/**
 * Google認証・ユーザー管理
 */

import { UserCalendar } from '../types/calendar-types';
import { ApiResponse } from '../types/api-types';
import { 
  getUserCalendars as getCalendars, 
  getWritableCalendars 
} from './calendar-manager';

/**
 * ユーザー情報
 */
export interface UserInfo {
  email: string;
  name: string;
  isAuthenticated: boolean;
  locale?: string;
  timeZone?: string;
}

/**
 * 現在のユーザー情報取得
 */
export function getCurrentUser(): UserInfo {
  try {
    const user = Session.getActiveUser();
    const email = user.getEmail();
    
    if (!email) {
      return {
        email: '',
        name: '',
        isAuthenticated: false
      };
    }
    
    return {
      email,
      name: email.split('@')[0],
      isAuthenticated: true,
      locale: Session.getActiveUserLocale(),
      timeZone: Session.getScriptTimeZone()
    };
    
  } catch (error) {
    console.error('ユーザー情報取得エラー:', error);
    return {
      email: '',
      name: '',
      isAuthenticated: false
    };
  }
}

/**
 * ユーザーのGoogleカレンダー一覧取得
 * @deprecated calendar-manager.ts の getUserCalendars を使用してください
 */
export function getUserCalendars(): UserCalendar[] {
  return getCalendars();
}

/**
 * 書き込み可能なカレンダー一覧取得
 */
export function getUserWritableCalendars(): UserCalendar[] {
  return getWritableCalendars();
}

/**
 * ユーザー認証状態確認
 */
export function isUserAuthenticated(): boolean {
  try {
    const user = Session.getActiveUser();
    const email = user.getEmail();
    return email !== '' && email !== undefined;
  } catch (error) {
    console.error('認証状態確認エラー:', error);
    return false;
  }
}

/**
 * ユーザーセッション情報取得
 */
export function getSessionInfo(): {
  user: UserInfo;
  permissions: {
    calendarAccess: boolean;
    driveAccess: boolean;
    sheetsAccess: boolean;
  };
  quotas: {
    calendarQuota: number;
    driveQuota: number;
  };
} {
  try {
    const user = getCurrentUser();
    
    // 各種サービスへのアクセス権限確認
    let calendarAccess = false;
    let driveAccess = false;
    let sheetsAccess = false;
    
    try {
      CalendarApp.getAllCalendars();
      calendarAccess = true;
    } catch (error) {
      console.warn('カレンダーアクセス権限なし');
    }
    
    try {
      DriveApp.getRootFolder();
      driveAccess = true;
    } catch (error) {
      console.warn('ドライブアクセス権限なし');
    }
    
    try {
      SpreadsheetApp.getActiveSpreadsheet();
      sheetsAccess = true;
    } catch (error) {
      console.warn('スプレッドシートアクセス権限なし');
    }
    
    return {
      user,
      permissions: {
        calendarAccess,
        driveAccess,
        sheetsAccess
      },
      quotas: {
        calendarQuota: 100, // デフォルト値
        driveQuota: 1000   // デフォルト値
      }
    };
    
  } catch (error) {
    console.error('セッション情報取得エラー:', error);
    throw new Error('セッション情報の取得に失敗しました');
  }
}

/**
 * ユーザー設定情報取得
 */
export function getUserPreferences(): {
  timeZone: string;
  locale: string;
  dateFormat: string;
  timeFormat: string;
} {
  try {
    return {
      timeZone: Session.getScriptTimeZone(),
      locale: Session.getActiveUserLocale(),
      dateFormat: 'yyyy/MM/dd',
      timeFormat: 'HH:mm'
    };
  } catch (error) {
    console.error('ユーザー設定取得エラー:', error);
    return {
      timeZone: 'Asia/Tokyo',
      locale: 'ja',
      dateFormat: 'yyyy/MM/dd',
      timeFormat: 'HH:mm'
    };
  }
}

/**
 * ユーザー権限レベル確認
 */
export function getUserPermissionLevel(): 'admin' | 'user' | 'readonly' {
  try {
    const user = getCurrentUser();
    
    if (!user.isAuthenticated) {
      return 'readonly';
    }
    
    // 書き込み可能なカレンダーがあるかチェック
    const writableCalendars = getUserWritableCalendars();
    if (writableCalendars.length === 0) {
      return 'readonly';
    }
    
    // プライマリカレンダーの所有者かチェック
    const allCalendars = getCalendars();
    const primaryCalendar = allCalendars.find(cal => cal.primary);
    
    if (primaryCalendar && primaryCalendar.accessLevel === 'owner') {
      return 'admin';
    }
    
    return 'user';
    
  } catch (error) {
    console.error('権限レベル確認エラー:', error);
    return 'readonly';
  }
}

/**
 * ユーザー初期化処理
 */
export function initializeUser(): {
  success: boolean;
  user?: UserInfo;
  calendars?: UserCalendar[];
  error?: string;
} {
  try {
    // 認証状態確認
    if (!isUserAuthenticated()) {
      return {
        success: false,
        error: '認証が必要です。Googleアカウントでログインしてください。'
      };
    }
    
    // ユーザー情報取得
    const user = getCurrentUser();
    
    // カレンダー一覧取得
    const calendars = getCalendars();
    
    if (calendars.length === 0) {
      return {
        success: false,
        error: 'アクセス可能なカレンダーが見つかりません。'
      };
    }
    
    // 書き込み可能なカレンダー確認
    const writableCalendars = getUserWritableCalendars();
    if (writableCalendars.length === 0) {
      return {
        success: false,
        error: '書き込み権限のあるカレンダーが見つかりません。'
      };
    }
    
    return {
      success: true,
      user,
      calendars: writableCalendars
    };
    
  } catch (error) {
    console.error('ユーザー初期化エラー:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'ユーザー初期化に失敗しました'
    };
  }
}