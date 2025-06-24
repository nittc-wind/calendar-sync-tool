# 部活予定表カレンダー連携システム

Excel/xlsxファイルの部活予定表をGoogleカレンダーに自動連携するWebアプリケーションです。

## 🚀 プロジェクト概要

- **技術スタック**: Google Apps Script + HTML/CSS/JavaScript
- **主要機能**: Excel解析、カレンダー連携、進捗管理、ログ記録
- **開発手法**: アジャイル開発（1週間スプリント）
- **開発期間**: 2025年6月〜9月

## 🛠 開発環境セットアップ

### 前提条件

- Node.js (v16以上)
- Git
- Googleアカウント（部活用推奨）

### 1. リポジトリのクローン

```bash
git clone https://github.com/nittc-wind/calendar-sync-tool.git
cd calendar-sync-tool
```

### 2. 依存関係のインストール

```bash
npm install
```

### 3. clasp（Google Apps Script CLI）のセットアップ

```bash
# clasp をグローバルインストール
npm install -g @google/clasp

# Google アカウントでログイン
clasp login
```

### 4. GASプロジェクトとの連携設定

**重要**: スクリプトIDは関係者から直接取得してください

#### 開発環境用設定ファイル作成
`.clasp-dev.json` を作成：
```json
{
  "scriptId": "【開発用スクリプトID】",
  "rootDir": "./src"
}
```

#### 本番環境用設定ファイル作成
`.clasp-prod.json` を作成：
```json
{
  "scriptId": "【本番用スクリプトID】",
  "rootDir": "./src"
}
```

#### デフォルト設定ファイル作成
`.clasp.json` を作成（開発環境と同じ内容）：
```json
{
  "scriptId": "【開発用スクリプトID】",
  "rootDir": "./src"
}
```

### 5. 初回デプロイ・動作確認

```bash
# 開発環境にソースコードをアップロード
npm run dev
```
