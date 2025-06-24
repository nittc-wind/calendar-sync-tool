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