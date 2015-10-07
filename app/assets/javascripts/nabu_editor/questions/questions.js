/*global
pop
holder
HandlebarsTemplates
program
mapi
preview
t
metaData
m
postMetaData
active_marqers
*/

// *****************************************************************************
//  Options
// *****************************************************************************

var defaultScore = 10; // move to options ?
var questiondatahaschanged = false;

// *****************************************************************************
//  Timer
// *****************************************************************************

function updateTimer(e) {
  $('#timer').val( Math.round( pop.currentTime() * 10 ) / 10 );
}


// *****************************************************************************
//  Delegated handlers for removing dynamically added elements
//  Add inside dom ready handler
// *****************************************************************************

$(function() {
  // Delegated click handler for removing score-dependent-text rows
  $( "#score_text_holder" ).on( "click", ".delete-score-text", function() {
    $(this).closest('.row.score_text').remove();
  });
});


// *****************************************************************************
//  Scoring dependencies
// *****************************************************************************

function addScoreDependentText(e) {
  var id = 'sct-' + new Date().getTime();
  var context = {id: id};
  var output = HandlebarsTemplates['score_dependent_text'](context);
  $('#score_text_holder').append(output);
  $('#score_text_holder').find('.score-text:last').find('.delete-score-text').click( function(e) {
   $(this).parent().parent().parent().remove();
  });
}


// *****************************************************************************
//  Questions
// *****************************************************************************

function createQuestionInterface( remote_id ) {

}

function addQuestion( remote_id ) {
  var id = Math.round( Math.random() * 10000000 ); // remote id
  var q_text = "";
  var r_id = -1; // temp ud

  // check for remote id
  //if ( remote_id !== undefined ) r_id = remote_id;

  var context = {
    "id": id,
    "r_id": remote_id,
    //"remote_id": remote_id,
    "question-suggestion": $('#question_suggestion').val(),
    "time": Math.round( pop.currentTime() * 10 ) / 10
  };

  if (context.time ===  0 ) context.time = 0.1;

  // create the question
  q_text = HandlebarsTemplates['question'](context);
  $('#questions_holder').prepend(q_text); // append it all

  // start the scripts
  var that = '#qid-' + id; // hook for post scripts
  $(that).hide().fadeIn("slow"); // visual hokey pokey
  $( that + " .question-question" ).focus(); // focus on the input field

  $( that + " .btn-skip-to" ).click( function() {
    pop.currentTime( Number( $(that).find('.in-point').val() ) + 0.1 );
  }); // add skip to functionality

  $(that + " .help").click( function(e) {
    $('#myModal').modal();
  }); // attach help

  // delete
  $(that + " .delete").click(function(e) {
    deleteMarqer( getMarqerById( $(that).attr('remote_id') ) );
    $(that).remove();
  });

  // ### change question type;
  // 1) first check if there are still anwsers
  $( that + " select.question-type").click( function(e) {
    if ( $( that ).find('.answer').length > 0 ) {
      alert( t.admin.questions.questions_warning );
      e.preventDefault()
      return;
    }
  })

  // 2) then go ahead and actually change the type
  $( that + " select.question-type").change( function() {
    changeQuestionType( that, $(that + " select.question-type").val() );
  });

  // answers defaults to multiplechoice
  changeQuestionType( that, "fmc" );

  // use smpt
  setTimeout( function() { convertSeconds('.in-point') }, 250 ); 

  // return id, for autogeneration of quesions
  return id;
}

