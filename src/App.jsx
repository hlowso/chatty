// jshint ignore: start

import React, {Component} from 'react';
import MessageList from './MessageList.jsx';
import ChatBar from './ChatBar.jsx';

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			currentUser: 'Anonymous',
			messages: []
		};		
	}

	componentDidMount() {
		this.ws = new WebSocket('ws://localhost:3001');
		this.ws.onmessage = event => {
			const incoming_message = JSON.parse(event.data);
			const messages = this.state.messages.concat(incoming_message);
			this.setState({ messages });
		};
	}

	sendMessage = message => {
		if(message) {
			const new_message = {
				username: this.state.currentUser,
				content: message
			};
			this.ws.send(JSON.stringify(new_message));
		}
	};

	handleEnterPress = chatbar_state => {
		const new_username = chatbar_state.usernameValue;
		const message = chatbar_state.currentMessage;
		if(new_username !== this.state.currentUser) {
			this.setState({
				currentUser: new_username
			}, () => 
				this.sendMessage(message)
			);
		}
		else {
			this.sendMessage(message);
		}
	};

  render() {
    return (
    	<main>
		  	<MessageList 
		  		messages={this.state.messages} />

		    <ChatBar 
		    	handleEnterPress={this.handleEnterPress} />
		  </main>
    );
  }
}
export default App;
