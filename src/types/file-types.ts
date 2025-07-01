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
 * アップロードファイル情報
 */
export interface UploadFileInfo {
  name: string;
  size: number;
  type: string;
  lastModified: number;
}

/**
 * Excel行データ
 */
export interface ExcelRowData {
  date: number | string; // Excelシリアル値 or 文字列
  day: string; // 曜日
  availableFlag: string; // 利用可能フラグ
  activityFlag: string; // 活動フラグ
  time: string; // 時間
  teacher?: string; // 先生
  location?: string; // 場所
  detail?: string; // 詳細
  remark?: string; // 備考
}
