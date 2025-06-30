/**
 * Google認証モジュール
 * OAuth2認証、ユーザー情報取得、カレンダー一覧取得機能を提供
 */

import {
    AuthResult,
    CalendarInfo,
    CalendarListResult,
    UserInfo,
    AuthStatusResult
} from './types/auth-types';

/**
 * エラーコード定義
 */
const AUTH_ERROR_CODES = {
    NO_USER: 'NO_USER',
    PERMISSION_DENIED: 'PERMISSION_DENIED',
    CALENDAR_ACCESS_DENIED: 'CALENDAR_ACCESS_DENIED',
    NETWORK_ERROR: 'NETWORK_ERROR',
    UNKNOWN_ERROR: 'UNKNOWN_ERROR'
} as const;

/**
 * Google認証を開始する
 * クライアント側から呼び出される主要な認証関数
 */
function initiateGoogleAuth(): AuthResult {
    try {
        // 現在のユーザー情報を取得
        const user = Session.getActiveUser();
        const userEmail = user.getEmail();

        if (!userEmail) {
            return {
                success: false,
                error: 'Googleアカウントでのログインが必要です',
                errorCode: AUTH_ERROR_CODES.NO_USER
            };
        }

        // カレンダーへのアクセス権限を確認
        try {
            CalendarApp.getAllCalendars();
        } catch (calendarError) {
            return {
                success: false,
                error: 'Googleカレンダーへのアクセス権限が必要です',
                errorCode: AUTH_ERROR_CODES.CALENDAR_ACCESS_DENIED
            };
        }

        // ユーザー名を取得（Drive APIを使用）
        let userName = '';
        try {
            userName = user.getEmail() || userEmail;
        } catch (driveError) {
            // Drive APIでエラーが発生した場合はメールアドレスを名前として使用
            userName = userEmail;
        }

        // 認証成功時にセッションプロパティに保存
        saveUserSession(userEmail, userName);

        return {
            success: true,
            userEmail: userEmail,
            userName: userName
        };

    } catch (error) {
        console.error('認証エラー:', error);
        return {
            success: false,
            error: '認証処理中にエラーが発生しました',
            errorCode: AUTH_ERROR_CODES.UNKNOWN_ERROR
        };
    }
}

/**
 * 現在の認証状態を確認する
 * ページ読み込み時に呼び出されて既存のログイン状態をチェック
 */
function checkAuthenticationStatus(): AuthStatusResult {
    try {
        const user = Session.getActiveUser();
        const userEmail = user.getEmail();

        if (!userEmail) {
            return {
                isAuthenticated: false
            };
        }

        // セッションプロパティから保存されたユーザー情報を取得
        const savedUserInfo = getUserSession();
        const userName = savedUserInfo?.userName || userEmail;

        return {
            isAuthenticated: true,
            userEmail: userEmail,
            userName: userName
        };

    } catch (error) {
        console.error('認証状態確認エラー:', error);
        return {
            isAuthenticated: false,
            error: '認証状態の確認中にエラーが発生しました'
        };
    }
}

/**
 * ユーザーのGoogleカレンダー一覧を取得する
 * カレンダー選択画面で使用
 */
function getUserCalendars(): CalendarListResult {
    try {
        // ユーザーが認証されているかチェック
        const authStatus = checkAuthenticationStatus();
        if (!authStatus.isAuthenticated) {
            return {
                success: false,
                error: 'ログインが必要です',
                errorCode: AUTH_ERROR_CODES.NO_USER
            };
        }

        // 全カレンダーを取得
        const allCalendars = CalendarApp.getAllCalendars();
        const calendarList: CalendarInfo[] = [];

        allCalendars.forEach(calendar => {
            try {
                const calendarInfo: CalendarInfo = {
                    id: calendar.getId(),
                    name: calendar.getName(),
                    description: calendar.getDescription() || '',
                    isPrimary: calendar.getId() === CalendarApp.getDefaultCalendar().getId(),
                    accessRole: 'owner', // GASで取得できるカレンダーは基本的にowner権限
                    backgroundColor: calendar.getColor()
                };

                calendarList.push(calendarInfo);
            } catch (calendarError) {
                // 個別のカレンダー情報取得でエラーが発生した場合はスキップ
                console.warn('カレンダー情報取得エラー:', calendarError);
            }
        });

        // プライマリカレンダーを先頭に、その後は名前順でソート
        calendarList.sort((a, b) => {
            if (a.isPrimary) return -1;
            if (b.isPrimary) return 1;
            return a.name.localeCompare(b.name);
        });

        return {
            success: true,
            calendars: calendarList
        };

    } catch (error) {
        console.error('カレンダー一覧取得エラー:', error);
        return {
            success: false,
            error: 'カレンダー一覧の取得中にエラーが発生しました',
            errorCode: AUTH_ERROR_CODES.CALENDAR_ACCESS_DENIED
        };
    }
}

