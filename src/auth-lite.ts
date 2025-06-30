function initiateLogin() {
    try {
      // 認証スコープを要求する処理
      // このタイミングでGoogle認証ダイアログが表示される
      const user = Session.getActiveUser();
      const email = user.getEmail();
      
      if (email) {
        // カレンダーアクセステスト（スコープ確認）
        const calendars = CalendarApp.getAllCalendars();
        
        return {
          success: true,
          user: {
            email: email,
            name: email.split('@')[0] // Extract username from email
          }
        };
      } else {
        return {
          success: false,
          error: 'ログインが必要です'
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: 'ログイン処理でエラーが発生しました'
      };
    }
  }
  
  function getCurrentUser() {
    try {
      const user = Session.getActiveUser();
      return {
        email: user.getEmail(),
        name: user.getEmail().split('@')[0] // Extract username from email
      };
    } catch (error) {
      return null;
    }
  }