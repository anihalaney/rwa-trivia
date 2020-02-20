export enum schedulerConstants {
    gamePlayDuration = 32,  // 32 hours
    beforeGameExpireDuration = 1890,  // 31 hours 30 minutes
    notificationInterval = 32, // 32 Minutes
    gameInvitationDuration = 192,   // 8 days
    DESCRIPTION = 'description',
    reminderNotificationInterval = 480, // 8 hours
    gamePlayLagDuration = 32, // 32 days;
}


export enum UserStatConstants {
    maxUsers = 100,
    initialContribution = 1
}

export enum TriggerConstants {
    invitationTxt = 'Please accept invitation to play Trivia Game',
    invitationMailSubject = 'bitwiser.io: Friend Request',
    fromUser = 'support@trivia.com',
    ANDROID = 'android',
    IOS = 'ios',
    WEB = 'web'
}

export enum UserControllerConstants {
    adminEmail = 'akshay@emaxers.com',
    mailTxt = 'Please allow access of bulk upload to below user',
    mailSubject = 'bitwiser.io: Bulk Upload Request',
}

export enum appConstants {
    API_PREFIX = 'app',
    API_VERSION = 'v1'
}

export enum interceptorConstants {
    UNAUTHORIZED = 401,
    TOKEN_EXPIRE = 419,
    INTERNAL_ERROR = 500,
    GATEWAY_TIMEOUT = 504,
    SUCCESS = 200,
    BAD_REQUEST = 400,
    FORBIDDEN = 403,
    MAXIMUM_RE_REQUEST_LIMIT = 3,
    ENTITY_NOT_FOUND = 404
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
    FRIEND_NOTIFICATIONS = 'friend-notifications',
    QUESTION_NOTIFICATIONS = 'my/questions',
    ACHIEVEMENT_NOTIFICATION = 'achievement-notification',
    TOKEN_IS_NOT_REGISTERED = 'messaging/registration-token-not-registered',
    NEW_GAME_START_WITH_OPPONENT = 'new-game-start-with-opponent',
    GAME_PLAY_LAG_NOTIFICATION = 'game-play-lag-notification'
}


/* Api constants */

export enum CollectionConstants {
    ACCOUNTS = 'accounts',
    APPLICATION_SETTINGS_FORWARD_SLASH_SETTINGS = 'application_settings/settings',
    BLOGS = 'blogs',
    BULK_UPLOADS = 'bulk_uploads',
    INVITATIONS = 'invitations',
    FRIENDS = 'friends',
    GAMES = 'games',
    LEADER_BOARD_STATS = 'leader_board_stats',
    QUESTIONS = 'questions',
    UNPUBLISHED_QUESTIONS = 'unpublished_questions',
    STATS = 'stats',
    SUBSCRIPTION = 'subscription',
    USERS = 'users',
    PUBLISHED = 'published',
    UNPUBLISHED = 'unpublished',
    CATEGORIES = 'categories',
    TAG_LIST = '/tagList',
    LISTS_FORWARD_SLASH_TAGS = 'lists/tags',
    STATS_SYSTEM = 'system',
    ACHIEVEMENTS = 'achievements',
    ACHIEVEMENT_RULES = 'achievement_rules',
    USER_STATUS = 'user_status',
    INFO = '.info',
    CONNECTED = 'connected',
    REACTIONS = 'reactions'
}

export enum UserConstants {
    PROFILE = 'profile',
    AVATAR = 'avatar',
    META_DATA = 'metadata',
    UPLOAD_FINISHED = 'upload finished',
    AUTH_STATE = 'authState',
    IMG_263 = 263,
    IMG_70 = 70,
    IMG_60 = 60,
    IMG_44 = 44,
    IMG_40 = 40,
    ROLES = 'roles',
    ORIGINAL = 'original',
}

export enum AuthProviderConstants {
    GOOGLE = 'google.com',
    FACEBOOK = 'facebook.com',
    PASSWORD = 'password',
    PHONE = 'phone',
    APPLE = 'apple.com'
}



