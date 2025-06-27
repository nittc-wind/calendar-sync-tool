# 部活予定表カレンダー連携システム - CSS画面遷移版

## 🎯 プロジェクト概要

Google Apps Script (GAS) + HTML/CSS/JavaScript を使用して、Excelの月間予定表をGoogleカレンダーに自動連携するWebアプリケーションです。

## 🏗️ CSS画面遷移システム

このシステムでは、**単一HTMLファイル内でのCSSによる画面切り替え**を採用しています。

### システムの特徴
- ✅ ページリロードなしの高速画面遷移
- ✅ ブラウザの戻る/進むボタン対応
- ✅ 統一されたUI/UX
- ✅ 開発・メンテナンスの容易さ

## 📁 ディレクトリ構成

```
frontend/
├── index.html           # メインHTML（全画面を包含）
├── script.js           # JavaScript制御ロジック
├── style.css           # 統一スタイルシート
├── components/         # 共通コンポーネント
│   ├── header.html     # ヘッダー
│   ├── navigation.html # ステップナビゲーション
│   └── footer.html     # フッター（デバッグリンク付き）
└── pages/              # 各画面HTML
    ├── login.html      # 🔐 Googleログイン画面
    ├── upload.html     # 📁 ファイルアップロード画面
    ├── processing.html # ⚙️ 処理中画面
    ├── preview.html    # 👀 データプレビュー画面
    ├── sync.html       # 📅 カレンダー同期画面
    ├── result.html     # ✅ 処理結果画面
    └── error.html      # ❌ エラー画面
```

## 🚀 開発環境セットアップ

### 1. 前提条件
- Google Chrome ブラウザ
- Google Apps Script プロジェクト
- テキストエディタ（VS Code推奨）

### 2. 開発用サーバー起動
```bash
# ローカルサーバーを起動（開発時）
python -m http.server 8000
# または
npx live-server frontend/
```

### 3. 開発用デバッグ
- フッターのデバッグリンクで画面確認
- ブラウザのコンソールでJavaScript確認

## 🛠️ 開発ガイド

### 画面遷移の仕組み

1. **HTML構造**
```html
<div class="page-container" id="画面名">
  <!-- 画面コンテンツ -->
</div>
```

2. **CSS制御**
```css
.page-container:not(.isActive) {
    display: none;
}
```

3. **JavaScript制御**
```javascript
switchPage('画面名'); // 画面切り替え
```

### 後輩の開発範囲

#### Phase 1: 基本画面実装 🎯
- [ ] **login.html** - ログイン状態表示の実装
- [ ] **upload.html** - ファイル選択UIの実装
- [ ] **preview.html** - データテーブル表示の実装

#### Phase 2: 詳細機能 🚀
- [ ] **processing.html** - ローディング・プログレスバー
- [ ] **sync.html** - カレンダー選択・確認画面
- [ ] **result.html** - 結果表示・ログ表示

#### Phase 3: エラーハンドリング 🛡️
- [ ] **error.html** - エラー表示・サポート情報

### よく使う関数

```javascript
// 画面遷移
switchPage('upload');
navigateToPage('preview', true);

// 現在の画面確認
getCurrentPage();

// 利用可能な画面一覧
getAvailablePages();
```

### CSSクラス一覧

#### レイアウト
- `.page-container` - ページ全体のコンテナ
- `.page-header` - ページタイトル部分
- `.page-content` - メインコンテンツ
- `.content-section` - 白い背景のセクション
- `.page-actions` - ボタン配置エリア

#### ボタン
- `.btn .btn-primary` - メインボタン（青）
- `.btn .btn-secondary` - サブボタン（グレー）
- `.btn-outline` - アウトラインボタン

#### 状態表示
- `.summary-info` - サマリー情報グリッド
- `.summary-item` - サマリー項目
- `.result-card` - 結果カード表示

## 🎨 デザインガイド

### カラーパレット
- **Primary**: #007bff（青）
- **Success**: #28a745（緑）
- **Warning**: #ffc107（黄）
- **Danger**: #dc3545（赤）
- **Secondary**: #6c757d（グレー）

### フォント
- **基本**: 'Helvetica Neue', Arial, sans-serif
- **コード**: 'Monaco', 'Menlo', monospace

### アイコン
- 📁 ファイル / 🔐 ログイン / ⚙️ 処理中
- 👀 プレビュー / 📅 カレンダー / ✅ 完了
- ❌ エラー / ⚠️ 警告 / 💡 情報

## 🧪 テスト方法

### 1. 画面遷移テスト
```javascript
// ブラウザコンソールで実行
switchPage('login');
switchPage('upload');
switchPage('preview');
```

### 2. デバッグリンクの使用
フッターの「デバッグ用」リンクをクリックして各画面を確認

### 3. レスポンシブテスト
ブラウザの開発者ツールでモバイル表示をテスト

## 📝 開発メモ

### 重要なポイント
1. **ページIDを正確に設定** - HTMLのid属性とJavaScriptの引数を一致
2. **既存の構造を維持** - `.page-container` クラスは必須
3. **CSSクラスを活用** - 新しいスタイルよりも既存クラスを使用
4. **小さな変更でテスト** - 一度に大きく変更しない

### トラブルシューティング

#### 画面が表示されない
```javascript
// 確認方法
console.log('現在の画面:', getCurrentPage());
console.log('利用可能な画面:', getAvailablePages());
```

#### スタイルが適用されない
1. CSSクラス名のスペルチェック
2. 既存のCSSクラスが利用できないか確認
3. ブラウザの開発者ツールでCSS確認

#### JavaScriptエラー
1. ブラウザのコンソールでエラー確認
2. 関数名のスペルチェック
3. 要素のIDが正しく設定されているか確認

## 🤝 協力体制

### 上級者の担当
- GAS実装
- 複雑なJavaScript処理
- API連携
- アーキテクチャ設計

### 後輩の担当
- HTML/CSS実装
- 基本的なDOM操作
- UI/UXの改善
- テスト・デバッグ

### 連携方法
1. **GitHub Issues** でタスク管理
2. **Pull Request** でコードレビュー
3. **週次MTG** で進捗共有

## 📚 参考資料

### 学習リソース
- [HTML/CSS基礎](https://developer.mozilla.org/ja/docs/Web/HTML)
- [JavaScript DOM操作](https://developer.mozilla.org/ja/docs/Web/API/Document_Object_Model)
- [CSS Grid/Flexbox](https://css-tricks.com/snippets/css/complete-guide-grid/)

### プロジェクト資料
- [要件定義書](../docs/requirements.md)
- [設計書](../docs/design.md)
- [スプリント計画](../docs/sprint-plans/)

## 💪 頑張って実装しよう！

分からないことがあれば、いつでも相談してください。
一緒に素晴らしいシステムを作り上げましょう！

---

**最終更新**: 2025年6月27日  
**作成者**: 上級者（21歳）  
**対象**: 後輩（18歳）