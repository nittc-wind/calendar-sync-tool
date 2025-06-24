/**
 * カレンダー関連の型定義
 */

/**
 * カレンダーイベント
 */
export interface CalendarEvent {
    date: string;          // yyyy-mm-dd
    startTime: string;     // HH:mm
    endTime: string;       // HH:mm
    title: string;
    location?: string;
    description?: string;
    teacher?: string;
  }
  
  /**
   * ユーザーカレンダー情報
   */
  export interface UserCalendar {
    id: string;
    name: string;
    description?: string;
    primary?: boolean;
    color?: string;
    timeZone?: string;
    accessLevel?: 'owner' | 'writer' | 'reader';
  }
  
  /**
   * カレンダー権限情報
   */
  export interface CalendarPermissions {
    canRead: boolean;
    canWrite: boolean;
    canEdit: boolean;
  }
  
  /**
   * カレンダー検証結果
   */
  export interface CalendarValidation {
    isValid: boolean;
    error?: string;
    warnings: string[];
  }
  
  /**
   * カレンダー空き状況
   */
  export interface CalendarAvailability {
    totalDays: number;
    busyDays: number;
    conflicts: Array<{
      date: string;
      eventCount: number;
      events: string[];
    }>;
  }
  
  /**
   * カレンダー詳細情報
   */
  export interface CalendarDetails {
    info: UserCalendar | null;
    permissions: CalendarPermissions;
    validation: CalendarValidation;
    recentActivity?: {
      lastEventDate?: string;
      totalEvents: number;
    };
  }
  
  /**
   * カレンダー選択状態
   */
  export interface CalendarSelection {
    selectedId: string;
    calendar: UserCalendar;
    isValid: boolean;
    warnings: string[];
  }
  
  /**
   * イベント作成オプション
   */
  export interface EventCreationOptions {
    sendNotifications?: boolean;
    guestsCanInviteOthers?: boolean;
    guestsCanSeeOtherGuests?: boolean;
    transparency?: 'opaque' | 'transparent';
  }
  
  /**
   * イベント作成結果
   */
  export interface EventCreationResult {
    success: boolean;
    eventId?: string;
    date: string;
    title: string;
    error?: string;
    warning?: string;
  }