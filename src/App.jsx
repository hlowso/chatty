// jshint ignore: start

import React, { Component, Fragment } from "react";
import MessageList from "./MessageList.jsx";
import ChatBar from "./ChatBar.jsx";

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			currentUser: "Anonymous",
			messages: [],
			count: 1
		};
	}

	componentDidMount() {
		this.ws = new WebSocket("ws://localhost:3001");
		this.ws.onopen = () => {
			this.send(
				"postNotification",
				`${this.state.currentUser} joined the chatroom`,
				"updateCount"
			);
		};
		this.ws.onmessage = event => {
			const incoming_message = JSON.parse(event.data);
			if (incoming_message.type === "incomingNotification") {
				if (incoming_message.action) {
					if (!incoming_message.args) {
						incoming_message.args = [];
					}
					this[incoming_message.action](...incoming_message.args);
				}
			}

			const messages = this.state.messages.concat(incoming_message);
			this.setState({ messages });
		};
		// this.ws.onclose = () => {
		// 	this.send(
		// 		"postNotification",
		// 		`${this.state.currentUser} left the chatroom`,
		// 		"decrement"
		// 	);
		// };
	}

	send = (type, content, action = null) => {
		if (content) {
			const new_message = {
				type,
				username: this.state.currentUser,
				content
			};
			if (type === "postNotification") {
				new_message.action = action;
			}
			this.ws.send(JSON.stringify(new_message));
		}
	};

	updateCount = count => {
		this.setState({ count });
	};

	handleEnterPress = chatbar_state => {
		debugger;

		const old_username = this.state.currentUser;
		const new_username = chatbar_state.usernameValue;
		const message = chatbar_state.currentMessage;
		if (new_username !== this.state.currentUser) {
			this.setState(
				{
					currentUser: new_username
				},
				() => {
					this.send(
						"postNotification",
						`${old_username} changed their name to ${new_username}`,
						"changeUsername"
					);
					this.send("postMessage", message);
				}
			);
		} else {
			this.send("postMessage", message);
		}
	};

	render() {
		return (
			<Fragment>
				<nav className="navbar">
					<a href="/" className="navbar-brand">
						Chatty
					</a>
					<p className="navbar-count">{this.state.count} user(s) online</p>
				</nav>
				<main>
					<MessageList messages={this.state.messages} />
					<ChatBar handleEnterPress={this.handleEnterPress} />
				</main>
			</Fragment>
		);
	}
}
export default App;