export enum GeneralConstants {
    LESS_THAN_OR_EQUAL = '<=',
    CREATED_UID = 'created_uid',
    DOUBLE_EQUAL = '==',
    EMAIL = 'email',
    FINISH = 'finish',
    ERROR = 'error',
    API_KEY = 'apiKey',
    AUTH_DOMAIN = 'authDomain',
    DATABASE_URL = 'databaseURL',
    PROJECT_ID = 'projectId',
    STORAGE_BUCKET = 'storageBucket',
    MESSAGING_SENDER_ID = 'messagingSenderId',
    TARGET_APP = 'targetApp',
    ID = 'id',
    TYPE = 'type',
    SOURCE = 'source',
    VALUE = 'value',
    CATEGORY_NAME = 'categoryName',
    Required_For_Game_Play = 'requiredForGamePlay',
    PLAYER_ID_ = 'playerId_',
    ROUND = 'round',
    BASE64 = 'base64',
    HELLO = 'Hello',
    TRUE = 'true',
    Error_Message = 'Error : ',
    GAME_EXPIRED_HOURS = 32, // hr
    NAME = 'name',
    DISPLAY_NAME = 'displayName',
    USER_ID = 'userId',
    WIN = 'Win',
    LOST = 'Lost',
    IN = 'in'
}

export enum SocialShareConstants {
    SOCIAL_SHARE = 'social_share',
    SCORE_IMAGES = 'score_images',
}

export enum GameConstants {
    GAME_STATUS = 'GameStatus',
    GAME_OVER = 'gameOver',
    RANDOM = 'Random',
    FRIEND = 'Friend',
    NORMAL = 'Normal',
    OFFLINE = 'Offline',
    SINGLE = 'Single',
    OPPONENT = 'Opponent',
    TURN_AT = 'turnAt'
}

export enum AccountConstants {
    NEXT_LIVE_UPDATE = 'nextLiveUpdate',
    ACCOUNT_DOES_NOT_EXIST = 'account does not exist',
    LAST_GAME_PLAYED = 'lastGamePlayed',
    LAST_GAME_PLAYED_NOTIFICATION = 'lastGamePlayedNotification'
}

export enum LeaderBoardConstants {
    LEADER_BOARD_STATS = 'leaderBoardStats'
}

export enum BulkUploadConstants {
    IS_ADMIN_ARCHIVED = 'isAdminArchived',
    IS_USER_ARCHIVED = 'isUserArchived1'
}

export enum ESConstants {
    DEV = 'dev:'
}

export enum SystemStatConstants {
    GAME_PLAYED = 'game_played',
    TOTAL_USERS = 'total_users',
    TOTAL_QUESTIONS = 'total_questions',
    ACTIVE_GAMES = 'active_games',
}

export enum QuestionsConstants {
    SOURCE = 'source',
    BULK_QUESTION = 'bulk-question',
    QUESTION = 'question',
    NEXT = 'next',
    META_DATA = 'metadata',
    UPLOAD_FINISHED = 'upload finished',
}

