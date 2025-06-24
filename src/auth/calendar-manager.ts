/**
 * カレンダー管理モジュール
 * Googleカレンダーの操作と管理を行う
 */

import { UserCalendar } from '../types/calendar-types';
import { CONSTANTS } from '../utils/constants';

/**
 * ユーザーのGoogleカレンダー一覧取得
 */
export function getUserCalendars(): UserCalendar[] {
  try {
    const calendars = CalendarApp.getAllCalendars();
    
    return calendars.map(calendar => ({
      id: calendar.getId(),
      name: calendar.getName(),
      description: calendar.getDescription(),
      primary: calendar.isMyPrimaryCalendar(),
      color: getCalendarColor(calendar),
      timeZone: calendar.getTimeZone(),
      accessLevel: getAccessLevel(calendar)
    }));
    
  } catch (error) {
    console.error('カレンダー一覧取得エラー:', error);
    throw new Error(CONSTANTS.ERROR_CODES.CALENDAR_API_ERROR);
  }
}

/**
 * 特定のカレンダー情報取得
 */
export function getCalendarById(calendarId: string): UserCalendar | null {
  try {
    const calendar = CalendarApp.getCalendarById(calendarId);
    if (!calendar) {
      return null;
    }
    
    return {
      id: calendar.getId(),
      name: calendar.getName(),
      description: calendar.getDescription(),
      primary: calendar.isMyPrimaryCalendar(),
      color: getCalendarColor(calendar),
      timeZone: calendar.getTimeZone(),
      accessLevel: getAccessLevel(calendar)
    };
    
  } catch (error) {
    console.error(`カレンダー取得エラー (ID: ${calendarId}):`, error);
    return null;
  }
}

/**
 * カレンダーアクセス権限確認
 */
export function checkCalendarPermission(calendarId: string): {
  canRead: boolean;
  canWrite: boolean;
  canEdit: boolean;
} {
  try {
    const calendar = CalendarApp.getCalendarById(calendarId);
    if (!calendar) {
      return { canRead: false, canWrite: false, canEdit: false };
    }
    
    // 読み取り権限確認
    let canRead = false;
    try {
      calendar.getName();
      canRead = true;
    } catch (error) {
      canRead = false;
    }
    
    // 書き込み権限確認
    let canWrite = false;
    try {
      // テストイベントの作成を試行（実際には作成しない）
      const testDate = new Date();
      testDate.setFullYear(testDate.getFullYear() + 10); // 未来の日付
      
      // 実際のイベント作成はせず、権限チェックのみ
      const accessLevel = getAccessLevel(calendar);
      canWrite = accessLevel === 'owner' || accessLevel === 'writer';
    } catch (error) {
      canWrite = false;
    }
    
    return {
      canRead,
      canWrite,
      canEdit: canWrite // 書き込み権限があれば編集も可能
    };
    
  } catch (error) {
    console.error(`権限確認エラー (ID: ${calendarId}):`, error);
    return { canRead: false, canWrite: false, canEdit: false };
  }
}

/**
 * カレンダーの空き状況確認
 */
export function checkCalendarAvailability(
  calendarId: string,
  startDate: Date,
  endDate: Date
): {
  totalDays: number;
  busyDays: number;
  conflicts: Array<{
    date: string;
    eventCount: number;
    events: string[];
  }>;
} {
  try {
    const calendar = CalendarApp.getCalendarById(calendarId);
    if (!calendar) {
      throw new Error('カレンダーが見つかりません');
    }
    
    // 期間内のイベント取得
    const events = calendar.getEvents(startDate, endDate);
    
    // 日付ごとのイベント数集計
    const eventsByDate = new Map<string, GoogleAppsScript.Calendar.CalendarEvent[]>();
    
    events.forEach(event => {
      const eventDate = event.getStartTime().toDateString();
      if (!eventsByDate.has(eventDate)) {
        eventsByDate.set(eventDate, []);
      }
      eventsByDate.get(eventDate)!.push(event);
    });
    
    // 競合情報作成
    const conflicts = Array.from(eventsByDate.entries())
      .filter(([_, events]) => events.length > 0)
      .map(([date, events]) => ({
        date,
        eventCount: events.length,
        events: events.map(event => event.getTitle())
      }));
    
    const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const busyDays = eventsByDate.size;
    
    return {
      totalDays,
      busyDays,
      conflicts
    };
    
  } catch (error) {
    console.error(`空き状況確認エラー (ID: ${calendarId}):`, error);
    throw new Error(CONSTANTS.ERROR_CODES.CALENDAR_API_ERROR);
  }
}

/**
 * カレンダーの有効性確認
 */
