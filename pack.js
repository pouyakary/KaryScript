module.exports = {
    target: 'node',
    entry: "./bin/compiler.js",
    output: {
        path: __dirname + "/bin",
        filename: "kc.js"
    }
};