const fs = require('fs');
const path = require('path');

_0x4cb6 = [
    "Ym/DsFLDti4fwqJeCcKK",
    "GsKLw4/Dj2APa1EiwrnCunzCucOQwrULQMO2Oww8FCI=",
    "fsOXwonChQ==",
    "dxhMOMO7Bg==",
    "wonCiMKy",
    "wrLCs30=",
    "wq/CpGNPQcKc",
    "wpzDmsOn",
    "QGnCtAHDp8KYwpM=",
    "wqHCrMKTACA=",
    "wp7CgU/Ch8K3",
    "ADTDssOLwqE=",
    "wrDDncO6wqHDpQ==",
    "wo9qwo1oQQ==",
    "wpzDm8O0woLDoA==",
    "eyVYFcO3",
    "w5DDsMKBwqIB",
    "w79YNFoL",
    "REXCq8Kjwp0=",
    "w47DnMKnwq4s",
    "w71ow77Dgk4=",
    "w5ELCkEB",
    "J8OXOMKZAcOx",
    "BVbChcKJFg==",
    "wqrCtFPCvkY=",
    "w5dyw5XDgiY=",
    "ZcK3wrpowos=",
    "wpfCg2rCpcKgw7w=",
    "ODsGeDo=",
    "w7DCvDfChsOj",
    "NsOTwqfCncOH",
    "SMOJXEc=",
    "JsK3w5XDllk=",
    "VMOZQUgUwrE=",
    "w6orDxhm",
    "JG4SaAc=",
    "envDpUHDnQ==",
    "wojDs8OPwq/Dlg==",
    "wqrCuVVBQA==",
    "f0jDkGnDiQ==",
    "bFDDnsKJFA==",
    "ZxdjGcO3",
    "ECPCrcOtJw==",
    "wqY1M8OBwrU=",
    "w4PDlDXCssKG",
    "IBDDkMOqwq4=",
    "ccKBwrQRAQ==",
    "w4tbE1Y+",
    "dkDDr8K2Ew==",
    "w6VJw5jDin0=",
    "NXHCmsKSNg==",
    "w7Vww7zDiDc=",
    "w5nCi8O8e8KI",
    "HcOGA8KLJw==",
    "w4bCmw7Cglo=",
    "w6TDs8KwSCPClAYdwrnDscOBw7rCqjjDl2nClkXDqidDw4nCiQ==",
    "wp7Do2jDvQ==",
    "woDDr8KhKVs=",
    "w6LCv3ghw44=",
    "w7fCkjXCu3s=",
    "w7tWw57Dvxs=",
    "5Lic5pSl5o6F6Iex5Yiw5pO35pWE",
    "MW7CvsKHdw3CnMONw78=",
    "w7DCriHCnMO9",
    "w7x9w7HDtCI=",
    "5ZOs6K6p6LGO55WI6ICW57mP5p+B",
    "w4d+O1Qw",
    "5pSc5o+D6ISS5Yqk5pGh5pW9",
    "QcKxwrxqwo4=",
    "McKkw4XDmFI=",
    "cBd5PsOu",
    "BnvDn8Kqw5/DmsK8ZcOTwphvw6ZVw70ldcKh",
    "w5bCrcO/bsKe",
    "UMOBwoPCu8KBGQ7CkMKy",
    "ckdVdcOGwok=",
    "w7ovAlgdwoIabA==",
    "wo5SwpNCa8OcHMOywqZFW2/DpsOiw4o/Y8O8VlrDihxHAMOfIDrCmcKXwr/CjsKowpJQfzJXBMKQw6HDi8KXwpQMWVtBw4PCt8OK",
    "amDCp8KhwofDlMOIfcKnwqcaw5QHw5hSaMOAMQnDnsK+wowFwpAXacKkwr3DsRUYVyzCt8KFQMOgBg==",
    "DyzCoMOSFA==",
    "LTwZUQo=",
    "GDfChsOLCQ==",
    "wrtcwpF9bA==",
    "wptDwohObg==",
    "wphVVh0v",
    "w7NPI1LCgw==",
    "esOPVX4X",
    "fSLCuhfDuw==",
    "w47Dk8KOWwM=",
    "TQdsKMOv",
    "RDVuPcO6",
    "w67CqA7CqVc=",
    "w6PDujjDocKYJldqw6w=",
    "woXCjsK2OSzDvkkcwqfCsQHDmS7DgsKHwok=",
    "wqvCssKaQAEjEcOOD8Kcw5lAw67CnsKPw6R2UhFBSBgfFcKrwobCqSw1wq7Dq2XDqcKMw6LCk8KwW8K8N8OLwobCnsOVb8Osd8ORcmp+dH/CrwF9ByrCiMKvw44Vw7IE",
    "TsK7wprCrQ==",
    "cmLDpXLDtg==",
    "ZcOkwo3Dsls=",
    "w6w2DUI7wooBZzI=",
    "CcKmw43Dv2A=",
    "w7XCtnkeNGU9w7trw7Ae",
    "wqU0LcOSwrE=",
    "CzPCkMOwNA==",
    "w5ZUKsKjQR8/w4jCv8Kmw4tMw5t+wpTCjQ4=",
    "woVddcK4FBE=",
    "UcKKwoMYPQ==",
    "c2fDoMKZIw==",
    "eR7DuMOkVgEifHosw4DDklY=",
    "w5ViCHbCjA==",
    "wpZIfj0jCMKJ",
    "5pKV5paC6L+05bqJ5pWZ5YyB77yJ772H",
    "w6/CpDXCmV0=",
    "Y27CrMKHwpg=",
    "TcO3wqvCv8KD",
    "PHYufTo=",
    "ARLDk8OkwqluAQ==",
    "YXvDgMKXPA==",
    "w7hZNHvCjA==",
    "woDCtETClXfClQ==",
    "BcKBwpfCrMKIFxLCkMKlwo8=",
    "OcOxP8KCKgJ6OFc=",
    "w4TDnsKfUT4=",
    "wqYZHcOBwoU=",
    "Gy7DrcOkwo8=",
    "w5pARzAzJA==",
    "a8KcJcKKFMOtDFfDgTXCjS0=",
    "P1Uybh8=",
    "SMOzRmA6",
    "wqvDu8OUwoDDpQ==",
    "fg41VwfChwsOIUPCusKTw7/CksK8wrrCjMO/TsOVw6HCjATCqMOuw6F/R8KtH8O+wrwsw6Q2w54cWcKGKRVgfsKoITvDt8KFw41JHsKOwpHCtybDuhU=",
    "OmnDp8OMwrEHNwbDhMOaw6gR",
    "w53CpiLChSLDmMKOwrofw5jCszjDksOPG8KTacOQKcOEIsK1fxjDnBBQBcOCwr5tScOODcOZw7PCtAnDhcOuKcKoQVHDpsOHRcKBK2PCl8KNJsKrWFrCtGNEAcOvw6gcBixRw7ohw6/CicKtc8Ocfwk8wqxMcsKkwopYDGodwpfCkWYHw6Ipw6wpdm/Cl8Kkwr/CiMOIw7cqFcO+ZBFcG8KNwrDCpcKbXsK4wpbDq8KJLUHDrcOAw6vCusKFw4kzw63Drh9TLArCp8KAfMOGwqU/wrprw4XCh8KEwo5jwplbSMOWK8O8BgPDpsKJwrTChAfCvQF3FjZ5fcKqw6whw6nDo0PDo8KoO8OyDsKLwqkpwoUtwpdRw6jDi8OowrPCr8KMGD7Du8O+WcKKw5dUwpbCv3LCpcOxw7EoNg==",
    "w6XCsSzCgEs=",
    "MyMjeAk=",
    "esOYwqXDhkU=",
    "wrzCiDbCunY=",
    "WsKmwrN+wrg=",
    "DMOswqTCmMO4",
    "wqdLwqBZUQ==",
    "wofDs8OUwrvDug==",
    "GTnDjcOwwqI=",
    "cwTCugHDmg==",
    "wq1eVcKWMg==",
    "RMOfwpfCssKe",
    "R2PDo8KzHA==",
    "wpDCuVg8Cw==",
    "CHPCh8KTPw==",
    "wr/Cg37CmMKl",
    "YFnDp0zDnw==",
    "w4bClMO6w57Dtw==",
    "w7rCuGUHw78=",
    "aD7CvAbDjg==",
    "wrHCkF98Qg==",
    "H8KTSwbDlQ==",
    "w6zDssKGwqgi",
    "csKdwrDCrcKq",
    "wpzDlsKDDEM=",
    "BsO5IsKbKw==",
    "fn3CuMKDwr8=",
    "woPDrMO6wo3Dog==",
    "w5bCnF8Qw78=",
    "CcO8MsKpFg==",
    "wo3CqmEyLg==",
    "AMOrPcKZPA==",
    "ZXjDjmrDkw==",
    "w5rClSnChVM=",
    "w69vElPCiw==",
    "wqFuVMK9GA==",
    "cMOzZ1ox",
    "w5fChgLCmcOZ",
    "Gw/Dm8OJwo0=",
    "NlTCmMKjIQ==",
    "w5LCniPCm8OU",
    "WW/DlEjDlA==",
    "w7rDkcKzwqE1",
    "w6vCu0sGw7w=",
    "wr3DmsOEwq5qw7jCgUzDmcOVXMOU",
    "E3syUBs=",
    "wqrCo1B9aA==",
    "w6zCkCfCpF4=",
    "wqDCk8KRLBA=",
    "NsO8woDCpsOe",
    "DcKLw5vDjV4=",
    "w6vCjwnColk=",
    "H8OFJ8KxBw==",
    "exd+J8O8",
    "w5how7TDhnQ=",
    "w71aw5jDsEU=",
    "RX3DtVTDqg==",
    "BgjDksOuwrA=",
    "JsO7OsKdLgVw",
    "SFRKaMOy",
    "f8O6wpHDrls=",
    "w7LCpCYmw5U=",
    "IHDCrsKiL8KBw5oSw7tr",
    "wobDjcOJwrnDvA==",
    "woHCqFHCh8K3",
    "cMO3wqHCiMK2",
    "KsOCJsKSDA==",
    "PcO1MMKhGA==",
    "I8O1wrPCgcON",
    "wqtiZwgU",
    "woUKI8OWwqQ=",
    "w7t3w6jDlSE=",
    "w7DCnsOCw4PDoQ==",
    "w7Rnw6zDr28=",
    "e8O5wonDgHY=",
    "w4/CiBLCtFE=",
    "wovCp0EYGw==",
    "wonCvljCgEE=",
    "w5nCky7CosOg",
    "w7NvEn86",
    "woBNZsKaHQZhw5HDo8Kuwo9ywpdWw4HClnYdUH8=",
    "VsOrwpHCq8KJ",
    "LMKSw4DDlQ==",
    "w6Z0w7fDqw==",
    "w4zDu8Kz",
    "JMK2YzjDjw==",
    "GcOEwqTCrMOi",
    "YMOlwpo=",
    "PMKvTCDDug==",
    "bcKBwoTCkMKk",
    "w7R1w7zDpBpJwr0=",
    "wpfCiWM=",
    "JVIySA8=",
    "wo4dCsOXwqQ=",
    "OcO8wqHCpsOI",
    "w6cpPgNr",
    "Dx7DlcOXwpc=",
    "dl/CvcKvwo4=",
    "w7A/AlwdwoM=",
    "w6sjJCx1",
    "w7rCn8Obw6rDhw==",
    "ZUbDlFTDoQ==",
    "W8KpwpI/DA==",
    "ScOKwonCucKTGA==",
    "wqrDkMOxwr3Dkw==",
    "WjfCuwfDvg==",
    "w5BHHQ==",
    "NUQ/Sws=",
    "w6vCgBMg",
    "LRDCusO3Fg==",
    "cBVIOsOuAC9HfQ==",
    "K8Kfw5PDgg==",
    "w4VlPlI6",
    "aFdZc8OJ",
    "w7LCkMOBw6DDhg==",
    "Q8Kcwqc+Kw==",
    "w7nDuMKmwpEq",
    "w67CgRI=",
    "DsKZw4nDhnA=",
    "wqAXLMOuwos=",
    "w5XCvQMkw4E=",
    "enDCi8KCwpg=",
    "CS0vajc=",
    "wp9sXcKOIA==",
    "w51yMVYrwo4=",
    "wp7Cil7CqcKg",
    "PUQzWRjCig==",
    "w6bCrVoow7Y=",
    "wpp+Xwos",
    "HWYJch4=",
    "woVeVsKZCw==",
    "VsOfwovCt8KT",
    "w4LDsMKWwqcD",
    "w6nDnBXCo8K3",
    "wqBNZAkg",
    "CxQBTjA=",
    "ekHCp8KSwpo=",
    "wpTDscKnGWJmXcKUdMOA",
    "w40qCWs5",
    "CkjCpcKYAQ==",
    "wrnDjMOpwoBv",
    "KRDChcO0Kw==",
    "wqLCjU7Cl8Ki",
    "OMO7JMKWOw4=",
    "XEjCvsKywrA=",
    "w4tGw6bDvmg=",
    "PMOFP8KEAg==",
    "wr7CqF3CkMKd",
    "wolmUMKOEw==",
    "KsK6w6PDqWQ=",
    "bGjDn8KDJw==",
    "XMKWwr8lIw==",
    "CMONwojCvsOm",
    "SMOgwrfCusK+",
    "CQIlWzc=",
    "w4vCvSnCrsOZ",
    "dsKMwqFewoU=",
    "wpnDl8KEOkM=",
    "wrjCrkVpYQ==",
    "eQhFOMOqHA==",
    "w4sJGlAT",
    "FWUVZjw=",
    "wrbDu8OLwpDDpw==",
    "wpHCsFImOQ==",
    "Dw7DjMOtwoc=",
    "wotNfMK4BQs=",
    "fW/DqnzDrDI=",
    "w6vCgBEqw4NCAA==",
    "w7Zqw6DDm0g=",
    "wrjDocKoE1A=",
    "w6jDmQLCm8KH",
    "ScKKwrtdwq4=",
    "QsO0bH4C",
    "fcKVwqEfLcOHLQ==",
    "McOyEMKaOw==",
    "wrZAaBMi",
    "a3zDrsKePT7Dig==",
    "cmPDjXXDkQ==",
    "w5TDucKiwrQE",
    "woRBW8KxOA==",
    "wrZceAkA",
    "wopxwqFvdQ==",
    "wohrwpRAYA==",
    "AsOkGsK+CA==",
    "wqljWcKmIA==",
    "YsOewp7DiFU=",
    "RVzDkE/DoA==",
    "wqtFfi8B",
    "bMK7wrkiCQ==",
    "YcKjwrl6wrw=",
    "QEDDv8KCDw==",
    "PcObKMKcOg==",
    "wqdQwodcaA==",
    "w6BkKlUQ",
    "wpxDYgYa",
    "QwrCrSTDoQ==",
    "w6DDjMKfXzQ=",
    "XSLCpBo=",
    "w4XDuMK8woAs",
    "wpJ6UcKoIA==",
    "N33CvMKk",
    "w6nDvMKnwq4N",
    "w7cyJkkk",
    "woXCl27Cs30=",
    "wrogN8OLwqc=",
    "V1LCoMKcwqo=",
    "wozCukBkSQ==",
    "bsKRwro6Cg==",
    "w7R4w6vDoj0=",
    "w4AENAdY",
    "HwU8TTk=",
    "eQJM",
    "worDksOPwodn",
    "dcK7wr3CkMKn",
    "LwfCvMOMDRBz",
    "wqvDncOYwqs=",
    "KGYPTDs=",
    "w5J8GX/CkA==",
    "VcOjwpHCtMKQ",
    "DsOIwqbCn8OL",
    "csKcwqnCjcK/",
    "w5PCtsOSw7zDgw==",
    "wp1cwoNfWw==",
    "d1/DilHDmw==",
    "w6gwCRVb",
    "aGloY8Oo",
    "wq3CrVDCrU8=",
    "LhDCjMO3Mw==",
    "w6M2ODl1",
    "RBhRPsOU",
    "w6nCh3kow60=",
    "w6XCiV0Mw74=",
    "w7bCrRDCh8OL",
    "NT01bxM=",
    "G8Kxw4/DoEw=",
    "ASjDrsOzwrc=",
    "UmjCgMKlwobDisOr",
    "XcKAwp7CtcK9",
    "YcOHwoDCrcK3",
    "wqfCk8K/KQg=",
    "GcOKwr7CvMOlwr7Cig==",
    "Y8KowrYJJw==",
    "w7nChsOpXsKo",
    "wrLDh8OxwpJn",
    "w5PDt8KNQS0=",
    "w4JnM1gr",
    "T8OdXUE=",
    "wobCtHLClg==",
    "wpPDvMKkHkY=",
    "w6vCjyLCsHc=",
    "M8K7QivDiHDCiHTDlQ==",
    "w5nCuDLCu8Oc",
    "OsKsRg==",
    "fcOWwoDCmMK1",
    "UsO+bUUC",
    "w6rChxEq",
    "wrrDmMObwq9Q",
    "w6DCjHwPw5Y=",
    "PcKWUDvDkA==",
    "w4XCtsO5Y8K4",
    "wrFiwoNqSw==",
    "I3syURY=",
    "CMO/wr/CoMOw",
    "O8K6ahjDjA==",
    "w48eOnMe",
    "LsKVw7LDvE0=",
    "bWhFR8OP",
    "w4N4w77Duk8=",
    "EG7Cp8KbCg==",
    "wq3Dl8KAB3Y=",
    "wqDCjX5jdQ==",
    "W2PCgcK8woE=",
    "fW/Do2rDiQ==",
    "wpzCqnjCkGI=",
    "Kw3CpsOrCxFz",
    "w4vCqzLCug==",
    "w7Fzw7zDthlJwqE=",
    "woMCHQ==",
    "wpHDkMOtwrvDmA1X",
    "VWLCjMKjwo4=",
    "P8KRw4/Dn3sKYQ==",
    "f8KCwqckNg==",
    "wrnCpWlZSMKZwrA=",
    "worClcK+NQ==",
    "wpTDtsKoGE5lXA==",
    "wpfDh8Ogwq3DhxVbwpQ+",
    "w4vCocOJw4/DhQ==",
    "Um3Cq8KVwoU=",
    "w6wZKE8D",
    "wpvCo8KNGQ4=",
    "wq3Cs3w=",
    "w7tyw7vDsQ==",
    "wrTCnmRlXQ==",
    "w6DCqn0nw7k=",
    "w60MAkwx",
    "wqDCgHFDbg==",
    "w57CthLCsVM=",
    "wqTDjcK/Mkw=",
    "w6zCuhYAw4E=",
    "wpxKdDci",
    "w7HCpwTCi3Q=",
    "wqoeFMOtwrI=",
    "d8KNwp7Cv8K9",
    "d8K0wp8iBw==",
    "QcKUwrDCvMK8",
    "ITfDp8OWwoE=",
    "Ay/DmMOywqs=",
    "wrbDiMO6wpvDkA==",
    "w55MOHPCrA==",
    "PMOYAcKTPg==",
    "QcOFwrbCvMKx",
    "HcKcw43DiWQKZUZvwqo=",
    "w4nCusOMw4nDjwHDjw==",
    "acKQwrLCusKa",
    "LMKrdj7DiQ==",
    "XcK/wrEhJg==",
    "w6XCqk40w4s=",
    "wo/ClMK/",
    "fThtG8Ov",
    "w43DnMKzTRs=",
    "w6F5w7fDrg==",
    "MgfDqcOkwrw=",
    "HRnDpMOq",
    "w6BFw6jDow==",
    "U8KHwovCvMK9",
    "cXfDr8KQ",
    "QMKnwp1n",
    "wrhPwpBKdg==",
    "wpHDq8KCBHY=",
    "H8OFOcKsOA==",
    "HsOqwp3CnMOo",
    "TQjCmj3DqA==",
    "woBNZsKLGA5p",
    "wpjCg23Crg==",
    "VMKawo5UwrU=",
    "w5vCrzTChMOBNgcvwrAMLA==",
    "wqjDnMOKwrFd",
    "QWfDtGPDqQ==",
    "OUgxcxU=",
    "w4HDqsKxWDI=",
    "w7VSw4nDp3A=",
    "OTDDuA==",
    "w6vCqnY7w4I=",
    "VcK2wqIzFA==",
    "KgIWRzA=",
    "dkbCu8KPwoQ=",
    "woHDssKkL1A=",
    "w7rCvDEZw4E=",
    "dgVKLcOdGyJNUlY=",
    "w4/DnsKsZQQ=",
    "bn3DrQ==",
    "V3BsRsOt",
    "dsKfwrI=",
    "QyHChAzDiQ==",
    "UMKmwpvCnsKP",
    "w7jCmDfCh3sHw6c=",
    "w6NVw77DoA==",
    "Pz3Do8OpwpA=",
    "DsOXwqDCmcOc",
    "N2rCv8KGOg==",
    "PBHDq8OCwpI=",
    "cUxJdQ==",
    "Jy0rRRM=",
    "w5jChcONw6HDjg==",
    "V8Knwr/CscK5",
    "wp3DkcOhwq3DkQ5Awp4lwoTCjhYCUw==",
    "w4gtA2kk",
    "OMOZE8KGPA==",
    "wq/Du8KtL3s=",
    "wo5NwoFhdw==",
    "YsKGwptJwp0=",
    "MjrDq8OowqxZMA==",
    "w6pNHnPCqw==",
    "w5ZyK2U2wovDlQ==",
    "wrzDjcOfwoZFw7XCjVvDtMOOS8Ozw6DDuQPClF1ed8Kh",
    "w5vCqDPCh8Od",
    "M3TCrsKp",
    "w7vDtxLCpA==",
    "X8Ktwp8=",
    "QFzDrsKsJg==",
    "wppHWj8+",
    "w75zw7U=",
    "w67CrSjCvsOK",
    "FsOMwqXClsOk",
    "wrzCo2lLS8KZwqw=",
    "wotHdQ==",
    "wp7CiW3CvEM=",
    "worCk3IXAA==",
    "Djk6Szc=",
    "wr4sGMOTwoU=",
    "wpUrK8ONwqk=",
    "w60ILxhZ",
    "wq/CokttaA==",
    "cMKpwpIZIA==",
    "w5DCriTCrcO9",
    "woTDvMK8P3A=",
    "YcOyTVcH",
    "wrnCgcKVKg8=",
    "w6Fiw7vDjnY=",
    "wrrDs8OUwpHDtg==",
    "XmhYRsOn",
    "VcKwwoDCrMKlw5A=",
    "wpbDq8KLB24=",
    "cUBRd8ORwpU=",
    "FHXCqcKxGA==",
    "wovCnlZOUg==",
    "Yi/CkyTDgQ==",
    "wrJOahYd",
    "wprClnTCrsKt",
    "w6HDtDvCmsKK",
    "woJce8KyFA==",
    "wpfCksK1Pw==",
    "w4/ClsOZw47Dlw==",
    "w67DuRLCssKm",
    "w5ovKVk5",
    "woR0wqd6bg==",
    "w7FXw57Dv1A=",
    "JjfDsMOL",
    "w5XCgxMuw48=",
    "L8KKw4jDgXE=",
    "U8K8wp7CvA==",
    "wqjCl8K+Ays=",
    "CBnDqcO7wqI=",
    "w5DCjGEvw4M=",
    "wpfDi8OqwqXDkg==",
    "w5PDoMK9wokg",
    "SMOQTlYywrhnOA==",
    "w5c2CmIa",
    "wpLCkcKBLi8=",
    "CMOUwp/CtcOu",
    "w7kuBVYM",
    "w4XCl0Em",
    "OA7CqcOhNhxiZQ==",
    "wp7Ckm3Cr8Kx",
    "wo/Cj2nCpw==",
    "OMOxLQ==",
    "w7rCkkoaw78=",
    "VHVVWMOI",
    "w7PCuRA6w5k=",
    "wp/Cj3DChMKy",
    "wppDRzA=",
    "CMO/McKoNw==",
    "ZXfDvsKrKgLDhcOFwqc/wrQ=",
    "PhjDl8Oewr0=",
    "HRo5UzPCjSvChQ==",
    "woXCksK0PxHDsw==",
    "J8OqI8KcKg==",
    "w5rCp8OBw4HDhQ==",
    "w4zCusOPw4LDgTzDnlzDvA==",
    "DcOfwrvChMOG",
    "O8Kbw5U=",
    "woNRcMKUIQ==",
    "Q8KfwocuCA==",
    "woHCr2rCicK/",
    "w7vCq0sBw60=",
    "wojCgX9bfw==",
    "PSzDj8OIwrU=",
    "OxbCqcOsEQ4=",
    "wrzCj0bCkWE=",
    "w5fCvgXCsMOZ",
    "IxbCjcO8Ew==",
    "Yn7DsX/DoQ4Twr1N",
    "wrHCsMKgKwA=",
    "w6vChRfClHU=",
    "w5HDssKAwqAV",
    "w4bDjcKRwqUs",
    "wpHDsMKqDmht",
    "wpfCvcK3LCs=",
    "wpFSQzA=",
    "w6Zrw77DhCM=",
    "worCjF3CtsKj",
    "NRkqeDM=",
    "H8OyLMKoPA==",
    "Q33ChMKfwoU=",
    "wpJ2YTQh",
    "bMKWwoEGEw==",
    "wp99wrBhTg==",
    "woIACsOvwoU=",
    "w77CiSHCrsOY",
    "w5Bfw7PDvwA=",
    "XcKWwrrCgcKO",
    "JFQ0Wg==",
    "w5/CpTXCpsOdICc/",
    "wo9ywohJUMO+",
    "acKEwqAvPcO+J8OhHsKxUMOuVMOF",
    "wqjCpnENLE47wqJ+",
    "w4XDusKwwqAkw4sa",
    "LQzCrMOPBQl1aB05wpjDiw==",
    "WjPCthzDvsOhwoQaw5wta8O8wpHDoQ==",
    "ICrDtsOY",
    "w47DqcK5",
    "wovCunZCdA==",
    "w4XDkMK/bT0=",
    "wrbDpsOUwo/Dnw==",
    "HsK9w4DDlmI=",
    "RkvDncK8LQ==",
    "w7/CtU8zw70=",
    "w4fCvXY1w4s=",
    "Lw3DmsOewoY=",
    "w5t6AmnCnw==",
    "MSUaUCQ=",
    "dsO4SEE0",
    "UnVpYcOB",
    "w5xww5vDuUM=",
    "aMKFwqXCqMKt",
    "bsKZwoIvLA==",
    "wobDlsOUwqzDnw==",
    "w6zDkxzCkMKi",
    "wozCrsKRNTc=",
    "w4lYw4/Dil0=",
    "w6sLIAla",
    "cz/ClSzDsA==",
    "w6goDk4M",
    "aMOEworCt8Ku",
    "wrbCjWnCq8Kd",
    "eW/CicKYwo4=",
    "w73CjTTCg3w=",
    "ER44cSg=",
    "UcKywo9cwqI=",
    "esO2XWcL",
    "w6fCuwc4w4M=",
    "wpXDqcKxO08=",
    "CEg4RAU=",
    "w7c0HARm",
    "w7vChsOKw5TDqA==",
    "VMOVWnYO",
    "w7V5w6bDkR9IwqE=",
    "w7F5w7vDqQ==",
    "w7VLw5rDoUI=",
    "dm/DsEvDtykTwqRBB8KI",
    "w4zCp8OJw57DlA==",
    "woRnQ8KXJw==",
    "wpzCg101Fg==",
    "e0HCpMKGwr4=",
    "FnAQdCI=",
    "w74RBXEI",
    "csO6ZX83",
    "UMK2wp8bEw==",
    "w7UTFC9y",
    "f25WWsOE",
    "HMOSwofCocOw",
    "wpttRxY3",
    "HDHDksOIwqo=",
    "w5pfLV7CkA==",
    "dm3Cm8KswoY=",
    "w6nDqCDCpMKJ",
    "wrzCvVBEXQ==",
    "ewvChBrDiw==",
    "w5DCoiY7w7o=",
    "w7LDmMKHwpAE",
    "wrHCt8KLLhk=",
    "d8OjwrTCqsKm",
    "UF7DmcKPBA==",
    "EXnChMKzOA==",
    "wrtXwrdYWA==",
    "wrzCqU3Ctnc=",
    "GcOTHcKdIQ==",
    "LwXDoMO3wr8=",
    "wrVJWcK8JQ==",
    "McK1w67DmHo=",
    "w447J1g9",
    "w6/CpTo7w5U=",
    "w5DCjz4sw68=",
    "FxjDisOgwoo=",
    "L8Knai/Dug==",
    "SsKmwrNtwo4=",
    "wrt6wq9PTQ==",
    "w53DvjzCqcKn",
    "wqfCn2XCknU=",
    "wonCs1scDA==",
    "w7TCjzHCv8ON",
    "wqXDuMKNCHU=",
    "wrLCj0JraA==",
    "w7QBBgNH",
    "w7RRw6jDr0Q=",
    "wojCoUkwOQ==",
    "wo3Cn1vCgFI=",
    "FcKOw5PDqkM=",
    "PsK7w67DlVA=",
    "w7ALGwZy",
    "wqFqXT0v",
    "wr9wwrJKeA==",
    "wpzDsMKxAXI=",
    "UsOpQnon",
    "wpTCh2XCicKd",
    "GcOUOMKHAQ==",
    "egxKFMOX",
    "dEXDgl7DiA==",
    "QMOgwqHCm8K3",
    "w5lnPHXCug==",
    "woR5wr5hUg==",
    "wpTDqsKFIE4=",
    "wopKSMKSOg==",
    "w7LCkAzCoMOn",
    "w4fDuRDCs8K2",
    "SnTDrcKCAA==",
    "VMKywrnCscKk",
    "wrrDmcOkwrHDsg==",
    "w5TDi8KfXzU=",
    "w5JHw5vDh2k=",
    "ZcOpwpnDsXk=",
    "wrLDi8OPwrV/",
    "wofDjsOIwqfDnw==",
    "QMKywpRlwrg=",
    "w7PCpz4nw7I=",
    "w7QTCm0K",
    "wp3ChWMqOw==",
    "WU7CiMKAwoo=",
    "wqk6CcOuwr4=",
    "BjXDp8OXwqs=",
    "wo3DksOjwqBs",
    "AwnCm8OhAw==",
    "wr9hwqxPXA==",
    "PRLCu8O6EA==",
    "C8KJw4/DgnU=",
    "H1QTfDU=",
    "wqLCl3XCrsKX",
    "fnZofcO1",
    "Nw3DsMOtwos=",
    "DMOpIcKlIA==",
    "w4nCtSTCo1E=",
    "REnDj3LDnQ==",
    "EsO8O8KUFg==",
    "w4dfw5nDrDM=",
    "w5jCmWkCw7Q=",
    "cMKiwpA5DA==",
    "w6bDuDLCi8KL",
    "wpHCtEHCsMKc",
    "wrLCtVU+IA==",
    "RlPCo8K3woo=",
    "w7t7w5fDhA4=",
    "JnUQXw8=",
    "w71ow6HDgH4=",
    "c21TWMO8",
    "X2zCoMKfwrE=",
    "QCDCki/Dsg==",
    "wozDn8OFwq1I",
    "w4BFw5jDvkA=",
    "w5bCtMOtw63DmA==",
    "wo9pWAY3",
    "EivCkcO0Dg==",
    "wqbCs8KfCxs=",
    "w7wpFAx5",
    "AmHCpsKACQ==",
    "wqolPcOqwp4=",
    "wq9ZdsK5IA==",
    "w4XCvMOLw4TDpw==",
    "w4cHCzdw",
    "w4ZDw6LDhFQ=",
    "wq4LDMOvwp4=",
    "Y8OOwrbDhGc=",
    "wrjCqHfCql8=",
    "V8O4ZGwo",
    "ZnXCjcKFwqA=",
    "S8KmwrgDNQ==",
    "SldcQ8Os",
    "wovCnGpiVg==",
    "Ai3DvMOvwow=",
    "YcOOX3gX",
    "TcKCwrYYDQ==",
    "Q8KCwqUcMw==",
    "w4Vuw7HDlj8=",
    "w6XCuDDCg8OZ",
    "wrNiXCQw",
    "OQ7DosOSwoE=",
    "wqXCnmbCgXA=",
    "w4lYHkjCrg==",
    "W07DtmPDvg==",
    "Qz1hDsOn",
    "CVzCvcKoCg==",
    "w6dHFWAm",
    "V8OGXlU5",
    "MX/CtcKyCw==",
    "P8OKHcKMMA==",
    "LcKqw43Djmw=",
    "YRVgLcOb",
    "w7PCuhktw4M=",
    "MhHDjcOYwoA=",
    "w4BDM1Mn",
    "w43ChwLCokI=",
    "w65SO0HCug==",
    "VsKzwqvCl8Kl",
    "wrVSU8KuIQ==",
    "fMOLwo/CkMK9",
    "dMK4wrJNwro=",
    "wojCsEZbdw==",
    "w4bCmSvCnUg=",
    "wqnCnEXCs8KE",
    "w4U+BHUz",
    "TVnDhMK3Ew==",
    "wpN3fD0Z",
    "w7R+N2YM",
    "w7YLPlom",
    "OzcdUiQ=",
    "JcOaJsKLAQ==",
    "fcO+flwE",
    "w71Iw73DvVM=",
    "wpTDpMOZwqpO",
    "w5LCojDCocOa",
    "fMKOwoplwqs=",
    "w7x0w6LDsAI=",
    "G8OSOMKYKA==",
    "JcOkGMKmGw==",
    "csOIwqDCpMKo",
    "w5HChcOmw7TDjg==",
    "wopQwqZ2Qw==",
    "w6V7w5DDhwc=",
    "dWp7XMOi",
    "w5XDocKcaSY=",
    "wpPCqUDCjsKT",
    "w5lYG30Y",
    "AcOMCcKBGg==",
    "EsOqwpTCg8ON",
    "w4InBQNX",
    "TcOgwqPCksKg",
    "w6XCp8ODw6HDhA==",
    "E37ChsKyHQ==",
    "w5XDqxzCh8KX",
    "wr8LM8OZwqw=",
    "QyNoNMOL",
    "TnZoU8Ox",
    "JsOPKcKyBA==",
    "w4Vuw47Do3I=",
    "wo15e8KyOg==",
    "w4oUL1A8",
    "a8O7wrnDjkc=",
    "w63CtcOkZsKh",
    "fFFdc8OA",
    "OcOzwrzCv8O7",
    "w6pZw6zDm2s=",
    "PsKIw6fDj20=",
    "aU/DhkzDgg==",
    "w7RSMHQx",
    "cHXCl8K3wp4=",
    "SMOwWUUX",
    "YmLDq2w=",
    "woFDRcK2FA==",
    "w7oxO1IM",
    "woREfcKsFCdlw5XDocK1wps=",
    "w71aA1HCnQ==",
    "w4FbKVso",
    "K3HCq8K1",
    "w7/ConweIQ==",
    "O8OiwqfCqMOC",
    "w7vChMO+ZsK4",
    "OMOGN8KMAQ==",
    "Gi/DlMO+woY=",
    "w7LCisOdw77DrQ==",
    "wq0OFcOswqg=",
    "wrtFQQsj",
    "w5/CpiXCtcOcEQc2wrwMNyc=",
    "w5jCtsOcw7jDiSXDjg==",
    "JcKEw4vDv1s=",
    "MsKxw7TDmV0=",
    "wrbCr2lNU8Kd",
    "w7xTw4fDsD8=",
    "w4zDscK6woMxw5c=",
    "wppKQS8z",
    "wr3Dj8OIworDtA==",
    "TiLCozrDo8ObwoA=",
    "Kw7CrcO5Fil/bSw/woDDmg==",
    "w45NCUXChsKO",
    "TcOabVgn",
    "McKmVRrDkWnChA==",
    "wqzCi8KTGBs=",
    "wqtxVikj",
    "w6vCuQXCvlg=",
    "w6PCkcO4RsKV",
    "MH3Cu8KEBcKDw5sYw49r",
    "S8OLe2Ya",
    "w555w7jDmmo=",
    "w5fDosKkwqAq",
    "woDDr8K2L04=",
    "IsKHZyPDsg==",
    "w6vCtsOtw4nDmQ==",
    "wpfCuHd6Yg==",
    "KgnDtcOqwro=",
    "w4fCqCDCqVA=",
    "w4NBfMKrFBF6w5XDoQ==",
    "wrfCicKiNzs=",
    "DMOSKMKlBA==",
    "w5bCiAjClcOL",
    "wpBFfAYG",
    "LVkNbMKUwoENw5Fh",
    "w6rCmMOXw7Ufw6zDk0LCrMKKRMKEwqHDkVbDhW8LIsK4wqrCu0NcAD3Dv0p7w4xeWsOtw5odwqTCrlfCu8K8LsKfwqHCqXXDngdtOsKEw53DrlsEK8OHQX3CvgrCjlTDk8KcPHDDj8Kbw6TCssKKTxzDqHJiTcODN38swpjDt1zClMOsDjAtDRzCoMK3w47DhF01w4ZDT8OmwpE4w7DCtcKdaMKSM1PCucOZWMO6IF9owrMMwoPDi8OxXVRpQ2t8aBJZw6jDq2t3PWtQw77CkUBGA8KhS8OaWmnDvcKlw6w7w6LDlUsXwp5bwoHCuMOTSDLCiCHCisK3DDgNwpsMw4DCsX/DicK9LsKRSFDCgsKLLjdiw7l7NzHClMO9wqNDJGlPwqfDicOQwoHDhDdtw6Y=",
    "VMK0wqp1wqo=",
    "wqdcwr7DtBfDn8KMCsKU",
    "wrDCmVM7Ew==",
    "w6nCiSMsw48=",
    "w6vDoyJMbD9sw6EjwqYPOsKZaSfChA==",
    "w4QVKgd2w64=",
    "wrTDisOtwqvDgwhdwpV4wovCkB4WWmplwrHDksKBw6jCiVdd",
    "IDvCosOS",
    "a1HDiMK+Eg==",
    "bcKSwqXCv8Ke",
    "RS3CvSrDhg==",
    "w7rCksOsw5rDqA==",
    "Y8K8woXDt1vCiMKkwoLDq8OBwpYC",
    "f2bCqMK+woQ=",
    "w63CuzMHw5E=",
    "wqTDrcOpwq3DtA==",
    "VhhiGcOJ",
    "w6lxJls3",
    "w7QqBCxH",
    "w7JtHVfCng==",
    "w6V0GWcz",
    "wrRAZh4f",
    "w7FBw7fDnXE=",
    "wq3CkFdMQg==",
    "wpg3KsOdwrg=",
    "w6o9AXkk",
    "w7nCgMOvRsKl",
    "w6ltOFfCpw==",
    "VcOewqjDgEU=",
    "wrBPwrFrcw==",
    "wqfDusOBwq/Dug==",
    "w5DCiy3CsUU=",
    "D8KkYyfDiA==",
    "w4rDlsKYXgI=",
    "w5jCpcOtdcKx",
    "wp3CnGZFUQ==",
    "GjjDkcOHwos=",
    "JcKVw5vDnGc=",
    "w7jChcOJw4PDlg==",
    "wqpFdMK7JQ==",
    "wqXDusOHwrzDkw==",
    "worClsKTHxE=",
    "AcKlewDDkQ==",
    "w7cVPTFY",
    "MQXCkMOoJg==",
    "woBBdiwU",
    "w4PCtsOEbsKa",
    "wq7CtcKyDSo=",
    "LcO1MMKBPA==",
    "w6Rqw4HDm24=",
    "Q8KSwoFZwoU=",
    "wrnCr8KCDS8=",
    "wrzDmsO7wrRh",
    "Ohc5SSY=",
    "wrVvbC8O",
    "wpLCvWUXNA==",
    "woLCi0XChsK8",
    "RcKYwoHCg8KT",
    "OArCj8OPJg==",
    "wolOaQsU",
    "AjzDuMOswrA=",
    "w7PCtA3Cpmc=",
    "H8OTBMKyGA==",
    "wq1HfBA7",
    "w4LDmcKmwr4f",
    "XkLCu8K0woU=",
    "EcOmDMKpAg==",
    "RULDoGHDlQ==",
    "wqPCnmLCq8Ky",
    "JjDDhcO2woc=",
    "wqVuwpBDUw==",
    "wprDqMKFIm8=",
    "fnHCgMK0wr4=",
    "DCnDksOowrw=",
    "w4fCmsOCw5nDhw==",
    "TWTDpMKZEg==",
    "w55MCnvCkg==",
    "w53Cm0Ikw7hX",
    "w4TDkzHCvMKL",
    "blVTecOR",
    "RU/CosKkwqw=",
    "PRMKahU=",
    "eMOCwrHDtWo=",
    "w5jDsi7CosKZ",
    "w6dow4HDumI=",
    "w6Z6Blk1",
    "wpDDvMKoPkU=",
    "wqXDksOawqDDnQ==",
    "CRnDr8OUwqw=",
    "TsOFwrHDhHk=",
    "wpHDscOJwq5B",
    "E24RfTo=",
    "RsOTwp/Dqkc=",
    "AVfCg8KTOg==",
    "B8OXHsKfDg==",
    "D8K3w7XDglU=",
    "wrXDlsKKKHc=",
    "KcOswoTCocOL",
    "GcOcK8KoOg==",
    "w6LCt3gtw40=",
    "GMKZcCPDrg==",
    "w7UpGQ5S",
    "Zx3ChgPDnA==",
    "FA8iQBE=",
    "wqHCgEXClEA=",
    "UsOGQU4x",
    "TEjDm8KWEw==",
    "w7vCmEo1w4A=",
    "ICbDkMOswp4=",
    "w5lGw6vDvms=",
    "wqNLwqBrSg==",
    "V0NZZsOp",
    "NCUIZhM=",
    "w54ZC3wG",
    "PDYrZi8=",
    "w73CnsOYw4rDmA==",
    "wr1lXMKyPQ==",
    "w6Y2I0oj",
    "wojCklJ9XQ==",
    "ZAXCnhrDnQ==",
    "LsKSw67Dn0Y=",
    "HGMUSjs=",
    "w6zClMOATsKR",
    "w5x4KFgT",
    "wpzDr8KxIHA=",
    "DSUcQhc=",
    "f8OswrLCuMKB",
    "wpzCql7Cl8KR",
    "aMKdwp8KJg==",
    "wq/CoX9+bw==",
    "w47CpwrClcOM",
    "wqNMwq1lVw==",
    "wqnCv1o+Og==",
    "GSEnazc=",
    "YH/Ct8K/wr4=",
    "wpDDjcKtIVY=",
    "UHbDnMKCAw==",
    "asOfwqTCksKU",
    "eyPCgRfDjA==",
    "woLCgVzCssKW",
    "fcKDwrJrwrw=",
    "PBjDl8O4wo4=",
    "VWrChMKbwp8=",
    "DsKaw7fDlVI=",
    "CcO9wrnCrMON",
    "w44+OkIv",
    "OxInbzk=",
    "QMKZwqLClMK/",
    "LBEaWAY=",
    "wrzDpMO6wo5f",
    "wr0JLMOCwps=",
    "wr3ChlZnUQ==",
    "w4VXw6PDkVY=",
    "dkbDlVbDrg==",
    "w7sWPXYf",
    "w6TCiSUqw58=",
    "w6zChybCuXA=",
    "w7o9PF4N",
    "bsKqwrksDg==",
    "LMKWQjnDlQ==",
    "w5TDjsK4woMP",
    "wq7CrnNyVQ==",
    "wpXCsWnCiMKw",
    "ZW7DsEPDqg==",
    "wpzDqMOuwoLDkw==",
    "NgXDsMOuwoQ=",
    "DgzCisO+IA==",
    "w759BlcU",
    "EMKtYyjDvA==",
    "wpTCuEkZEw==",
    "DcOcFMKYMQ==",
    "wrTCjF3CpMKf",
    "C3UObyg=",
    "w43CpAvCiUQ=",
    "Tzl4DsOa",
    "wrVxWsKFJw==",
    "woYFFMOdwqw=",
    "w6RVw4rDrU8=",
    "L8KkeT7Dug==",
    "w5h/MVcu",
    "w5lUOWIK",
    "E8ONwr7CqcO7",
    "UMO/SXw1",
    "wrPComlMVg==",
    "wr/CvXnCvlc=",
    "w4FPw6DDpVI=",
    "w5hRw4bDiU8=",
    "I8ONwrjCiMO5",
    "LSbDssO5woc=",
    "w4t0w7rDggU=",
    "w5zCpzDCq10=",
    "w77CqMODfcKh",
    "w6h/N3Ys",
    "wrNARMKuBQ==",
    "HsOTIcKKOA==",
    "c8K9wqXCqMK9",
    "w4VTO3QT",
    "VnrDnMKKMQ==",
    "woPDncKiLm0=",
    "w5t5B2sK",
    "w4rCk8OdfsKF",
    "w5XCvcOww7bDtQ==",
    "Q8KlwqbCscKc",
    "woXCtEzCo0M=",
    "w7Zsw4fDrSM=",
    "DMOgwqHCgsOO",
    "I20SXzQ=",
    "w7DDn8Kfwo80",
    "GMO0IsKwOA==",
    "V8OeS3wk",
    "LHrCq8KDKA==",
    "wqzCiXzCmsKX",
    "wofCrkLCtGA=",
    "w4lRw57DvlM=",
    "wrXCs1gwMg==",
    "MMOxwrHCpcOM",
    "w755w7zDogJN",
    "wonCqHvClFXChMKTw7psw4vDo2g=",
    "w5czPnch",
    "w63CisOHw5rDmA==",
    "UsK8wpE8Cw==",
    "w6jCmsOMY8K5",
    "I8OBwrXCvcON",
    "MGjCo8K5GA==",
    "woHCu1zCtnw=",
    "w5DCry7Cs8OaLQ==",
    "RHHDk8KXIw==",
    "SEbDq8KRAw==",
    "w79Fw6PDr1PDiw==",
    "HsKuw7fDjWU=",
    "WsOpfEYU",
    "w4bDhcKTZCU=",
    "fk1eYsOmwpJdw4gTGg==",
    "e1TCjMKhwr0=",
    "wrTDhsOHwr3Dng==",
    "w6ZSG0U7",
    "W33CocKDwo0=",
    "AhnDr8Omwrxi",
    "w6LCuFgNw4E=",
    "IwTDqcOtwpA=",
    "DmDCp8K8NA==",
    "b2lwccO9",
    "TW50e8OU",
    "w7Ztw5HDoDo=",
    "w556w5DDojg=",
    "woV+wopLbcOy",
    "wqrCvF3CrlI=",
    "wqJOW8KINQ==",
    "w74FHxNS",
    "XMONbEos",
    "XsKhwr5lwpY=",
    "XWLCgMKxwp3Djg==",
    "w7PCijLCn0I=",
    "f8KkwrprwoI=",
    "ZFvDqkrDlQ==",
    "S8Kcwr3CrMK8",
    "AznDjsOtwpU=",
    "AMKlcB/DqA==",
    "FcOgwoXCrcOm",
    "w6diw4/Dh3c=",
    "NVnCtcKJHg==",
    "wqzCi31zVQ==",
    "UcKUwonCgMK7",
    "V8KFwpkcJQ==",
    "LsOowrbCgsOD",
    "w5DCvTHCmMO+",
    "YX3DpMKYJAU=",
    "BxPDh8Ovwow=",
    "w4TChsO7XsKY",
    "w6LChcOKccKe",
    "dEp5fsOh",
    "ScOYwpbCksK3",
    "w5zCvMOGw4/DgTw=",
    "wpjDnsOIwqDDpw==",
    "HVMYfQ4=",
    "UMO+wonCj8Kq",
    "Mkk8TC/CjUIfBVY=",
    "PsOzGMKuOw==",
    "RMK9wpLCq8KIw5A=",
    "w6vDucKnwqsx",
    "w7zCusOnYMKo",
    "KMOaN8KMNMOt",
    "w7l+OGbCpQ==",
    "P8KsZyDDvA==",
    "UyhuB8OK",
    "ICbDkMO2wpE=",
    "wofDuMKFCUU=",
    "wobDl8K+AEo=",
    "w77CsHo1w6A=",
    "w7HDoMKSwr4W",
    "wrLDh8Otwq1t",
    "JMOcL8KoGw==",
    "NCbDpsOTwq4=",
    "wp3DuMOiwq/Dpw==",
    "PsOwJMKeLA==",
    "ERwDdAc=",
    "wo7Dj8O6wqFb",
    "w4/CqcO/w77Drg==",
    "wp8XLcOpwpM=",
    "BTnDrMOXwqU=",
    "wpNrUMKuEg==",
    "IybDpsO4wqM=",
    "w4vCqDTChl4=",
    "CMKrw5bDuVg=",
    "w6vChsOfw7nDrA==",
    "w5/CrcOwfcK7",
    "w6XDp8K2wrQW",
    "eBLCuTzDrg==",
    "ccO6wpDCi8Kr",
    "w71+w7jDiRE=",
    "UwLChAbDhQ==",
    "BAjCgcOqEQ==",
    "XgNoHcOI",
    "wpDDhsOowoF/",
    "w7TCvcOrw67Dtg==",
    "wpbCoE5YUg==",
    "eMKTw4XCmQ==",
    "LBfCqcOSCw==",
    "wr/DmcOzwrVL",
    "NRsPYxY=",
    "wprCmFzCmkA=",
    "YBRkFcOK",
    "JMO/CcKTKw==",
    "PSDCgMO7Mg==",
    "w6Baw53DuGI=",
    "YWjDiHDDsQ==",
    "TTlJCcOZ",
    "F8KQw6LDrkI=",
    "w79pw4PDvVI=",
    "LsO3EMK1GQ==",
    "UsOyXlwJ",
    "w4bCvMOZw7jDtg==",
    "QMKwwofCjcKgw4la",
    "Jx3Du8Omwr0=",
    "HTjCkMO7Ag==",
    "w6PDp8Kfbzw=",
    "w4Jbw5PDjQI=",
    "w7PCocOtw6/Dgg==",
    "KcKvw4/DvVk=",
    "KwrCqcOqJxJyZQgk",
    "IB3Dl8OfwpM=",
    "w5/CoiHCpsOvMQ==",
    "VFzDhk3Dlw==",
    "w5J/PkMewpI=",
    "YsOZwrLCnMKL",
    "csKPwqvCusKv",
    "w57CmQbCu8Oe",
    "w5fCqD0Gw4k=",
    "w4pQEV7Cgw==",
    "HDXDr8OTwo8=",
    "wqrCkcKoNRI=",
    "ezl/KcO5",
    "NMKZcCfDrg==",
    "SXzDicK5Ew==",
    "wqtHeggZ",
    "w7nDjj3CjsKe",
    "w4dGFXUy",
    "AwzCi8OaMg==",
    "JcOULsKbJg==",
    "w4BZJ1o0",
    "wr7DgMOMwpJc",
    "Q0fDt0LDkQ==",
    "woDDssKuDUs=",
    "HcO0OsKeBQ==",
    "w6vDrMKuRB0=",
    "P0U/bBs=",
    "w47DsMK2wrYy",
    "S8OLwoXCjMKQ",
    "wopOSsK5PQ==",
    "w5xxB1cT",
    "YcOswqXDoWM=",
    "w5tLMmHCqw==",
    "CcK6w5bDlXU=",
    "aFBWdA==",
    "w5LCkVkxw79awpDDjQ==",
    "fMKZwrkuDcOO",
    "w5UUOARqw4gyEsKMwqvDmn8aw4A=",
    "wpDCj8K5KCzDk0cGw6I=",
    "H8OLwrTCi8OrwqbCig==",
    "M8KtRRnDmXDCgnPDrx7DvyY=",
    "w53Cl8OpZMKka8KYfMOFI3pkYBg=",
    "w4rCpsOBw4g=",
    "RWPDusK9LQ==",
    "wr3Ck2rCocKgw73CpjM5w5hQwozDhcKmGSw/wrPCnhXCmsOow7E=",
    "wozDisKgPw==",
    "wp/DqcO/wo1R",
    "wpnCk2PCpcKxw6Y=",
    "JsOIHsKbIw==",
    "w7xDw7TDnGo=",
    "w4Z4w5bDrSY=",
    "WjPCpQfDpMOR",
    "wo/Cl8K3PQo=",
    "w67Cixsow49l",
    "w5nCpsOGw4/DlCHDhEDCuTbChlHDg8OzwpRc",
    "HzPCk8O7TMOEwpZIwoA3GmUVZ8OiYDsIUcORVRIOw6HCoTssXXINw7I9w73CucKxwosGwpHDv8O9RsOmHEvDmV0uUsK/w67Ctw5FacOZw5jDlcOPJMOUXURMeQ==",
    "woYDE8OP",
    "wpHDl8OiwqHDmQ==",
    "L8OswpTDq0rDpA==",
    "wq/CsQTCvsKSw5JPwoFfbcOXw54=",
    "w6/Dg8KYXBk=",
    "w61JCV7CmQ==",
    "H8KXdT3DqQ==",
    "T8OywpTDoXk=",
    "aGp0ScOc",
    "w4TCjAXCg8Ov",
    "W3DDhlTDug==",
    "wqrCjHFOdg==",
    "wqjCoHUbCQ==",
    "w5jCtAcBw7Y=",
    "TMKpwoIcAQ==",
    "UsOoRkAr",
    "w5rCmcOLw4fDkg==",
    "w7HDrsKVwoE3",
    "cMKbwqDCt8Kf",
    "DjM6RRE=",
    "w4oWPShX",
    "w6V+DVrCiw==",
    "wpLCtkEWAg==",
    "wo3Dq8OswrR4",
    "TF9+dcOX",
    "LEDCq8KcAg==",
    "w5XClMOZw4rDmA==",
    "w5LDgMKoTwY=",
    "w57DpTbCr8KB",
    "X23DtknDoQ==",
    "worDksOqwqZb",
    "UmNpRcOg",
    "NcOjwobCmsOP",
    "JsOxHsKYOw==",
    "T8OMXEkH",
    "wpgdCcOdwro=",
    "bmhtcsO8",
    "w4HCiGsIw6g=",
    "wqjDv8OlwpN9",
    "w7NHPnHCrA==",
    "w7bCkzfCu8Oj",
    "w7lhE2TCgQ==",
    "w6LDucKgwrcW",
    "Kk7CisKECw==",
    "wpBLWzQA",
    "w5TCsX0Mw44=",
    "OcOkDMKcFA==",
    "wpHDk8OmwqnDhTVbwpY1woXClw0=",
    "N8K1w6nDoHg=",
    "wozCmlZFcg==",
    "XWjDjn7DgQ==",
    "w5nDtcKewqET",
    "w4MUJA12",
    "w6gzAV4=",
    "JTPDvsOFwpdVIUA=",
    "w7ZUw6TDpUI=",
    "bsKZwrgu",
    "MzbDhcO1wqk=",
    "w6I5HQ5k",
    "w5nCicOjTMKK",
    "d8K6wrTCiMKL",
    "w6BtHlQt",
    "VV/DpMKdAA==",
    "H8OuH8KkDA==",
    "wrrCsGTCnVw=",
    "w6lCClTCoA==",
    "wpDCtsKKOAE=",
    "JgjDkcOswpE=",
    "wpfClVrCuH4=",
    "Ukp7UcOj",
    "RsOTworDqGI=",
    "eG9ce8OX",
    "QRXChgvDgA==",
    "wqDCul1vSA==",
    "wp8jCMOUwq0=",
    "dcKGwr4uEQ==",
    "w5oDGXgL",
    "FmjCjcK+GQ==",
    "IcOmB8KVIA==",
    "woprfD4P",
    "w6tvw4PDiU8=",
    "WhdeKMOw",
    "MRoIYAY=",
    "w4XDhgDCpcK+",
    "Fk3ChMKmPA==",
    "w43DhxHCicKW",
    "a8KYwrDCvMKv",
    "wpxdwrZJew==",
    "wpzCg3QMIg==",
    "w6fDjsKNTyE=",
    "Iy3DmsOtwqc=",
    "ZMKDwqHCm8Kb",
    "wpbCukkqMA==",
    "ScOjwr3ClcKi",
    "ZUXCo8KdwpE=",
    "cMOoVncM",
    "woxRwodHaw==",
    "X8OtSFoa",
    "eE1sdsOA",
    "wq3Du8KAKVI=",
    "EgDCjsOaFw==",
    "FsKNw7LDi38=",
    "YzTChAnDoQ==",
    "wr7CukMZPQ==",
    "E8OKwpnCh8Of",
    "FlfCqMK2GA==",
    "R8KYwpFjwo8=",
    "RFbChcK+wp8=",
    "wprDk8OnwpzDlA==",
    "RHfCvsKhwpo=",
    "dcK3wqXCs8KY",
    "wpvCv2fCjQ==",
    "wpXCvcKLDB0=",
    "w7fCo8Omw6DDqA==",
    "w4jCrzPCoA==",
    "wp9dwrd6XA==",
    "dFrDt0zDlw==",
    "wq7CokAIKw==",
    "wrHCiWJwSw==",
    "wr4XO8Oewq8=",
    "e07DiVLDug==",
    "eQNJNcOs",
    "LwEVbho=",
    "w6BUw6zDvFLDkA==",
    "OxbCvcO8HSl/bSw=",
    "wpxrwrRbag==",
    "bMK2woYdAQ==",
    "GTLCnsOhKQ==",
    "eUlwRcON",
    "wr3Cu3waEW4=",
    "CGYWeSc=",
    "w4jDoMK5wog=",
    "UsKlwqPCrsK6",
    "w6HCvh4qw70="
];
var stringArray = _0x4cb6;

