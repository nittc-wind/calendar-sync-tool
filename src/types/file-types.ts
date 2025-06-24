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
    date: number | string;    // Excelシリアル値 or 文字列
    day: string;              // 曜日
    availableFlag: string;    // 利用可能フラグ
    activityFlag: string;     // 活動フラグ
    time: string;            // 時間
    teacher?: string;        // 先生
    location?: string;       // 場所
    detail?: string;         // 詳細
    remark?: string;         // 備考
}
  