// Change the question type
function changeQuestionType( question_id, _to ) {
  console.log("change type", question_id, _to );

  if (_to == undefined) return;

  //$(question_id).find('.in-point:eq(0)').click( function() { console.log('allo allo ... CLICK'); } );
  /*
  $(question_id).find('.in-point:eq(0)').change( function() {
    if ( $(this).val() <= 0 ) {
      $(this).addClass('btn-warning');
      $(this).val('0.1');

      // ### TODO: translate!
      alert("To prevent everything blowing up, the In-point can not be smaller then 0.1");
      return;
    }else{
      $(this).removeClass('btn-warning');
    }
  });
  */

  // reset
  $(question_id + ' .answers_holder').html('');
  $(question_id + ' .add_new_answer').show();


  // FIXME, this should be so much more condensed:

  if ( _to == "mc" ) { // multiple choice
    //console.log("mc");
    $(question_id + ' .add_new_answer').unbind('click');
    $(question_id + ' .add_new_answer').click( function() {
      var id = new Date().getTime();
      var mc_output = HandlebarsTemplates['mc_answer']({"id":id, "q_id": question_id, "type": _to});
      $(question_id + ' .answers_holder').append( mc_output );
      addInteractionToAnswer(id, question_id );
    });
  }

  if (_to == "mmc" ) { // multiple multiple choice
    // activate add question handler
    //console.log("mmc");
    $(question_id + ' .add_new_answer').unbind('click');
    $(question_id + ' .add_new_answer').click( function() {
      var id = new Date().getTime();
      var mmc_output= HandlebarsTemplates['mmc_answer']({"id":id, "q_id": question_id, "type": _to});
      $( question_id + ' .answers_holder').append( mmc_output );
      addInteractionToAnswer( id, question_id );
    });
  }

  if ( _to == "fmc" ) { // ( Single choice ) force multiple choice
    //console.log("fmc");
    $(question_id + ' .add_new_answer').unbind('click');
    $(question_id + ' .add_new_answer').click( function() {
      var id = new Date().getTime();
      var fmc_output = HandlebarsTemplates['fmc_answer']({"id":id, "q_id": question_id, "type": _to});
      $(question_id + ' .answers_holder').append( fmc_output );
      addInteractionToAnswer(id, question_id );
      checkCorrectAnswer( question_id );
    });
  }

  if ( _to == "fmmc" ) { // ( Plural choice ) force multiple multiple choice
    // activate add question handler
    //console.log("fmmc");
    $(question_id + ' .add_new_answer').unbind('click');
    $(question_id + ' .add_new_answer').click( function() {
      var id = new Date().getTime();
      var fmmc_output= HandlebarsTemplates['fmmc_answer']({"id":id, "q_id": question_id, "type": _to});
      $( question_id + ' .answers_holder').append( fmmc_output );
      addInteractionToAnswer( id, question_id );
      checkCorrectAnswer( question_id );
    });
  }

  if ( _to == "oq") { // open question
    // Start question code
    var id = new Date().getTime();
    var context = { "t": t, "id":id, "q_id": question_id, "type": _to };
    if ( $(question_id).find('.oq-answer').length === 0 ) {
      var oq_output= HandlebarsTemplates['open_answer']( context );
      $(question_id + ' .answers_holder').append( oq_output );
      //console.log("hide new answer");
      $(question_id + ' .add_new_answer').hide();
      addInteractionToAnswer(id, question_id );
    }
  }
}

function addInteractionToAnswer( id, question_id ) {
    //console.log(' ### add interaction', id, question_id, $('#'+id).find('.delete-answer').length, $('#'+id).find('.answer-score').length );

      // initialize delete button
    $('#'+id).find('.delete-answer').click( function() {
      $( question_id ).find('.question-score').val( Number($(question_id).find('.question-score').val()) - $('#'+id).find('.answer-score').val() );
      $('#'+id).remove();
    });

    // initialize stepper
    $('#'+id).find('.answer-score').change( function() {

      // don't allow negative scores
      if ( $('#'+id).find('.answer-score').val() < 0 ) $('#'+id).find('.answer-score').val(0);

      // update orig_score
      $('#'+id).attr('orig_score', parseInt( $('#'+id).find('.answer-score').val(), 10 ) );

      updateOverallScore(question_id);
    });

    // initialize zero score for correct answer
    $('#'+id).find('.iscorrect').click( function() {
      checkAndDisableCorrect(question_id);
      updateOverallScore(question_id);
    });

    // focus on the text
    $('#'+id).find('.answer-text').focus();

    // init
    // $('#'+id).attr('orig_score', 10);
    // $('#'+id).find('.answer-score').val(10);
     // update orig_score
    $('#'+id).attr('orig_score', parseInt( $('#'+id).find('.answer-score').val(), 10 ) );
    checkCorrectAnswer( question_id );
    updateOverallScore(question_id);
    checkAndDisableCorrect(question_id);

    setTimeout( function() { convertSeconds(".in-point") }, 250 );
}

function checkAndDisableCorrect( question_id, answer_id ) {
  $.each( $( question_id ).find('.answer'), function( key, value ) {
    if ( !$( value ).find('.iscorrect').prop('checked') ) {
      $( value ).find('.answer-score').removeAttr("disabled");
      $( value ).find('.answer-score').val( $( value ).attr('orig_score') );

    }else{
      $( value ).find('.answer-score').attr("disabled", true);

      //console.log('zeg, ', parseInt( $( value ).find('.answer-score').val(), 10 ))
      if ( parseInt( $( value ).find('.answer-score').val(), 10 ) !== 0 )  {
        $( value ).attr('orig_score', parseInt(  $( value ).find('.answer-score').val(), 10 ) );
      }

      $( value ).find('.answer-score').val(0);

    }
  });
}