/**
 * 通用解密函数 (原 _0x1e77)
 * @param {string} indexHex - 密文在数组中的索引（可能是十六进制字符串）
 * @param {string} key - 解密用的密钥
 */
var decryptString = function (indexHex, key) {
    // 1. 处理索引：将 '0x5' 这种字符串转为整数索引
    // 原代码: _0x51af1b = ~~'0x'['concat'](_0x51af1b);
    var index = parseInt(indexHex, 16);

    // 从外部大数组中获取密文
    var encryptedString = stringArray[index];

    // 2. 初始化环境 (只运行一次)
    // 原代码: if (_0x1e77['WhVhCX'] === undefined)
    if (decryptString['isInitialized'] === undefined) {

        // --- 内部块 A: Base64 Polyfill ---
        // 这一段是为了兼容没有 atob 的环境 (如旧版 IE 或 Node.js)
        (function () {
            var globalScope = typeof window !== 'undefined' ? window : typeof process === 'object' && typeof require === 'function' && typeof global === 'object' ? global : this;
            var base64Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

            // // 如果环境里没有 atob，就手动定义一个
            // globalScope['atob'] || (globalScope['atob'] = function (input) {
            //     var str = String(input)['replace'](/=+$/, '');
            //     for (var bc = 0, bs, buffer, idx = 0, output = ''; buffer = str['charAt'](idx++); ~buffer && (bs = bc % 0x4 ? bs * 0x40 + buffer : buffer,
            //         bc++ % 0x4) ? output += String['fromCharCode'](0xff & bs >> (-0x2 * bc & 0x6)) : 0x0) {
            //         buffer = base64Chars['indexOf'](buffer);
            //     }
            //     return output;
            // });
        }());

        // --- 内部块 B: 核心 RC4 解密算法 (原 _0x6e3a78) ---
        var rc4Decrypt = function (data, key) {
            var sBox = [],
                j = 0,
                temp,
                decryptedResult = '',
                uriEncoded = '';

            // B1. Base64 解码
            data = atob(data);

            // B2. 处理 URL 编码 (为了正确显示中文和特殊字符)
            for (var i = 0, len = data['length']; i < len; i++) {
                uriEncoded += '%' + ('00' + data['charCodeAt'](i)['toString'](16))['slice'](-2);
            }
            data = decodeURIComponent(uriEncoded);

            // B3. 初始化 S-Box (0-255)
            for (var i = 0; i < 256; i++) {
                sBox[i] = i;
            }

            // B4. KSA (Key Scheduling Algorithm) - 密钥调度算法
            // 用密钥打乱 S-Box
            for (var i = 0; i < 256; i++) {
                j = (j + sBox[i] + key['charCodeAt'](i % key['length'])) % 256;
                // 交换
                temp = sBox[i];
                sBox[i] = sBox[j];
                sBox[j] = temp;
            }

            // B5. PRGA (Pseudo-Random Generation Algorithm) - 伪随机生成与解密
            var i = 0;
            j = 0;
            for (var k = 0; k < data['length']; k++) {
                i = (i + 1) % 256;
                j = (j + sBox[i]) % 256;

                // 再次交换
                temp = sBox[i];
                sBox[i] = sBox[j];
                sBox[j] = temp;

                // 异或解密
                var keyStreamByte = sBox[(sBox[i] + sBox[j]) % 256];
                decryptedResult += String['fromCharCode'](data['charCodeAt'](k) ^ keyStreamByte);
            }
            return decryptedResult;
        };

        // 将 RC4 函数挂载到主函数上
        decryptString['rc4Core'] = rc4Decrypt; // 原 pWOTjT
        decryptString['cache'] = {};           // 原 AfFUIg
        decryptString['isInitialized'] = true; // 原 WhVhCX
    }

    // 3. 检查缓存
    var cachedResult = decryptString['cache'][index];

    // 如果缓存里没有，说明是第一次解密
    if (cachedResult === undefined) {

        // --- 内部块 C: 反调试/代码完整性检查 (原 _0x1e77['ebRkjK']) ---
        // 这部分是用来防止你格式化代码的。如果你格式化了代码，正则匹配会失败，导致程序崩溃或进入死循环。
        // 在纯静态分析或重写脚本时，这部分通常可以直接删除。
        // if (decryptString['antiTamperInitialized'] === undefined) {
        //     var AntiTamperDetector = function (context) {
        //         this['context'] = context;
        //         this['state'] = [0x1, 0x0, 0x0]; // 状态机
        //         this['targetFunc'] = function () {
        //             return 'newState';
        //         };
        //         // 正则表达式：用于匹配压缩后的函数代码特征
        //         this['regexPart1'] = '\x5cw+\x20*\x5c(\x5c)\x20*{\x5cw+\x20*';
        //         this['regexPart2'] = '[\x27|\x22].+[\x27|\x22];?\x20*}';
        //     };

        //     AntiTamperDetector['prototype']['checkIntegrity'] = function () {
        //         var regex = new RegExp(this['regexPart1'] + this['regexPart2']);
        //         // 如果格式化了代码，targetFunc.toString() 就会包含多余的空格/换行，导致 test 失败
        //         var checkResult = regex['test'](this['targetFunc']['toString']())
        //             ? --this['state'][0x1]  // 正常路径
        //             : --this['state'][0x0]; // 异常路径（被篡改）

        //         return this['executeTrace'](checkResult);
        //     };

        //     AntiTamperDetector['prototype']['executeTrace'] = function (result) {
        //         if (!Boolean(~result)) {
        //             return result;
        //         }
        //         return this['crashOrRecursion'](this['context']);
        //     };

        //     AntiTamperDetector['prototype']['crashOrRecursion'] = function (funcCall) {
        //         // 如果检测到调试/篡改，在这里疯狂消耗内存或死循环
        //         for (var i = 0, len = this['state']['length']; i < len; i++) {
        //             this['state']['push'](Math['round'](Math['random']()));
        //             len = this['state']['length'];
        //         }
        //         return funcCall(this['state'][0x0]);
        //     };

        //     // 触发反调试检查
        //     new AntiTamperDetector(decryptString)['checkIntegrity']();
        //     decryptString['antiTamperInitialized'] = true; // 原 ebRkjK
        // }

        // 4. 执行解密并存入缓存
        // encryptedString 是密文，key 是密钥
        encryptedString = decryptString['rc4Core'](encryptedString, key);
        decryptString['cache'][index] = encryptedString;
    } else {
        encryptedString = cachedResult;
    }

    return encryptedString;
};

