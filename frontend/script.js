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

//ログイン完了時、ログインページで名前とメールを表示
function ShowUserInfo(user){
    document.getElementById('login-user-name').textContent = user.name;
    document.getElementById('login-user-email').textContent = user.mail;
    document.getElementById('logoutButton').style.display = 'inline-block';
}
google.script.run
  .withSuccessHandler(ShowUserInfo)
  .getLoginUser();