const fs = require('fs');
const path = require('path');
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

function expressionUsesOnlyParams(node, allowedParams, parentNode = null, parentKey = null) {
    if (!node) {
        return true;
    }

    if (t.isIdentifier(node)) {
        if (parentNode && t.isMemberExpression(parentNode) && parentKey === 'property' && !parentNode.computed) {
            return true;
        }

        return allowedParams.has(node.name) || node.name === 'undefined';
    }

    if (t.isThisExpression(node) || t.isSuper(node) || t.isMetaProperty(node)) {
        return false;
    }

    if (
        (t.isFunctionExpression(node) || t.isArrowFunctionExpression(node)) &&
        parentNode !== null
    ) {
        return false;
    }

    const childKeys = t.VISITOR_KEYS[node.type] || [];
    for (const childKey of childKeys) {
        const childNode = node[childKey];

        if (Array.isArray(childNode)) {
            for (const item of childNode) {
                if (item && !expressionUsesOnlyParams(item, allowedParams, node, childKey)) {
                    return false;
                }
            }
            continue;
        }

        if (childNode && !expressionUsesOnlyParams(childNode, allowedParams, node, childKey)) {
            return false;
        }
    }

    return true;
}

function cloneAndReplaceParams(node, paramMap) {
    if (!node) {
        return node;
    }

    if (t.isIdentifier(node) && Object.prototype.hasOwnProperty.call(paramMap, node.name)) {
        return t.cloneNode(paramMap[node.name], true);
    }

    const clone = t.cloneNode(node, false);
    const childKeys = t.VISITOR_KEYS[node.type] || [];

    for (const childKey of childKeys) {
        const childNode = node[childKey];

        if (Array.isArray(childNode)) {
            clone[childKey] = childNode.map(item => item ? cloneAndReplaceParams(item, paramMap) : item);
            continue;
        }

        if (childNode && typeof childNode.type === 'string') {
            clone[childKey] = cloneAndReplaceParams(childNode, paramMap);
        }
    }

    return clone;
}

function getProxyPropertyDescriptor(node) {
    if (
        t.isStringLiteral(node) ||
        t.isNumericLiteral(node) ||
        t.isBooleanLiteral(node) ||
        t.isNullLiteral(node) ||
        t.isIdentifier(node)
    ) {
        return {
            kind: 'value',
            node: t.cloneNode(node, true)
        };
    }

    if (!(t.isFunctionExpression(node) || t.isArrowFunctionExpression(node))) {
        return null;
    }

    if (!node.params.every(param => t.isIdentifier(param))) {
        return null;
    }

    const returnExpression = getSingleReturnExpression(node);
    if (!returnExpression) {
        return null;
    }

    const paramNames = new Set(node.params.map(param => param.name));
    if (!expressionUsesOnlyParams(returnExpression, paramNames)) {
        return null;
    }

    return {
        kind: 'expr',
        expr: returnExpression,
        params: node.params.map(param => param.name)
    };
}

var preprocessSharedObfuscation = (sourceCode) => {
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
        console.error("Could not find a shared string-array decoder.");
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

    const setupCode = [
        generator(topLevelFunctions.get(decoderInfo.arrayProviderName)).code,
        generator(topLevelFunctions.get(decoderInfo.decryptFuncName)).code,
        ...rotationExpressions.map(expression => `(${generator(expression).code});`)
    ].join('\n');

    let decryptFn = null;
    try {
        decryptFn = new Function(`${setupCode}\nreturn ${decoderInfo.decryptFuncName};`)();
        console.log("Dictionary code evaluated successfully.");
    } catch (e) {
        console.error("Error evaluating dictionary code:", e);
        return { code: sourceCode };
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
            } catch (e) {
                // Ignore unsupported argument shapes.
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
        `Shared decoder unpacked: ${decoderInfo.decryptFuncName}/${decoderInfo.arrayProviderName}, aliases ${dictFuncs.size}, replaced ${replaceCount} calls, removed rotations ${removedRotations}, removed prelude ${removedPreludeCalls}, removed unused ${removedUnusedBindings}.`
    );

    return {
        code: outputCode,
        dictNames: Array.from(dictFuncs),
        decoderInfo
    };
};

