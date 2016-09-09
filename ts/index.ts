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

import * as NConf from "nconf";
import * as FileSystem from "fs";

export default class Config {

    private static config: NConf.Provider;

    static tryLoadEnvFromFile(filename: string): boolean {
        try {
            let envLines = FileSystem.readFileSync(filename, "ascii").replace(/(\r\n|\n|\r)/g, "\n").split("\n");

            for (let envLine of envLines) {
                let eqPos = envLine.indexOf("=");
                if (eqPos > 0) {
                    process.env[envLine.slice(0, eqPos)] = envLine.slice(eqPos + 1);
                }
            }
            return true;
        } catch (err) {
            return false;
        }
    }

    static initConfig(): void {

        if (!Config.tryLoadEnvFromFile("./config.env")) {
            Config.tryLoadEnvFromFile("../config.env");
        }


        Config.config = NConf.argv()
            .env()
            .file("default", "./config.json");
    }

    static get(key: string): string {
        return Config.getAs<string>(key);
    }

    static getAs<T>(key: string): T {

        if (Config.config == undefined) {
            Config.initConfig();
        }

        let retVal = Config.config.get(key);
        if (retVal == undefined) {
            console.log(`Warning: Request for key ${key} is undefined.`);
        }
        return retVal as T;
    }
}
