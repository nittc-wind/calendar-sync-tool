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
document.addEventListener('DOMContentLoaded',function(){
    const convertBtn = document.getElementById("convertBtn");
    convertBtn.onclick = function() {
        const sheetId = document.getElementById('sheetIdInput').value.trim();
        const loading = document.getElementById('loading');
        const errorDiv = document.getElementById('error');
        const resultArea = document.getElementById('jsonResult');
        const tableDiv = document.getElementById('jsonTable')
        errorDiv.innerText = '';
        resultArea.value = '';
        tableDiv.innerHTML='';

        if (!sheetId) {
            errorDiv.innerText = 'スプレッドシートIDを入力してください。';
            return;
        }

        loading.style.display = 'block';
        google.script.run
            .withSuccessHandler(function(res) {
                loading.style.display = 'none';
                if (res.success) {
                    resultArea.value = res.data;
                    tableDiv.innerHTML = jsonToTable(res.data);
                } else {
                    errorDiv.innerText = res.error || '変換に失敗しました。';
                }
            })
            .withFailureHandler(function(err) {
                loading.style.display = 'none';
                errorDiv.innerText = 'エラー: ' + (err.message || err);
            })
            .convertSpreadsheetToJsonForFrontend(sheetId, {});
        };
    }
);

function jsonToTable(json){
    const columns = ["日付","曜日","活動可","活動あり","時間","顧問教員","場所","教室","詳細"]
    let data;

    try{
        data = typeof json === "string" ? JSON.parse(json):json;
    }catch(e){
        return "<div style='color:red;'>jsonのパースに失敗</div>";
    }
    if (!Array.isArray(data)||data.length === 0){
            return "<div style='color:red'>データがありません</div>";
    }

    let html  = "<table class='Table'>";
    html += "<tr>";
    columns.forEach(col => {
        html += `<th>${col}</th>`;
    });
    html +="</tr>";

    data.forEach(row => {
        html += "<tr>";
        columns.forEach((col, i) => {
            let val = row.data_row[i];
            if (col === "日付" && typeof val === "number") {
                //const elapsedmillis = val / 10_000;
                //const epoch = new date("1601-01-01t09:00:00+09:00"); // jstの9:00指定
                const jsdate = new Date(val/100000);
                val = formatDateJST(jsdate)
            }
            html += `<td>${val !== undefined ? escapeHtml(String(val)):""}</td>`;
        });
        html += "</tr>";
    });

    html += "</table>";
    return html;
}

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

//日付変換
function formatDateJST(date) {
    const jst = new Date(date.getTime() + 9 * 60 * 60 * 1000);
    const yyyy = jst.getUTCFullYear();
    const mm = String(jst.getUTCMonth() + 1).padStart(2, '0');
    const dd = String(jst.getUTCDate()).padStart(2, '0');
    return `${yyyy}${mm}${dd}`;
}