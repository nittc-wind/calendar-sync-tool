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

// "HH:mm～HH:mm" を [startMs, endMs] に変換（1日の中でのミリ秒）
function divideTimeMs(stringTime?: string): [number, number] {
  if (!stringTime) return [Number.NaN, Number.NaN];
  // 許容する区切り: 全角チルダ、波ダッシュ、半角~、ハイフン
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
  if (!start || !end) return [Number.NaN, Number.NaN];
  const [startH, startM] = start.split(':').map(v => parseInt(v, 10));
  const [endH, endM] = end.split(':').map(v => parseInt(v, 10));
  const startMs = (startH * 3600 + startM * 60) * 1000;
  const endMs = (endH * 3600 + endM * 60) * 1000;
  return [startMs, endMs];
}

// UNIX秒 date と [startMs, endMs] から ISO8601 UTC 文字列を作成
function makeIsoDateTimes(
  dateUnixSec: number,
  startMs: number,
  endMs: number
): [string, string] {
  const timeDiffJST = 9 * 60 * 60 * 1000; // JST と UTC のオフセット
  const isoStrStart = new Date(
    dateUnixSec * 1000 + startMs - timeDiffJST
  ).toISOString();
  const isoStrEnd = new Date(
    dateUnixSec * 1000 + endMs - timeDiffJST
  ).toISOString();
  return [isoStrStart, isoStrEnd];
}

// date が number(UNIX秒, JST基準) か 'YYYY-MM-DD' 文字列かを吸収して UNIX秒(JST基準) にする
function normalizeDateToUnixJst(date: number | string): number | null {
  if (typeof date === 'number' && Number.isFinite(date)) return date;
  if (typeof date === 'string') {
    const m = date.trim().match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
    if (m) {
      const y = parseInt(m[1], 10);
      const mo = parseInt(m[2], 10) - 1;
      const d = parseInt(m[3], 10);
      // UTCの00:00にJST(9h)を加算 → JSTの00:00のタイムスタンプ(秒)
      const timeDiffJST = 9 * 60 * 60 * 1000;
      const unixMsJstMidnight = Date.UTC(y, mo, d) + timeDiffJST;
      return Math.floor(unixMsJstMidnight / 1000);
    }
  }
  return null;
}

export function convertToCalendarEventResource(
  item: RawScheduleItem
): CalendarEventResource {
  const [startMs, endMs] = divideTimeMs(item.time);

  let startIso: string | null;
  let endIso: string | null;

  const unixJst = normalizeDateToUnixJst(item.date);

  if (Number.isNaN(startMs + endMs)) {
    // time が不正 or 空 → 終日扱いに近い形で同一ISO（UTC日付の00:00）を入れる
    const same =
      unixJst !== null
        ? new Date(unixJst * 1000).toISOString()
        : new Date(NaN).toISOString();
    startIso = same;
    endIso = same;
  } else {
    if (unixJst === null) {
      // 不正な date
      const same = new Date(NaN).toISOString();
      startIso = same;
      endIso = same;
    } else {
      const [s, e] = makeIsoDateTimes(unixJst, startMs, endMs);
      startIso = s;
      endIso = e;
    }
  }

  const summary = item.summary ?? '部活';
  const location = item.location ?? '';
  const description = `- 活動可能場所：${item.detail ?? ''}\n- 備考：${item.remark ?? ''}`;

  return {
    summary,
    location,
    description,
    start: { dateTime: startIso, timeZone: DEFAULT_TIME_ZONE },
    end: { dateTime: endIso, timeZone: DEFAULT_TIME_ZONE },
    colorId: 6, // orange
  };
}

export function convertArrayToCalendarEventResources(
  items: RawScheduleItem[]
): CalendarEventResource[] {
  return items.map(convertToCalendarEventResource);
}
