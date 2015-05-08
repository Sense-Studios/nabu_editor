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
    "urchin": ""
  },
  
  "player_options": {
    "autoplay": "false",
    "showscores":"true",
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
    "title": "true",
    "description": "true",  
    "thumbnail": "true",
    "pop_under": "false",
    "pop_under_target": ""
  },
  
  "on_movie_end": {
    "set": "do-nothing",
    "linked_page": "http://",
    "shown_text": "",
    "next_program_id": "",
    "score_dependent_texts": [],
    "score_dependent_texts_header": "",

    "show_social_media": "false",
    "show_highscores": "true",
    "show-opt-in": "true",
    "email-forwarding": "true",
    "show-score-dependant-texts": "true"
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
  
  "advanced": {
    // note that these are relayed through
    // custom marquers; ImageBeforeMarqer, ImageDuringMarqer, ImageAfterMarqer 
    // (nameing sucked out of my thumb)

    "show_image_before": "false",
    "show_image_before_url": "",
    "show_image_before_asset_id": "",
    "show_image_during": "false",
    "show_image_during_url": "",
    "show_image_during_asset_id": "",
    "show_image_after": "false",
    "show_image_after_url": "",
    "show_image_after_asset_id": ""
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
  [ 'showscores',      $('#show-scores')     ],
  [ 'pop_under',       $('#use_pop_under')   ]      
];

movie_end_checkboxes = [    
  [ "show_social_media",          $('#show-social-media')          ],
  [ "show_highscores",            $('#show-highscores')            ],
  [ "show-opt-in",                $('#show-opt-in')                ],
  [ "email-forwarding",           $('#email-forwarding')           ],
  [ "show-score-dependant-texts", $('#show-score-dependant-texts') ]
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
  [ 'show_image_before', $('#before_movie_image_checkbox') ],  
  [ 'show_image_during', $('#branded_logo_image_checkbox') ],    
  [ 'show_image_after',  $('#after_movie_image_checkbox')  ]
];