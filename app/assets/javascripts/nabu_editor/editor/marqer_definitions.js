var categories = [ 
  { 'title': 'Tekst',        'id': 'text'         },
  { 'title': 'Meer info',    'id': 'meer_info'    },
  { 'title': 'Social',       'id': 'social'       },
  { 'title': 'Opmaak',       'id': 'opmaak'       },
  // { 'title': 'Test&Quiz',    'id': 'test_quiz'    },
  { 'title': 'beta',         'id': 'experimental' }
];

var available_marqers = [  
  { 'name': 'Optitel',                       'type': 'TitleMarqer',                    'icon': '', 'category': 'text',         'version':'beta'  },
  { 'name': 'Tekst',                         'type': 'SimpleTextMarqer',               'icon': '', 'category': 'text',         'version':'alpha' },
  { 'name': 'Ondertiteling',                 'type': 'SRTMarqer',                      'icon': '', 'category': 'text',         'version':'alpha' },
  { 'name': 'Ondertitel',                    'type': 'SubTitleMarqer',                 'icon': '', 'category': 'text',         'version':'alpha' },
 
  { 'name': 'Geluid',                        'type': 'AudioMarqer',                    'icon': '', 'category': 'meer_info',    'version':'alpha' },
  { 'name': 'RSS',                           'type': 'RSSMarqer',                      'icon': '', 'category': 'meer_info',    'version':'beta'  },
  { 'name': 'Domein Afhankelijke RSS',       'type': 'MHPaperDependantRSSMarqer',      'icon': '', 'category': 'meer_info',    'version':'beta'  },      
   
  { 'name': 'Eigen Html',                    'type': 'FreeHtmlCssMarqer',              'icon': '', 'category': 'meer_info',    'version':'beta'  },
  { 'name': 'Knop',                          'type': 'ButtonMarqer',                   'icon': '', 'category': 'meer_info',    'version':'alpha' },
  { 'name': 'Afbeelding',                    'type': 'FreeImageMarqer',                'icon': '', 'category': 'meer_info',    'version':'beta'  },
  { 'name': 'Logo',                          'type': 'ImageMarqer',                    'icon': '', 'category': 'meer_info',    'version':'beta'  },
  { 'name': 'Link',                          'type': 'UrlMarqer',                      'icon': '', 'category': 'meer_info',    'version':'beta'  },    
 
  { 'name': 'Submenu',                       'type': 'SubmenuMarqer',                  'icon': '', 'category': 'experimental', 'version':'alpha' },
  { 'name': 'Zijpanel',                      'type': 'SidePanelMarqer',                'icon': '', 'category': 'experimental', 'version':'alpha' },
  { 'name': 'Film Titel',                    'type': 'FilmTitleMarqer',                'icon': '', 'category': 'opmaak',       'version':'alpha' },
 
  { 'name': 'Twitter',                       'type': 'TwitterMarqer',                  'icon': '', 'category': 'social',       'version':'alpha' },
  { 'name': 'Share Buttons',                 'type': 'ShareMarqer',                    'icon': '', 'category': 'social',       'version':'alpha' },
  { 'name': 'LinkedIn',                      'type': 'LinkedinMarqer',                 'icon': '', 'category': 'experimental', 'version':'alpha' },
 
  { 'name': 'Player Control',                'type': 'PlayerControlMarqer',            'icon': '', 'category': 'experimental', 'version':'alpha' },  
  { 'name': 'Seriously',                     'type': 'SeriouslyMarqer',                'icon': '', 'category': 'experimental', 'version':'alpha' },  
  { 'name': 'Achtergrond',                   'type': 'BackgroundMarqer',               'icon': '', 'category': 'opmaak',       'version':'alpha' }
  
  //{ 'name': 'Wikipedia',                     'type': 'WikipediaMarqer',                'icon': '', 'category': 'experimental', 'version':'alpha' },
  //{ 'name': 'Motion Tracker',                'type': 'MotionTrackerMarqer',            'icon': '', 'category': 'experimental', 'version':'alpha' },
  //{ 'name': 'Facebookpoort',                 'type': 'FacebookGateMarqer',             'icon': '', 'category': 'experimental', 'version':'alpha' },
  //{ 'name': 'Famo.us',                       'type': 'FamousMarqer',                   'icon': '', 'category': 'experimental', 'version':'alpha' },
  //{ 'name': 'Fatchat',                       'type': 'FatChatMarqer',                  'icon': '', 'category': 'experimental', 'version':'alpha' },
  //{ 'name': 'Google Maps',                   'type': 'GoogleMapsMarqer',               'icon': '', 'category': 'experimental', 'version':'alpha' },
  //{ 'name': 'Picture in Picture',            'type': 'PiPMarqer',                      'icon': '', 'category': 'experimental', 'version':'alpha' },
  //{ 'name': 'Post Message',                  'type': 'PostMessageMarqer',              'icon': '', 'category': 'experimental', 'version':'alpha' },
  //{ 'name': 'Highscores',                    'type': 'MTHighscoreMarqer',              'icon': '', 'category': 'test_quiz',    'version':'alpha' },
  //{ 'name': 'Opt in',                        'type': 'MTOptInMarqer',                  'icon': '', 'category': 'test_quiz',    'version':'alpha' },
  //{ 'name': 'Score',                         'type': 'MTScoreMarqer',                  'icon': '', 'category': 'test_quiz'     'version':'alpha' },
  //{ 'name': 'Tekstblok',                     'type': 'TextAreaMarqer',                 'icon': '', 'category': 'text',         'version':'alpha' },
  //{ 'name': 'Vragen',                        'type': 'MTQuestionMarqer',               'icon': '', 'category': '',             'version':'alpha' },
  //{ 'name': 'Score Afhankelijke Eindteksten','type': 'MTScoreDependantEndTextMarqer',  'icon': '', 'category': '',             'version':'alpha' },
  //{ 'name': 'Score Afhankelijke Opt-in',     'type': 'MTScoreDependantOptInMarqer',    'icon': '', 'category': '',             'version':'alpha' },
  //{ 'name': 'Doet niks',                     'type': 'DefaultMarqer',                  'icon': '', 'category': '',             'version':'alpha' },
  //{ 'name': 'Email Forwarding',              'type': 'MTEmailForwardMarqer',           'icon': '', 'category': 'social',       'version':'alpha' },
  //{ 'name': 'Sociale media',                 'type': 'MTShowSocialMediaMarqer',        'icon': '', 'category': 'social'        'version':'alpha' }

];
