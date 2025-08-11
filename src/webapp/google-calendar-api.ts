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
 * items は JSON で受け取った配列を想定
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

    for (const it of items) {
      try {
        const resource = convertToCalendarEventResource(it);

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
          // it.date は 'YYYY-MM-DD' も来る想定のため安全に処理
          let d: Date;
          if (typeof it.date === 'number') {
            d = new Date(it.date * 1000);
          } else if (typeof it.date === 'string') {
            const parts = it.date.split('-');
            if (parts.length === 3) {
              const y = parseInt(parts[0], 10);
              const m = parseInt(parts[1], 10) - 1;
              const day = parseInt(parts[2], 10);
              d = new Date(Date.UTC(y, m, day));
            } else {
              d = new Date(NaN);
            }
          } else {
            d = new Date(NaN);
          }
          event = cal.createAllDayEvent(resource.summary || '', d, {
            description: resource.description,
            location: resource.location,
          });
        }

        const dateStr = ((): string => {
          if (typeof it.date === 'number')
            return new Date(it.date * 1000).toISOString().slice(0, 10);
          if (typeof it.date === 'string') return it.date;
          return '';
        })();

        created.push({
          date: dateStr,
          title: resource.summary || '',
          eventId: event?.getId(),
          status: 'success',
        });
      } catch (e) {
        const dateStr = ((): string => {
          if (typeof it?.date === 'number')
            return new Date(it.date * 1000).toISOString().slice(0, 10);
          if (typeof it?.date === 'string') return it.date;
          return '';
        })();

        created.push({
          date: dateStr,
          title: it?.summary || '部活',
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