function updateOverallScore( question_id, answer_id ) {
  var overall_score = 0;
  $.each( $(question_id).find('.answer'), function( key, value ) {
    overall_score = overall_score + Number( $( value ).find( $('.answer-score') ).val() );
  });
  $(question_id).find('.question-score').val( overall_score );
}

function checkCorrectAnswer( question_id, answer_id ) {
  //console.log("CHECK CORRECT ANSWER ?");
  // if no answer has been selected, do that now ( as it is mandator
  // if no answer has been selected, do that now ( as it is mandator
  var hasCorrect = false;
  $.each( $( question_id + ' .answers_holder .answer'), function( key, value ) {
     if ( $(value).find('.iscorrect:eq(0)').prop("checked") ) hasCorrect = true;
  });

  // no answer was given, force the first
  if (!hasCorrect) $( question_id + ' .answers_holder .answer').first().find('.iscorrect:eq(0)').prop("checked", true);
}


// *****************************************************************************
//  DrawQuestions from program
// *****************************************************************************

function generateQuesionsFromProgram() {

  // with program?
  if ( program === undefined || program === null ) {
    // no program? start with a blank editor
    // this shouldn't be happening, by the way
    console.log('WARNING! Question Editor has no program');

  } else {

    // reset the question editor
    resetQuestions();

    // sort the marqers on inpoint
    program.marqers.sort( function(a, b){ return parseFloat(a.in) - parseFloat(b.in) } );
    program.marqers.reverse();

    $.each( program.marqers, function( key, marqer ) {
      // if the marqer has type question marqer
      if ( marqer.type == "MTQuestionMarqer") {
        // render a question,
        var thisQuestionId = addQuestion( marqer.id ); // returns a local id

        // fill the data,
        $( '#' + thisQuestionId ).find('.in-point').val( marqer.in );

        $( '#' + thisQuestionId ).find('.question-question').val( marqer.marqeroptions.question );
        $( '#' + thisQuestionId ).find('.question-score').val( marqer.marqeroptions.score );

        // switch type
        $( '#' + thisQuestionId ).find('.question-type').val( marqer.marqeroptions.questiontype );

        // add the answers
        // if (marqer.marqeroptions === null) console.log("SRSLY, DUDE. no marqeroptions"); return;
        if (marqer.marqeroptions.answers != null && marqer.marqeroptions.answers.length != 0 ) {

          var recalculatedScore = 0 ;
          changeQuestionType( '#' +thisQuestionId, marqer.marqeroptions.questiontype ); // appends it

          $.each( marqer.marqeroptions.answers, function( key2, value ) {

            if ( marqer.marqeroptions.questiontype == "mc" ) {
              var mc_output = HandlebarsTemplates['mc_answer']({"id":value.id, "q_id": thisQuestionId, "type": marqer.marqeroptions.questiontype });
              $( '#' + thisQuestionId ).find('.answers_holder').append( mc_output );
              $( '#' + thisQuestionId ).find('.answer-text:last').val( value.text );
              $( '#' + thisQuestionId ).find('.answer-score:last').val( value.score );
              addInteractionToAnswer( value.id, "#qid-"+thisQuestionId);
            }

            if ( marqer.marqeroptions.questiontype == "mmc" ) {
              var mmc_output = HandlebarsTemplates['mmc_answer']({"id":value.id, "q_id": thisQuestionId, "type": marqer.marqeroptions.questiontype});
              $( '#' + thisQuestionId ).find('.answers_holder').append( mmc_output );
              $( '#' + thisQuestionId ).find('.answer-text:last').val( value.text );
              $( '#' + thisQuestionId ).find('.answer-score:last').val( value.score );
              addInteractionToAnswer( value.id, "#qid-"+thisQuestionId);
            }

            if ( marqer.marqeroptions.questiontype == "fmc" ) {
              var fmc_output = HandlebarsTemplates['fmc_answer']({"id":value.id, "q_id": thisQuestionId, "type": marqer.marqeroptions.questiontype });
              $( '#' + thisQuestionId ).find('.answers_holder').append( fmc_output );
              $( '#' + thisQuestionId ).find('.answer-text:last').val( value.text );
              $( '#' + thisQuestionId ).find('.answer-score:last').val( value.score );
              //console.log(value.score)
              if (value.correct === "true") $( '#' + thisQuestionId ).find('.iscorrect:last').attr('checked', true);
              addInteractionToAnswer( value.id, "#qid-"+thisQuestionId);
            }

            if ( marqer.marqeroptions.questiontype == "fmmc" ) {
              var fmmc_output = HandlebarsTemplates['fmmc_answer']({"id":value.id, "q_id": thisQuestionId, "type": marqer.marqeroptions.questiontype});
              $( '#' + thisQuestionId ).find('.answers_holder').append( fmmc_output );
              $( '#' + thisQuestionId ).find('.answer-text:last').val( value.text );
              $( '#' + thisQuestionId ).find('.answer-score:last').val( value.score );
              if (value.correct === "true") $( '#' + thisQuestionId ).find('.iscorrect:last').attr('checked', true);
              addInteractionToAnswer( value.id, "#qid-"+thisQuestionId);
            }

            if ( marqer.marqeroptions.questiontype == "oq" ) {
              $( '#' + thisQuestionId ).find('.answer-text:last').val( value.text );
              $( '#' + thisQuestionId ).find('.answer-score:last').val( value.score );
              $( '#' + thisQuestionId ).find('.add_new_answer:last').hide();
              addInteractionToAnswer( value.id, "#qid-"+thisQuestionId);
            }

            recalculatedScore += parseInt( value.score );
          });

          // just to be sure, recalculate the question score
          $( '#' + thisQuestionId ).find('.question-score').val( recalculatedScore );

        }else{
          console.log("this question has no answers ... ")
        }

      }
    }); // render complete
  }
}