export enum ResponseMessagesConstants {
    MIGRATED_COLLECTION = 'migrated collection',
    QUESTIONS_INDEXED = 'Questions indexed',
    ELASTIC_SEARCH_CLUSTER_IS_DOWN = 'elasticsearch cluster is down!',
    HELLO_ES_IS_UP = 'Hello. ES is up',
    INTERNAL_SERVER_ERROR = 'Internal Server error',
    BAD_REQUEST = 'Bad Request',
    GAME_OPTION_NOT_FOUND = 'Game Option is not added in request',
    USER_ID_NOT_FOUND = 'userId is not added in request',
    NOT_ENOUGH_LIFE = 'Sorry, don\'t have enough life.',
    GAME_ID_NOT_FOUND = 'gameId is not added in request',
    OPERATION_NOT_FOUND = 'operation is not added in request',
    GAME_NOT_FOUND = 'Game not found',
    UNAUTHORIZED = 'Unauthorized',
    PLAYER_QNA_NOT_FOUND = 'playerQnA not found',
    UPDATED_STATS = 'updated stats',
    UPDATED_USER_CATEGORY_STAT = 'updated user category stat',
    UPDATED_SYSTEM_STAT = 'updated system stat',
    UPDATED_BULK_UPLOAD_COLLECTION = 'updated bulk upload collection',
    UPDATED_QUESTION_COLLECTION = 'updated question collection',
    UPDATED_UNPUBLISHED_QUESTION_COLLECTION = 'updated unpublished question collection',
    DUMPED_ALL_USERS = 'dumped all the users',
    DEFAULT_LIVES_ADDED = 'Default lives added successfully',
    LIVE_FEATURES_IS_NOT_ENABLED = 'live feature is not enabled',
    LOADED_DATA = 'loaded data',
    USER_NOT_PART_OF_GAME = 'User not part of this game',
    GAME_OVER = 'Game over. No more Questions',
    WAIT_FOR_YOUR_TURN = 'Wait for your turn. Not yet implemented.',
    QUESTION_ID_IS_NOT_AVAILABLE = 'questionId is not available',
    UNPUBLISHED_STATUS_CHANGED = 'unpublished status changed',
    SCHEDULER_CHECK_GAME_OVER_IS_COMPLETED = 'scheduler check game over is completed',
    SCHEDULER_CHANGE_GAME_TURN_IS_COMPLETED = 'scheduler change game turn is completed',
    LIVE_FEATURE_IS_NOT_ENABLED = 'live feature is not enabled',
    CREATED_FEED_BLOGS = 'created feed blogs',
    BLOGS_NOT_AVAILABLE = 'blogs not available',
    WIDTH_NOT_FOUND = 'width is not added in request',
    HEIGHT_NOT_FOUND = 'height is not added in request',
    PROFILE_DATA_IS_SAVED = 'Profile Data is saved !!',
    LIVES_ADDED = 'Lives added successfully !!',
    CHECK_FIRESTORE_DB_FOR_MIGRATION_DETAILS = 'Check firestore db for migration details',
    ADDED_GAME_OVER__FIELDS = 'added gameOverAt fields',
    REMOVE_ALL_ACCOUNTS = 'Remove all accounts',
    ACHIEVEMENT_PROPERTY_NOT_FOUND = 'Achievement property not found',
    ACHIEVEMENT_NAME_NOT_FOUND = 'Achievement name not found',
    DISPLAY_ORDER_NOT_FOUND = 'Display order not found',
    ACHIEVEMENT_RULES_ADDED_SUCCESSFULLY = 'Achievement rules added successfully',
    DISPLAY_NAME_NOT_FOUND = 'displayName is not added in request',
    BITS_ADDED = 'Bits added successfully !!',
    REMAINING_TIME_NOTIFICATION_SENT_SUCCESSFULLY = 'Remaining time notification sent successfully',
    SEND_NO_GAME_ACTIVITY_NOTIFICATION_SUCCESSFULLY = 'Notification for no game activity in 32 days sent successfully',
    SCHEDULER_CHECK_GAME_INVITATION_EXPIRE_IS_COMPLETED = 'scheduler check game invitation expire is completed',
    REMIND_BEFORE_TIME_NOT_FOUND = 'Reminder before time not found',
}

export enum FriendConstants {
    BR_HTML = '<br />',
}

export enum AchievementConstants {
    PROPERTY_DOT_NAME = 'property.name',
    GREATER_THAN = '>',
    GREATER_THAN_OR_EQUAL = '>=',
    LESS_THAN = '<',
    LESS_THAN_OR_EQUAL = '<=',
    DOUBLE_EQUAL = '==',
    NOT_EQUAL = '!=',
    DEFAULT_ACHIEVEMENT_ICON_PATH = '/assets/images/default-achievement.png',
    NA = 'NA'
}

export enum MigrationConstants {
    CATEGORIES = 'categories',
    TAGS = 'tags',
    GAMES = 'games',
    QUESTIONS = 'questions',
    UNPUBLISHED_QUESTIONS = 'unpublished_questions',
    ADDED_DEFAULT_LIVES_FOR_USERS_COLON = 'Added default lives for user :  '
}

export enum HeaderConstants {
    CONTENT_DASH_TYPE = 'content-type',
    TEXT_FORWARD_SLASH_HTML = 'text/html',
    CONTENT_DASH_DISPOSITION = 'content-disposition',
    ATTACHMENT_SEMI_COLON_FILE_NAME_EQUAL_TO_SOCIAL_UNDER_SCORE_IMAGE_DOT_PNG = 'attachment; filename=social_image.png',
    ATTACHMENT_SEMI_COLON_FILE_NAME_EQUAL_TO_PROFILE_UNDER_SCORE_IMAGE_DOT_PNG = 'attachment; filename=profile_image.png',
    IMAGE_FORWARD_SLASH_PNG = 'image/png',
    TEXT_FORWARD_SLASH_PLAIN = 'text/plain',
    IMAGE_FORWARD_SLASH_JPEG = 'image/jpeg',
    ATTACHMENT_QUESTION_IMAGE_PNG = 'attachment; filename=question_image.png',
}

