const fs = require('fs');
const path = require('path');

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

function parseSourceCode(sourceCode) {
    return parser.parse(sourceCode, { sourceType: 'unambiguous' });
}

function isObfuscatedName(name) {
    return typeof name === 'string' && /^(?:_0x[0-9a-f]+|a\d+_0x[0-9a-f]+)$/i.test(name);
}

function removeDeclarator(path) {
    if (!path?.parentPath?.node || !Array.isArray(path.parentPath.node.declarations)) {
        path.remove();
        return;
    }

    if (
        path.parentPath.parentPath &&
        (
            path.parentPath.parentPath.isForInStatement?.() ||
            path.parentPath.parentPath.isForOfStatement?.() ||
            path.parentPath.parentPath.isForStatement?.()
        )
    ) {
        return;
    }

    if (path.parentPath.node.declarations.length === 1) {
        path.parentPath.remove();
        return;
    }

    path.remove();
}

function evaluateStaticNode(node) {
    if (t.isNumericLiteral(node) || t.isStringLiteral(node) || t.isBooleanLiteral(node)) {
        return node.value;
    }

    if (t.isNullLiteral(node)) {
        return null;
    }

    if (t.isIdentifier(node, { name: 'undefined' })) {
        return undefined;
    }

    if (t.isUnaryExpression(node)) {
        const value = evaluateStaticNode(node.argument);

        switch (node.operator) {
            case '+':
                return +value;
            case '-':
                return -value;
            case '!':
                return !value;
            case '~':
                return ~value;
            default:
                break;
        }
    }

    throw new Error('Unsupported static node.');
}

function nodeReferencesIdentifier(node, targetName) {
    if (!node || !targetName) {
        return false;
    }

    let found = false;
    t.traverseFast(node, childNode => {
        if (!found && t.isIdentifier(childNode, { name: targetName })) {
            found = true;
        }
    });
    return found;
}

function getRootIdentifierName(node) {
    if (t.isIdentifier(node)) {
        return node.name;
    }

    if (t.isMemberExpression(node)) {
        return getRootIdentifierName(node.object);
    }

    if (t.isCallExpression(node) || t.isNewExpression(node)) {
        return getRootIdentifierName(node.callee);
    }

    return null;
}

function getAntiTamperHelperName(statementNode, nextStatementNode) {
    if (!t.isVariableDeclaration(statementNode) || statementNode.declarations.length !== 1) {
        return null;
    }

    const declarator = statementNode.declarations[0];
    if (
        !t.isIdentifier(declarator.id) ||
        !(t.isFunctionExpression(declarator.init) || t.isArrowFunctionExpression(declarator.init))
    ) {
        return null;
    }

    if (!t.isExpressionStatement(nextStatementNode)) {
        return null;
    }

    const helperName = declarator.id.name;
    const expressions = t.isSequenceExpression(nextStatementNode.expression)
        ? nextStatementNode.expression.expressions
        : [nextStatementNode.expression];

    const hasHelperPrototypeAssignment = expressions.some(expression =>
        t.isAssignmentExpression(expression) && getRootIdentifierName(expression.left) === helperName
    );

    const hasHelperInvocation = expressions.some(expression =>
        (t.isCallExpression(expression) || t.isNewExpression(expression)) &&
        getRootIdentifierName(expression) === helperName
    );

    if (!hasHelperPrototypeAssignment || !hasHelperInvocation) {
        return null;
    }

    return helperName;
}

function filterAntiTamperSequenceStatement(statementNode, helperName) {
    if (!t.isExpressionStatement(statementNode)) {
        return statementNode;
    }

    const expressions = t.isSequenceExpression(statementNode.expression)
        ? statementNode.expression.expressions
        : [statementNode.expression];
    const filteredExpressions = expressions.filter(expression => !nodeReferencesIdentifier(expression, helperName));

    if (filteredExpressions.length === 0) {
        return null;
    }

    return t.expressionStatement(
        filteredExpressions.length === 1
            ? filteredExpressions[0]
            : t.sequenceExpression(filteredExpressions)
    );
}

function sanitizeAntiTamperInBlock(blockNode) {
    if (!t.isBlockStatement(blockNode) || blockNode.body.length < 2) {
        return false;
    }

    let changed = false;
    const sanitizedBody = [];

    for (let index = 0; index < blockNode.body.length; index++) {
        const statementNode = blockNode.body[index];
        const nextStatementNode = blockNode.body[index + 1];
        const helperName = nextStatementNode
            ? getAntiTamperHelperName(statementNode, nextStatementNode)
            : null;

        if (!helperName) {
            sanitizedBody.push(statementNode);
            continue;
        }

        const sanitizedNextStatement = filterAntiTamperSequenceStatement(nextStatementNode, helperName);
        if (sanitizedNextStatement) {
            sanitizedBody.push(sanitizedNextStatement);
        }

        index += 1;
        changed = true;
    }

    if (changed) {
        blockNode.body = sanitizedBody;
    }

    return changed;
}

function sanitizeDecoderFunctionNode(funcNode) {
    const clonedNode = t.cloneNode(funcNode, true);
    const wrappedAst = t.file(t.program([clonedNode]));
    let changed = false;

    traverse(wrappedAst, {
        BlockStatement(path) {
            if (sanitizeAntiTamperInBlock(path.node)) {
                changed = true;
            }
        }
    });

    return {
        node: clonedNode,
        changed
    };
}

