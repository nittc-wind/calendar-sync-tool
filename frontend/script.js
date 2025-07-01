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
/**
 * 共通JavaScript関数
 */
// 各ページを配列に格納
const pages = Array.from(document.querySelectorAll('.page-container'));

// ページ切り替え処理
function switchPage(pageName) {   
    // ページ未指定の場合はuploadを、ページが存在しない場合はerrorを表示
    if (!pageName) {
        pageName = 'upload';
    }
    const page = pages.find(page => page.id === pageName);
    if (!page) {
        page = pages.find(page => page.id === 'error');
    }
    // 表示対象ページのみisActiveをtrueにする
    for (const page of pages) {
        page.id === pageName
            ? page.classList.add('isActive')
            : page.classList.remove('isActive');
    }
}

// ウェブアプリアクセス時の処理
google.script.url.getLocation(location => {
    switchPage(location.hash);
});

//ブラウザバック・フォワード時の処理
google.script.history.setChangeHandler(e => {
    switchPage(e.location.hash);
})

// aタグクリック時の処理（ページ切り替え・履歴追加）
Array.from(document.getElementsByClassName("link-btn")).forEach(el => {
    el.addEventListener("click", e => {
      e.preventDefault();                                       // aタグのページ遷移動作を無効化
      const pageName = e.target.getAttribute("href");           // aタグのhref属性を取得
      switchPage(pageName);                                     // ページを切り替える
      google.script.history.push(null, { page: pageName } );    // URLパラメーターをブラウザの履歴にプッシュ
    });
  });