export enum RoutesConstants {
    INVITATION = 'invitation',
    GAME_ID = 'gameId',
    SOCIAL = 'social',
    USER_ID = 'userId',
    SOCIAL_ID = 'socialId',
    SOCIAL_DASH_IMAGE = 'social-image',
    HELLO = 'hello',
    QUESTION = 'question',
    GAME = 'game',
    ES = 'es',
    CHECK = 'check',
    ACCOUNT = 'account',
    STAT = 'stat',
    USER = 'user',
    LEADERBOARD = 'leaderboard',
    CONTRIBUTION = 'contribution',
    UPDATE = 'update',
    MIGRATE = 'migrate',
    COLLECTION_NAME = 'collectionName',
    PROD = 'prod',
    DEV = 'dev',
    REBUILD = 'rebuild',
    INDEX = 'index',
    SYSTEM = 'system',
    BULK_UPLOAD = 'bulkupload',
    AUTH_DASH_USERS = 'auth-users',
    PROFILE = 'profile',
    IMAGE = 'image',
    STATUS = 'status',
    ADD = 'add',
    DEFAULT = 'default',
    LIVES = 'lives',
    REMOVE = 'remove',
    ALL = 'all',
    DAY = 'day',
    NEXT_Q = 'nextQ',
    NEXT = 'next',
    START = 'start',
    SIZE = 'size',
    QUESTION_ID = 'questionId',
    SUBSCRIPTION = 'subscription',
    GAME_ROUTES = 'gameRoutes',
    GENERAL = 'general',
    MIGRATION = 'migration',
    SCHEDULER = 'scheduler',
    FRIEND = 'friend',
    GAME_DASH_OVER = 'game-over',
    CHECK_DASH_GAME_DASH_EXPIRED_DASH_AND_DASH_SET_DASH_GAME_DASH_OVER = 'check-game-expired-and-set-game-over',
    TURN = 'turn',
    ADD_LIVES = 'add-lives',
    BLOG = 'blog',
    UPDATE_DASH_LIVES = 'update-lives',
    IMAGE_NAME = 'imageName',
    WIDTH = 'width',
    HEIGHT = 'height',
    COUNT = 'count',
    GAMEOVERAT = 'gameoverat',
    EXTENDEDINFO = 'extendedInfo',
    ACCOUNTS = 'accounts',
    ACHIEVEMENT = 'achievement',
    RULES = 'rules',
    GET_QUESTION_IMAGE = 'getQuestionImage',
    UPLOAD_QUESTION_IMAGE = 'uploadQuestionImage',
    DISPLAY_NAME = 'display-name',
    DISPLAY_DASH_NAME = 'displayName',
    UPDATE_USER_GAME_PLAYED_WITH_STAT = 'updateusergameplayedwithstat',
    ADDRESS_BY_LAT_LANG = 'addressByLatLang',
    LOCATION = 'location',
    LAT_LONG = 'latLong',
    ADDRESS_SUGGESTION = 'addressSuggestion',
    UPDATE_APP_VERSION = 'updateAppVersion',
    ADD_BITS_FIRST_QUESTION = 'add-bits-first-question',
    TOP_CATEGORIES_COUNT = 'getTopCategories',
    TOP_TAGS_COUNT = 'getTopTags',
    GAME_DASH_STAT_DASH_UPDATE = 'question-stat-update',
    NO_DASH_GAME_DASH_PLAY_DASH_32DAYS = 'no-game-play-32days',
    GAME_DASH_INVITATION_DASH_EXPIRE = 'game-invitation-expire',
    GAME_DASH_TIME_DASH_REMINDER_NOTIFICATION = 'game-time-reminder-notification',
    REMINDER_DASH_BEFORE_DASH_TIME = 'reminderBeforeTime',
    UPDATE_DASH_QUESTION_DASH_STATS = 'updateQuestionStats',    
    
}

export enum TermsAndPrivacyUrlConstant {
    TERMSANDCONDITIONSURL = 'https://bitwiser.io/terms-and-conditions',
    PRIVACYURL = 'https://bitwiser.io/terms-and-conditions'
}

export enum GameConstant {
    SINGLE = 'Single',
    OPPONENT = 'Opponent',
    RANDOM = 'Random',
    FRIEND = 'Friend',
    COMPUTER = 'Computer',
    NORMAL = 'Normal',
    OFFLINE = 'Offline'
}


