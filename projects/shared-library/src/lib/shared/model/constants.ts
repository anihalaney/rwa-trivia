export enum schedulerConstants {
    gamePlayDuration = 32,  // 32 hours
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