/**
 * 
 * @param {string} code code snippets
 * @param {string} decrypt_func_name the func name used to decrypt strings
 * @returns {string} code with decrypted strings
 */
var replaceVar = (code, decrypt_func_name) => {
    if (typeof code !== 'string' || typeof decrypt_func_name !== 'string' || !decrypt_func_name) {
        return code;
    }

    // 匹配形如: decrypt_func_name('0x1a','key') 或 decrypt_func_name("0x1a","key") 或 decrypt_func_name(`0x1a`,`key`)
    // 仅处理两个参数都是字符串字面量的情况
    const makeRegex = (fn) =>
        new RegExp(
            String(fn)
                .replace(/[.*+?^${}()|[\]\\]/g, '\\$&') +
            '\\(\\s*([\'"`])([^\'"`]+)\\1\\s*,\\s*([\'"`])([^\'"`]+)\\3\\s*\\)',
            'g'
        );

    const regex = makeRegex(decrypt_func_name);

    // 多轮替换，直到不再匹配（处理嵌套或多次出现）
    let prev;
    do {
        prev = code;
        code = code.replace(regex, (_, q1, arg1, q2, arg2) => {
            try {
                // 调用现有的解密函数
                const decrypted = decryptString(arg1, arg2);

                // 安全生成字符串字面量
                const literal = JSON.stringify(decrypted);
                return literal;
            } catch (e) {
                // 若解密失败，保持原调用不变
                return `${decrypt_func_name}(${q1}${arg1}${q1},${q2}${arg2}${q2})`;
            }
        });
    } while (code !== prev);

    return code;
};