export enum FirebaseAnalyticsKeyConstants {
    USER_ID = 'userId',
    GAME_ID = 'gameId',
    PLAYER_MODE = 'playerMode',
    OPPONENT_TYPE = 'opponentType',
    OTHER_USER_ID = 'otherUserId',
    USER_SCORE = 'userScore',
    OTHER_USER_SCORE = 'otherUserScore',
    GAME_STATUS = 'gameStatus',
    GAME_MODE = 'gameMode',
    CATEGORY_IDS = 'categoryIds',
    TAGS = 'tags',
    ROUND = 'round',
    IS_TIE = 'isTie',
    WINNER_PLAYER_ID = 'winnerPlayerId',
    LOCATION = 'location'
}

export enum FirebaseAnalyticsEventConstants {
    USER_LOGIN = 'user_login',
    COMPLETED_GAME = 'completed_game',
    START_NEW_GAME = 'start_new_game',
    USER_LOCATION = 'user_location'
}

export enum FirebaseScreenNameConstants {
    NEW_GAME = 'New Game',
    ACHIEVEMENTS = 'Achievements',
    PRIVACY_POLICY = 'Privacy Policy',
    RECENT_COMPLETED_GAMES = 'Recent Completed Games',
    DASHBOARD = ' Dashboard',
    LEADERBOARD = 'Leaderboard',
    GAME_OVER = 'Game Over',
    REPORT_GAME = 'Report Game',
    GAME_CONTINUE = 'Game Continue',
    GAME_QUESTION = 'Game Question',
    GAME_DIALOG = 'Game Dialog',
    INVITE_FRIENDS = 'Invite Friends',
    FRIEND_LIST = 'Friend List',
    MY_QUESTIONS = 'My Questions',
    INVITE_MAIL_FRIENDS = 'Invite Mail Friends',
    PROFILE_SETTINGS = 'Profile Settings',
    QUESTION_ADD_UPDATE = 'Question Add Update',
    LOGIN = 'Login',
    USER_FEEDBACK = 'User Feedback'
}

export enum GoogleLocationAPI {
    GOOGLE_AUTOCOMPLETE = 'https://maps.googleapis.com/maps/api/place/autocomplete/json',
    GOOGLE_GEOCODE = 'https://maps.googleapis.com/maps/api/geocode/json'
}

export enum AnalyticsEventConstants {
    EVENT = 'event',
}

export enum UserStatusConstants {
    ONLINE = 'online',
    OFFLINE = 'offline',
    CONNECTED = 'connected'
}

export enum DrawerConstants {
    UPDATE_TOKEN_STATUS = 'update token status',
    LOGOUT = 'logout'
}


export enum userCardType {
    USER_WEB_IMAGE_NAME_LOCATION_HORIZONTAL,
    USER_WEB_IMAGE_40X40_NAME_HORIZONTAL,
    USER_WEB_IMAGE_70X60_NAME_LOCATION,
    USER_WEB_IMAGE_70X60_IMAGE_VERTICAL,
    USER_WEB_IMAGE_NAME_STATUS_HORIZONTAL,
    USER_WEB_NAME_IMAGE_HORIZONTAL,
    USER_WEB_IMAGE_NAME_STATUS_LOCATION_HORIZONTAL,
    USER_WEB_IMAGE_NAME_LOCATION_VERTICAL,
    USER_WEB_IMAGE_NAME_VERTICAL,
    USER_WEB_IMAGE_NAME_RECENT_GAME_VERTICAL,
    USER_IMAGE_NAME_VERTICAL_NO_REDIRECT,
    USER_IMAGE_NAME_WITH_SCORE,
    USER_IMAGE_NAME_HORIZONTAL,
    USER_IMAGE_NAME_LAST_GAME_PLAYED_HORIZONTAL,
    USER_IMAGE_NAME_LOCATION_HORIZONTAL,
    USER_NAME_IMAGE_HORIZONTAL,
    USER_IMAGE_NAME_VERTICAL,
    USER_IMAGE_NAME_VERTICAL_GAME_OVER,
    USER_IMAGE_NAME_CATEGORY_HORIZONTAL,
    USER_IMAGE_WITH_ONLINE_STATUS,
    USER_WEB_IMAGE_WITH_ONLINE_STATUS,
    USER_IMAGE_NAME_GAME_PROFILE_HORIZONTAL,
    USER_IMAGE_NAME_PROFILE_HORIZONTAL,
    USER_IMAGE_NAME_WITH_SCORE_IN_GAME_PLAY_SINGLE_PLAYER,
    USER_IMAGE_NAME_WITH_SCORE_IN_GAME_PLAY_TWO_PLAYER,
    USER_IMAGE_30X30

}
