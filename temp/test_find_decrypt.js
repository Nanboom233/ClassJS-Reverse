const fs = require('fs');
const parser = require('@babel/parser');
const generator = require('@babel/generator').default;
const t = require('@babel/types');

const code = fs.readFileSync('source/v2/app.js', 'utf8');
const ast = parser.parse(code);

let setupNodes = [];
let decryptFuncName = null;

// The obfuscator usually places the IIFE, Dict, Decrypt function and an anti-debug variable at the top.
// We can take nodes until we hit the main program block (node 4).
for (let i = 0; i < 4; i++) {
    setupNodes.push(ast.program.body[i]);
}

let dictCode = setupNodes.map(node => generator(node).code).join('\n');
eval(dictCode);

// Find decrypt function name by finding a function declaration with 2 arguments that isn't the dictionary array
for (let node of setupNodes) {
    if (t.isFunctionDeclaration(node) && node.params.length === 2) {
        decryptFuncName = node.id.name;
    }
}
console.log("Decrypt function:", decryptFuncName);
console.log("Test eval:", global[decryptFuncName] || eval(decryptFuncName)(0x183));

