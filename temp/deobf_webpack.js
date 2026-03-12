const fs = require('fs');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const t = require('@babel/types');
const generator = require('@babel/generator').default;

const code = fs.readFileSync('dist/source-v2.js', 'utf8');
const ast = parser.parse(code);

let wrapperDictName = null;
let webpackDict = null;
let loaderFuncName = null;

// The file structure is generally:
// ((...args) => { ... })(window, function() {
//    var _0x224d7d = { ... modules ... }
//    function _0x285476(_0x370ff0) { ... } // This is the loader
//    ...
//    return _0x285476(_0x285476.s = "56d7");
// })

traverse(ast, {
    CallExpression(path) {
        if (t.isFunctionExpression(path.node.callee) && path.node.arguments.length === 2) {
            const secondArg = path.node.arguments[1];
            if (t.isFunctionExpression(secondArg)) {
                // Find module dictionary
                traverse(secondArg, {
                    VariableDeclarator(innerPath) {
                        if (t.isObjectExpression(innerPath.node.init)) {
                            let isModuleDict = false;
                            for (let prop of innerPath.node.init.properties) {
                                if (t.isObjectProperty(prop) && t.isFunctionExpression(prop.value)) {
                                    if (prop.value.params.length === 3) { // usually module, exports, require
                                        isModuleDict = true;
                                        break;
                                    }
                                }
                            }
                            if (isModuleDict && !webpackDict) {
                                webpackDict = innerPath.node.init;
                                wrapperDictName = innerPath.node.id.name;
                                console.log(`Found Webpack dict: ${wrapperDictName} with ${webpackDict.properties.length} modules.`);
                            }
                        }
                    },
                    FunctionDeclaration(innerPath) {
                        // The loader function usually takes 1 parameter (moduleId)
                        if (innerPath.node.params.length === 1 && innerPath.node.body.body.length > 0) {
                            // Look for the module cache object and execution logic
                            // This is a heuristic: it returns something like return ...["exports"]
                            let hasExportsReturn = false;
                            traverse(innerPath.node, {
                                ReturnStatement(retPath) {
                                    const retStr = generator(retPath.node).code;
                                    if (retStr.includes('exports')) {
                                        hasExportsReturn = true;
                                    }
                                },
                                CallExpression(callPath) {
                                     // Looks for _0x224d7d[_0x370ff0]["call"](...) inside the loader
                                     if (wrapperDictName && t.isMemberExpression(callPath.node.callee) && generator(callPath.node.callee).code.includes(wrapperDictName)) {
                                        hasExportsReturn = true;
                                     }
                                }
                            }, innerPath.scope, innerPath);

                            if (hasExportsReturn && !loaderFuncName) {
                                loaderFuncName = innerPath.node.id.name;
                                console.log(`Found Webpack loader function: ${loaderFuncName}`);
                            }
                        }
                    }
                }, path.scope, path);
            }
        }
    }
});
