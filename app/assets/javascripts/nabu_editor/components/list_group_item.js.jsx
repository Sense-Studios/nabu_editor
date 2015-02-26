/** @jsx React.DOM */

var ListGroupItem = React.createClass({

  componentDidMount: function() {    
    $.material.init()
  }, 
  
  getInitialState: function() {
    return {checked: false};
  },

  handleClick: function(event) {
    this.setState({checked: !this.state.checked});
  },

  render: function() {
    var classes="list-group-item"
    if ( this.state.checked ) classes += " long-shadow-4 btn-material-yellow-200"
      return (                    
        <div id="thisismylistgroupitem" className={classes}>
          <div className="row-action-primary checkbox">
            <label>
              <input                   
              type="checkbox" 
              ref="myAwesomeCheckbox"
              checked={this.state.checked}
              onChange={this.handleClick} 
              />
            </label>
          </div>
          <div className="row-content">
          <h4 className="list-group-item-heading">
            Tile with a checkbox in it, From react.
          </h4>
          <p className="list-group-item-text">
            Donec id elit non mi risus varius blandit.
          </p>
          </div>
        </div>
      );
    }
});

var ChannelListGroupItem = React.createClass({
  
  componentDidMount: function() {    
    $.material.init()
  }, 
  
  getInitialState: function() {
    return {checked: false};
  },

  handleClick: function(event) {
    this.setState({checked: !this.state.checked});
  },

  render: function() {
    var classes="list-group-item"
    if ( this.state.checked ) classes += " long-shadow-4 btn-material-yellow-200"
      return (                    
        <div id="thisismylistgroupitem" className={classes}>
          <div className="row-action-primary checkbox">
            <label>
              <input                   
              type="checkbox" 
              ref="myAwesomeCheckbox"
              checked={this.state.checked}
              onChange={this.handleClick} 
              />
            </label>
          </div>
          <div className="row-content">
          <h4 className="list-group-item-heading">
            {this.props.channel.slug}
          </h4>
          <p className="list-group-item-text">
            Donec id elit non mi risus varius blandit.
          </p>
          </div>
        </div>
      );
    }  
});