const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const t = require('@babel/types');
const generator = require('@babel/generator').default;

function isSimpleReturn(bodyBlock) {
    if (!bodyBlock || !bodyBlock.body || bodyBlock.body.length !== 1) return false;
    return t.isReturnStatement(bodyBlock.body[0]);
}

var unpackObfDicts = (sourceCode) => {
    let currentCode = sourceCode;
    let loopCount = 0;
    const MAX_LOOPS = 20;

    let processedDictNames = new Set();

    while (loopCount < MAX_LOOPS) {
        loopCount++;
        let hasChanged = false;

        const ast = parser.parse(currentCode);
        let allDicts = {};

        // --- 步骤一：寻找字典 ---
        traverse(ast, {
            VariableDeclarator(path) {
                if (path.node.init && t.isObjectExpression(path.node.init)) {
                    const properties = path.node.init.properties;
                    // if (properties.length < 3) return;

                    let tempDict = {};
                    let isLikelyObfuscatedDict = true;

                    for (let prop of properties) {
                        if (!prop.key) { isLikelyObfuscatedDict = false; break; }
                        const key = prop.key.value || prop.key.name;
                        const val = prop.value;

                        // 1. 字符串映射
                        if (t.isStringLiteral(val)) {
                            tempDict[key] = { type: 'string', value: val.value };
                        }
                        // 2. 函数映射
                        else if (t.isFunctionExpression(val) && isSimpleReturn(val.body)) {
                            const retArg = val.body.body[0].argument;
                            const params = val.params.map(p => p.name); // 获取函数参数名列表

                            if (t.isBinaryExpression(retArg)) {
                                tempDict[key] = { type: 'binary', operator: retArg.operator };
                            }
                            else if (t.isLogicalExpression(retArg)) {
                                tempDict[key] = { type: 'logical', operator: retArg.operator };
                            }
                            else if (t.isCallExpression(retArg)) {
                                // 重点修复逻辑：区分 "执行参数" 和 "执行别名"
                                const callee = retArg.callee;

                                // 情况 A: 调用的是参数之一 (例如: return fn(a, b))
                                if (t.isIdentifier(callee) && params.includes(callee.name)) {
                                    tempDict[key] = { type: 'call_indirect' }; // 标记为间接调用
                                }
                                // 情况 B: 调用的不是参数 (例如: return _0x56da17["FYuCb"](a, b))
                                else {
                                    // 我们需要把被调用的那个节点保存下来
                                    // 注意：这里保存的是 AST 节点，比如 _0x56da17["FYuCb"]
                                    tempDict[key] = { type: 'call_alias', calleeNode: callee };
                                }
                            }
                        }
                    }

                    if (isLikelyObfuscatedDict && Object.keys(tempDict).length > 0) {
                        const dictName = path.node.id.name;
                        allDicts[dictName] = tempDict;

                        // 新增：记录名字
                        processedDictNames.add(dictName);
                    }
                }
            }
        });

        if (Object.keys(allDicts).length === 0) {
            if (loopCount === 1) console.log("未检测到标准混淆字典。");
            break;
        }

        console.log(`第 ${loopCount} 轮: 发现 ${Object.keys(allDicts).length} 个字典。正在替换...`);

        // --- 步骤二：执行替换 ---
        traverse(ast, {
            // 字符串处理 (保持不变)
            MemberExpression(path) {
                if (path.removed) return;
                const objectName = path.node.object.name;
                const propertyName = path.node.property.value || path.node.property.name;

                if (t.isCallExpression(path.parent) && path.parent.callee === path.node) return;

                if (allDicts[objectName] && allDicts[objectName][propertyName]) {
                    const mapping = allDicts[objectName][propertyName];
                    if (mapping.type === 'string') {
                        path.replaceWith(t.stringLiteral(mapping.value));
                        hasChanged = true;
                    }
                }
            },

            // 函数调用处理
            CallExpression(path) {
                if (path.removed) return;
                const callee = path.node.callee;
                if (!t.isMemberExpression(callee)) return;

                const objectName = callee.object.name;
                const propertyName = callee.property.value || callee.property.name;

                if (allDicts[objectName] && allDicts[objectName][propertyName]) {
                    const mapping = allDicts[objectName][propertyName];
                    const args = path.node.arguments;

                    if (mapping.type === 'binary') {
                        if (args.length >= 2) {
                            path.replaceWith(t.binaryExpression(mapping.operator, args[0], args[1]));
                            hasChanged = true;
                        }
                    }
                    else if (mapping.type === 'logical') {
                        if (args.length >= 2) {
                            path.replaceWith(t.logicalExpression(mapping.operator, args[0], args[1]));
                            hasChanged = true;
                        }
                    }
                    // 修复点：处理间接调用 (return arg0(arg1))
                    else if (mapping.type === 'call_indirect') {
                        if (args.length >= 1) {
                            const realFunc = args[0];
                            const realArgs = args.slice(1);
                            path.replaceWith(t.callExpression(realFunc, realArgs));
                            hasChanged = true;
                        }
                    }
                    // 修复点：处理直接别名 (return GlobalFunc(arg0, arg1))
                    else if (mapping.type === 'call_alias') {
                        // 这里的 args 就是直接传递给内部函数的参数
                        // 我们只需要用 mapping.calleeNode (即那个 GlobalFunc 节点) 替换掉当前的 dict['method']
                        // 必须使用 t.cloneNode，因为 AST 节点不能重复使用
                        const newCallee = t.cloneNode(mapping.calleeNode);
                        path.replaceWith(t.callExpression(newCallee, args));
                        hasChanged = true;
                    }
                }
            }
        });

        if (hasChanged) {
            currentCode = generator(ast, { jsescOption: { minimal: true } }).code;
        } else {
            console.log("代码已稳定，停止解包。");
            break;
        }
    }

    return {
        code: currentCode,
        dictNames: Array.from(processedDictNames)
    };
};

