const fs = require('fs');
const parser = require('@babel/parser');
const t = require('@babel/types');
const traverse = require('@babel/traverse').default;

const code = fs.readFileSync('source/v2/app.js', 'utf8');
const ast = parser.parse(code);

const dictFuncs = new Set(['a0_0x22ce']);
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
console.log("Found", dictFuncs.size, "dictionary aliases:", Array.from(dictFuncs));
