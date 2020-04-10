export class ApplicationSettings {
    answer_max_length: number;             // Maximum character allowed for answer
    game_play_categories: Array<number>;   // Define categories Id to play game
    game_play_show_tags: boolean;          // Show/Hide  Tags in New game
    question_max_length: number;           // Maximum character allowed for question
    game_play_timer_loader_ranges: Array<TimerLoader>;  // Contains start range, end  range and seconds
    lives: Lives;
    social_profile: Array<SocialProfile>;
    tokens: Tokens;
    earn_bytes_on_question_contribute: number;
    enabled_rich_editor: boolean;
    display_achievements: boolean;
    quill_options: { list, options, custom_toolbar_position: string, web_view_question_options, web_view_answer_options };
    max_image_size_of_question?: number;
    android_version: number;
    ios_version: number;
    phone_authentication: boolean;
    game_play_max_time: number[];
    default_names: Array<string>;
    user_display_name_value: number;
    first_question_bits?: number;
    show_welcome_screen: boolean;
    show_category_screen?: boolean;
    category_count_limit?: number;
    tag_count_limit?: number;
    game_question_bits?: number;
    invite_bits?: number;
    invite_bits_enabled?: boolean;
    auto_save: { is_enabled: boolean, time: number };
    apple_authentication: boolean;
    badges: {};
    notification_template: { [key: string]: { message: string} };
}

export class TimerLoader {
    start: number;
    end: number;
    seconds: number;
}

export class Lives {
    enable: boolean;
    lives_add: number;
    lives_after_add_millisecond: number;
    max_lives: number;
}

export class SocialProfile {
    display: String;
    enable: Boolean;
    position: Number;
    social_name: string;
    url: String;
}
export class Tokens {
    enable: boolean;
    earn_bits: number;
    earn_bytes: number;
}
