const fs = require('fs');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;

const code = fs.readFileSync('dist/source-v2.js', 'utf8');
const ast = parser.parse(code);

let dicts = [];
traverse(ast, {
    VariableDeclarator(path) {
        if (path.node.id && path.node.id.name === '_0x224d7d') {
            console.log("Found _0x224d7d in VariableDeclarator, parent type:", path.parentPath.node.type);
            dicts.push(path);
        }
    }
});
console.log("Count:", dicts.length);