function resetQuestions() {
    $("#questions_holder").html('')
}

// *****************************************************************************
// Generate Score dependant texts from program metadata
// *****************************************************************************

function generateScoreDependentTexts() {

  // set the metadata!
  metaData = program.meta;
  console.log("score dependant text have data:", metaData.on_movie_end);

  $("#show-end-text").prop('checked', metaData.on_movie_end.set == 'show-end-text');      // enable or disable end text
  $("#show-highscores").prop('checked', metaData.on_movie_end.show_highscores == 'true'); // enable or disable highscores

  // score dependant text header
  $('#end-text').val( metaData.on_movie_end.score_dependent_texts_header );
  $('#end-text').change( function(e) {
    metaData.on_movie_end.score_dependent_texts_header = $('#end-text').val();
  });

  // score dependent text values
  if ( metaData.on_movie_end.score_dependent_texts === null || metaData.on_movie_end.score_dependent_texts === undefined ) return;
  $.each( metaData.on_movie_end.score_dependent_texts, function( index, value ) {
    addScoreDependentText();
    $('.score-text:last').find('.points-value').val( value.points );
    $('.score-text:last').find('.points-text').val( value.text );
  });
}


// *****************************************************************************
// Set and Check movie end options from program metadata
// *****************************************************************************

function setAndCheckMovieEndOptions() {
  // check
  if ( program.meta.on_movie_end.show_highscores == "true" ) $('#show-highscores').prop('checked', true);
  if ( program.meta.on_movie_end["show-score-dependant-texts"] == "true" ) $('#show-score-dependant-texts').prop('checked', true);

  $('#show-highscores').change( function(e) {
    if ( $(this).is(':checked') ) {
      program.meta.on_movie_end.show_highscores = "true";
    }else{
      program.meta.on_movie_end.show_highscores = "false";
    }
  });

  $('#show-score-dependant-texts').change( function(e) {
    if ( $(this).is(':checked') ) {
      program.meta.on_movie_end["show-score-dependant-texts"] = "true";
    }else{
      program.meta.on_movie_end["show-score-dependant-texts"] = "false";
    }
  });
}


// *****************************************************************************
// initialize the in/out point handlers
// *****************************************************************************

