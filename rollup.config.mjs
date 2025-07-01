/**
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import typescript from 'rollup-plugin-typescript2';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const pkg = require('./package.json');

export default {
  input: 'src/main.ts',
  output: {
    file: 'dist/コード.js',
    format: 'esm',
  },
  plugins: [
    typescript({
      typescript: require('typescript'),
      tsconfig: 'tsconfig.json',
      tsconfigOverride: {
        compilerOptions: {
          target: 'ES2019',    // GAS V8 対応
          module: 'ES2015',    // Rollup用
          declaration: false,  // .d.ts不要
          strict: false        // 最初は緩く
        }
      }
    })
  ],
  // GAS環境用の設定
  treeshake: false,  // 関数が削除されないように
  external: []
};