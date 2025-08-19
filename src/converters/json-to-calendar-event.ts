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
  console.log('変換開始 - 入力アイテム:', item);

  // data_row配列の場合は、インデックスを正しくマッピング
  let mappedItem: RawScheduleItem;
  if ('data_row' in item && Array.isArray(item.data_row)) {
    const row = item.data_row;
    mappedItem = {
      date: row[0], // 日付（UNIX秒）
      time: String(row[4]), // 時刻（5番目の要素）
      location: String(row[6]), // 場所（7番目の要素）
      detail: String(row[7]), // 詳細（8番目の要素）
      remark: String(row[8]), // 備考（9番目の要素）
      summary: String(row[1]), // タイトル（2番目の要素）
    };
    console.log('data_row配列をマッピング:', mappedItem);
  } else {
    mappedItem = item;
  }

  const [startMs, endMs] = divideTimeMs(mappedItem.time);
  console.log('時刻解析結果 - startMs:', startMs, 'endMs:', endMs);

  let startIso: string | null;
  let endIso: string | null;

  const unixJst = normalizeDateToUnixJst(mappedItem.date);
  console.log('日付正規化結果 - unixJst:', unixJst);

  if (Number.isNaN(startMs + endMs)) {
    // time が不正 or 空 → 終日扱いに近い形で同一ISO（UTC日付の00:00）を入れる
    console.log('時刻が不正または空 - 終日扱い');
    if (unixJst !== null) {
      const same = new Date(unixJst * 1000).toISOString();
      console.log('終日用ISO文字列:', same);
      startIso = same;
      endIso = same;
    } else {
      console.log('日付が不正 - デフォルト日付を使用');
      // 今日の日付をデフォルトとして使用
      const today = new Date();
      const defaultDate = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
      ).toISOString();
      startIso = defaultDate;
      endIso = defaultDate;
    }
  } else {
    if (unixJst === null) {
      // 不正な date
      console.log('日付が不正 - デフォルト日付を使用');
      const today = new Date();
      const defaultDate = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
      ).toISOString();
      startIso = defaultDate;
      endIso = defaultDate;
    } else {
      console.log('時刻あり - ISO文字列生成開始');
      const [s, e] = makeIsoDateTimes(unixJst, startMs, endMs);
      startIso = s;
      endIso = e;
      console.log('生成されたISO文字列 - start:', startIso, 'end:', endIso);
    }
  }

  const summary = '部活';
  const location = mappedItem.location ?? '';
  const description = `- 活動可能場所：${mappedItem.detail ?? ''}\n- 備考：${mappedItem.remark ?? ''}`;

  const result = {
    summary,
    location,
    description,
    start: { dateTime: startIso, timeZone: DEFAULT_TIME_ZONE },
    end: { dateTime: endIso, timeZone: DEFAULT_TIME_ZONE },
    colorId: 6, // orange
  };

  console.log('変換完了 - 結果:', result);
  return result;
}

export function convertArrayToCalendarEventResources(
  items: RawScheduleItem[]
): CalendarEventResource[] {
  return items.map(convertToCalendarEventResource);
}
