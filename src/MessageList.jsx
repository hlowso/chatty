// jshint ignore: start

import React, { Component } from "react";
import Message from "./Message.jsx";
import uuid from "uuid-v4";

const MessageList = ({ messages }) => {
	return (
		<section>
			{messages.map(message_obj => {
				let key = uuid();
				return (
					<Message
						key={key}
						type={message_obj.type}
						username={message_obj.username}
						username_color={message_obj.username_color}
						content={message_obj.content}
					/>
				);
			})}
		</section>
	);
};

export default MessageList;
