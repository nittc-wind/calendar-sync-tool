/**
 * カレンダーイベント
 */
export interface CalendarEvent {
    date: string;          // yyyy-mm-dd
    startTime: string;     // HH:mm
    endTime: string;       // HH:mm
    title: string;
    location?: string;
    description?: string;
    teacher?: string;
}
  
/**
* ユーザーカレンダー情報
*/
export interface UserCalendar {
    id: string;
    name: string;
    description?: string;
    primary?: boolean;
}
  