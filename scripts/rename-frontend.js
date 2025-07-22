/**
 * GAS用フロントエンドファイル変換スクリプト
 * .css → <style>タグで囲んで .css.html に変換
 * .js → <script>タグで囲んで .js.html に変換
 */

const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, '..', 'dist');

console.log('🔨 フロントエンドファイルをGAS形式に変換中...');

try {
  // 共通CSSファイルの変換
  convertCssToGasFormat('style.css');

  // 共通JSファイルの変換
  convertJsToGasFormat('script.js');

  // その他のCSSファイル変換（存在する場合）
  convertCssToGasFormat('upload.css');
  convertCssToGasFormat('preview.css');
  convertCssToGasFormat('calendar.css');
  convertCssToGasFormat('result.css');

  // その他のJSファイル変換（存在する場合）
  convertJsToGasFormat('upload.js');
  convertJsToGasFormat('preview.js');
  convertJsToGasFormat('calendar.js');
  convertJsToGasFormat('result.js');

  console.log('✅ フロントエンドファイルの変換完了');
} catch (error) {
  console.error('❌ 変換処理でエラーが発生:', error.message);
  throw error;
}

/**
 * CSSファイルを<style>タグで囲んでGAS形式に変換
 */
function convertCssToGasFormat(filename) {
  const cssFile = path.join(distDir, filename);
  const cssHtmlFile = path.join(distDir, filename + '.html');

  if (fs.existsSync(cssFile)) {
    try {
      // CSSファイルの内容を読み込み
      const cssContent = fs.readFileSync(cssFile, 'utf8');

      // <style>タグで囲む
      const htmlContent = `<style>
/* === ${filename} === */
${cssContent}
/* === /${filename} === */
</style>`;

      // .html形式で保存
      fs.writeFileSync(cssHtmlFile, htmlContent, 'utf8');

      // 元のCSSファイルを削除
      fs.unlinkSync(cssFile);

      console.log(`✓ CSS変換: ${filename} → ${filename}.html`);
    } catch (error) {
      console.error(`❌ CSS変換エラー (${filename}):`, error.message);
    }
  }
}

/**
 * JSファイルを<script>タグで囲んでGAS形式に変換
 */
function convertJsToGasFormat(filename) {
  const jsFile = path.join(distDir, filename);
  const jsHtmlFile = path.join(distDir, filename + '.html');

  if (fs.existsSync(jsFile)) {
    try {
      // JSファイルの内容を読み込み
      const jsContent = fs.readFileSync(jsFile, 'utf8');

      // <script>タグで囲む
      const htmlContent = `<script>
/* === ${filename} === */
${jsContent}
/* === /${filename} === */
</script>`;

      // .html形式で保存
      fs.writeFileSync(jsHtmlFile, htmlContent, 'utf8');

      // 元のJSファイルを削除
      fs.unlinkSync(jsFile);

      console.log(`✓ JS変換: ${filename} → ${filename}.html`);
    } catch (error) {
      console.error(`❌ JS変換エラー (${filename}):`, error.message);
    }
  }
}
