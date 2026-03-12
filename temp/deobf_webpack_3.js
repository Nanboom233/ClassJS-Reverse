const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const t = require('@babel/types');
const generator = require('@babel/generator').default;

const code = fs.readFileSync('dist/source-v2.js', 'utf8');
const ast = parser.parse(code);

let wrapperDictName = null;
let loaderFuncName = null;
let moduleMap = new Map();

// 1. Find the wrapper dict and loader function
traverse(ast, {
    VariableDeclarator(p) {
        if (t.isIdentifier(p.node.id) && t.isObjectExpression(p.node.init)) {
            let isWebpackObj = false;
            let funcs = 0;
            for (let prop of p.node.init.properties) {
                if (t.isObjectProperty(prop) && t.isFunctionExpression(prop.value)) {
                    funcs++;
                    if (prop.value.params.length === 3) {
                        isWebpackObj = true;
                    }
                }
            }
            if (isWebpackObj && funcs > 5) {
                wrapperDictName = p.node.id.name;
            }
        }
    },
    FunctionDeclaration(p) {
        if (p.node.params.length === 1 && p.node.id) {
            let funcCode = generator(p.node).code;
            if (wrapperDictName && funcCode.includes(wrapperDictName) && funcCode.includes('exports')) {
                loaderFuncName = p.node.id.name;
            }
        }
    }
});

let moduleFunctions = [];
let dictPathToRemove = null;

traverse(ast, {
    VariableDeclarator(p) {
        if (t.isIdentifier(p.node.id) && p.node.id.name === wrapperDictName && t.isObjectExpression(p.node.init)) {
            dictPathToRemove = p;
            for (let prop of p.node.init.properties) {
                if (t.isObjectProperty(prop)) {
                    let modName = prop.key.name || prop.key.value;
                    let funcExpr = prop.value;
                    
                    if (modName && t.isFunctionExpression(funcExpr)) {
                        let safeName = `module_${modName}`;
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

if (dictPathToRemove) {
    // Instead of completely removing it, we'll replace it with an empty object so references don't crash
    dictPathToRemove.node.init = t.objectExpression([]);
}

let topLevelBody = null;
traverse(ast, {
    VariableDeclarator(p) {
        if (p.node.id && p.node.id.name === wrapperDictName) {
            // Found the dictionary declaration again
            // Its parent is the VariableDeclaration, whose parent is BlockStatement (the IIFE body)
            let blockPath = p.parentPath.parentPath;
            if (t.isBlockStatement(blockPath.node)) {
                topLevelBody = blockPath.node.body;
                p.stop();
            }
        }
    }
});

if (topLevelBody) {
    topLevelBody.unshift(...moduleFunctions);
}

let loaderPath = null;
traverse(ast, {
    FunctionDeclaration(p) {
        if (p.node.id && p.node.id.name === loaderFuncName) {
            loaderPath = p;
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

fs.writeFileSync('dist/source-v3.js', generator(ast, { jsescOption: { minimal: true } }).code);
console.log('Done!');
