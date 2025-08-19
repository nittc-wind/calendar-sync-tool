import { convertToCalendarEventResource } from '../converters/json-to-calendar-event.js';
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

/**
 * 指定カレンダーにイベントを作成
 * items は既に convertArrayToCalendarEventResources で変換済みの配列を想定
 */
export function createEventsOnCalendar(calendarId: string, itemsJson: string) {
  try {
    const parsed = JSON.parse(itemsJson);
    const items: any[] = Array.isArray(parsed) ? parsed : [parsed];
    const cal = CalendarApp.getCalendarById(calendarId);
    if (!cal) {
      return {
        success: false,
        error: '指定カレンダーが見つかりません',
        timestamp: new Date().toISOString(),
      };
    }

    const created: {
      date: string;
      title: string;
      eventId?: string;
      status: 'success' | 'failed';
      error?: string;
    }[] = [];

    for (const resource of items) {
      try {
        // 既に変換済みのデータなので、直接使用
        console.log('イベント作成開始:', resource);

        // CalendarApp は ISO8601を直接は受け取らないため、Date に変換
        const start = resource.start.dateTime
          ? new Date(resource.start.dateTime)
          : null;
        const end = resource.end.dateTime
          ? new Date(resource.end.dateTime)
          : null;

        let event: GoogleAppsScript.Calendar.CalendarEvent | null = null;
        if (start && end) {
          event = cal.createEvent(resource.summary || '', start, end, {
            description: resource.description,
            location: resource.location,
          });
        } else {
          // 終日扱い（開始・終了同一日）
          // 日付文字列からDateを作成
          let d: Date;
          if (resource.start.dateTime) {
            d = new Date(resource.start.dateTime);
          } else {
            // デフォルト日付（今日）
            d = new Date();
          }
          event = cal.createAllDayEvent(resource.summary || '', d, {
            description: resource.description,
            location: resource.location,
          });
        }

        // 日付文字列を取得（ISO文字列から日付部分のみ抽出）
        const dateStr = ((): string => {
          if (resource.start.dateTime) {
            return new Date(resource.start.dateTime).toISOString().slice(0, 10);
          }
          return new Date().toISOString().slice(0, 10);
        })();

        created.push({
          date: dateStr,
          title: resource.summary || '',
          eventId: event?.getId(),
          status: 'success',
        });
      } catch (e) {
        const dateStr = ((): string => {
          if (resource.start?.dateTime) {
            return new Date(resource.start.dateTime).toISOString().slice(0, 10);
          }
          return '';
        })();

        created.push({
          date: dateStr,
          title: resource.summary || '',
          status: 'failed',
          error: e instanceof Error ? e.message : String(e),
        });
      }
    }

    return {
      success: true,
      data: created,
      timestamp: new Date().toISOString(),
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : String(err),
      timestamp: new Date().toISOString(),
    };
  }
}
