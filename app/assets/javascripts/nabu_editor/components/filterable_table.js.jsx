/** @jsx React.DOM */

var CreateNewProgramTile = React.createClass({
  handleClick:function() {
    showCreateMovie()
  },

  render:function() {
    return (
      <div className="program_container add_program_container long-shadow-3 btn-black ss-active-child" >
        <div className='btn dotted btn-white' onClick={this.handleClick}>
          +
        </div>
      </div>
    )
  }
})

var ProgramTile = React.createClass({

  selectMovie:function() {
    doSelectMovie(this.props.program.id)
    this.props.parentTable.setState({selectedProgramItem: this.props.program.id})
    $('.select_videos .active').removeClass('active') // this is nasty
  },

  showMovieRelay:function() {
    doShowMovie(this.props.program.id)
    this.props.parentTable.setState({selectedProgramItem: this.props.program.id})
    $('.select_videos .active').removeClass('active') // this is nasty
  },

  describeMovieRelay:function() {
    doDescribeMovie(this.props.program.id)
    this.props.parentTable.setState({selectedProgramItem: this.props.program.id})
    $('.select_videos .active').removeClass('active') // this is nasty
  },

  timeLineEditMovieRelay:function() {
    doTimeLineEditMovie(this.props.program.id)
    this.props.parentTable.setState({selectedProgramItem: this.props.program.id})
    $('.select_videos .active').removeClass('active') // this is nasty
  },

  questionsEditorMovieRelay:function() {
    doQuestionsMovie(this.props.program.id)
    this.props.parentTable.setState({selectedProgramItem: this.props.program.id})
    $('.select_videos .active').removeClass('active') // this is nasty
  },

  publishMovieRelay:function() {
    doPublishMovie(this.props.program.id)
    this.props.parentTable.setState({selectedProgramItem: this.props.program.id})
    $('.select_videos .active').removeClass('active') // this is nasty
  },

  copyMovieRelay:function() {
    doCopyMovie(this.props.program.id)
    this.props.parentTable.setState({selectedProgramItem: this.props.program.id})
    $('.select_videos .active').removeClass('active') // this is nasty
  },

  deleteMovieRelay:function() {
    doDeleteMovie(this.props.program.id)
    $('#' + this.props.program.id ).animate({"opacity":0.2}, 600)
  },

  statsMovieRelay:function() {
    doStatsMovie(this.props.program.id)
    this.props.parentTable.setState({selectedProgramItem: this.props.program.id})
    $('.select_videos .active').removeClass('active') // this is nasty
  },

  toggleDropdown:function() {
    if (agent.label == "IPAD") {
      $(this.getDOMNode()).find('.dropdown-toggle').dropdown('toggle')
    }
  },

  render:function() {
      var id = this.props.program.id
      var embedlink = "/embed/" + id

      //var link = '/'+ this.props.program.id
      if ( this.props.program.title == null || this.props.program.title == "" ) this.props.program.title = "( geen titel )"
      var title = this.props.program.title
      var description = this.props.program.description
      var tags = this.props.program.tags.join(', ')

      // for statistics
      var temp_time = toTime( Math.round( this.props.program.timewatched ) )
      var timewatched =  temp_time.h + ":" + temp_time.m
      var openers = this.props.program.openers + "/" + this.props.program.completed

      //var thumb = this.props.program.meta.moviedescription.thumbnail
      var thumb = this.props.program.thumbnail

      //console.log(title, this.props.hide)
      var classes = 'program_container'
      if ( this.props.parentTable.state.selectedProgramItem == this.props.program.id ) {
      // || ( program !== null && this.props.program.id == program.id ) ) {

        classes += ' long-shadow-5 btn-material-pink selected'
      }else{
        classes += ' long-shadow-3 btn-white'
      }

      if (this.props.hide == 'true') {
        classes += ' hidden'
      }

      return (
        <div className={classes} id={id} title={description} alt={description}>
          <span className='pseudolink' onClick={this.selectMovie} >
            <img src={thumb} width="100%"  />
            <div className='stats' onClick={this.statsMovieRelay}>
              <span className='glyphicon glyphicon-time'/> {timewatched}<br/>
              <span className='glyphicon glyphicon-eye-open'/> {openers}<br/>
            </div>

            <div className="description"> {title} <br/><small className="code"> {tags} </small></div>
          </span>

          <ul className='nav nav-tabs btn-material-pink'>
            <li className='dropdown'>
              <span className='glyphicon glyphicon-menu-hamburger' aria='' hidden='true'>
              </span>
              <a className='dropdown-toggle clickable' data-toggle='dropdown' href="#" onClick={this.toggleDropdown}>
              </a>
              <ul className='dropdown-menu'>
                <li>
                  <a href='#' onClick={this.showMovieRelay} data-toggle='tab'> Bekijk </a>
                </li>
                <li>
                  <a href={embedlink} target='_blank'> Embed </a>
                </li>
                <li>
                  <a href='#' onClick={this.describeMovieRelay} data-toggle='tab'> Beschrijf </a>
                </li>
                <li>
                  <a href='#' onClick={this.timeLineEditMovieRelay} data-toggle='tab'> Marqers </a>
                </li>
                <li>
                  <a href='#' onClick={this.questionsEditorMovieRelay} data-toggle='tab'> Quiz </a>
                </li>
                <li>
                  <a href='#' onClick={this.publishMovieRelay} data-toggle='tab'> Publiceer </a>
                </li>
                <li>
                  <a href='#' onClick={this.copyMovieRelay} data-toggle='tab'> Dupliceer </a>
                </li>
                <li className='btn-material-red'>
                  <a href='#' onClick={this.deleteMovieRelay} data-toggle='tab'> Verwijder </a>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      );
  }
});