/**
 * 現在のユーザー情報を取得する
 * 各画面で現在のユーザー情報を表示するために使用
 */
function getCurrentUser(): UserInfo {
    try {
        const user = Session.getActiveUser();
        const userEmail = user.getEmail();

        if (!userEmail) {
            return {
                email: '',
                name: '',
                isAuthenticated: false
            };
        }

        // セッションプロパティから保存されたユーザー情報を取得
        const savedUserInfo = getUserSession();
        const userName = savedUserInfo?.userName || userEmail;

        return {
            email: userEmail,
            name: userName,
            isAuthenticated: true
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
 * ログアウト処理
 * セッション情報をクリア
 */
function logout(): { success: boolean } {
    try {
        // セッションプロパティをクリア
        clearUserSession();

        return { success: true };
    } catch (error) {
        console.error('ログアウトエラー:', error);
        return { success: false };
    }
}

/**
 * 指定されたカレンダーIDに対するアクセス権限を確認
 * イベント作成前のバリデーションで使用
 */
function validateCalendarAccess(calendarId: string): { hasAccess: boolean; error?: string } {
    try {
        if (!calendarId) {
            return { hasAccess: false, error: 'カレンダーIDが指定されていません' };
        }

        // カレンダーへのアクセスを試行
        const calendar = CalendarApp.getCalendarById(calendarId);
        if (!calendar) {
            return { hasAccess: false, error: '指定されたカレンダーが見つかりません' };
        }

        // カレンダー名の取得を試行（権限確認）
        calendar.getName();

        return { hasAccess: true };

    } catch (error) {
        console.error('カレンダーアクセス確認エラー:', error);
        return {
            hasAccess: false,
            error: 'カレンダーへのアクセス権限がありません'
        };
    }
}

/**
 * ユーザーセッション情報をPropertiesServiceに保存
 * @param userEmail ユーザーメールアドレス
 * @param userName ユーザー名
 */
function saveUserSession(userEmail: string, userName: string): void {
    try {
        const sessionData = {
            userEmail: userEmail,
            userName: userName,
            loginTime: new Date().toISOString()
        };

        PropertiesService.getUserProperties()
            .setProperty('user_session', JSON.stringify(sessionData));
    } catch (error) {
        console.error('セッション保存エラー:', error);
    }
}

/**
 * ユーザーセッション情報をPropertiesServiceから取得
 */
function getUserSession(): { userEmail: string; userName: string; loginTime: string } | null {
    try {
        const sessionJson = PropertiesService.getUserProperties()
            .getProperty('user_session');

        if (!sessionJson) {
            return null;
        }

        return JSON.parse(sessionJson);
    } catch (error) {
        console.error('セッション取得エラー:', error);
        return null;
    }
}

/**
 * ユーザーセッション情報をクリア
 */
function clearUserSession(): void {
    try {
        PropertiesService.getUserProperties()
            .deleteProperty('user_session');
    } catch (error) {
        console.error('セッションクリアエラー:', error);
    }
}

/**
 * 認証が必要な機能の実行前に呼び出すヘルパー関数
 * 他のモジュールから利用される
 */
function requireAuthentication(): AuthResult {
    const authStatus = checkAuthenticationStatus();

    if (!authStatus.isAuthenticated) {
        return {
            success: false,
            error: 'この機能を使用するにはログインが必要です',
            errorCode: AUTH_ERROR_CODES.NO_USER
        };
    }

    return {
        success: true,
        userEmail: authStatus.userEmail,
        userName: authStatus.userName
    };
}

/**
 * 管理者権限チェック（将来的な拡張用）
 * 現在は全ユーザーが管理者として扱われる
 */
function checkAdminPermission(): boolean {
    try {
        const userInfo = getCurrentUser();

        // 現在は全認証済みユーザーを管理者として扱う
        // 将来的には特定のメールアドレスやグループでの制限を実装可能
        return userInfo.isAuthenticated;
    } catch (error) {
        console.error('管理者権限確認エラー:', error);
        return false;
    }
}

/*
  // エクスポート用の関数リスト（TypeScriptコンパイル後にGASで利用可能）
  declare global {
    function initiateGoogleAuth(): AuthResult;
    function checkAuthenticationStatus(): AuthStatusResult;
    function getUserCalendars(): CalendarListResult;
    function getCurrentUser(): UserInfo;
    function logout(): { success: boolean };
    function validateCalendarAccess(calendarId: string): { hasAccess: boolean; error?: string };
    function requireAuthentication(): AuthResult;
    function checkAdminPermission(): boolean;
  }
*/