function extractArrayDecoderInfo(funcNode) {
    if (!t.isFunctionDeclaration(funcNode) || !funcNode.id) {
        return null;
    }

    const funcName = funcNode.id.name;
    let arrayProviderName = null;
    let rewritesSelf = false;
    let tailCallsSelf = false;

    for (const statement of funcNode.body.body) {
        if (t.isVariableDeclaration(statement)) {
            for (const declarator of statement.declarations) {
                if (t.isCallExpression(declarator.init) && t.isIdentifier(declarator.init.callee)) {
                    arrayProviderName = declarator.init.callee.name;
                }
            }
        }

        if (!t.isReturnStatement(statement) || !statement.argument) {
            continue;
        }

        const expressions = t.isSequenceExpression(statement.argument)
            ? statement.argument.expressions
            : [statement.argument];

        for (const expression of expressions) {
            if (
                t.isAssignmentExpression(expression, { operator: '=' }) &&
                t.isIdentifier(expression.left, { name: funcName }) &&
                (t.isFunctionExpression(expression.right) || t.isArrowFunctionExpression(expression.right))
            ) {
                rewritesSelf = true;
            }

            if (t.isCallExpression(expression) && t.isIdentifier(expression.callee, { name: funcName })) {
                tailCallsSelf = true;
            }
        }
    }

    if (!arrayProviderName || !rewritesSelf || !tailCallsSelf) {
        return null;
    }

    return {
        decryptFuncName: funcName,
        arrayProviderName
    };
}

function isRotationCallExpression(node, arrayProviderName) {
    if (!t.isCallExpression(node)) {
        return false;
    }

    if (!(t.isFunctionExpression(node.callee) || t.isArrowFunctionExpression(node.callee))) {
        return false;
    }

    if (!t.isIdentifier(node.arguments[0], { name: arrayProviderName })) {
        return false;
    }

    let hasWhileLoop = false;
    const bodyNode = t.isBlockStatement(node.callee.body) ? node.callee.body : node.callee;

    t.traverseFast(bodyNode, childNode => {
        if (t.isWhileStatement(childNode)) {
            hasWhileLoop = true;
        }
    });

    return hasWhileLoop;
}

function pruneTopLevelExpressions(programPath, shouldRemove) {
    let removedCount = 0;

    for (const statementPath of programPath.get('body')) {
        if (!statementPath.isExpressionStatement()) {
            continue;
        }

        const expressionNode = statementPath.node.expression;
        const expressions = t.isSequenceExpression(expressionNode)
            ? expressionNode.expressions
            : [expressionNode];
        const remainingExpressions = [];

        for (let index = 0; index < expressions.length; index++) {
            const expression = expressions[index];

            if (shouldRemove(expression, index, statementPath)) {
                removedCount++;
                continue;
            }

            remainingExpressions.push(expression);
        }

        if (remainingExpressions.length === expressions.length) {
            continue;
        }

        if (remainingExpressions.length === 0) {
            statementPath.remove();
        } else if (remainingExpressions.length === 1) {
            statementPath.replaceWith(t.expressionStatement(remainingExpressions[0]));
        } else {
            statementPath.node.expression = t.sequenceExpression(remainingExpressions);
        }
    }

    return removedCount;
}

function removeTopLevelPreludeCallsAst(ast) {
    let removedCount = 0;

    traverse(ast, {
        Program(path) {
            path.scope.crawl();

            removedCount = pruneTopLevelExpressions(path, (expression, index) => {
                if (index !== 0) {
                    return false;
                }

                if (!t.isCallExpression(expression) || expression.arguments.length !== 0 || !t.isIdentifier(expression.callee)) {
                    return false;
                }

                const binding = path.scope.getBinding(expression.callee.name);
                return Boolean(
                    binding &&
                    binding.scope.path === path &&
                    binding.path.isVariableDeclarator() &&
                    t.isCallExpression(binding.path.node.init)
                );
            });

            path.stop();
        }
    });

    return removedCount;
}

function removeUnusedObfuscatedBindingsAst(ast) {
    let removedCount = 0;

    traverse(ast, {
        Program(path) {
            path.scope.crawl();
            path.stop();
        }
    });

    traverse(ast, {
        VariableDeclarator(path) {
            if (!t.isIdentifier(path.node.id) || !isObfuscatedName(path.node.id.name)) {
                return;
            }

            const binding = path.scope.getBinding(path.node.id.name);
            if (binding && binding.path === path && !binding.referenced) {
                removeDeclarator(path);
                removedCount++;
            }
        },
        FunctionDeclaration(path) {
            if (!path.node.id || !isObfuscatedName(path.node.id.name)) {
                return;
            }

            const binding = path.scope.getBinding(path.node.id.name);
            if (binding && binding.path === path && !binding.referenced) {
                path.remove();
                removedCount++;
            }
        }
    });

    return removedCount;
}

function getStaticMemberName(node) {
    if (!t.isMemberExpression(node)) {
        return null;
    }

    if (!node.computed && t.isIdentifier(node.property)) {
        return node.property.name;
    }

    if (node.computed && (t.isStringLiteral(node.property) || t.isNumericLiteral(node.property))) {
        return String(node.property.value);
    }

    return null;
}

function isDotSafeProperty(name) {
    return typeof name === 'string' && t.isValidIdentifier(name);
}

function getSingleReturnExpression(node) {
    if (t.isArrowFunctionExpression(node) && !t.isBlockStatement(node.body)) {
        return node.body;
    }

    if (!(t.isFunctionExpression(node) || t.isArrowFunctionExpression(node))) {
        return null;
    }

    if (!t.isBlockStatement(node.body) || node.body.body.length !== 1) {
        return null;
    }

    const onlyStatement = node.body.body[0];
    if (!t.isReturnStatement(onlyStatement) || !onlyStatement.argument) {
        return null;
    }

    return onlyStatement.argument;
}

