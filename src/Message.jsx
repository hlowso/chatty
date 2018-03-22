import React, {Component} from 'react';


export default class Message extends Component {
	render() {
	  return (
	  	<div className="message">
	    	<strong className="message-username">{(this.props.username) ? this.props.username : 'Anonymous'}</strong>
	    	<p className="message-content">{this.props.message}</p>
	    </div>
	  );	
	}
};