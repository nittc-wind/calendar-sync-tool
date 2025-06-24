/**
 * GAS用フロントエンドファイルリネームスクリプト
 * .css → .css.html, .js → .js.html に変換
 */

const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, '..', 'dist');

console.log('フロントエンドファイルをGAS形式にリネーム中...');

try {
  // style.css → style.css.html
  const cssFile = path.join(distDir, 'style.css');
  const cssHtmlFile = path.join(distDir, 'style.css.html');
  
  if (fs.existsSync(cssFile)) {
    fs.renameSync(cssFile, cssHtmlFile);
    console.log('✓ style.css → style.css.html');
  }

  // script.js → script.js.html
  const jsFile = path.join(distDir, 'script.js');
  const jsHtmlFile = path.join(distDir, 'script.js.html');
  
  if (fs.existsSync(jsFile)) {
    fs.renameSync(jsFile, jsHtmlFile);
    console.log('✓ script.js → script.js.html');
  }

  console.log('✅ フロントエンドファイルのリネーム完了');

} catch (error) {
  console.error('❌ リネーム処理でエラーが発生:', error.message);
  process.exit(1);
}