var ProgramTable = React.createClass({

    getInitialState: function() {
      return {
        lastLength: 0,
        itemLength: 0,
        selectedProgramItem: 0
      };
    },

    // after creation
    componentDidMount: function() {
      try {
        $('.leprograms').shapeshift(shapeshiftOptions());
      }catch(e){}
      $('.numvideos').text( $('.leprograms .program_container:not(.hidden)').length )
    },

    // after render
    componentDidUpdate: function() {

      setTimeout( function() { $(".leprograms").trigger("ss-rearrange")}, 100 )

      if ( this.state.lastLength > this.state.itemLength ) {
        $('.leprograms').css('opacity','0')
        if ( this.props.inShift === true ) return
        this.props.inShift = true
        setTimeout( function() {
          $('.leprograms').shapeshift(shapeshiftOptions());
          $('.leprograms').animate({'opacity':'1'}, 420)
          setTimeout( function() { if ($(".leprograms").is(':visible')) $(".leprograms").trigger("ss-rearrange")}, 100 ) }
        , 300 )
      }

      if ( this.props.filterText == "" && this.props.inShift !== true) {
        this.props.inShift = true
        setTimeout( function() { if ($(".leprograms").is(':visible')) $('.leprograms').shapeshift( shapeshiftOptions() ) }, 800 )
      }

      $('.numvideos').text( $('.leprograms .program_container:not(.hidden)').length )
    },


    render: function() {
      //console.log(this.props);
      var items = [];
      var lastCategory = null;

      // push add new program
      // items.push( <CreateNewProgramTile parentTable={this} key="createNewProgram" /> )

      this.state.lastLength = this.state.itemLength
      this.state.itemLength = 0
      this.props.programs.forEach( function( program ) {

        // failsave, for now
        if ( program.title === null ) program.title = " [ Title goes here ] "

        console.log( program.title.toLowerCase().indexOf(this.props.filterText.toLowerCase()), program.tags.join(' ').toLowerCase().indexOf( this.props.filterText.toLowerCase() ) )
        if ( program.title.toLowerCase().indexOf(this.props.filterText.toLowerCase()) == -1 && program.tags.join(' ').toLowerCase().indexOf( this.props.filterText.toLowerCase()) == -1 ) { // || (!program.stocked && this.props.inStockOnly
          //return;
          items.push( <ProgramTile parentTable={this} hide='true' program={program} key={program.id} /> );
          this.state.itemLength+=1
        }else{
          items.push( <ProgramTile parentTable={this} program={program} key={program.id} /> );
        }

      }.bind(this));

      if (items.length == 0 ) {
        items = "De filmpjes zijn op"
      }

      return (
        <div className="leprograms">
            {items}
        </div>
      );
    }
});

var SearchBar2 = React.createClass({
    handleChange: function() {
      this.props.onUserInput(
        this.refs.filterTextInput.getDOMNode().value
        //this.refs.inStockOnlyInput.getDOMNode().checked
        //this.placeholder = window.t.devise.confirmations.confirmed
      );
    },

    render: function() {
        return (
            <form className='video_search_wrapper'>
              <i className="glyphicon glyphicon-search search_video_icon" aria-hidden='true' />
              <input
                  className='video_search'
                  type="text"
                  placeholder="Zoek in jouw video&#39;s"
                  //placeholder={t.devise.confirmations.confirmed}
                  value={this.props.filterText}
                  ref="filterTextInput"
                  onChange={this.handleChange}
              />
              <div className='video_count' >
                <span className='numvideos'> 0 </span><p>video&#39;s</p>
              </div>
            </form>
        );
    }
});


var FilterableProgramTable = React.createClass({
    statics: {
      update: function(foo) {
        this.setState({
            filterText: 'foo'
        });
      }
    },

    getInitialState: function() {
        return {
            filterText: '',
            selectedProgramItem: '54dcf8aa6465760785a90000'
        };
    },

    handleUserInput: function(filterText, inStockOnly) {
        this.setState({
            filterText: filterText
        });
    },

    render: function() {
      window.filter_table = this
      console.log("has programs?", this.props.programs )
        return (
            <div>
                <SearchBar2
                    filterText={this.state.filterText}
                    inStockOnly={this.state.inStockOnly}
                    onUserInput={this.handleUserInput}
                />
                <ProgramTable
                    programs={this.props.programs}
                    filterText={this.state.filterText}
                    selectedProgramItem={this.state.selectedProgramItem}
                />
            </div>
        );
    }
});
