/*********************************************************************************

MIT License

Copyright (c) 2016 - Miguel Ángel Pérez Martínez

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

*********************************************************************************/
"use strict";
const NConf = require("nconf");
const FileSystem = require("fs");
class Config {
    static tryLoadEnvFromFile(filename) {
        try {
            let envLines = FileSystem.readFileSync(filename, "ascii").replace(/(\r\n|\n|\r)/g, "\n").split("\n");
            for (let envLine of envLines) {
                let eqPos = envLine.indexOf("=");
                if (eqPos > 0) {
                    process.env[envLine.slice(0, eqPos)] = envLine.slice(eqPos + 1);
                }
            }
            return true;
        }
        catch (err) {
            return false;
        }
    }
    static tryLoadEnvAtRootOrParent(filename) {
        if (!this.tryLoadEnvFromFile(`./${filename}`)) {
            this.tryLoadEnvFromFile(`../${filename}`);
        }
    }
    static initConfig() {
        this.tryLoadEnvAtRootOrParent("config.env");
        this.tryLoadEnvAtRootOrParent("config.local.env");
        this.tryLoadEnvAtRootOrParent("config.test.env");
        this.tryLoadEnvAtRootOrParent("config.latest.env");
        this.tryLoadEnvAtRootOrParent("config.stable.env");
        this.config = NConf.argv()
            .env()
            .file("default", "./config.json");
    }
    static get(key) {
        return Config.getAs(key);
    }
    static getAs(key) {
        if (Config.config == undefined) {
            Config.initConfig();
        }
        let retVal = Config.config.get(key);
        if (retVal == undefined) {
            console.log(`Warning: Request for key ${key} is undefined.`);
        }
        return retVal;
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Config;
//# sourceMappingURL=index.js.map