var removeObfDicts = (sourceCode, targetDictNames) => {
    // 如果没有名单，为了安全起见，我们什么都不做，或者你可以改为移除所有无用对象
    if (!targetDictNames || targetDictNames.length === 0) return sourceCode;

    const ast = parser.parse(sourceCode);
    let removedCount = 0;

    traverse(ast, {
        VariableDeclarator(path) {
            const { id, init } = path.node;
            const varName = id.name;

            // 1. 检查名字：必须是我们解包过的字典
            if (!targetDictNames.includes(varName)) return;

            // 2. 检查结构：必须是对象定义 var x = { ... }
            if (!init || !t.isObjectExpression(init)) return;

            // 3. 核心检查：检查引用计数 (Reference Count)
            // path.scope.getBinding 会获取该变量在作用域内的所有信息
            const binding = path.scope.getBinding(varName);

            // binding.referenced 为 false 表示没有任何代码读取或调用这个变量
            if (binding && !binding.referenced) {
                // 安全移除
                path.remove();
                removedCount++;
            }
        }
    });

    console.log(`清理完成：移除了 ${removedCount} 个遗留的混淆字典。`);
    return generator(ast, { jsescOption: { minimal: true } }).code;
};

var removeObfIfStatement = (sourceCode) => {
    // 1. 将源代码解析为 AST
    // sourceType: 'module' 允许解析 import/export 等语法
    const ast = parser.parse(sourceCode, {
        sourceType: 'module'
    });

    // 2. 遍历 AST
    traverse(ast, {
        // 访问每一个 IfStatement 节点
        IfStatement(path) {
            const node = path.node;
            const test = node.test;

            // 3. 检测：我们需要过滤出特定的结构
            // 结构特征：if ("str" op "str")
            // 判断条件必须是二元表达式 (BinaryExpression)
            if (!t.isBinaryExpression(test)) return;

            // 判断左右两边是否都是字符串字面量 (StringLiteral)
            if (!t.isStringLiteral(test.left) || !t.isStringLiteral(test.right)) return;

            // 4. 求值：手动计算这个表达式的结果
            // 获取左右两边的字符串值
            const leftVal = test.left.value;
            const rightVal = test.right.value;
            const operator = test.operator;

            let result = null;

            // 根据操作符进行运算 (针对你提到的 ===, !==, ==, !=)
            switch (operator) {
                case '===':
                case '==':
                    result = leftVal === rightVal;
                    break;
                case '!==':
                case '!=':
                    result = leftVal !== rightVal;
                    break;
                // 如果有其他操作符可以在这里补充
            }

            // 如果结果没有被计算出来（不是我们要的操作符），则跳过
            if (result === null) return;

            // 5. 替换：根据计算结果保留代码分支

            if (result === true) {
                // 情况 A: 结果为真，只保留 if 里面的代码 (consequent)
                // 这里的处理是为了去掉多余的花括号 {}
                if (t.isBlockStatement(node.consequent)) {
                    // 如果里面是代码块 { ... }，用代码块里的语句列表替换当前节点
                    path.replaceWithMultiple(node.consequent.body);
                } else {
                    // 如果里面只有一句代码 (没有花括号)，直接替换
                    path.replaceWith(node.consequent);
                }
            } else {
                // 情况 B: 结果为假，只保留 else 里面的代码 (alternate)
                if (node.alternate) {
                    // 如果存在 else 块
                    if (t.isBlockStatement(node.alternate)) {
                        path.replaceWithMultiple(node.alternate.body);
                    } else {
                        path.replaceWith(node.alternate);
                    }
                } else {
                    // 如果结果为假，且没有 else，说明整个 if 语句都可以删掉
                    path.remove();
                }
            }

            // 这是一个好习惯：如果你替换了节点，建议停止处理当前路径的子节点，或者重新根据需要处理
            // 这里因为我们替换了整个 If 语句，通常不需要再深究旧的结构了
        }
    });

    // 6. 生成代码
    // jsescOption: { minimal: true } 可以在生成代码时尽量少用转义符
    console.log("条件语句清理完成。");
    return generator(ast, { jsescOption: { minimal: true } }).code;
}

