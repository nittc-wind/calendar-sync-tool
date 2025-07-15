/**
 * Googleカレンダー一覧を返す（ダミー）
 * @return {Array<Object>} カレンダー情報の配列
 */
export function getGoogleCalendars() {
  return [
    {
      id: "primary",
      summary: "自分のカレンダー",
      description: "メインのカレンダー",
      backgroundColor: "#9a9cff"
    },
    {
      id: "abcdef123456@group.calendar.google.com",
      summary: "会社の予定",
      description: "",
      backgroundColor: "#ff7537"
    }
  ];
} 