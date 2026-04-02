import argparse
import base64
import json
import time
import urllib.parse
import urllib.request
from textwrap import wrap

from Crypto.Cipher import AES, PKCS1_v1_5
from Crypto.PublicKey import RSA
from Crypto.Util.Padding import pad, unpad


PUBLIC_KEY_B64 = (
    "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCgfZmpLpPEpEFRKBe+ZjWJUjPe+7qg"
    "7pGqcfN3j2egJ8H2mrKwaEqZEnPnpi2O3hN8HRyaFozDOp8gwZiYfiIZjWy0Jr/FNAii"
    "KYh5bq0GsEn+ieMmRyJg/+i1rqizhvCXvFdrdGhFTw5EBwTpsGdwe1utdlrvIJUAFWj9"
    "Yh4qbQIDAQAB"
)
IV = b"1g3qqdh4jvbskb9x"
APP_COMM_URL = "https://appcomm-user.zhihuishu.com/app-commserv-user/c/has"


def to_public_pem(public_key_b64: str = PUBLIC_KEY_B64) -> str:
    body = "\n".join(wrap(public_key_b64, 64))
    return f"-----BEGIN PUBLIC KEY-----\n{body}\n-----END PUBLIC KEY-----"


def try_parse_json(text: str):
    try:
        return json.loads(text)
    except Exception:
        return text


def parse_payload_arg(payload: str):
    value = try_parse_json(payload)
    if isinstance(value, (dict, list, str, int, float, bool)) or value is None:
        return value
    return payload


def pretty(value) -> str:
    if isinstance(value, (dict, list)):
        return json.dumps(value, ensure_ascii=False, indent=2, sort_keys=True)
    return str(value)


def rsa_encrypt_uid(module: int, public_key_pem: str | None = None) -> str:
    """
    对应 4.js / l0a1b2c:
    {"module": module} -> RSA 公钥加密 -> base64 uid
    """
    public_key_pem = public_key_pem or to_public_pem()
    rsa_key = RSA.import_key(public_key_pem)
    cipher = PKCS1_v1_5.new(rsa_key)
    plaintext = json.dumps({"module": module}, separators=(",", ":")).encode("utf-8")
    return base64.b64encode(cipher.encrypt(plaintext)).decode("utf-8")


def _js_style_pkcs1_unpad(block: bytes) -> bytes:
    """
    对齐 dist/4.js:1649-1661。
    注意这里不是严格校验 PKCS#1 block type，而是按 JS 逻辑直接拆：
    1. 跳过前导 0x00
    2. 跳过 1 个 block type 字节
    3. 找到下一个 0x00 分隔符
    4. 取剩余正文
    """
    idx = 0
    while idx < len(block) and block[idx] == 0:
        idx += 1

    if idx >= len(block):
        raise ValueError("Invalid RSA block: missing block type")

    idx += 1
    while idx < len(block) and block[idx] != 0:
        idx += 1

    if idx >= len(block):
        raise ValueError("Invalid RSA block: missing separator")

    return block[idx + 1 :]


def rsa_public_decrypt(cipher_b64: str, public_key_pem: str | None = None) -> str:
    """
    对应 4.js / rsaUtil.decrypt。
    注意：它不是常规“私钥解密”，底层是 JSEncrypt 自定义 doPublic()。
    """
    public_key_pem = public_key_pem or to_public_pem()
    rsa_key = RSA.import_key(public_key_pem)

    cipher_bytes = base64.b64decode(cipher_b64)
    cipher_int = int.from_bytes(cipher_bytes, "big")
    plain_int = pow(cipher_int, rsa_key.e, rsa_key.n)
    block_size = (rsa_key.size_in_bits() + 7) // 8
    plain_block = plain_int.to_bytes(block_size, "big")
    return _js_style_pkcs1_unpad(plain_block).decode("utf-8")


def decode_sl(sl_b64: str, public_key_pem: str | None = None) -> dict:
    """
    rt.sl -> RSA 公钥还原 -> JSON。
    当前链路至少会用到 cKey。
    """
    return json.loads(rsa_public_decrypt(sl_b64, public_key_pem))


