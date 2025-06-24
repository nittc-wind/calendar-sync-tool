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