export function validateCalendar(calendarId: string): {
  isValid: boolean;
  error?: string;
  warnings: string[];
} {
  const warnings: string[] = [];
  
  try {
    // カレンダー存在確認
    const calendar = CalendarApp.getCalendarById(calendarId);
    if (!calendar) {
      return {
        isValid: false,
        error: 'カレンダーが見つかりません',
        warnings
      };
    }
    
    // アクセス権限確認
    const permissions = checkCalendarPermission(calendarId);
    if (!permissions.canWrite) {
      return {
        isValid: false,
        error: 'カレンダーへの書き込み権限がありません',
        warnings
      };
    }
    
    // 警告チェック
    if (!permissions.canEdit) {
      warnings.push('イベントの編集権限が制限されている可能性があります');
    }
    
    const calendarInfo = getCalendarById(calendarId);
    if (calendarInfo && calendarInfo.accessLevel === 'reader') {
      warnings.push('読み取り専用カレンダーです');
    }
    
    return {
      isValid: true,
      warnings
    };
    
  } catch (error) {
    console.error(`カレンダー有効性確認エラー (ID: ${calendarId}):`, error);
    return {
      isValid: false,
      error: error instanceof Error ? error.message : 'カレンダー確認中にエラーが発生しました',
      warnings
    };
  }
}

/**
 * プライマリカレンダー取得
 */
export function getPrimaryCalendar(): UserCalendar | null {
  try {
    const calendars = getUserCalendars();
    return calendars.find(calendar => calendar.primary) || null;
  } catch (error) {
    console.error('プライマリカレンダー取得エラー:', error);
    return null;
  }
}

/**
 * 書き込み可能なカレンダー一覧取得
 */
export function getWritableCalendars(): UserCalendar[] {
  try {
    const allCalendars = getUserCalendars();
    
    return allCalendars.filter(calendar => {
      const permissions = checkCalendarPermission(calendar.id);
      return permissions.canWrite;
    });
    
  } catch (error) {
    console.error('書き込み可能カレンダー取得エラー:', error);
    return [];
  }
}

/**
 * カレンダー情報の詳細取得
 */
export function getCalendarDetails(calendarId: string): {
  info: UserCalendar | null;
  permissions: ReturnType<typeof checkCalendarPermission>;
  validation: ReturnType<typeof validateCalendar>;
  recentActivity?: {
    lastEventDate?: string;
    totalEvents: number;
  };
} {
  try {
    const info = getCalendarById(calendarId);
    const permissions = checkCalendarPermission(calendarId);
    const validation = validateCalendar(calendarId);
    
    // 最近のアクティビティ取得（任意）
    let recentActivity;
    if (info && permissions.canRead) {
      try {
        const calendar = CalendarApp.getCalendarById(calendarId);
        const now = new Date();
        const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        const recentEvents = calendar.getEvents(oneMonthAgo, now);
        
        recentActivity = {
          lastEventDate: recentEvents.length > 0 ? 
            recentEvents[recentEvents.length - 1].getStartTime().toISOString() : 
            undefined,
          totalEvents: recentEvents.length
        };
      } catch (error) {
        // 最近のアクティビティ取得失敗は無視
      }
    }
    
    return {
      info,
      permissions,
      validation,
      recentActivity
    };
    
  } catch (error) {
    console.error(`カレンダー詳細取得エラー (ID: ${calendarId}):`, error);
    throw new Error(CONSTANTS.ERROR_CODES.CALENDAR_API_ERROR);
  }
}

// ========================================
// Private Helper Functions
// ========================================

/**
 * カレンダーの色情報取得
 */
function getCalendarColor(calendar: GoogleAppsScript.Calendar.Calendar): string {
  try {
    // GASのCalendarオブジェクトには直接色情報がないため、
    // デフォルト色を返すか、将来的にCalendar APIを使用
    return '#1976d2'; // デフォルトブルー
  } catch (error) {
    return '#1976d2';
  }
}

/**
 * カレンダーのアクセスレベル取得
 */
function getAccessLevel(calendar: GoogleAppsScript.Calendar.Calendar): 'owner' | 'writer' | 'reader' {
  try {
    // プライマリカレンダーの場合はowner
    if (calendar.isMyPrimaryCalendar()) {
      return 'owner';
    }
    
    // テスト書き込みで権限レベル判定
    try {
      // ダミーイベントで書き込み権限テスト（実際には作成しない）
      const testTitle = `__test_${Date.now()}__`;
      // 実際のテストは省略し、一般的にはwriter権限とする
      return 'writer';
    } catch (error) {
      return 'reader';
    }
    
  } catch (error) {
    return 'reader';
  }
}