def fetch_sl(module: int, timeout: int = 10) -> tuple[str, dict]:
    """
    完整走一遍：
    module -> uid -> GET /c/has -> rt.sl
    """
    uid = rsa_encrypt_uid(module)
    url = APP_COMM_URL + "?" + urllib.parse.urlencode({"uid": uid})
    with urllib.request.urlopen(url, timeout=timeout) as resp:
        data = json.loads(resp.read().decode("utf-8"))

    sl = data["rt"]["sl"]
    return sl, data


def aes_encrypt(plaintext: str | dict | list, ckey: str) -> str:
    """
    对应 4.js / aesUtil.encrypt:
    AES-CBC + PKCS7 + iv=1g3qqdh4jvbskb9x，输出 base64
    """
    if isinstance(plaintext, (dict, list)):
        plaintext = json.dumps(plaintext, ensure_ascii=False, separators=(",", ":"))
    else:
        plaintext = str(plaintext)

    cipher = AES.new(ckey.encode("utf-8"), AES.MODE_CBC, IV)
    encrypted = cipher.encrypt(pad(plaintext.encode("utf-8"), AES.block_size))
    return base64.b64encode(encrypted).decode("utf-8")


def aes_decrypt(secret_str: str, ckey: str):
    """
    对应 4.js / aesUtil.decrypt
    """
    cipher = AES.new(ckey.encode("utf-8"), AES.MODE_CBC, IV)
    plaintext = unpad(cipher.decrypt(base64.b64decode(secret_str)), AES.block_size)
    text = plaintext.decode("utf-8")
    if text[:1] in ("{", "["):
        return json.loads(text)
    return text


def build_secret_str(payload: dict | list | str, sl_b64: str, public_key_pem: str | None = None) -> tuple[str, dict]:
    """
    rt.sl -> cKey -> AES 加密 payload -> secretStr
    返回: (secretStr, key_info)
    """
    key_info = decode_sl(sl_b64, public_key_pem)
    secret_str = aes_encrypt(payload, key_info["cKey"])
    return secret_str, key_info


def decrypt_secret_str_with_sl(secret_str: str, sl_b64: str, public_key_pem: str | None = None):
    """
    secretStr + rt.sl -> 原始明文
    """
    key_info = decode_sl(sl_b64, public_key_pem)
    plaintext = aes_decrypt(secret_str, key_info["cKey"])
    return plaintext, key_info


def build_request_body(payload: dict | list | str, sl_b64: str, date_formate: int | None = None) -> tuple[dict, dict]:
    """
    构造最终拦截器改写后的请求体:
    { secretStr, dateFormate }
    """
    secret_str, key_info = build_secret_str(payload, sl_b64)
    body = {
        "secretStr": secret_str,
        "dateFormate": date_formate if date_formate is not None else int(time.time() * 1000),
    }
    return body, key_info


def explain_decrypt_possibility() -> str:
    return (
        "从 secretStr 反解的可行性：\n"
        "1. 只有 secretStr：基本无法直接解密。它只是 AES-CBC 密文，固定 IV 不等于可恢复密钥。\n"
        "2. secretStr + 同一次/同会话的 rt.sl：可以。rt.sl 可用固定 RSA 公钥还原出 cKey，再做 AES 解密。\n"
        "3. secretStr + 已提取出的 cKey：可以直接 AES 解密。\n"
        "4. 若只拿到新的 rt.sl，通常不能稳定反解旧 secretStr；因为旧密文依赖生成它时对应的 cKey。\n"
        "5. 但从当前前端逻辑看，key 会缓存在 state.key / state.studentKey 中，所以同一页面会话里，"
        "同类请求往往复用同一个 sl/cKey。抓到同会话任意一次 /c/has 响应，通常就能反解该会话后续同类 secretStr。"
    )


