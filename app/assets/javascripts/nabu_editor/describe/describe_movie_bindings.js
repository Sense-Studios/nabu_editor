// *****************************************************************************
// Program Descriptor
// *****************************************************************************

var metaData =  {
  "moviedescription": {
    "title": "",
    "description": "",
    "in-point": "",
    "out-point": "",
    "tags": "",
    "thumbnail": "",
    "urchin": "",
    "duration_in_ms": ""
  },

  "player_options": {
    "title": "true",
    "description": "true",
    "autoplay": "false",
    //"showscores":"true",
    "scrubbar": "true",
    "allow_scrubbing": "true",
    "loader": "true",
    "playhead": "true",
    "time": "true",
    "duration": "true",
    "quality": "false",
    "fullscreen": "true",
    "seek": "false",
    "volume": "false",
    "mute": "true",
    "show_big_play": "true",
    "thumbnail": "true",

    "pop_under": "false",
    "pop_under_target": "",

    "enable_password": false,
    "movie_password": "password",

    "import_subtitles": false,
    "subtitle_language": "en",

    "custom_widget_id": "",
    "custom_embed_code": ""
  },

  "on_movie_end": {
    "set": "do-nothing",
    "linked_page": "http://",
    "shown_text": "",
    "next_program_id": ""
    //"score_dependent_texts": [],
    //"score_dependent_texts_header": "",
    //"show_social_media": "false",
    //"show_highscores": "true",
    //"show-opt-in": "true",
    //"email-forwarding": "true",
    //"show-score-dependant-texts": "true"
  },

  "social": {
    "title": "",
    "url": "",
    "description": "",
    "subject": "",
    "body": "",
    "facebook": "false",
    "linkedin": "false",
    "twitter": "false",
    "google": "false",
    "reddit": "false",
    "pinterest": "false",
    "email": "false",
    "like": "false",
    "plusone": "false"
  },

  "statistics": {
    "views": 0,
    "openers": 0,
    "completed": 0,
    "timewatched": 0,
    // "statistics" => "0",
    "logging_enabled": "false"
  }
};

// checkbox holder
var movie_options_checkboxes;
var movie_end_checkboxes;
var advanced_checkboxes;
var social_checkboxes;

// attaches meta data object elements, program.meta.player_options[*]
// to in-page elements
movie_options_checkboxes = [
  [ 'scrubbar',        $('#show-progress')   ],
  [ 'allow_scrubbing', $('#allow-scrubbing') ],
  [ 'show_big_play',   $('#show-big-play')   ],
  [ 'duration',        $('#show-duration')   ],
  [ 'time',            $('#show-time')       ],
  [ 'quality',         $('#show-quality')    ],
  [ 'fullscreen',      $('#show-fullscreen') ],
  [ 'volume',          $('#show-volume')     ],
  [ 'seek',            $('#show-seek')       ],
  [ 'mute',            $('#show-mute')       ],
  [ 'title',           $('#show-title')      ],
  [ 'autoplay',        $('#autoplay')        ],
  [ 'description',     $('#show-description')],

  //[ 'showscores',      $('#show-scores')     ],
  [ 'pop_under',       $('#use_pop_under')   ],

  // "pop_under": "false",
  // "pop_under_target": "",

  [ "custom_widget_id", $('#custom_widget_id') ],
  [ "custom_embed_code", $('#custom_embed_code') ]
];

movie_end_checkboxes = [
  //[ "show_social_media",          $('#show-social-media')          ],
  //[ "show_highscores",            $('#show-highscores')            ],
  //[ "show-opt-in",                $('#show-opt-in')                ],
  //[ "email-forwarding",           $('#email-forwarding')           ],
  //[ "show-score-dependant-texts", $('#show-score-dependant-texts') ]
];

// attaches meta data object elements, program.meta.social.networks[*]
// to in-page elements
social_checkboxes = [
  [ 'facebook',  $('#social-facebook ')  ],
  [ 'linkedin',  $('#social-linkedin ')  ],
  [ 'twitter',   $('#social-twitter ')   ],
  [ 'google',    $('#social-google')     ],
  [ 'reddit',    $('#social-reddit')     ],
  [ 'pinterest', $('#social-pinterest')  ],
  [ 'email',     $('#social-email')      ],
  [ 'like',      $('#social-like ')      ],
  [ 'plusone',   $('#social-plusone')    ]
];

// attaches meta data object elements, program.meta.advanced[*]
// to in-page elements
advanced_checkboxes = [
  //[ 'show_image_before', $('#before_movie_image_checkbox') ],
  //[ 'show_image_during', $('#branded_logo_image_checkbox') ],
  //[ 'show_image_after',  $('#after_movie_image_checkbox')  ]
];
