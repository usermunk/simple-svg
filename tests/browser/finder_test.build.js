/**
 * Build test
 */
"use strict";

const fs = require('fs');

module.exports = (Helper, codeDir, testFile, TestHelper) => {
    let code = fs.readFileSync(testFile, 'utf8'),
        modules = [
            fs.readFileSync(codeDir + '/browser/defaults.js', 'utf8'),
            fs.readFileSync(codeDir + '/browser/config.js', 'utf8'),
            fs.readFileSync(codeDir + '/browser/image.js', 'utf8'),
            fs.readFileSync(codeDir + '/browser/finder.js', 'utf8')
                .replace('SimpleSVG.scanDOM();', '')
        ];

    // Replace code
    modules = modules.join('');

    // Merge modules and test
    code = code.replace('/* Modules() */', modules);

    return code;
};
