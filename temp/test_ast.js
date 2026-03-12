const fs = require('fs');
const parser = require('@babel/parser');
const generator = require('@babel/generator').default;
const code = fs.readFileSync('source/v2/app.js', 'utf8');
const ast = parser.parse(code);
const node4 = ast.program.body[4];
console.log(node4.type);
if (node4.expression.type === 'SequenceExpression') {
    node4.expression.expressions.forEach((expr, i) => {
        console.log(`Seq[${i}]: ${expr.type}`);
        if (expr.type === 'CallExpression') {
            console.log(`  callee: ${generator(expr.callee).code.substring(0, 100)}`);
        }
    });
}