function analyzeProxyExpression(node, scope, allowedParams = new Set(), options = {}) {
    const externalBindings = new Map();
    const allowCalls = Boolean(options.allowCalls);

    function visit(currentNode, parentNode = null, parentKey = null) {
        if (!currentNode) {
            return true;
        }

        if (Array.isArray(currentNode)) {
            return currentNode.every(item => !item || visit(item, parentNode, parentKey));
        }

        if (typeof currentNode.type !== 'string') {
            return true;
        }

        if (t.isIdentifier(currentNode)) {
            if (
                parentNode &&
                (
                    (t.isMemberExpression(parentNode) && parentKey === 'property' && !parentNode.computed) ||
                    (
                        (t.isObjectProperty(parentNode) || t.isObjectMethod(parentNode)) &&
                        parentKey === 'key' &&
                        !parentNode.computed
                    )
                )
            ) {
                return true;
            }

            if (allowedParams.has(currentNode.name) || currentNode.name === 'undefined') {
                return true;
            }

            if (currentNode.name === 'arguments') {
                return false;
            }

            externalBindings.set(currentNode.name, scope.getBinding(currentNode.name) || null);
            return true;
        }

        if (
            t.isThisExpression(currentNode) ||
            t.isSuper(currentNode) ||
            t.isMetaProperty(currentNode) ||
            currentNode.type === 'OptionalMemberExpression'
        ) {
            return false;
        }

        if (
            t.isAssignmentExpression(currentNode) ||
            t.isUpdateExpression(currentNode) ||
            t.isAwaitExpression(currentNode) ||
            t.isYieldExpression(currentNode) ||
            t.isImport(currentNode) ||
            (t.isUnaryExpression(currentNode) && currentNode.operator === 'delete')
        ) {
            return false;
        }

        if (
            !allowCalls &&
            (
                t.isCallExpression(currentNode) ||
                t.isNewExpression(currentNode) ||
                t.isTaggedTemplateExpression(currentNode) ||
                currentNode.type === 'OptionalCallExpression'
            )
        ) {
            return false;
        }

        if (
            (t.isFunctionExpression(currentNode) || t.isArrowFunctionExpression(currentNode) || t.isClassExpression(currentNode)) &&
            parentNode !== null
        ) {
            return false;
        }

        const childKeys = t.VISITOR_KEYS[currentNode.type] || [];
        for (const childKey of childKeys) {
            const childNode = currentNode[childKey];

            if (Array.isArray(childNode)) {
                for (const item of childNode) {
                    if (item && !visit(item, currentNode, childKey)) {
                        return false;
                    }
                }
                continue;
            }

            if (childNode && !visit(childNode, currentNode, childKey)) {
                return false;
            }
        }

        return true;
    }

    if (!visit(node)) {
        return null;
    }

    return { externalBindings };
}

function cloneAndReplaceParams(node, paramMap, parentNode = null, parentKey = null) {
    if (!node) {
        return node;
    }

    if (
        t.isIdentifier(node) &&
        Object.prototype.hasOwnProperty.call(paramMap, node.name) &&
        !(
            parentNode &&
            (
                (t.isMemberExpression(parentNode) && parentKey === 'property' && !parentNode.computed) ||
                (
                    (t.isObjectProperty(parentNode) || t.isObjectMethod(parentNode)) &&
                    parentKey === 'key' &&
                    !parentNode.computed
                )
            )
        )
    ) {
        return t.cloneNode(paramMap[node.name], true);
    }

    const clone = t.cloneNode(node, false);
    const childKeys = t.VISITOR_KEYS[node.type] || [];

    for (const childKey of childKeys) {
        const childNode = node[childKey];

        if (Array.isArray(childNode)) {
            clone[childKey] = childNode.map(item =>
                item ? cloneAndReplaceParams(item, paramMap, node, childKey) : item
            );
            continue;
        }

        if (childNode && typeof childNode.type === 'string') {
            clone[childKey] = cloneAndReplaceParams(childNode, paramMap, node, childKey);
        }
    }

    return clone;
}

function getProxyPropertyDescriptor(node, scope) {
    if (!(t.isFunctionExpression(node) || t.isArrowFunctionExpression(node))) {
        const valueAnalysis = analyzeProxyExpression(node, scope, new Set(), { allowCalls: false });
        if (valueAnalysis) {
            return {
                kind: 'value',
                node: t.cloneNode(node, true),
                externalBindings: valueAnalysis.externalBindings
            };
        }

        return null;
    }

    if (!node.params.every(param => t.isIdentifier(param))) {
        return null;
    }

    const returnExpression = getSingleReturnExpression(node);
    if (!returnExpression) {
        return null;
    }

    const params = node.params.map(param => param.name);
    const exprAnalysis = analyzeProxyExpression(
        returnExpression,
        scope,
        new Set(params),
        { allowCalls: true }
    );

    if (!exprAnalysis) {
        return null;
    }

    return {
        kind: 'expr',
        expr: t.cloneNode(returnExpression, true),
        params,
        externalBindings: exprAnalysis.externalBindings
    };
}

function descriptorBindingsMatch(scope, descriptor) {
    for (const [name, expectedBinding] of descriptor.externalBindings.entries()) {
        const actualBinding = scope.getBinding(name) || null;
        if (actualBinding !== expectedBinding) {
            return false;
        }
    }

    return true;
}

function isPathWithinAny(targetPath, candidatePaths) {
    if (!targetPath) {
        return false;
    }

    for (const candidatePath of candidatePaths) {
        if (!candidatePath || candidatePath.removed) {
            continue;
        }

        if (targetPath === candidatePath || targetPath.findParent(parentPath => parentPath === candidatePath)) {
            return true;
        }
    }

    return false;
}

