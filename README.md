<!--
Copyright 2023 Google LLC

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
-->
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
  "rootDir": "./dist"
}
```

#### 本番環境用設定ファイル作成
`.clasp-prod.json` を作成：
```json
{
  "scriptId": "【本番用スクリプトID】",
  "rootDir": "./dist"
}
```

#### デフォルト設定ファイル作成
`.clasp.json` を作成（開発環境と同じ内容）：
```json
{
  "scriptId": "【開発用スクリプトID】",
  "rootDir": "./dist"
}
```

### 5. 初回デプロイ・動作確認

```bash
# 開発環境にソースコードをアップロード
npm run dev
```
