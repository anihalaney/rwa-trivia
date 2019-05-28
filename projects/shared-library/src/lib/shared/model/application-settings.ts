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
    display_achievements: boolean;
    android_version: number;
    ios_version: number;
    phone_authentication: boolean;
    default_names: Array<string>;
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
