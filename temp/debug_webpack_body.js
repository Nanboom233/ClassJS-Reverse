const fs = require('fs');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const t = require('@babel/types');

const code = fs.readFileSync('dist/source-v2.js', 'utf8');
const ast = parser.parse(code);

let topLevelBodyPath = null;
traverse(ast, {
    CallExpression(path) {
        if (t.isFunctionExpression(path.node.callee) && path.node.arguments.length === 2) {
            if (t.isFunctionExpression(path.node.arguments[1])) {
                let bodyNodes = path.node.arguments[1].body.body;
                // Double check if this body contains the dictionary
                let hasDict = false;
                for (let node of bodyNodes) {
                    if (t.isVariableDeclaration(node)) {
                        for (let decl of node.declarations) {
                            if (t.isIdentifier(decl.id) && decl.id.name === '_0x224d7d') {
                                hasDict = true;
                            }
                        }
                    }
                }
                if (hasDict) {
                    topLevelBodyPath = path.get('arguments.1.body');
                    console.log("Found correct IIFE body with length:", bodyNodes.length);
                    path.stop();
                }
            }
        }
    }
});