var removeObfFunc = (sourceCode) => {
    // === 阶段一：内联替换 (Inlining) ===
    // 这个阶段我们只关注把代码展开，不关心删除，避免 Scope 问题干扰

    let ast = parser.parse(sourceCode);
    let changed = true;
    let loopCount = 0;

    function getProxyFunctionInfo(path) {
        const { node } = path;
        const body = node.body.body;
        if (body.length !== 1 || !t.isReturnStatement(body[0])) return null;
        const returnArg = body[0].argument;
        if (!returnArg) return null;
        return { returnArg };
    }

    while (changed && loopCount < 50) {
        changed = false;
        loopCount++;

        // 每次循环重新遍历，确保获取最新状态
        traverse(ast, {
            FunctionDeclaration(path) {
                const proxyInfo = getProxyFunctionInfo(path);
                if (!proxyInfo) return;

                const { node } = path;
                const params = node.params;
                const { returnArg } = proxyInfo;
                const binding = path.scope.getBinding(node.id.name);

                if (!binding || !binding.constant) return;

                binding.referencePaths.forEach(refPath => {
                    const callExprPath = refPath.parentPath;
                    if (!t.isCallExpression(callExprPath.node) ||
                        callExprPath.node.callee !== refPath.node ||
                        callExprPath.node.arguments.length !== params.length) {
                        return;
                    }

                    const args = callExprPath.node.arguments;
                    const newExpr = t.cloneNode(returnArg);
                    const replaceMap = {};

                    params.forEach((param, index) => {
                        if (t.isIdentifier(param)) replaceMap[param.name] = args[index];
                    });

                    traverse(t.file(t.program([t.expressionStatement(newExpr)])), {
                        Identifier(innerPath) {
                            const pName = innerPath.node.name;
                            if (replaceMap.hasOwnProperty(pName)) {
                                innerPath.replaceWith(t.cloneNode(replaceMap[pName]));
                                innerPath.skip();
                            }
                        },
                        noScope: true
                    });

                    callExprPath.replaceWith(newExpr);
                    changed = true;
                });
            }
        });
    }

    // =======================================================
    // 关键修复步骤：重新生成代码并重新解析 (Flush AST)
    // =======================================================
    // 此时内存中的 AST 可能包含大量已经断开连接的节点导致的“幽灵引用”。
    // 我们将代码生成出来，这会自动丢弃所有不在树上的节点。
    // 然后重新解析，得到一个干净的、引用计数准确的 AST。
    let cleanCode = generator(ast).code;
    ast = parser.parse(cleanCode);

    // =======================================================
    // 阶段二：清理死代码 (Cleanup)
    // =======================================================

    let cleanupChanged = true;
    let cleanupLoopCount = 0;

    while (cleanupChanged && cleanupLoopCount < 50) {
        cleanupChanged = false;
        cleanupLoopCount++;

        traverse(ast, {
            FunctionDeclaration(path) {
                const fnName = path.node.id.name;
                const binding = path.scope.getBinding(fnName);

                // 如果没有 binding，说明是个很奇怪的孤立节点，或者已经被移除
                if (!binding) return;

                // 策略 A：基于 AST 的智能引用检查 (现在因为 Re-parse 变准了)
                const externalRefs = binding.referencePaths.filter(refPath => {
                    return !refPath.findParent(p => p === path);
                });

                if (externalRefs.length === 0) {
                    path.remove();
                    cleanupChanged = true;
                    return; // 删掉了就不用执行策略 B 了
                }

                // 策略 B：暴力文本检查 (响应你的要求)
                // 如果 AST 依然因为某种原因抽风 (比如 Scope 没更新)，我们用正则表达式检查
                // 条件：
                // 1. 函数名比较长 (避免误伤变量 'a', 'b')，混淆名通常 > 3 字符
                // 2. 整个 sourceCode 里，这个名字出现的次数 == 1 (只有定义处)
                // 注意：这种方法比较耗时，但对于解决最后几个顽固分子很有效

                if (fnName.length > 3 && fnName.startsWith('_0x')) {
                    // 这里我们需要当前的源码字符串。由于 traverse 过程中 ast 在变，
                    // 每次 generate 会很慢。但我们可以只在 externalRefs > 0 但看起来很可疑时做。

                    // 简单的正则匹配次数
                    const regex = new RegExp(fnName.replace('$', '\\$'), 'g');
                    // 注意：这里用的是刚生成的 cleanCode，可能略有滞后，但对于清理阶段足够了
                    // 更好的方式是只在最后做一次暴力清理，但这里放在循环里也行
                    const matchCount = (cleanCode.match(regex) || []).length;

                    // 如果文本里只出现了一次（就是函数定义本身），那就强制删除
                    if (matchCount === 1) {
                        console.log(`[Force Delete] 强制删除僵尸函数: ${fnName}`);
                        path.remove();
                        cleanupChanged = true;
                    }
                }
            }
        });

        // 如果发生了改变，更新 cleanCode，以便下一轮暴力检查使用
        if (cleanupChanged) {
            cleanCode = generator(ast).code;
        }
    }

    return cleanCode;
};

