/**
 * JSONオブジェクトをGoogle Calendar APIのイベントリソース相当に変換
 * Advanced Calendar Service 相当のEventリソースを返すが、CalendarAppでも利用できるように
 * start/end の ISO8601 を中心に構成する
 */

export interface RawScheduleItem {
  date: number | string; // UNIX秒（JST基準）または 'YYYY-MM-DD'
  time?: string; // "HH:mm～HH:mm" 形式 or 未入力/不正
  location?: string;
  detail?: string; // 活動可能場所 等
  remark?: string; // 備考
  summary?: string; // タイトル（なければ既定値）
  data_row?: (number | string)[]; // データベースからの行データ
}

export interface CalendarEventResource {
  summary: string | null;
  location: string;
  description: string;
  start: { dateTime: string | null; timeZone: string };
  end: { dateTime: string | null; timeZone: string };
  colorId?: number;
}

const DEFAULT_TIME_ZONE = 'Asia/Tokyo';

// "HH:mm～HH:mm" を [startH, startM, endH, endM] に変換
function parseTimeHM(
  stringTime?: string
): [number, number, number, number] | null {
  if (!stringTime) return null;
  const sep = stringTime.includes('～')
    ? '～'
    : stringTime.includes('〜')
      ? '〜'
      : stringTime.includes('~')
        ? '~'
        : stringTime.includes('-')
          ? '-'
          : '～';
  const [start, end] = stringTime.split(sep).map(s => s.trim());
  if (!start || !end) return null;
  const [sh, sm] = start.split(':').map(v => parseInt(v, 10));
  const [eh, em] = end.split(':').map(v => parseInt(v, 10));
  if ([sh, sm, eh, em].some(v => Number.isNaN(v))) return null;
  return [sh, sm, eh, em];
}

// date が number(UNIX秒) か 'YYYY-MM-DD' を吸収して JST の (y,m,d) を返す
function extractYMDinJst(
  date: number | string
): { y: number; m: number; d: number } | null {
  if (typeof date === 'number' && Number.isFinite(date)) {
    const dt = new Date(date * 1000); // GASのタイムゾーン(Asia/Tokyo)で解釈
    return { y: dt.getFullYear(), m: dt.getMonth(), d: dt.getDate() };
  }
  if (typeof date === 'string') {
    const m = date.trim().match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
    if (m) {
      const y = parseInt(m[1], 10);
      const mo = parseInt(m[2], 10) - 1;
      const d = parseInt(m[3], 10);
      return { y, m: mo, d };
    }
  }
  return null;
}

export function convertToCalendarEventResource(
  item: RawScheduleItem
): CalendarEventResource {
  console.log('変換開始 - 入力アイテム:', item);

  // data_row配列の場合は、インデックスを正しくマッピング
  let mappedItem: RawScheduleItem;
  if ('data_row' in item && Array.isArray((item as any).data_row)) {
    const row = (item as any).data_row as Array<string | number>;
    mappedItem = {
      date: row[0],
      time: String(row[4]),
      location: String(row[6]),
      detail: String(row[7]),
      remark: String(row[8]),
      summary: String(row[1]),
    };
    console.log('data_row配列をマッピング:', mappedItem);
  } else {
    mappedItem = item;
  }

  const ymd = extractYMDinJst(mappedItem.date);
  console.log('JST日付抽出結果:', ymd);

  const hm = parseTimeHM(mappedItem.time);
  console.log('時刻解析結果(HM):', hm);

  let startDate: Date;
  let endDate: Date;

  if (!ymd) {
    // 不正な日付 → 今日の日付を採用
    const today = new Date();
    if (hm) {
      startDate = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        hm[0],
        hm[1],
        0
      );
      endDate = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        hm[2],
        hm[3],
        0
      );
    } else {
      startDate = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
      );
      endDate = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
      );
    }
  } else {
    if (hm) {
      startDate = new Date(ymd.y, ymd.m, ymd.d, hm[0], hm[1], 0);
      endDate = new Date(ymd.y, ymd.m, ymd.d, hm[2], hm[3], 0);
    } else {
      startDate = new Date(ymd.y, ymd.m, ymd.d);
      endDate = new Date(ymd.y, ymd.m, ymd.d);
    }
  }

  const startIso = startDate.toISOString();
  const endIso = endDate.toISOString();
  console.log('生成ISO:', { startIso, endIso });

  const summary = '部活';
  const location = mappedItem.location ?? '';
  const description = `- 活動可能場所：${mappedItem.detail ?? ''}\n- 備考：${mappedItem.remark ?? ''}`;

  const result = {
    summary,
    location,
    description,
    start: { dateTime: startIso, timeZone: DEFAULT_TIME_ZONE },
    end: { dateTime: endIso, timeZone: DEFAULT_TIME_ZONE },
    colorId: 6,
  };

  console.log('変換完了 - 結果:', result);
  return result;
}

export function convertArrayToCalendarEventResources(
  items: RawScheduleItem[]
): CalendarEventResource[] {
  return items.map(convertToCalendarEventResource);
}
