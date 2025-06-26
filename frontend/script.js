/**
 * 共通JavaScript関数
 */

// アプリケーション初期化
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 ページ初期化:', window.APP_DATA.pageType);
    
    // 共通の初期化処理
    initializeCommonFeatures();
});

/**
 * 共通機能の初期化
 */
function initializeCommonFeatures() {
    // ユーザー情報の表示更新
    updateUserDisplay();
    
    // エラーハンドリングの設定
    setupErrorHandling();
    
    // 共通イベントリスナーの設定
    setupCommonEventListeners();
}

/**
 * ユーザー情報表示の更新
 */
function updateUserDisplay() {
    console.log('👤 ユーザー情報更新開始');
    
    const user = window.APP_DATA.currentUser;
    console.log('取得したユーザー情報:', user);
    
    const userNameElement = document.getElementById('user-name');
    const userEmailElement = document.getElementById('user-email');
    
    console.log('DOM要素:', { userNameElement, userEmailElement });
    
    if (userNameElement) {
        if (user && user.name) {
            userNameElement.textContent = user.name;
            console.log('ユーザー名を設定:', user.name);
        } else {
            userNameElement.textContent = 'ゲスト';
            console.log('ユーザー名が見つからないため、ゲストを設定');
        }
    } else {
        console.warn('ユーザー名要素が見つかりません');
    }
    
    if (userEmailElement) {
        if (user && user.email) {
            userEmailElement.textContent = user.email;
            console.log('ユーザーメールを設定:', user.email);
        } else {
            userEmailElement.textContent = '';
            console.log('ユーザーメールが見つからないため、空文字を設定');
        }
    } else {
        console.warn('ユーザーメール要素が見つかりません');
    }
    
    console.log('👤 ユーザー情報更新完了');
}

/**
 * エラーハンドリングの設定
 */
function setupErrorHandling() {
    window.onerror = function(msg, url, lineNo, columnNo, error) {
        console.error('JavaScript エラー:', { msg, url, lineNo, columnNo, error });
        showErrorMessage('予期しないエラーが発生しました。');
        return false;
    };
}

/**
 * 共通イベントリスナーの設定
 */
function setupCommonEventListeners() {
    // フッターのリンクボタン
    window.goToUpload = function() {
        navigateToPage('upload');
    };
    
    window.refreshPage = function() {
        window.location.reload();
    };
}

/**
 * ページ遷移関数
 */
function navigateToPage(pageType, data = {}) {
    console.log('ページ遷移:', pageType);
    
    const functionMap = {
        'upload': 'showUploadPage',
        'preview': 'showPreviewPage', 
        'calendar': 'showCalendarPage',
        'result': 'showResultPage'
    };
    
    const gasFunction = functionMap[pageType];
    
    if (!gasFunction) {
        console.error('不正なページタイプ:', pageType);
        return;
    }
    
    // ローディング表示
    showLoading('ページを読み込み中...');
    
    google.script.run
        .withSuccessHandler(function(htmlOutput) {
            // 新しいHTMLで画面を置き換え
            document.open();
            document.write(htmlOutput.getContent());
            document.close();
        })
        .withFailureHandler(function(error) {
            hideLoading();
            showErrorMessage('ページの読み込みに失敗しました: ' + error);
        })[gasFunction](data);
}

/**
 * ローディング表示
 */
function showLoading(message = '読み込み中...') {
    // 簡単なローディング表示の実装
    const loading = document.createElement('div');
    loading.id = 'app-loading';
    loading.innerHTML = `
        <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
                    background: rgba(0,0,0,0.5); display: flex; align-items: center; 
                    justify-content: center; z-index: 9999;">
            <div style="background: white; padding: 2rem; border-radius: 8px; text-align: center;">
                <div>🔄</div>
                <p>${message}</p>
            </div>
        </div>
    `;
    document.body.appendChild(loading);
}

/**
 * ローディング非表示
 */
function hideLoading() {
    const loading = document.getElementById('app-loading');
    if (loading) {
        loading.remove();
    }
}

/**
 * エラーメッセージ表示
 */
function showErrorMessage(message) {
    alert('エラー: ' + message); // 簡易実装、後で改善
}

/**
 * 成功メッセージ表示
 */
function showSuccessMessage(message) {
    console.log('成功:', message);
    // 後で実装
}