// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// the compiled file.
//
// WARNING: THE FIRST BLANK LINE MARKS THE END OF WHAT'S TO BE PROCESSED, ANY BLANK LINE SHOULD
// GO AFTER THE REQUIRES BELOW.
//

// JQUERY
//= require jquery
//= require jquery_ujs
//= require jqueryui/jquery-ui-1.11.4
//= require jquery-touch-punch/jquery.ui.touch-punch.min

// TURBOLINKS
//= require turbolinks

// REACT
// require react/react
//= require react/react-with-addons
//= require react/react_ujs
//= require components
//= require_tree ./components

// BOOTSTRAP
//= require bootstrap
//= require bootstrap-material-design/material
//= require bootstrap-material-design/ripples

// UPLOADERS
//= require s3_direct_upload
// require bootstrap-fileinput/bootstrap-fileinput

// POPCORN
//= require popcorn
// require popcorn_admin

// ### OPTIONALS ###

// ANGULAR
// require angular

// MOMENT http://momentjs.com/
//= require moment/moment

// DATEPICKERS
// require bootstrap-daterangepicker/moment.js
// require bootstrap-daterangepicker/daterangepicker.js

// HELPERS
//= require colorpicker/bootstrap-colorpicker-new
// require colorpicker/bootstrap-colorpicker
//= require image-picker/image-picker
// require slider/bootstrap-slider

// DRAG-DROP helper (not used)
// require interact/interact.js

// JQUERY HELPERS
//= require jquery-fittext/jquery.fittext.js 
//= require jquery-shapeshift/jquery.shapeshift.min
//= require jquery-cookie/jquery.cookie
// require jquery-fbjlike/jquery.fbjlike            // facebook

// DATATABLES
// require dataTables/jquery.dataTables
// require dataTables/jquery.dataTables.bootstrap3

// SMOOTHER 
// require smooth/smooth

// SERIOUSLY ( -- seriously is injected at runtime )
// require seriously/seriously.js

// HANDLERBARS
//= require handlebars.runtime
//= require handlebars_helpers
//= require templates/marqer_templates
//= require_tree ./templates

// CODE EDITOR
//= require ace/ace.js

// CHARTS
// require highcharts/highcharts.js
// require highcharts/modules/exporting.js
// require oocharts/oocharts.js

// MARDUQ
//= require marduq_api/marduq_api
//= require marduq/utils
// require marduq/options
//= require marduq/debug
// require marduq/social
//= require marduq/player
// require marduq/editor

// ### EXTRAS ####
//= require marduq/marqers/MarqerPrototype
//= require marduq/marqer_definitions
//= require marduq/marqers/MotionTrackerMarqer
// require marduq/motion_data_editor

//= require marduq/marqers
//= require marduq/controls
//= require marduq/social

// require admin/create_movie ( this one has been depreicated and is updated in the engine )
// require admin/describe_movie ( this one has been depreicated and is updated in the engine )
// require marduq/marduq

// TODO move or connect this approprietly
moment.locale('nl')