function getNodeStart(pathOrNode) {
    const node = pathOrNode?.node || pathOrNode;
    return typeof node?.start === 'number' ? node.start : -1;
}

function removeExpressionPath(path) {
    if (!path || path.removed || !path.parentPath || !path.container) {
        return false;
    }

    if (path.parentPath?.isSequenceExpression()) {
        const sequencePath = path.parentPath;
        path.remove();

        if (sequencePath.removed || !sequencePath.parentPath || !sequencePath.container) {
            return true;
        }

        const expressions = sequencePath.node.expressions;
        if (expressions.length === 0) {
            if (sequencePath.parentPath?.isExpressionStatement()) {
                sequencePath.parentPath.remove();
            } else {
                sequencePath.replaceWith(t.unaryExpression('void', t.numericLiteral(0)));
            }
        } else if (expressions.length === 1) {
            sequencePath.replaceWith(expressions[0]);
        }

        return true;
    }

    if (path.parentPath?.isExpressionStatement()) {
        path.parentPath.remove();
        return true;
    }

    path.replaceWith(t.unaryExpression('void', t.numericLiteral(0)));
    return true;
}

function collectProxyBindingMetas(ast) {
    const proxyLookup = new Map();
    const rootMetas = new Map();
    const aliasCandidates = [];

    function ensureRootMeta(binding, definitionPath) {
        let meta = rootMetas.get(binding.path.node);
        if (!meta) {
            meta = {
                properties: new Map(),
                bindings: new Set([binding]),
                definitionPaths: new Set([definitionPath])
            };
            rootMetas.set(binding.path.node, meta);
            proxyLookup.set(binding.path.node, meta);
        } else if (definitionPath) {
            meta.definitionPaths.add(definitionPath);
        }

        return meta;
    }

    traverse(ast, {
        VariableDeclarator(path) {
            if (!t.isIdentifier(path.node.id) || !isObfuscatedName(path.node.id.name)) {
                return;
            }

            const binding = path.scope.getBinding(path.node.id.name);
            if (!binding || binding.path !== path || !binding.constant) {
                return;
            }

            if (t.isObjectExpression(path.node.init)) {
                const meta = ensureRootMeta(binding, path);

                for (const property of path.node.init.properties) {
                    if (!t.isObjectProperty(property)) {
                        continue;
                    }

                    const propName = t.isIdentifier(property.key)
                        ? property.key.name
                        : t.isStringLiteral(property.key) || t.isNumericLiteral(property.key)
                            ? String(property.key.value)
                            : null;

                    if (propName === null) {
                        continue;
                    }

                    const descriptor = getProxyPropertyDescriptor(property.value, path.scope);
                    if (descriptor) {
                        meta.properties.set(propName, descriptor);
                    }
                }

                return;
            }

            if (t.isIdentifier(path.node.init) && isObfuscatedName(path.node.init.name)) {
                const targetBinding = path.scope.getBinding(path.node.init.name);
                if (targetBinding) {
                    aliasCandidates.push({ binding, targetBinding, path });
                }
            }
        }
    });

    let didResolveAlias = true;
    while (didResolveAlias) {
        didResolveAlias = false;

        for (const candidate of aliasCandidates) {
            if (proxyLookup.has(candidate.binding.path.node)) {
                continue;
            }

            const targetMeta = proxyLookup.get(candidate.targetBinding.path.node);
            if (!targetMeta) {
                continue;
            }

            proxyLookup.set(candidate.binding.path.node, targetMeta);
            targetMeta.bindings.add(candidate.binding);
            targetMeta.definitionPaths.add(candidate.path);
            didResolveAlias = true;
        }
    }

    traverse(ast, {
        AssignmentExpression(path) {
            if (path.node.operator !== '=' || !t.isMemberExpression(path.node.left) || !t.isIdentifier(path.node.left.object)) {
                return;
            }

            const objectBinding = path.scope.getBinding(path.node.left.object.name);
            const meta = objectBinding ? proxyLookup.get(objectBinding.path.node) : null;
            if (!meta) {
                return;
            }

            const propName = getStaticMemberName(path.node.left);
            if (propName === null) {
                return;
            }

            const descriptor = getProxyPropertyDescriptor(path.node.right, path.scope);
            if (!descriptor) {
                return;
            }

            meta.properties.set(propName, descriptor);
            meta.definitionPaths.add(path);
        }
    });

    return {
        proxyLookup,
        metas: Array.from(new Set(proxyLookup.values()))
    };
}