function initInOutPoint() {

  // has duration?
  if ( pop === null || isNaN(pop.duration()) || pop.duration() === null || pop.duration() === undefined) {
    setTimeout( initInOutPoint, 500);
    return;
  }

  // in point
  $('#in-point-now').click( function()  {
    $('#in-point-now').removeClass('btn-warning').addClass('btn-default');
    if (  pop.currentTime() > $('#out-point').val() ) {
      $('#in-point-now').addClass('btn-warning');
      alert("In point can not be set after out point");
      return;
    }

    $('#in-point').val( Math.round( pop.currentTime() * 10 ) / 10 );
    program.meta.moviedescription["in-point"] = $('#in-point').val();
  });

  // out point
  $('#out-point-now').click( function() {
    $('#out-point-now').removeClass('btn-warning').addClass('btn-default');
    if (  pop.currentTime() < $('#in-point').val() ) {
      $('#out-point-now').addClass('btn-warning');
      alert("Out point can not be set before in point");
      return;
    }
    $('#out-point').val( Math.round( pop.currentTime() * 10 ) / 10 );
    program.meta.moviedescription["out-point"] = $('#out-point').val();
  });

  // change handlers
  $('#in-point').change( function() { program.meta.moviedescription["in-point"] = $('#in-point').val() });
  $('#out-point').change( function() { program.meta.moviedescription["out-point"] = $('#out-point').val() });

  // defaults to pop duration
  $('#in-point').val( 0 );
  $('#out-point').val( Math.round( pop.duration() * 10 ) / 10 );

  if ( program.meta.moviedescription["in-point"] !== undefined && program.meta.moviedescription["in-point"] !== "" ) {
    $('#in-point').val( program.meta.moviedescription["in-point"] );
  }

  if ( program.meta.moviedescription["out-point"] !== undefined && program.meta.moviedescription["out-point"] !== "" ) {
    $('#out-point').val( program.meta.moviedescription["out-point"] );
  }

}

// *****************************************************************************
//  Save the end texts
// *****************************************************************************

// Saving endtexts to metadata
function saveEndText() {
  console.log('save end texts');

  // handled in: setAndCheckMovieEndOptions()
  // score dependent text values
  holder = [];

  $(".score-text").each(function( index ) {
    var pt = $( this ).find(".points-value").val();
    var txt = $( this ).find(".points-text").val();
    holder.push({'points': pt.toString(), 'text': txt.toString()});
  });

  // put the holder in there
  //console.log(holder);
  metaData.on_movie_end.score_dependent_texts = holder;
}

// *****************************************************************************
//  Update the question holder object
// *****************************************************************************

function updateQuestionData(e) {
  $.each(marqers, function( key, marqer ) {

    if ( marqer.type == "MTQuestionMarqer" ) {
      marqer.remote_id = marqer.id // failsafe

      $('.question').each( function(i, value) {
        if ( $(value).attr("remote_id") == marqer.id ) {

          // upate in/out
          console.log("storing in point: ", $(value).find('.in-point').val() )
          marqer.in = $(value).find('.in-point').val();
          marqer.out = Number( $(value).find('.in-point').val() ) + 1;

          // start the question data
          marqer.marqeroptions.track = 1
          marqer.marqeroptions.title = {}
          marqer.marqeroptions.title.value = $(value).find('.question-question').val();
          marqer.marqeroptions.question = $(value).find('.question-question').val();
          marqer.marqeroptions.score = $(value).find('.question-score').val();         // this is the overall (max) score
          marqer.marqeroptions.questiontype = $(value).find('.question-type').val();
          marqer.marqeroptions.answers = [];

          $(value).find('.answer').each( function(a_key, a_value) {
            // add the answers
            var answer = {};
            answer.text = $(a_value).find('.answer-text').val();
            $(a_value).find('.iscorrect').is(':checked') ? answer.correct = "true" : answer.correct = "false";
            answer.score = $(a_value).find('.answer-score').val();
            answer.id = $(a_value).attr('id');
            marqer.marqeroptions.answers.push(answer);
          });
        }
      });
    }
  });
}

// *****************************************************************************
// Original warning system (depricated)
// *****************************************************************************
function doWarningQuestions() {
  if ( questiondatahaschanged ) {
    //$('.save-butt').removeClass('disabled')
    //$('.save-butt-end-text').removeClass('disabled')
    var msg = "You have unsaved changes! Are you sure you want to leave the page?";
    return msg;
  }
}

function setChangeHandlers() {
  $('#question_suggestion').click( function() { enableWarning() } );
  $('#add-question').click( function() { enableWarning() } );
  $('.question-question').click( function() { enableWarning() } );
  $('.question-score').click( function() { enableWarning() } );
  $('.in-point').click( function() { enableWarning() } );
  $('.question').click( function() { enableWarning() } );
  $('#end-text').click( function() { enableWarning() } );
  $('#show-end-text').change( function() { enableWarning() } );
  $('#show-highscores').change( function() { enableWarning() } );
  $('#add-score-dependent-text').click( function() { enableWarning() } );
  $('.delete').click( function() { enableWarning() } );

  //convertSeconds('.in-point')
  updateQuestionData();
  preview();
}