var removeObfConstants = (sourceCode) => {
    let ast = parser.parse(sourceCode);

    // 设置一个标志位，用于判断AST是否发生了改变
    let changed = true;
    let loopLimit = 200; // 防止死循环，设置最大轮数

    // 循环执行，直到没有新的替换发生，或者达到最大轮数
    while (changed && loopLimit > 0) {
        changed = false;
        loopLimit--;

        traverse(ast, {
            // 1. 处理字符串拼接 "str" + "ing"
            BinaryExpression(path) {
                const { left, right, operator } = path.node;

                // 只处理 "+" 运算符
                if (operator !== '+') return;

                // 检查左边和右边是否都是字面量 (StringLiteral, NumericLiteral 等)
                if (t.isLiteral(left) && t.isLiteral(right)) {
                    // 确保是字符串拼接 (通常至少有一边是字符串)
                    if (typeof left.value === 'string' || typeof right.value === 'string') {
                        // 计算结果
                        const result = left.value + right.value;
                        // 替换节点为新的字符串常量
                        path.replaceWith(t.stringLiteral(result));
                        changed = true;
                    }
                }
            },

            // 2. 处理属性访问 "string"["length"] 或 "string".length
            MemberExpression(path) {
                const { object, property, computed } = path.node;

                // 目标必须是字符串常量
                if (!t.isStringLiteral(object)) return;

                // 获取属性名
                let propName;
                if (computed && t.isStringLiteral(property)) {
                    // 形式: "str"['length']
                    propName = property.value;
                } else if (!computed && t.isIdentifier(property)) {
                    // 形式: "str".length
                    propName = property.name;
                }

                // 处理 .length 属性
                if (propName === 'length') {
                    const result = object.value.length;
                    // 替换为数字常量
                    path.replaceWith(t.numericLiteral(result));
                    changed = true;
                }

                // (可选) 如果需要处理 "abc"[0] 这种索引访问，可以在这里加逻辑
            },

            // 3. 处理变量常量替换 (之前的逻辑)
            VariableDeclarator(path) {
                const { id, init } = path.node;

                // 必须有初始值，且初始值必须是 字面量 (String, Number, Boolean)
                // 这里放宽了条件，不仅支持字符串，也支持数字等，只要是Literal即可
                if (!init || !t.isLiteral(init)) return;
                if (!t.isIdentifier(id)) return;

                const binding = path.scope.getBinding(id.name);
                if (!binding || !binding.constant) return;

                // 如果该变量没有被引用，说明是死代码（或者已经被我们在之前的循环中替换完了）
                // 可以直接删除，净化代码
                if (binding.referencePaths.length === 0) {
                    path.remove();
                    changed = true;
                    return;
                }

                // 执行替换
                for (const refPath of binding.referencePaths) {
                    // 此时 init 必定是 Literal，直接根据类型创建对应的 Literal 节点
                    // 使用 t.cloneNode 复制节点，防止引用同一个对象出错
                    refPath.replaceWith(t.cloneNode(init));
                }

                // 替换完成后，标记发生了改变
                changed = true;

                // 注意：这里我们不直接 remove，而是等到下一轮循环时
                // binding.referencePaths.length 变成 0 了再由上面的逻辑删除
                // 这样逻辑更清晰
            }
        });
    }

    return generator(ast, { jesc: true }).code;
}

function main() {
    let sourcePath = 'source/new_2.js';
    let originalCode = fs.readFileSync(path.resolve(__dirname, sourcePath), 'utf-8').toString();

    let unpackedCode = replaceVar(originalCode, "_0x1e77");
    fs.writeFileSync(path.resolve(__dirname, 'dist/source-decrypted.js'), unpackedCode);

    let unpackedResult = unpackObfDicts(unpackedCode);
    let unpakcedCode = removeObfDicts(unpackedResult.code, unpackedResult.dictNames);
    fs.writeFileSync(path.resolve(__dirname, 'dist/source-decrypted-unpacked.js'), unpakcedCode);

    let cleanedCode = removeObfIfStatement(unpakcedCode);
    fs.writeFileSync(path.resolve(__dirname, 'dist/source-cleaned.js'), cleanedCode);

    let noObfFuncCode = removeObfFunc(cleanedCode);
    fs.writeFileSync(path.resolve(__dirname, 'dist/source-no-obf-func.js'), noObfFuncCode);

    let noObfConstantsCode = removeObfConstants(noObfFuncCode);
    fs.writeFileSync(path.resolve(__dirname, 'dist/source-no-obf-constants.js'), noObfConstantsCode);
}
main();