def run_demo() -> None:
    sample_payload = {
        "recruitId": 123456,
        "lessonId": 654321,
        "smallLessonId": 0,
    }
    sample_ckey = "0123456789abcdef"

    print("=== Demo 1: 生成 /c/has 的 uid ===")
    print("module=11 ->", rsa_encrypt_uid(11))
    print("module=3  ->", rsa_encrypt_uid(3))

    print("\n=== Demo 2: 纯本地 AES 回环演示（不依赖网络） ===")
    secret_str = aes_encrypt(sample_payload, sample_ckey)
    plaintext = aes_decrypt(secret_str, sample_ckey)
    print("sample cKey :", sample_ckey)
    print("payload     :", pretty(sample_payload))
    print("secretStr   :", secret_str)
    print("decrypted   :", pretty(plaintext))

    print("\n=== Demo 3: 真实链路用法（需要 rt.sl） ===")
    print("步骤：")
    print("  1) sl, raw = fetch_sl(11)")
    print("  2) body, key_info = build_request_body(sample_payload, sl)")
    print("  3) print(body)  # => {'secretStr': '...', 'dateFormate': ...}")
    print("  4) plain, key_info = decrypt_secret_str_with_sl(body['secretStr'], sl)")
    print("  5) print(plain)")

    print("\n=== Demo 4: 从 secretStr 反解的可能性 ===")
    print(explain_decrypt_possibility())


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="secretStr 加解密与使用演示")
    subparsers = parser.add_subparsers(dest="command")

    parser_gen_uid = subparsers.add_parser("gen-uid", help="生成 /c/has 所需 uid")
    parser_gen_uid.add_argument("--module", type=int, required=True, help="11=普通 gateway/t/v1, 3=studentexam")

    parser_fetch_sl = subparsers.add_parser("fetch-sl", help="在线拉取 rt.sl")
    parser_fetch_sl.add_argument("--module", type=int, required=True, help="11=普通 gateway/t/v1, 3=studentexam")

    parser_decode_sl = subparsers.add_parser("decode-sl", help="把 rt.sl 还原成 JSON")
    parser_decode_sl.add_argument("--sl", required=True)

    parser_encrypt = subparsers.add_parser("encrypt", help="用 rt.sl 生成 secretStr")
    parser_encrypt.add_argument("--sl", required=True)
    parser_encrypt.add_argument("--payload", required=True, help='JSON 字符串或普通字符串，如 \'{"a":1}\'')
    parser_encrypt.add_argument("--with-body", action="store_true", help="顺带输出最终 {secretStr,dateFormate}")

    parser_decrypt = subparsers.add_parser("decrypt", help="解密 secretStr")
    parser_decrypt.add_argument("--secret-str", required=True)
    parser_decrypt.add_argument("--sl", help="有 sl 时可自动还原 cKey")
    parser_decrypt.add_argument("--ckey", help="已知 cKey 时可直接 AES 解密")

    subparsers.add_parser("demo", help="打印完整使用演示")
    subparsers.add_parser("explain", help="解释从 secretStr 反解的可能性")
    return parser


def main() -> None:
    parser = build_parser()
    args = parser.parse_args()

    if not args.command or args.command == "demo":
        run_demo()
        return

    if args.command == "gen-uid":
        print(rsa_encrypt_uid(args.module))
        return

    if args.command == "fetch-sl":
        sl, raw = fetch_sl(args.module)
        print("sl =", sl)
        print("raw response =")
        print(pretty(raw))
        return

    if args.command == "decode-sl":
        print(pretty(decode_sl(args.sl)))
        return

    if args.command == "encrypt":
        payload = parse_payload_arg(args.payload)
        if args.with_body:
            body, key_info = build_request_body(payload, args.sl)
            print("key_info =")
            print(pretty(key_info))
            print("request_body =")
            print(pretty(body))
        else:
            secret_str, key_info = build_secret_str(payload, args.sl)
            print("key_info =")
            print(pretty(key_info))
            print("secretStr =")
            print(secret_str)
        return

    if args.command == "decrypt":
        if not args.sl and not args.ckey:
            raise SystemExit("decrypt 必须提供 --sl 或 --ckey 其中之一")

        if args.ckey:
            print(pretty(aes_decrypt(args.secret_str, args.ckey)))
            return

        plaintext, key_info = decrypt_secret_str_with_sl(args.secret_str, args.sl)
        print("key_info =")
        print(pretty(key_info))
        print("plaintext =")
        print(pretty(plaintext))
        return

    if args.command == "explain":
        print(explain_decrypt_possibility())
        return

    raise SystemExit(f"Unknown command: {args.command}")


if __name__ == "__main__":
    main()
