export enum schedulerConstants {
    gamePlayDuration = 32,  // 32 hours
    beforeGameExpireDuration = 1890,  // 31 hours 30 minutes
    notificationInterval = 32, // 32 Minutes
    gameInvitationDuration = 192   // 8 days
}


export enum UserStatConstants {
    maxUsers = 100,
    initialContribution = 1
}

export enum TriggerConstants {
    invitationTxt = 'Please accept invitation to play Trivia Game',
    invitationMailSubject = 'bitwiser.io: Friend Request',
    fromUser = 'support@trivia.com'
}

export enum RSSFeedConstants {
    feedURL = 'https://blog.realworldfullstack.io/feed'
}


export enum UserControllerConstants {
    adminEmail = 'akshay@emaxers.com',
    mailTxt = 'Please allow access of bulk upload to below user',
    mailSubject = 'bitwiser.io: Bulk Upload Request',
}

export enum appConstants {
    API_PREFIX = 'app'
}

export enum interceptorConstants {
    UNAUTHORIZED = 401,
    TOKEN_EXPIRE = 419,
    INTERNAL_ERROR = 500,
    GATEWAY_TIMEOUT = 504,
    MAXIMUM_RE_REQUEST_LIMIT = 3
}


export enum GameInviteConstants {
    INVITATION_APPROVAL_TOTAL_DAYS = 8
}

export enum CalenderConstants {
    MINUTE_CALCULATIONS = 60 * 1000,
    HOURS_CALCULATIONS = MINUTE_CALCULATIONS * 60,
    DAYS_CALCULATIONS = HOURS_CALCULATIONS * 24
}

export enum LeaderBoardConstants {
    UNKNOWN = 'Unknown'
}

export enum DashboardConstants {
    ADMIN_ROUTE = 'admin/index.html',
}

export enum profileSettingsConstants {
    NONE = 'none',
    PENDING = 'pending',
    APPROVED = 'approved',
    BULK_UPLOAD_REQUEST_BTN_TEXT = 'Bulk Upload Request',
    BULK_UPLOAD_SEND_REQUEST_AGAIN_BTN_TEXT = 'Send Request Again',
}

export enum friendInvitationConstants {
    PENDING = 'pending',
    APPROVED = 'approved',
    REJECTED = 'rejected'
}

export enum gamePlayConstants {
    GAME_Q_TIMER = 500
}

export enum pushNotificationRouteConstants {
    GAME_PLAY = 'game-play',
    FRIEND_REQUEST = 'friend-request',
    GAME_PLAY_NOTIFICATIONS = 'game-play-notifications',
    GAME_REMAINING_TIME_NOTIFICATIONS = 'game-play-time-notifications',
    FRIEND_NOTIFICATIONS = 'friend-notifications'
}