var simplifyObfStructures = (sourceCode) => {
    let currentCode = sourceCode;
    const MAX_PASSES = 12;

    for (let pass = 1; pass <= MAX_PASSES; pass++) {
        const ast = parseSourceCode(currentCode);
        let dotCount = 0;
        let inlineCallCount = 0;
        let inlineValueCount = 0;
        let cleanupCount = 0;

        traverse(ast, {
            MemberExpression(path) {
                const propName = getStaticMemberName(path.node);
                if (!isDotSafeProperty(propName)) {
                    return;
                }

                if (!path.node.computed && t.isIdentifier(path.node.property, { name: propName })) {
                    return;
                }

                path.node.computed = false;
                path.node.property = t.identifier(propName);
                dotCount++;
            }
        });

        const { proxyLookup, metas } = collectProxyBindingMetas(ast);

        traverse(ast, {
            CallExpression(path) {
                const callee = path.node.callee;
                if (!t.isMemberExpression(callee) || !t.isIdentifier(callee.object)) {
                    return;
                }

                const objectBinding = path.scope.getBinding(callee.object.name);
                const meta = objectBinding ? proxyLookup.get(objectBinding.path.node) : null;
                if (!meta) {
                    return;
                }

                const propName = getStaticMemberName(callee);
                const descriptor = meta.properties.get(propName);
                if (!descriptor || descriptor.kind !== 'expr' || path.node.arguments.length !== descriptor.params.length) {
                    return;
                }

                if (!descriptorBindingsMatch(path.scope, descriptor)) {
                    return;
                }

                const paramMap = {};
                descriptor.params.forEach((paramName, index) => {
                    paramMap[paramName] = path.node.arguments[index];
                });

                path.replaceWith(cloneAndReplaceParams(descriptor.expr, paramMap));
                inlineCallCount++;
                path.skip();
            },
            MemberExpression(path) {
                if (!path.isReferenced() || path.parentPath.isCallExpression({ callee: path.node }) || !t.isIdentifier(path.node.object)) {
                    return;
                }

                const objectBinding = path.scope.getBinding(path.node.object.name);
                const meta = objectBinding ? proxyLookup.get(objectBinding.path.node) : null;
                if (!meta) {
                    return;
                }

                const propName = getStaticMemberName(path.node);
                const descriptor = meta.properties.get(propName);
                if (!descriptor || descriptor.kind !== 'value') {
                    return;
                }

                if (!descriptorBindingsMatch(path.scope, descriptor)) {
                    return;
                }

                path.replaceWith(t.cloneNode(descriptor.node, true));
                inlineValueCount++;
                path.skip();
            }
        });

        for (const meta of metas) {
            let hasExternalRefs = false;

            for (const binding of meta.bindings) {
                const dependentPaths = [
                    ...binding.referencePaths,
                    ...binding.constantViolations
                ];

                if (dependentPaths.some(refPath => !isPathWithinAny(refPath, meta.definitionPaths))) {
                    hasExternalRefs = true;
                    break;
                }
            }

            if (hasExternalRefs) {
                continue;
            }

            const definitionPaths = Array.from(meta.definitionPaths)
                .filter(defPath => defPath && !defPath.removed)
                .sort((leftPath, rightPath) => getNodeStart(rightPath) - getNodeStart(leftPath));

            for (const definitionPath of definitionPaths) {
                if (definitionPath.removed) {
                    continue;
                }

                try {
                    if (definitionPath.isVariableDeclarator()) {
                        removeDeclarator(definitionPath);
                        cleanupCount++;
                        continue;
                    }

                    if (definitionPath.isAssignmentExpression() && removeExpressionPath(definitionPath)) {
                        cleanupCount++;
                    }
                } catch (error) {
                    // Stale paths can show up after sibling removals; the next pass can retry on fresh AST.
                }
            }
        }

        const removedUnusedBindings = removeUnusedObfuscatedBindingsAst(ast);
        const hasChanged = dotCount > 0 || inlineCallCount > 0 || inlineValueCount > 0 || cleanupCount > 0 || removedUnusedBindings > 0;

        console.log(
            `代理字典第 ${pass} 轮: found ${metas.length}, normalized ${dotCount}, inlined calls=${inlineCallCount}, values=${inlineValueCount}, cleaned=${cleanupCount}, removed unused=${removedUnusedBindings}.`
        );

        if (!hasChanged) {
            break;
        }

        currentCode = generator(ast, { jsescOption: { minimal: true } }).code;
    }

    return currentCode;
};

