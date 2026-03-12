const fs = require('fs');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const t = require('@babel/types');
const generator = require('@babel/generator').default;

const code = fs.readFileSync('dist/source-v2.js', 'utf8');
const ast = parser.parse(code);

let wrapperDictName = null;
let loaderFuncName = null;
let moduleCount = 0;

traverse(ast, {
    VariableDeclarator(path) {
        if (t.isIdentifier(path.node.id) && t.isObjectExpression(path.node.init)) {
            // Webpack module objects usually have properties whose values are function expressions 
            // taking 3 arguments: module, exports, require (often obfuscated names)
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
                moduleCount = funcs;
                console.log(`Found Webpack modules object: ${wrapperDictName} with ${moduleCount} modules.`);
            }
        }
    },
    FunctionDeclaration(path) {
        if (path.node.params.length === 1 && path.node.id) {
            let funcCode = generator(path.node).code;
            // The loader usually references the module cache and the modules object
            if (wrapperDictName && funcCode.includes(wrapperDictName) && funcCode.includes('exports')) {
                loaderFuncName = path.node.id.name;
                console.log(`Found Webpack loader function: ${loaderFuncName}`);
            }
        }
    }
});

// Now let's try to extract these modules to separate files
if (wrapperDictName) {
    if (!fs.existsSync('dist/unpacked')) {
        fs.mkdirSync('dist/unpacked');
    }
    traverse(ast, {
        VariableDeclarator(path) {
            if (t.isIdentifier(path.node.id) && path.node.id.name === wrapperDictName && t.isObjectExpression(path.node.init)) {
                for (let prop of path.node.init.properties) {
                    if (t.isObjectProperty(prop)) {
                        let modName = prop.key.name || prop.key.value;
                        if (modName) {
                            let modCode = generator(prop.value).code;
                            fs.writeFileSync(`dist/unpacked/module_${modName}.js`, modCode);
                        }
                    }
                }
            }
        }
    });
    console.log(`Unpacked modules to dist/unpacked/`);
}
