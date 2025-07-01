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
 * システム定数
 */
export const CONSTANTS = {
  // ファイル制約
  MAX_FILE_SIZE: 1024 * 1024, // 1MB
  ALLOWED_EXTENSIONS: ['xlsx', 'xlsm'],

  // 処理制約
  MAX_PROCESSING_TIME: 5.5 * 60 * 1000, // 5.5分 (ms)
  MAX_EVENTS: 50,

  // Excel設定
  DATA_START_ROW: 7,
  DATA_END_ROW: 37,
  DATA_RANGE: 'A7:I37',

  // エラーコード
  ERROR_CODES: {
    FILE_SIZE_EXCEEDED: 'FILE_SIZE_EXCEEDED',
    FILE_FORMAT_INVALID: 'FILE_FORMAT_INVALID',
    PARSE_NO_DATA: 'PARSE_NO_DATA',
    TIMEOUT_ERROR: 'TIMEOUT_ERROR',
    CALENDAR_API_ERROR: 'CALENDAR_API_ERROR',
    UNKNOWN_ERROR: 'UNKNOWN_ERROR',
  } as const,

  // エラーメッセージ
  ERROR_MESSAGES: {
    FILE_SIZE_EXCEEDED: 'ファイルサイズが1MBを超えています',
    FILE_FORMAT_INVALID: '対応していないファイル形式です（.xlsx, .xlsmのみ）',
    PARSE_NO_DATA: '有効なデータが見つかりません',
    TIMEOUT_ERROR: '処理時間が制限を超えました（6分）',
    CALENDAR_API_ERROR: 'カレンダーAPIでエラーが発生しました',
    UNKNOWN_ERROR: '予期しないエラーが発生しました',
  } as const,
} as const;