function preprocessSharedObfuscation(sourceCode) {
    const currentCode = sourceCode.replace(/---_0x/g, '- --_0x');
    const ast = parseSourceCode(currentCode);
    const topLevelFunctions = new Map();

    for (const node of ast.program.body) {
        if (t.isFunctionDeclaration(node) && node.id) {
            topLevelFunctions.set(node.id.name, node);
        }
    }

    let decoderInfo = null;
    for (const node of ast.program.body) {
        const currentInfo = extractArrayDecoderInfo(node);
        if (!currentInfo) {
            continue;
        }

        if (!topLevelFunctions.has(currentInfo.arrayProviderName)) {
            continue;
        }

        decoderInfo = currentInfo;
        break;
    }

    if (!decoderInfo) {
        console.log("未检测到共享大字典解码器。");
        return { code: sourceCode, dictNames: [] };
    }

    const rotationExpressions = [];
    for (const node of ast.program.body) {
        if (!t.isExpressionStatement(node)) {
            continue;
        }

        const expressions = t.isSequenceExpression(node.expression)
            ? node.expression.expressions
            : [node.expression];

        for (const expression of expressions) {
            if (isRotationCallExpression(expression, decoderInfo.arrayProviderName)) {
                rotationExpressions.push(expression);
            }
        }
    }

    const sanitizedDecryptResult = sanitizeDecoderFunctionNode(topLevelFunctions.get(decoderInfo.decryptFuncName));

    const setupCode = [
        generator(topLevelFunctions.get(decoderInfo.arrayProviderName)).code,
        generator(sanitizedDecryptResult.node).code,
        ...rotationExpressions.map(expression => `(${generator(expression).code});`)
    ].join('\n');

    let decryptFn = null;
    try {
        decryptFn = new Function(`${setupCode}\nreturn ${decoderInfo.decryptFuncName};`)();
        console.log(`共享大字典代码求值成功${sanitizedDecryptResult.changed ? '（已移除反调试块）' : ''}。`);
    } catch (error) {
        console.error("共享大字典代码求值失败:", error);
        return { code: sourceCode, dictNames: [] };
    }

    const dictFuncs = new Set([decoderInfo.decryptFuncName]);
    let lastSize = 0;

    while (dictFuncs.size > lastSize) {
        lastSize = dictFuncs.size;

        traverse(ast, {
            VariableDeclarator(path) {
                if (t.isIdentifier(path.node.id) && t.isIdentifier(path.node.init) && dictFuncs.has(path.node.init.name)) {
                    dictFuncs.add(path.node.id.name);
                }
            },
            AssignmentExpression(path) {
                if (t.isIdentifier(path.node.left) && t.isIdentifier(path.node.right) && dictFuncs.has(path.node.right.name)) {
                    dictFuncs.add(path.node.left.name);
                }
            }
        });
    }

    const decodeCache = new Map();
    let replaceCount = 0;

    traverse(ast, {
        CallExpression(path) {
            const callee = path.node.callee;
            if (!t.isIdentifier(callee) || !dictFuncs.has(callee.name)) {
                return;
            }

            try {
                const args = path.node.arguments.map(evaluateStaticNode);
                const cacheKey = JSON.stringify(args);
                let result = decodeCache.get(cacheKey);

                if (result === undefined && !decodeCache.has(cacheKey)) {
                    result = decryptFn(...args);
                    decodeCache.set(cacheKey, result);
                }

                if (typeof result === 'string') {
                    path.replaceWith(t.stringLiteral(result));
                    replaceCount++;
                    return;
                }

                if (typeof result === 'number') {
                    path.replaceWith(t.numericLiteral(result));
                    replaceCount++;
                    return;
                }

                if (result !== undefined) {
                    path.replaceWith(t.valueToNode(result));
                    replaceCount++;
                }
            } catch (error) {
                // 忽略无法静态求值的调用
            }
        }
    });

    let removedRotations = 0;
    traverse(ast, {
        Program(path) {
            removedRotations = pruneTopLevelExpressions(path, expression =>
                isRotationCallExpression(expression, decoderInfo.arrayProviderName)
            );
            path.stop();
        }
    });

    traverse(ast, {
        FunctionDeclaration(path) {
            if (!path.node.id || !path.parentPath.isProgram()) {
                return;
            }

            if (
                path.node.id.name === decoderInfo.decryptFuncName ||
                path.node.id.name === decoderInfo.arrayProviderName
            ) {
                path.remove();
            }
        },
        VariableDeclarator(path) {
            if (
                t.isIdentifier(path.node.id) &&
                t.isIdentifier(path.node.init) &&
                dictFuncs.has(path.node.id.name) &&
                dictFuncs.has(path.node.init.name)
            ) {
                removeDeclarator(path);
            }
        },
        AssignmentExpression(path) {
            if (
                t.isIdentifier(path.node.left) &&
                t.isIdentifier(path.node.right) &&
                dictFuncs.has(path.node.left.name) &&
                dictFuncs.has(path.node.right.name) &&
                path.parentPath.isExpressionStatement()
            ) {
                path.parentPath.remove();
            }
        }
    });

    const removedPreludeCalls = removeTopLevelPreludeCallsAst(ast);
    const removedUnusedBindings = removeUnusedObfuscatedBindingsAst(ast);
    const outputCode = generator(ast, { jsescOption: { minimal: true } }).code;

    console.log(
        `共享大字典已解包: ${decoderInfo.decryptFuncName}/${decoderInfo.arrayProviderName}, aliases ${dictFuncs.size}, replaced ${replaceCount} calls, removed rotations ${removedRotations}, removed prelude ${removedPreludeCalls}, removed unused ${removedUnusedBindings}.`
    );

    return {
        code: outputCode,
        dictNames: Array.from(dictFuncs),
        decoderInfo
    };
}

function isSimpleReturn(bodyBlock) {
    if (!bodyBlock || !bodyBlock.body || bodyBlock.body.length !== 1) return false;
    return t.isReturnStatement(bodyBlock.body[0]);
}

