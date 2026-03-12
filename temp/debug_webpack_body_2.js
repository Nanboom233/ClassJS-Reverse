const fs = require('fs');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;

const code = fs.readFileSync('dist/source-v2.js', 'utf8');
const ast = parser.parse(code);

traverse(ast, {
    VariableDeclarator(path) {
        if (path.node.id && path.node.id.name === '_0x224d7d') {
            console.log("Found dictionary at depth:", path.getAncestry().length);
            let p = path;
            while(p.parentPath) {
                console.log("->", p.parentPath.node.type);
                p = p.parentPath;
            }
        }
    }
});
