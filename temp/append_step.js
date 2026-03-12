const fs = require('fs');
const code = fs.readFileSync('decrypt_v2.js', 'utf8');

const newStep = `
var unpackWebpackModules = (sourceCode) => {
    const ast = parser.parse(sourceCode, { sourceType: 'module' });
    let wrapperDictName = null;
    let loaderFuncName = null;
    let moduleMap = new Map();

    traverse(ast, {
        VariableDeclarator(path) {
            if (t.isIdentifier(path.node.id) && t.isObjectExpression(path.node.init)) {
                let isWebpackObj = false;
                let funcs = 0;
                for (let prop of path.node.init.properties) {
                    if (t.isObjectProperty(prop) && t.isFunctionExpression(prop.value)) {
                        funcs++;
                        if (prop.value.params.length === 3) {
                            isWebpackObj = true;
                        }
                    }
                }
                if (isWebpackObj && funcs > 5) {
                    wrapperDictName = path.node.id.name;
                }
            }
        },
        FunctionDeclaration(path) {
            if (path.node.params.length === 1 && path.node.id) {
                let funcCode = generator(path.node).code;
                if (wrapperDictName && funcCode.includes(wrapperDictName) && funcCode.includes('exports')) {
                    loaderFuncName = path.node.id.name;
                }
            }
        }
    });

    console.log("Loader:", loaderFuncName, "Dict:", wrapperDictName);

    let moduleFunctions = [];
    let dictPathToRemove = null;

    traverse(ast, {
        VariableDeclarator(path) {
            if (t.isIdentifier(path.node.id) && path.node.id.name === wrapperDictName && t.isObjectExpression(path.node.init)) {
                dictPathToRemove = path;
                for (let prop of path.node.init.properties) {
                    if (t.isObjectProperty(prop)) {
                        let modName = prop.key.name || prop.key.value;
                        let funcExpr = prop.value;
                        
                        if (modName && t.isFunctionExpression(funcExpr)) {
                            let safeName = \`module_\${modName}\`;
                            safeName = safeName.replace(/[^a-zA-Z0-9_]/g, '_');
                            
                            moduleMap.set(String(modName), safeName);
                            
                            let funcDecl = t.functionDeclaration(
                                t.identifier(safeName),
                                funcExpr.params,
                                funcExpr.body,
                                funcExpr.generator,
                                funcExpr.async
                            );
                            moduleFunctions.push(funcDecl);
                        }
                    }
                }
            }
        }
    });

    console.log(\`Extracted \${moduleFunctions.length} modules.\`);

    if (dictPathToRemove) {
        dictPathToRemove.remove();
    }

    let topLevelBody = null;
    traverse(ast, {
        CallExpression(path) {
            if (t.isFunctionExpression(path.node.callee) && path.node.arguments.length === 2) {
                if (t.isFunctionExpression(path.node.arguments[1])) {
                    topLevelBody = path.node.arguments[1].body.body;
                    path.stop();
                }
            }
        }
    });

    if (topLevelBody) {
        topLevelBody.unshift(...moduleFunctions);
    }

    let loaderPath = null;
    traverse(ast, {
        FunctionDeclaration(path) {
            if (path.node.id && path.node.id.name === loaderFuncName) {
                loaderPath = path;
            }
        }
    });

    if (loaderPath && wrapperDictName) {
        let callArgs = [];
        
        traverse(loaderPath.node, {
            CallExpression(callPath) {
                if (t.isMemberExpression(callPath.node.callee)) {
                    let member = callPath.node.callee;
                    if (t.isMemberExpression(member.object) && 
                        t.isIdentifier(member.object.object) && 
                        member.object.object.name === wrapperDictName) {
                        
                        callArgs = callPath.node.arguments;
                        
                        let proxyCall = t.callExpression(
                            t.identifier('__call_webpack_module'),
                            [t.identifier(loaderPath.node.params[0].name), ...callArgs]
                        );
                        callPath.replaceWith(proxyCall);
                    }
                }
            }
        }, loaderPath.scope, loaderPath);

        let switchCases = [];
        let proxyArgs = [t.identifier('modId'), t.identifier('arg1'), t.identifier('arg2'), t.identifier('arg3'), t.identifier('arg4')];
        
        for (let [modId, safeName] of moduleMap.entries()) {
            let testValue = /^[0-9]+$/.test(modId) ? t.numericLiteral(Number(modId)) : t.stringLiteral(modId);
            
            let applyCall = t.callExpression(
                t.memberExpression(t.identifier(safeName), t.identifier('call')),
                [t.identifier('arg1'), t.identifier('arg2'), t.identifier('arg3'), t.identifier('arg4')]
            );
            
            switchCases.push(
                t.switchCase(testValue, [
                    t.returnStatement(applyCall)
                ])
            );
        }
        
        switchCases.push(
            t.switchCase(null, [
                t.throwStatement(
                    t.newExpression(t.identifier('Error'), [
                        t.binaryExpression('+', t.stringLiteral('Module not found: '), t.identifier('modId'))
                    ])
                )
            ])
        );
        
        let proxyFunc = t.functionDeclaration(
            t.identifier('__call_webpack_module'),
            proxyArgs,
            t.blockStatement([
                t.switchStatement(t.identifier('modId'), switchCases)
            ])
        );
        
        if (topLevelBody) {
            topLevelBody.unshift(proxyFunc);
        }
    }

    console.log("Webpack modules unpacked and reconstructed.");
    return generator(ast, { jsescOption: { minimal: true } }).code;
}
`;

// Insert the new function before function main()
let newCode = code.replace('function main() {', newStep + '\nfunction main() {');

// Update main() to use the new step
newCode = newCode.replace(
    /fs\.writeFileSync\(path\.resolve\(__dirname, 'dist\/source-v2\.js'\), cleanedCode\);\s*console\.log\("All done!"\);/g,
    `fs.writeFileSync(path.resolve(__dirname, 'dist/source-v2.js'), cleanedCode);

    console.log("Starting unpackWebpackModules...");
    let unpackedWebpackCode = unpackWebpackModules(cleanedCode);
    fs.writeFileSync(path.resolve(__dirname, 'dist/source-v3.js'), unpackedWebpackCode);

    console.log("All done!");`
);

fs.writeFileSync('decrypt_v2.js', newCode);