var unpackObfDicts = (sourceCode) => {
    const sharedResult = preprocessSharedObfuscation(sourceCode);
    let currentCode = sharedResult.code;
    let loopCount = 0;
    const MAX_LOOPS = 20;

    let processedDictNames = new Set(sharedResult.dictNames || []);

    while (loopCount < MAX_LOOPS) {
        loopCount++;
        let hasChanged = false;

        const ast = parseSourceCode(currentCode);
        let allDicts = {};

        // --- 步骤一：寻找字典 ---
        traverse(ast, {
            VariableDeclarator(path) {
                if (
                    t.isIdentifier(path.node.id) &&
                    isObfuscatedName(path.node.id.name) &&
                    path.node.init &&
                    t.isObjectExpression(path.node.init)
                ) {
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
                if (!path.isReferenced()) return;
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
        dictNames: Array.from(processedDictNames),
        decoderInfo: sharedResult.decoderInfo || null
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

function evaluateDeterministicStringTest(testNode) {
    if (!t.isBinaryExpression(testNode)) {
        return null;
    }

    if (!t.isStringLiteral(testNode.left) || !t.isStringLiteral(testNode.right)) {
        return null;
    }

    const leftVal = testNode.left.value;
    const rightVal = testNode.right.value;

    switch (testNode.operator) {
        case '===':
        case '==':
            return leftVal === rightVal;
        case '!==':
        case '!=':
            return leftVal !== rightVal;
        case '<':
            return leftVal < rightVal;
        case '<=':
            return leftVal <= rightVal;
        case '>':
            return leftVal > rightVal;
        case '>=':
            return leftVal >= rightVal;
        default:
            return null;
    }
}

function evaluateStaticTruthiness(node) {
    if (t.isBooleanLiteral(node)) {
        return node.value;
    }

    if (t.isStringLiteral(node) || t.isNumericLiteral(node)) {
        return Boolean(node.value);
    }

    if (t.isNullLiteral(node)) {
        return false;
    }

    if (
        t.isArrayExpression(node) ||
        t.isObjectExpression(node) ||
        t.isFunctionExpression(node) ||
        t.isArrowFunctionExpression(node) ||
        t.isClassExpression(node) ||
        t.isRegExpLiteral(node)
    ) {
        return true;
    }

    if (t.isIdentifier(node, { name: 'undefined' })) {
        return false;
    }

    if (t.isUnaryExpression(node, { operator: '!' })) {
        const inner = evaluateStaticTruthiness(node.argument);
        return inner === null ? null : !inner;
    }

    return null;
}

function getPipeSplitOrder(initNode) {
    if (!t.isCallExpression(initNode) || initNode.arguments.length !== 1) {
        return null;
    }

    if (!t.isStringLiteral(initNode.arguments[0], { value: '|' })) {
        return null;
    }

    const callee = initNode.callee;
    if (!t.isMemberExpression(callee) || getStaticMemberName(callee) !== 'split' || !t.isStringLiteral(callee.object)) {
        return null;
    }

    return callee.object.value.split('|');
}

function bindingOnlyUsedByFlattenLoop(binding, whilePath) {
    if (!binding) {
        return false;
    }

    const relatedPaths = [...binding.referencePaths, ...binding.constantViolations]
        .filter(refPath => refPath && refPath !== binding.path);
    return relatedPaths.every(refPath => isPathWithinAny(refPath, [whilePath]));
}

function stripFlattenFlowTail(statements) {
    const clonedStatements = statements.map(statement => t.cloneNode(statement, true));

    while (clonedStatements.length > 0) {
        const tail = clonedStatements[clonedStatements.length - 1];
        if (t.isContinueStatement(tail) || t.isBreakStatement(tail) || t.isEmptyStatement(tail)) {
            clonedStatements.pop();
            continue;
        }
        break;
    }

    return clonedStatements;
}

function extractFlattenedWhileSwitchCandidate(declPath, whilePath) {
    if (!declPath?.isVariableDeclaration() || !whilePath?.isWhileStatement()) {
        return null;
    }

    if (evaluateStaticTruthiness(whilePath.node.test) !== true) {
        return null;
    }

    const whileBodyPath = whilePath.get('body');
    if (!whileBodyPath.isBlockStatement()) {
        return null;
    }

    const whileBodyStatements = whileBodyPath.get('body');
    if (whileBodyStatements.length === 0 || !whileBodyStatements[0].isSwitchStatement()) {
        return null;
    }

    if (whileBodyStatements.slice(1).some(statementPath => !statementPath.isBreakStatement())) {
        return null;
    }

    const switchPath = whileBodyStatements[0];
    const discriminant = switchPath.node.discriminant;
    if (
        !t.isMemberExpression(discriminant) ||
        !discriminant.computed ||
        !t.isIdentifier(discriminant.object) ||
        !t.isUpdateExpression(discriminant.property, { operator: '++', prefix: false }) ||
        !t.isIdentifier(discriminant.property.argument)
    ) {
        return null;
    }

    const orderName = discriminant.object.name;
    const indexName = discriminant.property.argument.name;

    let orderDeclaratorPath = null;
    let indexDeclaratorPath = null;
    let order = null;

    for (const declaratorPath of declPath.get('declarations')) {
        if (!declaratorPath.get('id').isIdentifier()) {
            continue;
        }

        const declaratorName = declaratorPath.node.id.name;
        const initNode = declaratorPath.node.init;

        if (declaratorName === orderName) {
            order = getPipeSplitOrder(initNode);
            if (!order) {
                return null;
            }
            orderDeclaratorPath = declaratorPath;
            continue;
        }

        if (declaratorName === indexName) {
            try {
                if (evaluateStaticNode(initNode) !== 0) {
                    return null;
                }
            } catch (error) {
                return null;
            }
            indexDeclaratorPath = declaratorPath;
        }
    }

    if (!orderDeclaratorPath || !indexDeclaratorPath || !Array.isArray(order) || order.length === 0) {
        return null;
    }

    const orderBinding = declPath.scope.getBinding(orderName);
    const indexBinding = declPath.scope.getBinding(indexName);
    if (
        !orderBinding ||
        !indexBinding ||
        orderBinding.path !== orderDeclaratorPath ||
        indexBinding.path !== indexDeclaratorPath ||
        !bindingOnlyUsedByFlattenLoop(orderBinding, whilePath) ||
        !bindingOnlyUsedByFlattenLoop(indexBinding, whilePath)
    ) {
        return null;
    }

    const caseMap = new Map();
    for (const switchCase of switchPath.node.cases) {
        if (!switchCase.test) {
            return null;
        }

        const caseKey = t.isStringLiteral(switchCase.test) || t.isNumericLiteral(switchCase.test)
            ? String(switchCase.test.value)
            : null;
        if (caseKey === null) {
            return null;
        }

        caseMap.set(caseKey, switchCase.consequent);
    }

    const flattenedStatements = [];
    for (const item of order) {
        if (!caseMap.has(String(item))) {
            return null;
        }

        flattenedStatements.push(...stripFlattenFlowTail(caseMap.get(String(item))));
    }

    return {
        declPath,
        whilePath,
        declaratorPaths: [orderDeclaratorPath, indexDeclaratorPath],
        statements: flattenedStatements
    };
}

var removeObfControlFlowFlattening = (sourceCode) => {
    let currentCode = sourceCode;
    let totalFlattened = 0;

    for (let round = 1; round <= 20; round++) {
        const ast = parseSourceCode(currentCode);
        const candidates = [];

        function collectCandidates(containerPath) {
            const bodyPaths = containerPath.get('body');
            for (let index = 1; index < bodyPaths.length; index++) {
                const candidate = extractFlattenedWhileSwitchCandidate(bodyPaths[index - 1], bodyPaths[index]);
                if (candidate) {
                    candidates.push(candidate);
                }
            }
        }

        traverse(ast, {
            Program(path) {
                collectCandidates(path);
            },
            BlockStatement(path) {
                collectCandidates(path);
            }
        });

        if (candidates.length === 0) {
            break;
        }

        candidates.sort((left, right) => getNodeStart(right.whilePath) - getNodeStart(left.whilePath));

        let appliedCount = 0;
        for (const candidate of candidates) {
            if (candidate.declPath.removed || candidate.whilePath.removed) {
                continue;
            }

            try {
                candidate.whilePath.replaceWithMultiple(candidate.statements.map(statement => t.cloneNode(statement, true)));

                [...candidate.declaratorPaths]
                    .filter(Boolean)
                    .sort((left, right) => right.key - left.key)
                    .forEach(declaratorPath => {
                        if (!declaratorPath.removed) {
                            removeDeclarator(declaratorPath);
                        }
                    });

                appliedCount++;
            } catch (error) {
                // Ignore stale path failures and let the next round retry with a fresh AST.
            }
        }

        if (appliedCount === 0) {
            break;
        }

        totalFlattened += appliedCount;
        currentCode = generator(ast, { jsescOption: { minimal: true } }).code;
    }

    console.log(`控制流平坦化清理完成。flattened=${totalFlattened}`);
    return currentCode;
};

function replaceIfWithKnownBranch(path, result) {
    const { consequent, alternate } = path.node;

    if (result) {
        if (t.isBlockStatement(consequent)) {
            path.replaceWithMultiple(consequent.body);
        } else if (t.isEmptyStatement(consequent)) {
            path.remove();
        } else {
            path.replaceWith(consequent);
        }
        return true;
    }

    if (!alternate) {
        path.remove();
        return true;
    }

    if (t.isBlockStatement(alternate)) {
        path.replaceWithMultiple(alternate.body);
    } else if (t.isEmptyStatement(alternate)) {
        path.remove();
    } else {
        path.replaceWith(alternate);
    }

    return true;
}

var removeObfIfStatement = (sourceCode) => {
    let currentCode = sourceCode;
    let round = 0;
    let totalIfCount = 0;
    let totalConditionalCount = 0;

    while (round < 10) {
        round++;

        const ast = parser.parse(currentCode, {
            sourceType: 'module'
        });

        let changed = false;
        let ifCount = 0;
        let conditionalCount = 0;

        traverse(ast, {
            IfStatement(path) {
                const result = evaluateDeterministicStringTest(path.node.test);
                if (result === null) {
                    return;
                }

                if (replaceIfWithKnownBranch(path, result)) {
                    changed = true;
                    ifCount++;
                    path.skip();
                }
            },
            ConditionalExpression(path) {
                const result = evaluateDeterministicStringTest(path.node.test);
                if (result === null) {
                    return;
                }

                path.replaceWith(result ? path.node.consequent : path.node.alternate);
                changed = true;
                conditionalCount++;
                path.skip();
            }
        });

        totalIfCount += ifCount;
        totalConditionalCount += conditionalCount;

        if (!changed) {
            break;
        }

        currentCode = generator(ast, { jsescOption: { minimal: true } }).code;
    }

    console.log(`条件语句清理完成。if=${totalIfCount}, ternary=${totalConditionalCount}`);
    return currentCode;
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
                            if (!innerPath.isReferencedIdentifier()) return;
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
                const isTopLevelPublicFunction = path.parentPath?.isProgram() && !isObfuscatedName(fnName);
                if (isTopLevelPublicFunction) return;

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
    const sourcePath = process.argv[2] || 'source/2.js';
    const inputPath = path.resolve(__dirname, sourcePath);
    const outputDir = path.resolve(__dirname, 'dist');
    const baseName = path.basename(sourcePath, path.extname(sourcePath));

    fs.mkdirSync(outputDir, { recursive: true });

    const originalCode = fs.readFileSync(inputPath, 'utf-8').toString();

    const unpackedResult = unpackObfDicts(originalCode);
    const noDictCode = removeObfDicts(unpackedResult.code, unpackedResult.dictNames);
    const cleanedCode = removeObfIfStatement(noDictCode);
    const flattenedCode = removeObfControlFlowFlattening(cleanedCode);
    const simplifiedCode = simplifyObfStructures(flattenedCode);
    const reCleanedCode = removeObfIfStatement(simplifiedCode);
    const reFlattenedCode = removeObfControlFlowFlattening(reCleanedCode);
    const noObfFuncCode = removeObfFunc(reFlattenedCode);
    const noObfConstantsCode = removeObfConstants(noObfFuncCode);
    const finalCode = removeObfIfStatement(noObfConstantsCode);
    const finalOutputPath = path.resolve(outputDir, `${baseName}.js`);

    fs.writeFileSync(finalOutputPath, finalCode);

    // Clean up historical intermediate artifacts from earlier runs.
    for (const suffix of ['01-unpacked', '02-no-dicts', '03-cleaned', '04-no-obf-func']) {
        const intermediatePath = path.resolve(outputDir, `${baseName}.${suffix}.js`);
        if (fs.existsSync(intermediatePath)) {
            fs.unlinkSync(intermediatePath);
        }
    }
}
main();