function enableWarning() {
  questiondatahaschanged = true;
  doWarningQuestions();
  $('.save_status').css('background-color', 'yellow')
}

// *****************************************************************************
// Helpers
// *****************************************************************************
function checkForMissingAnswers() {
  var answerMissing = false;
  $.each( $('#questions_holder').find('.question'), function( q_key, q_value ) {
    var hasAnswer = false;
    $.each( $( q_value ).find('.answer'), function( a_key, a_value ) {
      if( $(a_value).find(".iscorrect").prop("checked") || $(a_value).attr("type") == "oq" || $(a_value).attr("type") == "mc" || $(a_value).attr("type") == "mmc" ) hasAnswer = true;
      console.log("trrr:",$(a_value).attr("type") );
    });

    if ( !hasAnswer ) answerMissing = true;
  });

  if ( answerMissing  ) {
    // needs translation
    alert("It seems that one of the questions doesn't has at least one correct answer, or no answer at all.");
  }
}

function doTooltips() {
  $('#pause-button').attr("data-toggle", "tooltip");
  $('#pause-button').attr("data-placement", "top");
  $('#pause-button').attr("title", t.tooltips.pause_to_add_question );
  $('#pause-button').tooltip({container: 'body'});
  $('.save-butt').tooltip({container: 'body'});
  $('.refresh-butt').tooltip({container: 'body'});
}

function createQuestion() {
  // check for remote id
  // crate a new marqer
  var marqer = {}
  marqer.type = "MTQuestionMarqer"
  marqer.in = "0.1";
  marqer.out = "1.1";
  marqer.name = "Questionmarqer";
  marqer.title = "Questionmarqer";
  marqer.track = 1;
  marqer.marqeroptions = {}
  marqer.marqeroptions.track = 1;
  marqer.marqeroptions.answers = []
  marqer.marqeroptions.questiontype = "fmc"
  marqer.program_id = program.id;

  mapi.createMarqer({
    marqer: marqer,
    success: function( marqer ){
      console.log("question creation successfull!", marqer );

      // show an updated bar in the video
      addQuestion( marqer.id )
      marqers.push( marqer )
      // preview();
    },
    failure: function( response ){
      console.log("question deletion faal!", response);
    }
  })
}

// REsize helper
// add resize_aspect_ratio
function questionsOnResize() {
  setTimeout( function() {
    var hgt = $(document).height() - $('.main_container').offset().top - 58;
    $('.scroll_container').css( { 'height': hgt + 'px' } );
  }, 500)
}

// *****************************************************************************
// INIT
// *****************************************************************************

function initQuestions() {
  // we need a duration!
  if ( pop === null || isNaN(pop.duration()) ) {
    setTimeout(initQuestions, 500);
    return;
  }

  // listen for update
  pop.on("timeupdate", updateTimer );

  $('#add-question').click( function(e) { createQuestion() });
  $('#add-score-dependent-text').click( function(e) { addScoreDependentText() });
  $('.delete-score-text').click( function(e) { $(this).parent().parent().parent().remove(); } );

  // these functions are relayed through editor.js
  $('.preview-butt').unbind('click')
  $('.preview-butt').click(function() {
    checkForMissingAnswers();
    updateQuestionData();
    $.each(marqers, function(i, m) {
      if (m.type == "MTQuestionMarqer") {
        m.remote_id = m.id
        updateMarqer(m)
      }
    });
    generateQuesionsFromProgram();
  });

  $('.stats-butt').click(function() {
    window.location = "http://nabu.sense-studios.com/admin/statistics/traffic?program_id=56054e566465764309000003"
  })

  //$('.refresh-butt').click(function() {
  //  window.location.reload();
  //});

  //generateQuesionsFromProgram();
  generateScoreDependentTexts();
  setAndCheckMovieEndOptions();

  // set the update script
  //setInterval( updateQuestionData, 200 );
  window.onbeforeunload = doWarningQuestions;

  // listen for change
  setChangeHandlers();
  //convertSeconds('.in-point')

  // init in and out point handlers
  initInOutPoint();

  // add tooltip to the pause button
  doTooltips();

  $(window).resize( function() { questionsOnResize(); } );
  questionsOnResize()
}
