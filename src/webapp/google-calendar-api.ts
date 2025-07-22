/**
 * Googleカレンダー一覧を返す（実データ版）
 * @return {Array<Object>} カレンダー情報の配列
 */
export function getGoogleCalendars() {
  const calendars = CalendarApp.getAllCalendars();
  return calendars.map(cal => ({
    id: cal.getId(),
    summary: cal.getName(),
    description: cal.getDescription(),
    backgroundColor: '#9a9cff', // CalendarAppでは色は取得できないためダミー
  }));
}
