var categories = [
  { "title": t.marqer_categories.text,        "id": "text"         },
  { "title": t.marqer_categories.more_info,   "id": "meer_info"    },
  { "title": "MovieTrader",                   "id": "movietrader"  },
  { "title": t.marqer_categories.social,      "id": "social"       },
  { "title": t.marqer_categories.layout,      "id": "opmaak"       },
  { "title": t.marqer_categories.beta,        "id": "experimental" }
];

var available_marqers = [
  { "name": t.marqer_names.title,           "type": "TitleMarqer",                    "icon": "", "category": "text",         "version":"beta"  },
  { "name": t.marqer_names.simple_text,     "type": "SimpleTextMarqer",               "icon": "", "category": "text",         "version":"alpha" },
  { "name": t.marqer_names.srt,             "type": "SRTMarqer",                      "icon": "", "category": "text",         "version":"alpha" },
  { "name": t.marqer_names.subtitle,        "type": "SubTitleMarqer",                 "icon": "", "category": "text",         "version":"alpha" },

  { "name": t.marqer_names.audio,           "type": "AudioMarqer",                    "icon": "", "category": "meer_info",    "version":"alpha" },
  { "name": t.marqer_names.rss,             "type": "RSSMarqer",                      "icon": "", "category": "meer_info",    "version":"beta"  },
  { "name": t.marqer_names.domain_rss,      "type": "MHPaperDependantRSSMarqer",      "icon": "", "category": "meer_info",    "version":"beta"  },

  { "name": t.marqer_names.free_html,       "type": "FreeHtmlCssMarqer",              "icon": "", "category": "meer_info",    "version":"beta"  },
  { "name": t.marqer_names.button,          "type": "ButtonMarqer",                   "icon": "", "category": "meer_info",    "version":"alpha" },
  { "name": t.marqer_names.free_image,      "type": "FreeImageMarqer",                "icon": "", "category": "meer_info",    "version":"beta"  },
  { "name": t.marqer_names.image,           "type": "ImageMarqer",                    "icon": "", "category": "meer_info",    "version":"beta"  },
  { "name": t.marqer_names.url,             "type": "UrlMarqer",                      "icon": "", "category": "meer_info",    "version":"beta"  },

  { "name": t.marqer_names.submenu,         "type": "SubmenuMarqer",                  "icon": "", "category": "experimental", "version":"alpha" },
  { "name": t.marqer_names.side_panel,      "type": "SidePanelMarqer",                "icon": "", "category": "experimental", "version":"alpha" },
  { "name": t.marqer_names.film_title,      "type": "FilmTitleMarqer",                "icon": "", "category": "opmaak",       "version":"alpha" },

  { "name": t.marqer_names.twitter,         "type": "TwitterMarqer",                  "icon": "", "category": "social",       "version":"alpha" },
  { "name": t.marqer_names.share,           "type": "ShareMarqer",                    "icon": "", "category": "social",       "version":"alpha" },
  { "name": t.marqer_names.linked_in,       "type": "LinkedinMarqer",                 "icon": "", "category": "experimental", "version":"alpha" },

  { "name": t.marqer_names.player_control,  "type": "PlayerControlMarqer",            "icon": "", "category": "experimental", "version":"alpha" },
  { "name": t.marqer_names.seriously,       "type": "SeriouslyMarqer",                "icon": "", "category": "experimental", "version":"alpha" },
  { "name": t.marqer_names.background,      "type": "BackgroundMarqer",               "icon": "", "category": "opmaak",       "version":"alpha" },
  { "name": t.marqer_names.react,           "type": "ReactMarqer",                    "icon": "", "category": "experimental", "version":"alpha" },

  //{ "name": "Wikipedia",                     "type": "WikipediaMarqer",                "icon": "", "category": "experimental", "version":"alpha" },
  //{ "name": "Motion Tracker",                "type": "MotionTrackerMarqer",            "icon": "", "category": "experimental", "version":"alpha" },
  //{ "name": "Facebookpoort",                 "type": "FacebookGateMarqer",             "icon": "", "category": "experimental", "version":"alpha" },
  //{ "name": "Famo.us",                       "type": "FamousMarqer",                   "icon": "", "category": "experimental", "version":"alpha" },
  //{ "name": "Fatchat",                       "type": "FatChatMarqer",                  "icon": "", "category": "experimental", "version":"alpha" },
  //{ "name": "Google Maps",                   "type": "GoogleMapsMarqer",               "icon": "", "category": "experimental", "version":"alpha" },
  //{ "name": "Picture in Picture",            "type": "PiPMarqer",                      "icon": "", "category": "experimental", "version":"alpha" },
  //{ "name": "Post Message",                  "type": "PostMessageMarqer",              "icon": "", "category": "experimental", "version":"alpha" },
  { "name": "Highscores",                    "type": "MTHighscoreMarqer",              "icon": "", "category": "movietrader",    "version":"alpha" },
  { "name": "Opt in",                        "type": "MTOptInMarqer",                  "icon": "", "category": "movietrader",    "version":"alpha" },
  { "name": "Score",                         "type": "MTScoreMarqer",                  "icon": "", "category": "movietrader",    "version":"alpha" },
  //{ "name": "Tekstblok",                     "type": "TextAreaMarqer",                 "icon": "", "category": "text",         "version":"alpha" },
  //{ "name": "Vragen",                        "type": "MTQuestionMarqer",               "icon": "", "category": "",             "version":"alpha" },
  { "name": "Score Afhankelijke Eindteksten","type": "MTScoreDependantEndTextMarqer",  "icon": "", "category": "movietrader",    "version":"alpha" },
  { "name": "Score Afhankelijke Opt-in",     "type": "MTScoreDependantOptInMarqer",    "icon": "", "category": "movietrader",    "version":"alpha" },
  //{ "name": "Doet niks",                     "type": "DefaultMarqer",                  "icon": "", "category": "",             "version":"alpha" },
  { "name": "Email Forwarding",              "type": "MTEmailForwardMarqer",           "icon": "", "category": "movietrader",    "version":"alpha" },
  { "name": "Sociale media",                 "type": "MTShowSocialMediaMarqer",        "icon": "", "category": "movietrader",    "version":"alpha" }

];
