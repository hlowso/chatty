// jshint ignore: start

import React, { Component } from "react";

class ChatBar extends Component {
	constructor(props) {
		super(props);
		this.state = {
			usernameValue: "Anonymous",
			currentMessage: ""
		};
	}

	handleNameChange = event => {
		this.setState({ usernameValue: event.target.value });
	};

	handleMessageChange = event => {
		this.setState({ currentMessage: event.target.value });
	};

	onEnter = event => {
		if (event.key === "Enter") {
			this.props.handleEnterPress(this.state);
			this.setState({ currentMessage: "" });
		}
	};

	render() {
		return (
			<footer className="chatbar" onKeyPress={this.onEnter}>
				<input
					className="chatbar-username"
					placeholder="Your Name (optional)"
					value={this.state.usernameValue}
					onChange={this.handleNameChange}
				/>

				<input
					className="chatbar-message"
					placeholder="Type a message and hit ENTER"
					value={this.state.currentMessage}
					onChange={this.handleMessageChange}
				/>
			</footer>
		);
	}
}

export default ChatBar;
