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
 * API共通レスポンス型
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  errorCode?: string;
  timestamp: string;
}

/**
 * 処理進行状況
 */
export interface ProcessProgress {
  stage: 'parsing' | 'creating' | 'logging' | 'completed';
  message: string;
  timestamp: string;
  percentage: number;
}

/**
 * 処理結果
 */
export interface ProcessResult {
  date: string;
  status: 'success' | 'failed';
  eventId?: string;
  error?: string;
}