var simplifyObfStructures = (sourceCode) => {
    const ast = parseSourceCode(sourceCode);
    const proxyBindings = new Map();
    let dotCount = 0;
    let dictCount = 0;
    let inlineCallCount = 0;
    let inlineValueCount = 0;

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

    traverse(ast, {
        VariableDeclarator(path) {
            if (
                !t.isIdentifier(path.node.id) ||
                !isObfuscatedName(path.node.id.name) ||
                !t.isObjectExpression(path.node.init)
            ) {
                return;
            }

            const binding = path.scope.getBinding(path.node.id.name);
            if (!binding || binding.path !== path || !binding.constant) {
                return;
            }

            const properties = new Map();

            for (const property of path.node.init.properties) {
                if (!t.isObjectProperty(property)) {
                    return;
                }

                const propName = t.isIdentifier(property.key)
                    ? property.key.name
                    : t.isStringLiteral(property.key) || t.isNumericLiteral(property.key)
                        ? String(property.key.value)
                        : null;

                if (propName === null) {
                    return;
                }

                const descriptor = getProxyPropertyDescriptor(property.value);
                if (!descriptor) {
                    return;
                }

                properties.set(propName, descriptor);
            }

            if (properties.size === 0) {
                return;
            }

            proxyBindings.set(binding.path.node, {
                properties
            });
        }
    });

    dictCount = proxyBindings.size;

    traverse(ast, {
        CallExpression(path) {
            const callee = path.node.callee;
            if (!t.isMemberExpression(callee) || !t.isIdentifier(callee.object)) {
                return;
            }

            const binding = path.scope.getBinding(callee.object.name);
            const proxyInfo = binding ? proxyBindings.get(binding.path.node) : null;
            if (!proxyInfo) {
                return;
            }

            const propName = getStaticMemberName(callee);
            const descriptor = proxyInfo.properties.get(propName);
            if (!descriptor || descriptor.kind !== 'expr' || path.node.arguments.length < descriptor.params.length) {
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
            if (!path.isReferenced() || path.parentPath.isCallExpression({ callee: path.node })) {
                return;
            }

            if (!t.isIdentifier(path.node.object)) {
                return;
            }

            const binding = path.scope.getBinding(path.node.object.name);
            const proxyInfo = binding ? proxyBindings.get(binding.path.node) : null;
            if (!proxyInfo) {
                return;
            }

            const propName = getStaticMemberName(path.node);
            const descriptor = proxyInfo.properties.get(propName);
            if (!descriptor || descriptor.kind !== 'value') {
                return;
            }

            path.replaceWith(t.cloneNode(descriptor.node, true));
            inlineValueCount++;
            path.skip();
        }
    });

    const removedUnusedBindings = removeUnusedObfuscatedBindingsAst(ast);
    console.log(
        `Structures simplified: normalized ${dotCount} members, found ${dictCount} proxy dicts, inlined calls=${inlineCallCount}, values=${inlineValueCount}, removed unused=${removedUnusedBindings}.`
    );

    return generator(ast, { jsescOption: { minimal: true } }).code;
};

function isRedundantObjectWrapperArgument(path) {
    return path.isIdentifier() ||
        path.isMemberExpression() ||
        path.isObjectExpression() ||
        path.isFunctionExpression() ||
        path.isArrowFunctionExpression() ||
        path.isClassExpression();
}

function getNodeStart(pathOrNode) {
    const node = pathOrNode?.node || pathOrNode;
    return typeof node?.start === 'number' ? node.start : -1;
}

function getNodeEnd(pathOrNode) {
    const node = pathOrNode?.node || pathOrNode;
    return typeof node?.end === 'number' ? node.end : -1;
}

function isWithinPath(targetPath, ancestorPath) {
    return !!targetPath && !!ancestorPath && (targetPath === ancestorPath || !!targetPath.findParent(parentPath => parentPath === ancestorPath));
}

function isObviouslySideEffectFreePath(path) {
    if (!path?.node) {
        return false;
    }

    if (path.isPure()) {
        return true;
    }

    if (
        path.isIdentifier() ||
        path.isThisExpression() ||
        path.isSuper() ||
        path.isMetaProperty() ||
        path.isFunctionExpression() ||
        path.isArrowFunctionExpression() ||
        path.isClassExpression()
    ) {
        return true;
    }

    if (path.isMemberExpression()) {
        const objectPath = path.get('object');
        const propertyPath = path.node.computed ? path.get('property') : null;
        return isObviouslySideEffectFreePath(objectPath) &&
            (!propertyPath || isObviouslySideEffectFreePath(propertyPath));
    }

    if (path.isTemplateLiteral()) {
        return path.get('expressions').every(expressionPath => isObviouslySideEffectFreePath(expressionPath));
    }

    if (path.isArrayExpression()) {
        return path.get('elements')
            .filter(Boolean)
            .every(elementPath => isObviouslySideEffectFreePath(elementPath));
    }

    if (path.isObjectExpression()) {
        return path.get('properties').every(propertyPath => {
            if (propertyPath.isObjectProperty()) {
                const keyPath = propertyPath.node.computed ? propertyPath.get('key') : null;
                return (!keyPath || isObviouslySideEffectFreePath(keyPath)) &&
                    isObviouslySideEffectFreePath(propertyPath.get('value'));
            }

            if (propertyPath.isSpreadElement()) {
                return isObviouslySideEffectFreePath(propertyPath.get('argument'));
            }

            return false;
        });
    }

    if (path.isUnaryExpression()) {
        return isObviouslySideEffectFreePath(path.get('argument'));
    }

    if (path.isConditionalExpression()) {
        return isObviouslySideEffectFreePath(path.get('test')) &&
            isObviouslySideEffectFreePath(path.get('consequent')) &&
            isObviouslySideEffectFreePath(path.get('alternate'));
    }

    if (path.isSequenceExpression()) {
        return path.get('expressions').every(expressionPath => isObviouslySideEffectFreePath(expressionPath));
    }

    return false;
}

function removeRedundantObjectWrappersAst(ast) {
    let wrapperCount = 0;

    traverse(ast, {
        CallExpression(path) {
            if (!t.isIdentifier(path.node.callee, { name: 'Object' }) || path.node.arguments.length !== 1) {
                return;
            }

            const argumentPath = path.get('arguments')[0];
            if (!argumentPath || !isRedundantObjectWrapperArgument(argumentPath)) {
                return;
            }

            path.replaceWith(t.cloneNode(argumentPath.node, true));
            wrapperCount++;
            path.skip();
        }
    });

    return wrapperCount;
}

function removeDiscardedPureSequencePrefixesAst(ast) {
    let removedExpressionCount = 0;

    traverse(ast, {
        SequenceExpression(path) {
            const expressionPaths = path.get('expressions');
            if (expressionPaths.length < 2) {
                return;
            }

            const keptExpressions = [];

            expressionPaths.forEach((expressionPath, index) => {
                const isLastExpression = index === expressionPaths.length - 1;
                if (isLastExpression || !isObviouslySideEffectFreePath(expressionPath)) {
                    keptExpressions.push(t.cloneNode(expressionPath.node, true));
                    return;
                }

                removedExpressionCount++;
            });

            if (keptExpressions.length === expressionPaths.length) {
                return;
            }

            if (keptExpressions.length === 1) {
                path.replaceWith(keptExpressions[0]);
            } else {
                path.replaceWith(t.sequenceExpression(keptExpressions));
            }
        }
    });

    return removedExpressionCount;
}

function isReferenceVisibleBeforeWrite(referencePath, writePath) {
    if (!writePath?.node) {
        return true;
    }

    const referenceStart = getNodeStart(referencePath);
    const writeStart = getNodeStart(writePath);
    if (referenceStart < writeStart) {
        return true;
    }

    if (writePath.isVariableDeclarator()) {
        const initPath = writePath.get('init');
        return !!initPath?.node && isWithinPath(referencePath, initPath);
    }

    if (writePath.isAssignmentExpression()) {
        const rightPath = writePath.get('right');
        return !!rightPath?.node && isWithinPath(referencePath, rightPath);
    }

    if (writePath.isForInStatement() || writePath.isForOfStatement()) {
        const rightPath = writePath.get('right');
        return !!rightPath?.node && isWithinPath(referencePath, rightPath);
    }

    return false;
}

function getReachableReferencePaths(binding, declaratorPath) {
    const declaratorEnd = getNodeEnd(declaratorPath);
    const nextWritePath = binding.constantViolations
        .filter(violationPath => violationPath !== declaratorPath && getNodeStart(violationPath) >= declaratorEnd)
        .sort((leftPath, rightPath) => getNodeStart(leftPath) - getNodeStart(rightPath))[0] || null;

    return binding.referencePaths.filter(referencePath => {
        if (!referencePath.isReferencedIdentifier()) {
            return false;
        }

        if (getNodeStart(referencePath) < declaratorEnd) {
            return false;
        }

        return isReferenceVisibleBeforeWrite(referencePath, nextWritePath);
    });
}

function isAggressivelyInlineableAliasInitPath(path) {
    if (!path?.node) {
        return false;
    }

    return path.isIdentifier() ||
        path.isMemberExpression() ||
        path.isThisExpression() ||
        path.isSuper() ||
        path.isMetaProperty();
}

function pathReferencesObfuscatedIdentifier(path) {
    if (!path?.node) {
        return false;
    }

    const tempAst = t.file(t.program([
        t.expressionStatement(t.cloneNode(path.node, true))
    ]));
    let hasObfuscatedIdentifier = false;

    traverse(tempAst, {
        Identifier(identifierPath) {
            if (!identifierPath.isReferencedIdentifier()) {
                return;
            }

            if (!isObfuscatedName(identifierPath.node.name)) {
                return;
            }

            hasObfuscatedIdentifier = true;
            identifierPath.stop();
        }
    });

    return hasObfuscatedIdentifier;
}

function isSafeDanglingAliasReplacementNode(node) {
    if (!node) {
        return false;
    }

    if (t.isIdentifier(node)) {
        return !isObfuscatedName(node.name);
    }

    if (t.isMemberExpression(node)) {
        return isSafeDanglingAliasReplacementNode(node.object) &&
            (!node.computed || isSafeDanglingAliasReplacementNode(node.property));
    }

    return t.isThisExpression(node) ||
        t.isSuper(node) ||
        t.isMetaProperty(node) ||
        t.isStringLiteral(node) ||
        t.isNumericLiteral(node);
}

function isSafeDanglingAliasReplacementPath(path) {
    return !!path?.node && isSafeDanglingAliasReplacementNode(path.node);
}

function replaceDanglingObfuscatedAliasReferencesAst(ast, removedAliasInitMap) {
    let replacedCount = 0;

    if (!(removedAliasInitMap instanceof Map) || removedAliasInitMap.size === 0) {
        return replacedCount;
    }

    traverse(ast, {
        Identifier(path) {
            if (!path.isReferencedIdentifier()) {
                return;
            }

            const replacementNode = removedAliasInitMap.get(path.node.name);
            if (!replacementNode) {
                return;
            }

            if (path.scope.hasBinding(path.node.name)) {
                return;
            }

            path.replaceWith(t.cloneNode(replacementNode, true));
            replacedCount++;
        }
    });

    return replacedCount;
}

function inlineSingleUseObfuscatedAliasesAst(ast) {
    let inlineCount = 0;
    let changed = true;
    const removedAliasInitMap = new Map();

    while (changed) {
        changed = false;

        traverse(ast, {
            Program(path) {
                path.scope.crawl();
                path.stop();
            }
        });

        const replacedDanglingReferenceCount = replaceDanglingObfuscatedAliasReferencesAst(ast, removedAliasInitMap);
        if (replacedDanglingReferenceCount > 0) {
            changed = true;
            traverse(ast, {
                Program(path) {
                    path.scope.crawl();
                    path.stop();
                }
            });
        }

        const candidates = [];

        traverse(ast, {
            VariableDeclarator(path) {
                if (
                    !t.isIdentifier(path.node.id) ||
                    !isObfuscatedName(path.node.id.name) ||
                    !path.node.init
                ) {
                    return;
                }

                const binding = path.scope.getBinding(path.node.id.name);
                if (
                    !binding ||
                    binding.referencePaths.length === 0
                ) {
                    return;
                }

                const initPath = path.get('init');
                if (!isObviouslySideEffectFreePath(initPath)) {
                    return;
                }

                if (pathReferencesObfuscatedIdentifier(initPath)) {
                    return;
                }

                const reachableReferencePaths = getReachableReferencePaths(binding, path);
                if (reachableReferencePaths.length === 0) {
                    return;
                }

                if (
                    reachableReferencePaths.length > 1 &&
                    !(
                        isAggressivelyInlineableAliasInitPath(initPath) &&
                        isSafeDanglingAliasReplacementPath(initPath)
                    )
                ) {
                    return;
                }

                candidates.push({
                    declaratorPath: path,
                    name: path.node.id.name,
                    replacementNode: t.cloneNode(path.node.init, true),
                    referencePaths: reachableReferencePaths.slice(),
                    isSafeReplacement: isAggressivelyInlineableAliasInitPath(initPath) &&
                        isSafeDanglingAliasReplacementPath(initPath)
                });
            }
        });

        if (candidates.length === 0) {
            continue;
        }

        for (const candidate of candidates) {
            candidate.referencePaths
                .slice()
                .filter(referencePath => !!referencePath?.node && !referencePath.removed)
                .sort((leftPath, rightPath) => getNodeStart(rightPath) - getNodeStart(leftPath))
                .forEach(referencePath => {
                    referencePath.replaceWith(t.cloneNode(candidate.replacementNode, true));
                });
            if (candidate.isSafeReplacement) {
                removedAliasInitMap.set(candidate.name, t.cloneNode(candidate.replacementNode, true));
            }
            inlineCount++;
            changed = true;
        }

        traverse(ast, {
            Program(path) {
                path.scope.crawl();
                path.stop();
            }
        });

        candidates
            .slice()
            .filter(candidate => !!candidate.declaratorPath?.node && !candidate.declaratorPath.removed)
            .sort((leftCandidate, rightCandidate) =>
                getNodeStart(rightCandidate.declaratorPath) - getNodeStart(leftCandidate.declaratorPath)
            )
            .forEach(candidate => {
                const binding = candidate.declaratorPath.scope.getBinding(candidate.name);
                if (!binding) {
                    return;
                }

                const remainingReachableReferences = getReachableReferencePaths(binding, candidate.declaratorPath);
                if (remainingReachableReferences.length !== 0) {
                    return;
                }

                removeDeclarator(candidate.declaratorPath);
            });

        traverse(ast, {
            Program(path) {
                path.scope.crawl();
                path.stop();
            }
        });

        if (!changed) {
            break;
        }
    }

    return inlineCount;
}

var cleanupObfuscatedReadableArtifacts = (sourceCode) => {
    const ast = parser.parse(sourceCode, { sourceType: 'module' });
    const redundantObjectWrapperCount = removeRedundantObjectWrappersAst(ast);
    const removedSequencePrefixCount = removeDiscardedPureSequencePrefixesAst(ast);
    const inlinedSingleUseAliasCount = inlineSingleUseObfuscatedAliasesAst(ast);
    const removedUnusedBindings = removeUnusedObfuscatedBindingsAst(ast);

    console.log(
        `Obfuscated readability cleanup: removed Object() wrappers=${redundantObjectWrapperCount}, removed discarded sequence prefixes=${removedSequencePrefixCount}, inlined single-use aliases=${inlinedSingleUseAliasCount}, removed unused=${removedUnusedBindings}.`
    );

    return generator(ast, { jsescOption: { minimal: true } }).code;
};

var unpackObfDicts = (sourceCode) => preprocessSharedObfuscation(sourceCode);

var removeObfIfStatement = (sourceCode) => {
    const ast = parser.parse(sourceCode, { sourceType: 'module' });
    traverse(ast, {
        IfStatement(path) {
            const node = path.node;
            const test = node.test;
            if (!t.isBinaryExpression(test)) return;
            if (!t.isStringLiteral(test.left) || !t.isStringLiteral(test.right)) return;

            const leftVal = test.left.value;
            const rightVal = test.right.value;
            const operator = test.operator;

            let result = null;
            switch (operator) {
                case '===':
                case '==': result = leftVal === rightVal; break;
                case '!==':
                case '!=': result = leftVal !== rightVal; break;
            }

            if (result === null) return;

            if (result === true) {
                if (t.isBlockStatement(node.consequent)) {
                    path.replaceWithMultiple(node.consequent.body);
                } else {
                    path.replaceWith(node.consequent);
                }
            } else {
                if (node.alternate) {
                    if (t.isBlockStatement(node.alternate)) {
                        path.replaceWithMultiple(node.alternate.body);
                    } else {
                        path.replaceWith(node.alternate);
                    }
                } else {
                    path.remove();
                }
            }
        }
    });
    console.log("if statements cleaned.");
    return generator(ast, { jsescOption: { minimal: true } }).code;
}

const WEBPACK_RUNTIME_KEYS = ['e', 'm', 'c', 'd', 'r', 't', 'n', 'o', 'p', 'oe'];

function getStaticMemberName(node) {
    if (!t.isMemberExpression(node)) return null;
    if (!node.computed && t.isIdentifier(node.property)) return node.property.name;
    if (node.computed && t.isStringLiteral(node.property)) return node.property.value;
    return null;
}

function isDotSafeProperty(name) {
    return typeof name === 'string' && t.isValidIdentifier(name);
}

function isFunctionHelperAssignment(node, funcName) {
    if (!t.isAssignmentExpression(node, { operator: '=' })) return false;
    if (!t.isMemberExpression(node.left)) return false;
    if (!t.isIdentifier(node.left.object, { name: funcName })) return false;
    return getStaticMemberName(node.left) !== null;
}

function makeDefinePropertyCall(targetNode, keyNode, descriptorNode) {
    return t.callExpression(
        t.memberExpression(t.identifier('Object'), t.identifier('defineProperty')),
        [t.cloneNode(targetNode), t.cloneNode(keyNode), descriptorNode]
    );
}

function makeHasOwnPropertyCall(targetNode, keyNode) {
    return t.callExpression(
        t.memberExpression(
            t.memberExpression(
                t.memberExpression(t.identifier('Object'), t.identifier('prototype')),
                t.identifier('hasOwnProperty')
            ),
            t.identifier('call')
        ),
        [t.cloneNode(targetNode), t.cloneNode(keyNode)]
    );
}

function makeDefineGetterExpression(targetNode, keyNode, getterNode) {
    return t.logicalExpression(
        '||',
        makeHasOwnPropertyCall(targetNode, keyNode),
        makeDefinePropertyCall(
            targetNode,
            keyNode,
            t.objectExpression([
                t.objectProperty(t.identifier('enumerable'), t.booleanLiteral(true)),
                t.objectProperty(t.identifier('get'), t.cloneNode(getterNode))
            ])
        )
    );
}

function makeMarkEsModuleExpression(targetNode) {
    return t.sequenceExpression([
        t.logicalExpression(
            '&&',
            t.logicalExpression(
                '&&',
                t.binaryExpression(
                    '!==',
                    t.unaryExpression('typeof', t.identifier('Symbol'), true),
                    t.stringLiteral('undefined')
                ),
                t.memberExpression(t.identifier('Symbol'), t.identifier('toStringTag'))
            ),
            makeDefinePropertyCall(
                targetNode,
                t.memberExpression(t.identifier('Symbol'), t.identifier('toStringTag')),
                t.objectExpression([
                    t.objectProperty(t.identifier('value'), t.stringLiteral('Module'))
                ])
            )
        ),
        makeDefinePropertyCall(
            targetNode,
            t.stringLiteral('__esModule'),
            t.objectExpression([
                t.objectProperty(t.identifier('value'), t.booleanLiteral(true))
            ])
        )
    ]);
}

function renameBinding(scopePath, oldName, newName) {
    if (!scopePath?.scope || !oldName || !newName || oldName === newName) {
        return false;
    }

    const binding = scopePath.scope.getBinding(oldName);
    if (!binding) {
        return false;
    }

    const hasOwnBinding = typeof binding.scope.hasOwnBinding === 'function'
        ? binding.scope.hasOwnBinding(newName)
        : binding.scope.hasBinding(newName);
    if (hasOwnBinding && oldName !== newName) {
        return false;
    }

    binding.scope.rename(oldName, newName);
    return true;
}

function hasAppZeroProperty(node) {
    if (!t.isObjectExpression(node)) {
        return false;
    }

    return node.properties.some(prop =>
        t.isObjectProperty(prop) &&
        (
            (!prop.computed && t.isIdentifier(prop.key, { name: 'app' })) ||
            t.isStringLiteral(prop.key, { value: 'app' })
        ) &&
        t.isNumericLiteral(prop.value, { value: 0 })
    );
}

function isWebpackRequireAssignment(statementPath, propertyName) {
    if (!statementPath?.isExpressionStatement()) return false;
    const expression = statementPath.get('expression');
    if (!expression.isAssignmentExpression({ operator: '=' })) return false;
    const left = expression.get('left');
    return (
        left.isMemberExpression() &&
        left.get('object').isIdentifier({ name: '__webpack_require__' }) &&
        getStaticMemberName(left.node) === propertyName
    );
}

function functionContainsEntryRequireCall(functionPath) {
    let found = false;

    functionPath.traverse({
        CallExpression(path) {
            if (!t.isIdentifier(path.node.callee, { name: '__webpack_require__' })) {
                return;
            }

            const [arg] = path.node.arguments;
            if (
                t.isAssignmentExpression(arg, { operator: '=' }) &&
                t.isMemberExpression(arg.left) &&
                t.isIdentifier(arg.left.object, { name: '__webpack_require__' }) &&
                getStaticMemberName(arg.left) === 's'
            ) {
                found = true;
                path.stop();
            }
        }
    });

    return found;
}

function collectReferencedCandidateNames(functionPath, candidateNames) {
    const usedNames = new Set();

    functionPath.traverse({
        Identifier(path) {
            if (!path.isReferencedIdentifier()) return;
            if (!candidateNames.has(path.node.name)) return;
            usedNames.add(path.node.name);
        }
    });

    return usedNames;
}

function renameWebpackRuntimeScaffold(sourceCode) {
    const ast = parser.parse(sourceCode, { sourceType: 'module' });
    let loaderPath = null;
    let renameCount = 0;

    traverse(ast, {
        FunctionDeclaration(path) {
            if (path.node.id && path.node.id.name === '__webpack_require__') {
                loaderPath = path;
                path.stop();
            }
        }
    });

    if (!loaderPath) {
        console.log("Webpack runtime scaffold rename skipped: __webpack_require__ not found.");
        return sourceCode;
    }

    const runtimeScopePath = loaderPath.parentPath;
    const bodyPaths = runtimeScopePath.get('body');
    const appZeroObjectNames = new Set();
    const arrayNames = new Set();
    let modulesName = null;
    let installedModulesName = null;
    let webpackJsonpCallbackName = null;
    let jsonpArrayName = null;
    let checkDeferredModulesPath = null;
    let webpackJsonpCallbackPath = null;
    let requireEFunctionPath = null;
    let requireOeFunctionPath = null;

    for (const statementPath of bodyPaths) {
        if (statementPath.isVariableDeclaration()) {
            for (const declaratorPath of statementPath.get('declarations')) {
                const idPath = declaratorPath.get('id');
                const initPath = declaratorPath.get('init');
                if (!idPath.isIdentifier()) continue;

                if (initPath.isArrayExpression()) {
                    arrayNames.add(idPath.node.name);
                } else if (hasAppZeroProperty(initPath.node)) {
                    appZeroObjectNames.add(idPath.node.name);
                }
            }
            continue;
        }

        if (statementPath.isFunctionDeclaration() && functionContainsEntryRequireCall(statementPath)) {
            checkDeferredModulesPath = statementPath;
            continue;
        }

        if (!statementPath.isExpressionStatement()) {
            continue;
        }

        const expressionPath = statementPath.get('expression');
        if (!expressionPath.isAssignmentExpression({ operator: '=' })) {
            continue;
        }

        const leftPath = expressionPath.get('left');
        const rightPath = expressionPath.get('right');

        if (
            leftPath.isMemberExpression() &&
            leftPath.get('object').isIdentifier({ name: '__webpack_require__' })
        ) {
            const helperName = getStaticMemberName(leftPath.node);

            if (helperName === 'm' && rightPath.isIdentifier()) {
                modulesName = rightPath.node.name;
            } else if (helperName === 'c' && rightPath.isIdentifier()) {
                installedModulesName = rightPath.node.name;
            } else if (helperName === 'e' && rightPath.isFunctionExpression()) {
                requireEFunctionPath = rightPath;
            } else if (helperName === 'oe' && rightPath.isFunctionExpression()) {
                requireOeFunctionPath = rightPath;
            }

            continue;
        }

        if (
            leftPath.isMemberExpression() &&
            getStaticMemberName(leftPath.node) === 'push' &&
            leftPath.get('object').isIdentifier() &&
            rightPath.isIdentifier()
        ) {
            jsonpArrayName = leftPath.get('object').node.name;
            webpackJsonpCallbackName = rightPath.node.name;
        }
    }

    if (modulesName && renameBinding(runtimeScopePath, modulesName, 'modules')) {
        renameCount++;
    }

    if (installedModulesName && renameBinding(runtimeScopePath, installedModulesName, 'installedModules')) {
        renameCount++;
    }

    if (jsonpArrayName && renameBinding(runtimeScopePath, jsonpArrayName, 'jsonpArray')) {
        renameCount++;
    }

    if (checkDeferredModulesPath?.node.id && renameBinding(runtimeScopePath, checkDeferredModulesPath.node.id.name, 'checkDeferredModules')) {
        renameCount++;
    }

    if (webpackJsonpCallbackName && renameBinding(runtimeScopePath, webpackJsonpCallbackName, 'webpackJsonpCallback')) {
        renameCount++;
    }

    if (t.isIdentifier(loaderPath.node.params[0]) && renameBinding(loaderPath, loaderPath.node.params[0].name, 'moduleId')) {
        renameCount++;
    }

    for (const statementPath of loaderPath.get('body.body')) {
        if (!statementPath.isVariableDeclaration()) continue;
        for (const declaratorPath of statementPath.get('declarations')) {
            if (!declaratorPath.get('id').isIdentifier()) continue;
            if (renameBinding(loaderPath, declaratorPath.node.id.name, 'module')) {
                renameCount++;
            }
            break;
        }
        break;
    }

    if (requireEFunctionPath && t.isIdentifier(requireEFunctionPath.node.params[0])) {
        if (renameBinding(requireEFunctionPath, requireEFunctionPath.node.params[0].name, 'chunkId')) {
            renameCount++;
        }

        for (const statementPath of requireEFunctionPath.get('body.body')) {
            if (!statementPath.isVariableDeclaration()) continue;
            for (const declaratorPath of statementPath.get('declarations')) {
                if (
                    declaratorPath.get('id').isIdentifier() &&
                    declaratorPath.get('init').isArrayExpression() &&
                    renameBinding(requireEFunctionPath, declaratorPath.node.id.name, 'promises')
                ) {
                    renameCount++;
                }
                break;
            }
            break;
        }
    }

    if (requireOeFunctionPath && t.isIdentifier(requireOeFunctionPath.node.params[0])) {
        if (renameBinding(requireOeFunctionPath, requireOeFunctionPath.node.params[0].name, 'error')) {
            renameCount++;
        }
    }

    if (webpackJsonpCallbackName) {
        const callbackBinding = runtimeScopePath.scope.getBinding('webpackJsonpCallback') || runtimeScopePath.scope.getBinding(webpackJsonpCallbackName);
        if (callbackBinding?.path?.isFunctionDeclaration()) {
            webpackJsonpCallbackPath = callbackBinding.path;
        }
    }

    if (!webpackJsonpCallbackPath) {
        for (const statementPath of bodyPaths) {
            if (!statementPath.isFunctionDeclaration() || !statementPath.node.id) continue;
            if (statementPath.node.id.name === 'webpackJsonpCallback') {
                webpackJsonpCallbackPath = statementPath;
                break;
            }
        }
    }

    if (webpackJsonpCallbackPath) {
        if (t.isIdentifier(webpackJsonpCallbackPath.node.params[0]) && renameBinding(webpackJsonpCallbackPath, webpackJsonpCallbackPath.node.params[0].name, 'data')) {
            renameCount++;
        }

        const callbackParamName = t.isIdentifier(webpackJsonpCallbackPath.node.params[0])
            ? webpackJsonpCallbackPath.node.params[0].name
            : null;

        if (callbackParamName) {
            webpackJsonpCallbackPath.traverse({
                VariableDeclarator(path) {
                    if (!path.get('id').isIdentifier()) return;
                    const initNode = path.node.init;
                    if (
                        t.isMemberExpression(initNode) &&
                        t.isIdentifier(initNode.object, { name: callbackParamName }) &&
                        initNode.computed &&
                        t.isNumericLiteral(initNode.property)
                    ) {
                        const targetNames = {
                            0: 'chunkIds',
                            1: 'moreModules',
                            2: 'executeModules'
                        };
                        const nextName = targetNames[initNode.property.value];
                        if (nextName && renameBinding(webpackJsonpCallbackPath, path.node.id.name, nextName)) {
                            renameCount++;
                        }
                    } else if (
                        t.isArrayExpression(initNode) &&
                        initNode.elements.length === 0 &&
                        renameBinding(webpackJsonpCallbackPath, path.node.id.name, 'resolves')
                    ) {
                        renameCount++;
                    }
                }
            });
        }

        for (const statementPath of bodyPaths) {
            if (!statementPath.isVariableDeclaration()) continue;
            for (const declaratorPath of statementPath.get('declarations')) {
                if (!declaratorPath.get('id').isIdentifier() || !declaratorPath.get('init').isIdentifier()) {
                    continue;
                }

                const binding = runtimeScopePath.scope.getBinding(declaratorPath.node.id.name);
                if (
                    binding?.referencePaths?.some(refPath => refPath.findParent(parent => parent === webpackJsonpCallbackPath))
                ) {
                    if (renameBinding(runtimeScopePath, declaratorPath.node.id.name, 'parentJsonpFunction')) {
                        renameCount++;
                    }
                    if (renameBinding(runtimeScopePath, declaratorPath.node.init.name, 'oldJsonpFunction')) {
                        renameCount++;
                    }
                }
            }
        }
    }

    if (checkDeferredModulesPath) {
        const usedObjectNames = collectReferencedCandidateNames(checkDeferredModulesPath, appZeroObjectNames);
        const usedArrayNames = collectReferencedCandidateNames(checkDeferredModulesPath, arrayNames);
        const [installedChunksName] = Array.from(usedObjectNames);
        const [deferredModulesName] = Array.from(usedArrayNames);

        if (installedChunksName && renameBinding(runtimeScopePath, installedChunksName, 'installedChunks')) {
            renameCount++;
        }

        if (deferredModulesName && renameBinding(runtimeScopePath, deferredModulesName, 'deferredModules')) {
            renameCount++;
        }

        for (const objectName of appZeroObjectNames) {
            if (objectName === installedChunksName) continue;
            if (renameBinding(runtimeScopePath, objectName, 'installedCssChunks')) {
                renameCount++;
                break;
            }
        }
    }

    console.log(`Webpack runtime scaffold renamed: ${renameCount} binding(s).`);
    return generator(ast, { jsescOption: { minimal: true } }).code;
}

var normalizeRuntimeHelperDicts = (sourceCode) => {
    const ast = parser.parse(sourceCode, { sourceType: 'module' });
    const helperNames = new Set();
    let splitCount = 0;
    let renameCount = 0;
    let dotCount = 0;

    traverse(ast, {
        FunctionDeclaration(path) {
            if (!path.node.id || !path.inList) return;

            const funcName = path.node.id.name;
            const nextPath = path.getSibling(path.key + 1);
            if (!nextPath?.isExpressionStatement()) return;
            if (!t.isSequenceExpression(nextPath.node.expression)) return;

            const expressions = nextPath.node.expression.expressions;
            if (expressions.length < 4) return;
            if (!expressions.every(node => isFunctionHelperAssignment(node, funcName))) return;

            const helperKeys = expressions.map(node => getStaticMemberName(node.left));
            const looksLikeWebpackRuntime = WEBPACK_RUNTIME_KEYS.every(key => helperKeys.includes(key));

            let normalizedName = funcName;
            if (
                looksLikeWebpackRuntime &&
                funcName !== '__webpack_require__' &&
                !path.scope.hasBinding('__webpack_require__')
            ) {
                path.scope.rename(funcName, '__webpack_require__');
                normalizedName = '__webpack_require__';
                renameCount++;
            }

            helperNames.add(normalizedName);

            const splitStatements = nextPath.node.expression.expressions.map(node =>
                t.expressionStatement(node)
            );
            nextPath.replaceWithMultiple(splitStatements);
            splitCount++;
        }
    });

    traverse(ast, {
        MemberExpression(path) {
            if (!t.isIdentifier(path.node.object)) return;
            if (!helperNames.has(path.node.object.name)) return;

            const propName = getStaticMemberName(path.node);
            if (!isDotSafeProperty(propName)) return;
            if (!path.node.computed && t.isIdentifier(path.node.property, { name: propName })) return;

            path.node.computed = false;
            path.node.property = t.identifier(propName);
            dotCount++;
        }
    });

    console.log(
        `Runtime helpers normalized: split ${splitCount} dict chains, renamed ${renameCount} loader(s), converted ${dotCount} helper members.`
    );

    return generator(ast, { jsescOption: { minimal: true } }).code;
}

var inlineRuntimeHelperRefs = (sourceCode) => {
    const ast = parser.parse(sourceCode, { sourceType: 'module' });
    let inlineCounts = {
        o: 0,
        d: 0,
        r: 0
    };
    let flattenedSeqCount = 0;

    traverse(ast, {
        CallExpression(path) {
            const callee = path.node.callee;
            if (!t.isMemberExpression(callee)) return;
            if (!t.isIdentifier(callee.object, { name: '__webpack_require__' })) return;

            const helperName = getStaticMemberName(callee);
            const args = path.node.arguments;

            if (helperName === 'o' && args.length === 2) {
                path.replaceWith(makeHasOwnPropertyCall(args[0], args[1]));
                inlineCounts.o++;
                path.skip();
                return;
            }

            if (helperName === 'd' && args.length === 3) {
                path.replaceWith(makeDefineGetterExpression(args[0], args[1], args[2]));
                inlineCounts.d++;
                path.skip();
                return;
            }

            if (helperName === 'r' && args.length === 1) {
                path.replaceWith(makeMarkEsModuleExpression(args[0]));
                inlineCounts.r++;
                path.skip();
            }
        }
    });

    traverse(ast, {
        SequenceExpression(path) {
            const flatExpressions = [];
            let changed = false;

            for (const expr of path.node.expressions) {
                if (t.isSequenceExpression(expr)) {
                    flatExpressions.push(...expr.expressions);
                    changed = true;
                } else {
                    flatExpressions.push(expr);
                }
            }

            if (changed) {
                path.node.expressions = flatExpressions;
                flattenedSeqCount++;
            }
        }
    });

    console.log(
        `Runtime helper refs simplified: inlined o=${inlineCounts.o}, d=${inlineCounts.d}, r=${inlineCounts.r}, flattened ${flattenedSeqCount} sequence(s).`
    );

    return generator(ast, { jsescOption: { minimal: true } }).code;
}

function flattenSequenceExpressions(node, result = []) {
    if (t.isSequenceExpression(node)) {
        for (const expression of node.expressions) {
            flattenSequenceExpressions(expression, result);
        }
        return result;
    }

    result.push(node);
    return result;
}

function flattenLogicalAndExpressions(node, result = []) {
    if (t.isLogicalExpression(node, { operator: '&&' })) {
        flattenLogicalAndExpressions(node.left, result);
        flattenLogicalAndExpressions(node.right, result);
        return result;
    }

    result.push(node);
    return result;
}

function getStaticPropertyKeyName(node) {
    if (t.isStringLiteral(node) || t.isNumericLiteral(node)) {
        return String(node.value);
    }

    if (t.isIdentifier(node)) {
        return node.name;
    }

    return null;
}

function isObjectPrototypeHasOwnPropertyCall(node, objectName) {
    if (!t.isCallExpression(node) || node.arguments.length !== 2) {
        return false;
    }

    const callee = node.callee;
    if (!t.isMemberExpression(callee) || !t.isIdentifier(callee.property, { name: 'call' })) {
        return false;
    }

    const hasOwnPropertyMember = callee.object;
    if (
        !t.isMemberExpression(hasOwnPropertyMember) ||
        !t.isIdentifier(hasOwnPropertyMember.property, { name: 'hasOwnProperty' })
    ) {
        return false;
    }

    const prototypeMember = hasOwnPropertyMember.object;
    if (
        !t.isMemberExpression(prototypeMember) ||
        !t.isIdentifier(prototypeMember.object, { name: 'Object' }) ||
        !t.isIdentifier(prototypeMember.property, { name: 'prototype' })
    ) {
        return false;
    }

    return t.isIdentifier(node.arguments[0], { name: objectName });
}

function isObjectDefinePropertyCall(node, objectName) {
    return t.isCallExpression(node) &&
        t.isMemberExpression(node.callee) &&
        t.isIdentifier(node.callee.object, { name: 'Object' }) &&
        t.isIdentifier(node.callee.property, { name: 'defineProperty' }) &&
        node.arguments.length >= 3 &&
        t.isIdentifier(node.arguments[0], { name: objectName });
}

function extractGetterReturnExpression(node) {
    if (!(t.isFunctionExpression(node) || t.isArrowFunctionExpression(node))) {
        return null;
    }

    if (t.isBlockStatement(node.body)) {
        if (node.body.body.length !== 1 || !t.isReturnStatement(node.body.body[0]) || !node.body.body[0].argument) {
            return null;
        }
        return node.body.body[0].argument;
    }

    return node.body;
}

function extractWebpackExportDefinition(expression, exportsParamName) {
    let definePropertyCall = null;

    if (
        t.isLogicalExpression(expression, { operator: '||' }) &&
        isObjectPrototypeHasOwnPropertyCall(expression.left, exportsParamName) &&
        isObjectDefinePropertyCall(expression.right, exportsParamName)
    ) {
        definePropertyCall = expression.right;
    } else if (t.isLogicalExpression(expression, { operator: '&&' })) {
        const logicalParts = flattenLogicalAndExpressions(expression);
        const lastPart = logicalParts[logicalParts.length - 1];
        if (isObjectDefinePropertyCall(lastPart, exportsParamName)) {
            definePropertyCall = lastPart;
        }
    } else if (isObjectDefinePropertyCall(expression, exportsParamName)) {
        definePropertyCall = expression;
    }

    if (!definePropertyCall) {
        return null;
    }

    const [, propertyNode, descriptorNode] = definePropertyCall.arguments;
    if (!t.isObjectExpression(descriptorNode)) {
        return null;
    }

    const propertyName = getStaticPropertyKeyName(propertyNode);
    const getterProperty = descriptorNode.properties.find(property =>
        t.isObjectProperty(property) &&
        getStaticPropertyKeyName(property.key) === 'get'
    );
    const valueProperty = descriptorNode.properties.find(property =>
        t.isObjectProperty(property) &&
        getStaticPropertyKeyName(property.key) === 'value'
    );

    if (propertyName === '__esModule') {
        return { type: 'marker' };
    }

    if (
        t.isMemberExpression(propertyNode) &&
        t.isIdentifier(propertyNode.object, { name: 'Symbol' }) &&
        t.isIdentifier(propertyNode.property, { name: 'toStringTag' })
    ) {
        return { type: 'marker' };
    }

    if (getterProperty) {
        const returnExpression = extractGetterReturnExpression(getterProperty.value);
        if (!returnExpression || propertyName === null) {
            return null;
        }

        return {
            type: 'getter',
            exportName: propertyName,
            valueExpression: returnExpression
        };
    }

    if (valueProperty && propertyName !== null) {
        return {
            type: 'value',
            exportName: propertyName,
            valueExpression: valueProperty.value
        };
    }

    return null;
}

function isModuleExportsMember(node, moduleParamName) {
    if (!moduleParamName) {
        return false;
    }

    return t.isMemberExpression(node) &&
        t.isIdentifier(node.object, { name: moduleParamName }) &&
        getStaticMemberName(node) === 'exports';
}

function isNamedExportMember(node, objectName) {
    if (!objectName) {
        return false;
    }

    return t.isMemberExpression(node) &&
        t.isIdentifier(node.object, { name: objectName }) &&
        getStaticMemberName(node) !== null;
}

function extractWebpackAssignmentExport(expression, moduleParamName, exportsParamName) {
    if (!t.isAssignmentExpression(expression, { operator: '=' })) {
        return null;
    }

    if (isModuleExportsMember(expression.left, moduleParamName)) {
        return {
            type: 'moduleExports',
            valueExpression: expression.right
        };
    }

    if (isNamedExportMember(expression.left, exportsParamName)) {
        return {
            type: 'namedExport',
            exportName: getStaticMemberName(expression.left),
            valueExpression: expression.right
        };
    }

    if (
        t.isMemberExpression(expression.left) &&
        t.isAssignmentExpression(expression.left.object, { operator: '=' }) &&
        isModuleExportsMember(expression.left.object.left, moduleParamName)
    ) {
        return {
            type: 'moduleExportsAssignmentWithProperty',
            moduleValueExpression: expression.left.object.right,
            propertyName: getStaticMemberName(expression.left),
            propertyValueExpression: expression.right
        };
    }

    return null;
}

function buildWebpackNamedPropertyAccess(objectExpression, propertyName) {
    const useComputed = !/^[A-Za-z_$][A-Za-z0-9_$]*$/.test(propertyName);
    return t.memberExpression(
        t.cloneNode(objectExpression, true),
        useComputed ? t.stringLiteral(propertyName) : t.identifier(propertyName),
        useComputed
    );
}

function buildWebpackModuleExportsAssignmentWithPropertyExpression(assignmentExport) {
    return t.assignmentExpression(
        '=',
        buildWebpackNamedPropertyAccess(assignmentExport.moduleValueExpression, assignmentExport.propertyName),
        t.cloneNode(assignmentExport.propertyValueExpression, true)
    );
}

function buildExpressionFromExpressions(expressions) {
    if (!Array.isArray(expressions) || expressions.length === 0) {
        return null;
    }

    return expressions.length === 1
        ? expressions[0]
        : t.sequenceExpression(expressions);
}

function buildExpressionStatementFromExpressions(expressions) {
    const expression = buildExpressionFromExpressions(expressions);
    return expression ? t.expressionStatement(expression) : null;
}

function unwrapIgnorableStatementExpression(node) {
    let currentNode = node;

    while (t.isParenthesizedExpression(currentNode)) {
        currentNode = currentNode.expression;
    }

    while (
        t.isUnaryExpression(currentNode) &&
        ['!', 'void', '+', '-', '~'].includes(currentNode.operator)
    ) {
        currentNode = currentNode.argument;
    }

    return currentNode;
}

function getIifeFunctionNode(expression) {
    const coreExpression = unwrapIgnorableStatementExpression(expression);
    if (!t.isCallExpression(coreExpression)) {
        return null;
    }

    if (t.isFunctionExpression(coreExpression.callee) || t.isArrowFunctionExpression(coreExpression.callee)) {
        return {
            coreExpression,
            functionNode: coreExpression.callee
        };
    }

    if (
        t.isMemberExpression(coreExpression.callee) &&
        (t.isIdentifier(coreExpression.callee.property, { name: 'call' }) || t.isIdentifier(coreExpression.callee.property, { name: 'apply' })) &&
        (t.isFunctionExpression(coreExpression.callee.object) || t.isArrowFunctionExpression(coreExpression.callee.object))
    ) {
        return {
            coreExpression,
            functionNode: coreExpression.callee.object
        };
    }

    return null;
}

function rewriteNestedWebpackExportIifeExpression(expression, moduleParamName, exportsParamName) {
    const iifeInfo = getIifeFunctionNode(expression);
    if (!iifeInfo || !t.isBlockStatement(iifeInfo.functionNode.body)) {
        return null;
    }

    const clonedExpression = t.cloneNode(iifeInfo.coreExpression, true);
    const clonedIifeInfo = getIifeFunctionNode(clonedExpression);
    if (!clonedIifeInfo || !t.isBlockStatement(clonedIifeInfo.functionNode.body)) {
        return null;
    }

    const nestedExportEntries = [];
    const rewrittenStatements = [];
    let nestedModuleExportsExpression = null;
    let changed = false;

    for (const originalStatement of clonedIifeInfo.functionNode.body.body) {
        if (!t.isExpressionStatement(originalStatement)) {
            rewrittenStatements.push(t.cloneNode(originalStatement, true));
            continue;
        }

        const residualExpressions = [];

        for (const nestedExpression of flattenSequenceExpressions(originalStatement.expression)) {
            const exportDefinition = exportsParamName
                ? extractWebpackExportDefinition(nestedExpression, exportsParamName)
                : null;
            if (exportDefinition) {
                changed = true;

                if (exportDefinition.type === 'getter' || exportDefinition.type === 'value') {
                    nestedExportEntries.push({
                        exportName: exportDefinition.exportName,
                        valueExpression: exportDefinition.valueExpression
                    });
                }
                continue;
            }

            const assignmentExport = moduleParamName || exportsParamName
                ? extractWebpackAssignmentExport(nestedExpression, moduleParamName, exportsParamName)
                : null;
            if (assignmentExport) {
                changed = true;

                if (assignmentExport.type === 'moduleExports') {
                    nestedModuleExportsExpression = t.cloneNode(assignmentExport.valueExpression, true);
                    continue;
                }

                if (assignmentExport.type === 'namedExport') {
                    nestedExportEntries.push({
                        exportName: assignmentExport.exportName,
                        valueExpression: assignmentExport.valueExpression
                    });
                    continue;
                }

                if (assignmentExport.type === 'moduleExportsAssignmentWithProperty') {
                    nestedModuleExportsExpression = t.cloneNode(assignmentExport.moduleValueExpression, true);
                    residualExpressions.push(buildWebpackModuleExportsAssignmentWithPropertyExpression(assignmentExport));
                    continue;
                }
            }

            residualExpressions.push(t.cloneNode(nestedExpression, true));
        }

        const rewrittenStatement = buildExpressionStatementFromExpressions(residualExpressions);
        if (rewrittenStatement) {
            rewrittenStatements.push(rewrittenStatement);
        }
    }

    if (!changed) {
        return null;
    }

    clonedIifeInfo.functionNode.body = t.blockStatement(rewrittenStatements);
    return {
        expression: clonedExpression,
        exportEntries: nestedExportEntries,
        moduleExportsExpression: nestedModuleExportsExpression
    };
}

function makeReadableWebpackExportsExpression(exportEntries) {
    return t.objectExpression(
        exportEntries.map(entry => t.objectMethod(
            'get',
            /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(entry.exportName)
                ? t.identifier(entry.exportName)
                : t.stringLiteral(entry.exportName),
            [],
            t.blockStatement([
                t.returnStatement(t.cloneNode(entry.valueExpression, true))
            ]),
            false,
            false
        ))
    );
}

function moduleBodyUsesParam(statements, paramName) {
    if (!paramName) {
        return false;
    }

    const tempAst = t.file(t.program(statements.map(statement => t.cloneNode(statement, true))));
    let used = false;

    traverse(tempAst, {
        Identifier(path) {
            if (!path.isReferencedIdentifier({ name: paramName })) {
                return;
            }

            if (path.scope.hasBinding(paramName)) {
                return;
            }

            used = true;
            path.stop();
        }
    });

    return used;
}

function buildFlattenedWebpackModuleNodes(functionNode, moduleId) {
    if (!functionNode.id || !t.isIdentifier(functionNode.id)) {
        return null;
    }

    const factoryName = functionNode.id.name;
    const moduleParamName = t.isIdentifier(functionNode.params[0]) ? functionNode.params[0].name : null;
    const exportsParamName = t.isIdentifier(functionNode.params[1]) ? functionNode.params[1].name : null;
    const exportEntries = [];
    const bodyStatements = [];
    let moduleExportsExpression = null;

    for (const originalStatement of functionNode.body.body) {
        if (!t.isExpressionStatement(originalStatement)) {
            bodyStatements.push(t.cloneNode(originalStatement, true));
            continue;
        }

        const residualExpressions = [];

        for (const expression of flattenSequenceExpressions(originalStatement.expression)) {
            const exportDefinition = exportsParamName
                ? extractWebpackExportDefinition(expression, exportsParamName)
                : null;
            if (exportDefinition) {
                if (exportDefinition.type === 'getter' || exportDefinition.type === 'value') {
                    exportEntries.push({
                        exportName: exportDefinition.exportName,
                        valueExpression: exportDefinition.valueExpression
                    });
                }
                continue;
            }

            const assignmentExport = moduleParamName || exportsParamName
                ? extractWebpackAssignmentExport(expression, moduleParamName, exportsParamName)
                : null;
            if (assignmentExport) {
                if (assignmentExport.type === 'moduleExports') {
                    moduleExportsExpression = t.cloneNode(assignmentExport.valueExpression, true);
                    continue;
                }

                if (assignmentExport.type === 'namedExport') {
                    exportEntries.push({
                        exportName: assignmentExport.exportName,
                        valueExpression: assignmentExport.valueExpression
                    });
                    continue;
                }

                if (assignmentExport.type === 'moduleExportsAssignmentWithProperty') {
                    moduleExportsExpression = t.cloneNode(assignmentExport.moduleValueExpression, true);
                    residualExpressions.push(buildWebpackModuleExportsAssignmentWithPropertyExpression(assignmentExport));
                    continue;
                }
            }

            if (t.isIdentifier(expression) && /^webpack_exports_[A-Za-z0-9_]+$/.test(expression.name)) {
                continue;
            }

            residualExpressions.push(t.cloneNode(expression, true));
        }

        if (residualExpressions.length === 0) {
            continue;
        }

        let rewrittenStatement = buildExpressionStatementFromExpressions(residualExpressions);
        if (!rewrittenStatement) {
            continue;
        }

        const rewrittenNestedIife = rewriteNestedWebpackExportIifeExpression(
            rewrittenStatement.expression,
            moduleParamName,
            exportsParamName
        );
        if (rewrittenNestedIife) {
            exportEntries.push(...rewrittenNestedIife.exportEntries);
            if (rewrittenNestedIife.moduleExportsExpression) {
                moduleExportsExpression = t.cloneNode(rewrittenNestedIife.moduleExportsExpression, true);
            }
            rewrittenStatement = rewrittenNestedIife.expression
                ? t.expressionStatement(rewrittenNestedIife.expression)
                : null;
        }

        if (rewrittenStatement) {
            bodyStatements.push(rewrittenStatement);
        }
    }

    const returnExpression = moduleExportsExpression || (
        exportEntries.length > 0
            ? makeReadableWebpackExportsExpression(exportEntries)
            : t.objectExpression([])
    );
    bodyStatements.push(t.returnStatement(returnExpression));

    if (
        moduleBodyUsesParam(bodyStatements, moduleParamName) ||
        moduleBodyUsesParam(bodyStatements, exportsParamName)
    ) {
        return buildFallbackFlattenedWebpackModuleNodes(functionNode, moduleId);
    }

    const exportsName = getWebpackModuleExportsName(moduleId);
    return [
        t.exportNamedDeclaration(
            t.variableDeclaration('var', [
                t.variableDeclarator(
                    t.identifier(exportsName),
                    t.callExpression(
                        t.parenthesizedExpression(
                            t.arrowFunctionExpression([], t.blockStatement(bodyStatements))
                        ),
                        []
                    )
                )
            ]),
            []
        ),
        t.variableDeclaration('var', [
            t.variableDeclarator(
                t.identifier(factoryName),
                t.identifier(exportsName)
            )
        ])
    ];
}

function buildFallbackFlattenedWebpackModuleNodes(functionNode, moduleId) {
    if (!functionNode.id || !t.isIdentifier(functionNode.id)) {
        return null;
    }

    const factoryName = functionNode.id.name;
    const moduleParamName = t.isIdentifier(functionNode.params[0]) ? functionNode.params[0].name : null;
    const exportsParamName = t.isIdentifier(functionNode.params[1]) ? functionNode.params[1].name : null;
    const exportsName = getWebpackModuleExportsName(moduleId);
    const sanitizedModuleId = sanitizeModuleIdForIdentifier(moduleId);
    const moduleHolderName = `__webpack_module_${sanitizedModuleId}`;
    const exportsHolderName = `__webpack_exports_object_${sanitizedModuleId}`;
    const bodyStatements = [];

    if (moduleParamName) {
        bodyStatements.push(
            t.variableDeclaration('var', [
                t.variableDeclarator(
                    t.identifier(moduleHolderName),
                    t.objectExpression([
                        t.objectProperty(t.identifier('exports'), t.objectExpression([]))
                    ])
                )
            ])
        );
        bodyStatements.push(
            t.variableDeclaration('var', [
                t.variableDeclarator(
                    t.identifier(moduleParamName),
                    t.identifier(moduleHolderName)
                )
            ])
        );

        if (exportsParamName) {
            bodyStatements.push(
                t.variableDeclaration('var', [
                    t.variableDeclarator(
                        t.identifier(exportsParamName),
                        t.memberExpression(
                            t.identifier(moduleHolderName),
                            t.identifier('exports')
                        )
                    )
                ])
            );
        }
    } else if (exportsParamName) {
        bodyStatements.push(
            t.variableDeclaration('var', [
                t.variableDeclarator(
                    t.identifier(exportsHolderName),
                    t.objectExpression([])
                )
            ])
        );
        bodyStatements.push(
            t.variableDeclaration('var', [
                t.variableDeclarator(
                    t.identifier(exportsParamName),
                    t.identifier(exportsHolderName)
                )
            ])
        );
    }

    for (const statement of functionNode.body.body) {
        bodyStatements.push(t.cloneNode(statement, true));
    }

    bodyStatements.push(
        t.returnStatement(
            moduleParamName
                ? t.memberExpression(
                    t.identifier(moduleHolderName),
                    t.identifier('exports')
                )
                : exportsParamName
                    ? t.identifier(exportsHolderName)
                    : t.objectExpression([])
        )
    );

    return [
        t.exportNamedDeclaration(
            t.variableDeclaration('var', [
                t.variableDeclarator(
                    t.identifier(exportsName),
                    t.callExpression(
                        t.parenthesizedExpression(
                            t.arrowFunctionExpression([], t.blockStatement(bodyStatements))
                        ),
                        []
                    )
                )
            ]),
            []
        ),
        t.variableDeclaration('var', [
            t.variableDeclarator(
                t.identifier(factoryName),
                t.identifier(exportsName)
            )
        ])
    ];
}

var flattenWebpackModuleFactories = (sourceCode) => {
    const ast = parser.parse(sourceCode, { sourceType: 'module' });
    const functionPaths = new Map();
    const recordDeclarationPaths = new Map();
    const recordCallPaths = new Map();
    const exportDeclarationPaths = new Map();
    let flattenedCount = 0;

    traverse(ast, {
        FunctionDeclaration(path) {
            if (!path.parentPath.isProgram() || !path.node.id) {
                return;
            }

            const match = /^webpack_module_(.+)$/.exec(path.node.id.name);
            if (!match) {
                return;
            }

            functionPaths.set(match[1], path);
        },
        VariableDeclaration(path) {
            if (!path.parentPath.isProgram()) {
                return;
            }

            for (const declarator of path.node.declarations) {
                if (!t.isIdentifier(declarator.id)) {
                    continue;
                }

                const recordMatch = /^webpack_module_record_(.+)$/.exec(declarator.id.name);
                if (
                    recordMatch &&
                    t.isObjectExpression(declarator.init) &&
                    declarator.init.properties.length === 1 &&
                    t.isObjectProperty(declarator.init.properties[0]) &&
                    getStaticPropertyKeyName(declarator.init.properties[0].key) === 'exports'
                ) {
                    recordDeclarationPaths.set(recordMatch[1], path);
                }
            }
        },
        ExpressionStatement(path) {
            if (!path.parentPath.isProgram() || !t.isCallExpression(path.node.expression)) {
                return;
            }

            const callExpression = path.node.expression;
            if (!t.isIdentifier(callExpression.callee)) {
                return;
            }

            const callMatch = /^webpack_module_(.+)$/.exec(callExpression.callee.name);
            if (!callMatch) {
                return;
            }

            recordCallPaths.set(callMatch[1], path);
        },
        ExportNamedDeclaration(path) {
            if (!path.parentPath.isProgram() || !t.isVariableDeclaration(path.node.declaration)) {
                return;
            }

            for (const declarator of path.node.declaration.declarations) {
                if (!t.isIdentifier(declarator.id)) {
                    continue;
                }

                const exportMatch = /^webpack_exports_(.+)$/.exec(declarator.id.name);
                if (exportMatch) {
                    exportDeclarationPaths.set(exportMatch[1], path);
                }
            }
        }
    });

    for (const [moduleId, functionPath] of functionPaths.entries()) {
        const exportDeclarationPath = exportDeclarationPaths.get(moduleId);
        const recordDeclarationPath = recordDeclarationPaths.get(moduleId);
        const recordCallPath = recordCallPaths.get(moduleId);
        if (!exportDeclarationPath || !recordDeclarationPath || !recordCallPath) {
            continue;
        }

        const replacementNodes = buildFlattenedWebpackModuleNodes(functionPath.node, moduleId);
        if (!replacementNodes) {
            continue;
        }

        functionPath.replaceWithMultiple(replacementNodes);
        if (!recordDeclarationPath.removed) {
            recordDeclarationPath.remove();
        }
        if (!recordCallPath.removed) {
            recordCallPath.remove();
        }
        if (!exportDeclarationPath.removed) {
            exportDeclarationPath.remove();
        }
        flattenedCount++;
    }

    console.log(`Webpack module factories flattened: ${flattenedCount}.`);
    return generator(ast, { jsescOption: { minimal: true } }).code;
}

function renameWebpackModuleRequireParams(ast, moduleFunctionNames) {
    let renameCount = 0;

    traverse(ast, {
        FunctionDeclaration(path) {
            if (!path.node.id || !moduleFunctionNames.has(path.node.id.name)) {
                return;
            }

            const lastParam = path.node.params[path.node.params.length - 1];
            if (!t.isIdentifier(lastParam) || lastParam.name === '__webpack_require__') {
                return;
            }

            const hasOwnBinding = typeof path.scope.hasOwnBinding === 'function'
                ? path.scope.hasOwnBinding('__webpack_require__')
                : path.scope.hasBinding('__webpack_require__');
            if (hasOwnBinding) {
                return;
            }

            path.scope.rename(lastParam.name, '__webpack_require__');
            renameCount++;
        }
    });

    return renameCount;
}

function hasEnoughWebpackModuleFactories(node) {
    if (!t.isObjectExpression(node)) {
        return false;
    }

    let functionCount = 0;
    for (const property of node.properties) {
        const moduleId = getWebpackModuleIdFromProperty(property);
        if (
            t.isObjectProperty(property) &&
            isLikelyWebpackModuleId(moduleId) &&
            (t.isFunctionExpression(property.value) || t.isArrowFunctionExpression(property.value))
        ) {
            functionCount++;
        }
    }

    return functionCount > 5;
}

function isLikelyWebpackModuleId(moduleId) {
    return typeof moduleId === 'string' && /^(?:\d+|[0-9a-f]{4,})$/i.test(moduleId);
}

function getWebpackModuleIdFromProperty(propertyNode) {
    if (!t.isObjectProperty(propertyNode)) {
        return null;
    }

    if (t.isIdentifier(propertyNode.key) && !propertyNode.computed) {
        return propertyNode.key.name;
    }

    if (t.isStringLiteral(propertyNode.key) || t.isNumericLiteral(propertyNode.key)) {
        return String(propertyNode.key.value);
    }

    return null;
}

function sanitizeModuleIdForIdentifier(moduleId) {
    return String(moduleId).replace(/[^a-zA-Z0-9_]/g, '_');
}

function getWebpackModuleFactoryName(moduleId) {
    return `webpack_module_${sanitizeModuleIdForIdentifier(moduleId)}`;
}

function getWebpackModuleRecordName(moduleId) {
    return `webpack_module_record_${sanitizeModuleIdForIdentifier(moduleId)}`;
}

function getWebpackModuleExportsName(moduleId) {
    return `webpack_exports_${sanitizeModuleIdForIdentifier(moduleId)}`;
}

function makeModuleIdLiteral(moduleId) {
    return /^[0-9]+$/.test(String(moduleId))
        ? t.numericLiteral(Number(moduleId))
        : t.stringLiteral(String(moduleId));
}

function getInsertionScopePath(path) {
    return path.findParent(parent => parent.isBlockStatement() || parent.isProgram());
}

function getProgramScopePath(path) {
    return path.findParent(parent => parent.isProgram()) || path;
}

function collectWebpackModuleContainers(ast) {
    const containers = [];

    traverse(ast, {
        VariableDeclarator(path) {
            if (!hasEnoughWebpackModuleFactories(path.node.init)) {
                return;
            }

            const insertionScopePath = getInsertionScopePath(path);
            if (!insertionScopePath) {
                return;
            }

            containers.push({
                objectPath: path.get('init'),
                insertionScopePath,
                programScopePath: getProgramScopePath(path)
            });
        },
        CallExpression(path) {
            if (!t.isMemberExpression(path.node.callee)) {
                return;
            }

            const args = path.get('arguments');
            if (args.length === 0 || !args[0].isArrayExpression()) {
                return;
            }

            const elements = args[0].get('elements');
            if (elements.length < 2 || !elements[1]?.isObjectExpression()) {
                return;
            }

            if (!hasEnoughWebpackModuleFactories(elements[1].node)) {
                return;
            }

            const insertionScopePath = getInsertionScopePath(path);
            if (!insertionScopePath) {
                return;
            }

            containers.push({
                objectPath: elements[1],
                insertionScopePath,
                programScopePath: getProgramScopePath(path)
            });
        }
    });

    return containers;
}

function makeWebpackModuleRecordStatements(moduleId, factoryName) {
    const recordName = getWebpackModuleRecordName(moduleId);
    const exportsName = getWebpackModuleExportsName(moduleId);
    const recordIdentifier = t.identifier(recordName);
    const exportsMemberExpression = t.memberExpression(recordIdentifier, t.identifier('exports'));

    return [
        t.variableDeclaration('var', [
            t.variableDeclarator(
                recordIdentifier,
                t.objectExpression([
                    t.objectProperty(t.identifier('exports'), t.objectExpression([]))
                ])
            )
        ]),
        t.expressionStatement(
            t.callExpression(
                t.identifier(factoryName),
                [
                    recordIdentifier,
                    exportsMemberExpression,
                    t.identifier('__webpack_require__')
                ]
            )
        ),
        t.exportNamedDeclaration(
            t.variableDeclaration('var', [
                t.variableDeclarator(
                    t.identifier(exportsName),
                    exportsMemberExpression
                )
            ]),
            []
        )
    ];
}

function collectWebpackModuleRegistry(sourceCode, sourceFilePath) {
    const ast = parseSourceCode(sourceCode);
    const containers = collectWebpackModuleContainers(ast);
    const moduleRegistry = new Map();

    for (const container of containers) {
        for (const propertyPath of container.objectPath.get('properties')) {
            if (!propertyPath.isObjectProperty()) {
                continue;
            }

            const moduleId = getWebpackModuleIdFromProperty(propertyPath.node);
            const valuePath = propertyPath.get('value');
            if (
                moduleId === null ||
                !isLikelyWebpackModuleId(moduleId) ||
                !(valuePath.isFunctionExpression() || valuePath.isArrowFunctionExpression())
            ) {
                continue;
            }

            if (!moduleRegistry.has(moduleId)) {
                moduleRegistry.set(moduleId, {
                    sourceFilePath,
                    factoryName: getWebpackModuleFactoryName(moduleId),
                    exportsName: getWebpackModuleExportsName(moduleId),
                    recordName: getWebpackModuleRecordName(moduleId)
                });
            }
        }
    }

    return moduleRegistry;
}

function getImportPathForSourceFile(sourceFilePath, importedSourceFilePath) {
    let relativePath = path.relative(path.dirname(sourceFilePath), importedSourceFilePath).replace(/\\/g, '/');
    if (!relativePath.startsWith('.')) {
        relativePath = `./${relativePath}`;
    }
    return relativePath;
}

function insertWebpackExportImports(ast, sourceFilePath, importedModuleInfos) {
    if (importedModuleInfos.size === 0) {
        return;
    }

    const importGroups = new Map();
    for (const moduleInfo of importedModuleInfos.values()) {
        if (!moduleInfo.sourceFilePath || moduleInfo.sourceFilePath === sourceFilePath) {
            continue;
        }

        const importPath = getImportPathForSourceFile(sourceFilePath, moduleInfo.sourceFilePath);
        let exportNames = importGroups.get(importPath);
        if (!exportNames) {
            exportNames = new Set();
            importGroups.set(importPath, exportNames);
        }
        exportNames.add(moduleInfo.exportsName);
    }

    if (importGroups.size === 0) {
        return;
    }

    const importDeclarations = Array.from(importGroups.entries())
        .sort((left, right) => left[0].localeCompare(right[0]))
        .map(([importPath, exportNames]) => t.importDeclaration(
            Array.from(exportNames)
                .sort((left, right) => left.localeCompare(right))
                .map(exportName => t.importSpecifier(t.identifier(exportName), t.identifier(exportName))),
            t.stringLiteral(importPath)
        ));

    ast.program.body.unshift(...importDeclarations);
}

function replaceStaticWebpackRequireCalls(ast, moduleRegistry, sourceFilePath) {
    let rewriteCount = 0;
    const importedModuleInfos = new Map();

    traverse(ast, {
        CallExpression(path) {
            if (t.isIdentifier(path.node.callee, { name: '__webpack_require__' })) {
                if (path.node.arguments.length !== 1) {
                    return;
                }

                const [moduleIdNode] = path.node.arguments;
                if (!(t.isStringLiteral(moduleIdNode) || t.isNumericLiteral(moduleIdNode))) {
                    return;
                }

                const moduleId = String(moduleIdNode.value);
                const moduleInfo = moduleRegistry.get(moduleId);
                if (!moduleInfo) {
                    return;
                }

                if (moduleInfo.sourceFilePath && moduleInfo.sourceFilePath !== sourceFilePath) {
                    importedModuleInfos.set(moduleId, moduleInfo);
                }
                path.replaceWith(t.identifier(moduleInfo.exportsName));
                rewriteCount++;
                path.skip();
                return;
            }

            if (!t.isMemberExpression(path.node.callee)) {
                return;
            }

            if (
                !t.isIdentifier(path.node.callee.object, { name: '__webpack_require__' }) ||
                getStaticMemberName(path.node.callee) !== 'bind'
            ) {
                return;
            }

            if (path.node.arguments.length !== 2 || !t.isNullLiteral(path.node.arguments[0])) {
                return;
            }

            const moduleIdNode = path.node.arguments[1];
            if (!(t.isStringLiteral(moduleIdNode) || t.isNumericLiteral(moduleIdNode))) {
                return;
            }

            const moduleId = String(moduleIdNode.value);
            const moduleInfo = moduleRegistry.get(moduleId);
            if (!moduleInfo) {
                return;
            }

            if (moduleInfo.sourceFilePath && moduleInfo.sourceFilePath !== sourceFilePath) {
                importedModuleInfos.set(moduleId, moduleInfo);
            }
            path.replaceWith(
                t.functionExpression(
                    null,
                    [],
                    t.blockStatement([
                        t.returnStatement(t.identifier(moduleInfo.exportsName))
                    ])
                )
            );
            rewriteCount++;
            path.skip();
        }
    });

    insertWebpackExportImports(ast, sourceFilePath, importedModuleInfos);
    return rewriteCount;
}

var unpackWebpackModules = (sourceCode, moduleRegistry, sourceFilePath) => {
    const ast = parseSourceCode(sourceCode);
    const containers = collectWebpackModuleContainers(ast);
    let moduleMap = new Map();
    let moduleFunctionNames = new Set();
    const scopeInsertions = new Map();
    const moduleRecordInsertions = new Map();
    let extractedModuleCount = 0;

    if (containers.length === 0) {
        console.log("No webpack module containers found.");
        return sourceCode;
    }

    for (const container of containers) {
        const { objectPath, programScopePath } = container;
        let declarationsForScope = scopeInsertions.get(programScopePath);
        if (!declarationsForScope) {
            declarationsForScope = [];
            scopeInsertions.set(programScopePath, declarationsForScope);
        }

        let moduleRecordsForScope = moduleRecordInsertions.get(programScopePath);
        if (!moduleRecordsForScope) {
            moduleRecordsForScope = [];
            moduleRecordInsertions.set(programScopePath, moduleRecordsForScope);
        }

        for (const propertyPath of objectPath.get('properties')) {
            if (!propertyPath.isObjectProperty()) {
                continue;
            }

            const moduleId = getWebpackModuleIdFromProperty(propertyPath.node);
            const valuePath = propertyPath.get('value');
            if (
                moduleId === null ||
                !isLikelyWebpackModuleId(moduleId) ||
                !(valuePath.isFunctionExpression() || valuePath.isArrowFunctionExpression())
            ) {
                continue;
            }

            const moduleInfo = moduleRegistry.get(moduleId) || {
                sourceFilePath,
                factoryName: getWebpackModuleFactoryName(moduleId),
                exportsName: getWebpackModuleExportsName(moduleId),
                recordName: getWebpackModuleRecordName(moduleId)
            };
            let factoryName = moduleMap.get(moduleId);
            if (!factoryName) {
                factoryName = moduleInfo.factoryName;
                moduleMap.set(moduleId, factoryName);
                moduleFunctionNames.add(factoryName);

                if (!moduleInfo.sourceFilePath || moduleInfo.sourceFilePath === sourceFilePath) {
                    const funcExpr = valuePath.node;
                    declarationsForScope.push(
                        t.functionDeclaration(
                            t.identifier(factoryName),
                            funcExpr.params,
                            t.isBlockStatement(funcExpr.body)
                                ? funcExpr.body
                                : t.blockStatement([t.returnStatement(funcExpr.body)]),
                            funcExpr.generator,
                            funcExpr.async
                        )
                    );
                    moduleRecordsForScope.push(...makeWebpackModuleRecordStatements(moduleId, factoryName));
                    extractedModuleCount++;
                }
            }

            valuePath.replaceWith(t.identifier(factoryName));
        }
    }

    for (const [scopePath, declarations] of scopeInsertions.entries()) {
        const moduleRecordStatements = moduleRecordInsertions.get(scopePath) || [];
        scopePath.node.body.unshift(...declarations, ...moduleRecordStatements);
    }

    const requireRenameCount = renameWebpackModuleRequireParams(ast, moduleFunctionNames);
    const staticRequireRewriteCount = replaceStaticWebpackRequireCalls(ast, moduleRegistry, sourceFilePath);
    console.log(`Extracted ${extractedModuleCount} webpack module factories from ${containers.length} container(s).`);
    console.log(`Webpack module require params renamed: ${requireRenameCount}.`);
    console.log(`Static webpack require calls rewritten: ${staticRequireRewriteCount}.`);
    return generator(ast, { jsescOption: { minimal: true } }).code;
}

function hasObfuscationMarkers(sourceCode) {
    return /\b(?:_0x[0-9a-f]+|a\d+_0x[0-9a-f]+)\b/i.test(sourceCode);
}

function collectInputFiles(inputPath) {
    const absoluteInputPath = path.resolve(__dirname, inputPath);
    if (!fs.existsSync(absoluteInputPath)) {
        throw new Error(`Input path not found: ${inputPath}`);
    }

    const stat = fs.statSync(absoluteInputPath);
    if (stat.isFile()) {
        return [absoluteInputPath];
    }

    return fs.readdirSync(absoluteInputPath)
        .map(name => path.join(absoluteInputPath, name))
        .filter(filePath => fs.statSync(filePath).isFile())
        .sort((left, right) => left.localeCompare(right));
}

function getOutputPath(sourceFilePath) {
    const sourceRoot = path.resolve(__dirname, 'source/v2');
    const outputRoot = path.resolve(__dirname, 'dist/v2');
    const relativePath = path.relative(sourceRoot, sourceFilePath);

    if (!relativePath.startsWith('..') && !path.isAbsolute(relativePath)) {
        return path.join(outputRoot, relativePath);
    }

    return path.resolve(__dirname, 'dist', path.basename(sourceFilePath));
}

function ensureOutputDir(filePath) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function isUnderDirectory(filePath, directoryPath) {
    const relativePath = path.relative(directoryPath, filePath);
    return !relativePath.startsWith('..') && !path.isAbsolute(relativePath);
}

function collectRegistryFiles(inputFiles) {
    const sourceRoot = path.resolve(__dirname, 'source/v2');
    if (!fs.existsSync(sourceRoot)) {
        return inputFiles;
    }

    const allWithinSourceRoot = inputFiles.every(filePath => isUnderDirectory(filePath, sourceRoot));
    return allWithinSourceRoot ? collectInputFiles(sourceRoot) : inputFiles;
}

function prepareSourceFile(sourceFilePath) {
    const displayPath = path.relative(__dirname, sourceFilePath);
    let currentCode = fs.readFileSync(sourceFilePath, 'utf-8').toString();
    const shouldRunObfuscationPasses = hasObfuscationMarkers(currentCode);

    console.log(`Preparing ${displayPath}...`);

    if (shouldRunObfuscationPasses) {
        console.log("Starting unpackObfDicts...");
        currentCode = unpackObfDicts(currentCode).code;

        console.log("Starting removeObfIfStatement...");
        currentCode = removeObfIfStatement(currentCode);

        console.log("Starting simplifyObfStructures...");
        currentCode = simplifyObfStructures(currentCode);
    } else {
        console.log("No obfuscation markers detected. Skipping shared deobfuscation passes.");
    }

    return {
        code: currentCode,
        shouldRunObfuscationPasses
    };
}

function buildWebpackModuleRegistry(preparedFiles) {
    const moduleRegistry = new Map();

    for (const [sourceFilePath, preparedFile] of preparedFiles.entries()) {
        const fileRegistry = collectWebpackModuleRegistry(preparedFile.code, sourceFilePath);
        for (const [moduleId, moduleInfo] of fileRegistry.entries()) {
            if (!moduleRegistry.has(moduleId)) {
                moduleRegistry.set(moduleId, moduleInfo);
            }
        }
    }

    return moduleRegistry;
}

function processPreparedSourceFile(sourceFilePath, preparedFile, moduleRegistry) {
    const displayPath = path.relative(__dirname, sourceFilePath);
    const outputPath = getOutputPath(sourceFilePath);
    let currentCode = preparedFile.code;

    console.log(`Processing ${displayPath}...`);

    console.log("Starting unpackWebpackModules...");
    currentCode = unpackWebpackModules(currentCode, moduleRegistry, sourceFilePath);

    console.log("Starting normalizeRuntimeHelperDicts...");
    currentCode = normalizeRuntimeHelperDicts(currentCode);

    console.log("Starting renameWebpackRuntimeScaffold...");
    currentCode = renameWebpackRuntimeScaffold(currentCode);

    console.log("Starting inlineRuntimeHelperRefs...");
    currentCode = inlineRuntimeHelperRefs(currentCode);

    console.log("Starting flattenWebpackModuleFactories...");
    currentCode = flattenWebpackModuleFactories(currentCode);

    if (preparedFile.shouldRunObfuscationPasses) {
        console.log("Starting cleanupObfuscatedReadableArtifacts...");
        currentCode = cleanupObfuscatedReadableArtifacts(currentCode);
    }

    ensureOutputDir(outputPath);
    fs.writeFileSync(outputPath, currentCode);
    console.log(`Wrote ${path.relative(__dirname, outputPath)}.`);
}

function main() {
    const inputPath = process.argv[2] || 'source/v2';
    const inputFiles = collectInputFiles(inputPath);
    const registryFiles = collectRegistryFiles(inputFiles);
    const preparedFiles = new Map();
    let failureCount = 0;

    for (const sourceFilePath of registryFiles) {
        try {
            preparedFiles.set(sourceFilePath, prepareSourceFile(sourceFilePath));
        } catch (error) {
            failureCount++;
            console.error(`Failed to prepare ${path.relative(__dirname, sourceFilePath)}:`);
            console.error(error && error.stack ? error.stack : error);
        }
    }

    const moduleRegistry = buildWebpackModuleRegistry(preparedFiles);
    console.log(`Collected ${moduleRegistry.size} webpack module record(s).`);

    for (const sourceFilePath of inputFiles) {
        if (!preparedFiles.has(sourceFilePath)) {
            continue;
        }

        try {
            processPreparedSourceFile(sourceFilePath, preparedFiles.get(sourceFilePath), moduleRegistry);
        } catch (error) {
            failureCount++;
            console.error(`Failed to process ${path.relative(__dirname, sourceFilePath)}:`);
            console.error(error && error.stack ? error.stack : error);
        }
    }

    if (failureCount > 0) {
        process.exitCode = 1;
        console.error(`Completed with ${failureCount} failure(s).`);
        return;
    }

    console.log(`Processed ${inputFiles.length} file(s).`);
}

main();
