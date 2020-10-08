export const ApplicationSettings = {
  'android_version': 79,
  'answer_max_length': 128,
  'apple_authentication': true,
  'max_image_size_of_question': 1024,
  'auto_save': {
    'is_enabled': true,
    'time': 30000
  },
  'badges': {
    'lizard': {
      'category': 8,
      'class': 'score5',
      'image': {
        'full_name': 'badge5.png',
        'name': 'badge5'
      }
    },
    'paper': {
      'category': 0,
      'class': 'score2',
      'image': {
        'full_name': 'badge2.png',
        'name': 'badge2'
      }
    },
    'rock': {
      'category': 0,
      'class': 'score1',
      'image': {
        'full_name': 'badge1.png',
        'name': 'badge1'
      }
    },
    'scissors': {
      'category': 0,
      'class': 'score3',
      'image': {
        'full_name': 'badge3.png',
        'name': 'badge3'
      }
    },
    'spoke': {
      'category': 1,
      'class': 'score4',
      'image': {
        'full_name': 'badge4.png',
        'name': 'badge4'
      }
    }
  },
  'default_names': [
    'HackMan',
    'FluxCapacitor',
    'PyCharmer',
    'NullPointer',
    'ContinuousIntegrator',
    'SeeSharper',
    'NothingBut.Net'
  ],
  'display_achievements': false,
  'earn_bytes_on_question_contribute': 4,
  'enabled_rich_editor': true,
  'first_question_bits': 50,
  'game_play_categories': [
    9,
    8,
    4,
    1,
    6,
    2,
    3,
    5,
    7
  ],
  'game_play_max_time': [
    8,
    16,
    32,
    64,
    128
  ],
  'game_play_show_tags': true,
  'game_play_timer_loader_ranges': [
    {
      'end': 256,
      'seconds': 16,
      'start': 0
    },
    {
      'end': 512,
      'seconds': 24,
      'start': 256
    },
    {
      'end': 10000000000000000,
      'seconds': 32,
      'start': 512
    }
  ],
  'game_question_bits': 50,
  'invite_bits': 4,
  'invite_bits_enabled': true,
  'ios_version': 74,
  'lives': {
    'enable': true,
    'lives_add': 2,
    'lives_after_add_millisecond': 1920000,
    'max_lives': 4
  },
  'notification_template': {
    'achievement_notification': {
      'message': 'You get ${achievement} Achievement'
    },
    'friend_notifications': {
      'message': '${displayName}  wants to friend you on bitWiser! Accept or Deny. Let the bitWiser battles begin!'
    },
    'game_completed': {
      'message': '${displayName} won this bitWiser game. Play again, to get even!'
    },
    'game_invitation_remaining_time_notifications_8_hr': {
      'message': 'Your game play invitation from ${displayName} will expire in 8 hours. Accept the challenge and play now!'
    },
    'game_play_lag_notification': {
      'message': '${displayName} - we have added new questions to bitWiser! Come back and challenge your friends to a new game.'
    },
    'game_remaining_time_notifications_32_mins': {
      'message': 'You have only 32 minutes left to be a bitWiser! Play now!'
    },
    'game_remaining_time_notifications_8_hr': {
      'message': 'Your bitWiser game will expire in 8 hours, play now!'
    },
    'invitation_timeout': {
      'message': 'Your game play invitation to ${displayName} expired. Challenge your friends to a new game!'
    },
    'new_gmae_start_with_opponent': {
      'message': '${displayName} started a new bitWiser game with you! Stay tuned for your turn!'
    },
    'question_notifications_approved': {
      'message': 'Yay! Your submitted question has been approved for the bitWiser question bank. You earned 8 bytes!!'
    },
    'question_notifications_status_change': {
      'message': 'The status changed from ${oldStatus} to ${newStatus} for your question.'
    },
    'time_expired_notification_game_lost': {
      'message': 'You snooze you lose! sorry, your bitWiser game ended. Take another shot now!'
    },
    'time_expired_notification_game_won': {
      'message': '${displayName} did not answer in time. You have won this bitWiser game! You are on a roll, start another game.'
    },
    'turn_change_notification_current_player': {
      'message': '${displayName}’s turn to play bitWiser.'
    },
    'turn_change_on_wrong_answer': {
      'message': '${displayName} did not answer correctly. It\'s your turn now!!'
    },
    'turn_change_user_not_answered_notification_to_next_player': {
      'message': '${displayName} did not answer in time. It’s your turn to play and win bitWiser!'
    },
    'waiting_for_friend_invitation_acceptance': {
      'message': '${displayName} has invited you to a new game. It\'s your turn to play!'
    },
    'waiting_for_random_player_invitation_acceptance': {
      'message': '${displayName} has invited you to a new game. It\'s your turn to play!'
    }
  },
  'phone_authentication': true,
  'question_max_length': 256,
  'quill_options': {
    'custom_toolbar_position': 'bottom',
    'list': [
      {
        'list': 'bullet'
      },
      {
        'list': 'ordered'
      }
    ],
    'options': [
      'bold',
      'italic',
      'underline',
      'strike',
      'mathEditor',
      'image',
      'code-block'
    ],
    'web_view_answer_options': {
      'ql-code-block': '<button type=\'button\' class=\'ql-code-block\'></button>'
    },
    'web_view_question_options': {
      'ql-code-block': '<button type=\'button\' class=\'ql-code-block\'></button>',
      'ql-image': '<button type=\'button\' class=\'ql-image\'></button>'
    }
  },
  'show_welcome_screen': true,
  'social_profile': [
    {
      'display': 'Github',
      'enable': false,
      'position': 0,
      'social_name': 'githubUrl',
      'url': 'https://www.github.com/'
    },
    {
      display: 'Stack Overflow',
      enable: true,
      position: 1,
      social_name: 'stackoverflowUrl',
      url: 'https://www.stackoverflow.com/users/',
      socialUrl: 'https://www.stackoverflow.com/users/'
    },
    {
      display: 'Hacker News',
      enable: true,
      position: 2,
      social_name: 'hackernewsUrl',
      url: 'https://thehackernews.com/',
      socialUrl: 'https://thehackernews.com/'
    },
    {
      display: 'Reddit',
      enable: true,
      position: 3,
      social_name: 'redditUrl',
      url: 'https://www.reddit.com/user/',
      socialUrl: 'https://www.reddit.com/user/'
    },
    {
      display: 'LinkedIn',
      enable: true,
      position: 4,
      social_name: 'linkedInUrl',
      url: 'https://www.linkedin.com/in/',
      socialUrl: 'https://www.linkedin.com/in/'
    },
    {
      display: 'Twitter',
      enable: true,
      position: 5,
      social_name: 'twitterUrl',
      url: 'https://www.twitter.com/',
      socialUrl: 'https://www.twitter.com/'
    }
  ],
  'tag_count_limit': 10,
  'tokens': {
    'earn_bits': 4,
    'earn_bytes': 2,
    'enable': true
  },
  'user_display_name_value': 1282
};
