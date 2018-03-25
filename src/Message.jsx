// jshint ignore: start
import React, { Component } from "react";
import Media from "./Media.jsx";

const parseContentForMedia = content => {
	const urls = content.match(/\S+\.(jpg|png|gif)/g);
	let new_content = content;

	if (urls) {
		for (let url of urls) {
			new_content = content.replace(
				new RegExp(url, "g"),
				`<img src="${url}" style="max-width:60%">`
			);
		}
	}

	return { __html: new_content };
};

const Message = props => {
	switch (props.type) {
		case "incomingMessage":
			return (
				<div className="message">
					<strong
						className="message-username"
						style={{ color: props.username_color }}
					>
						{props.username ? props.username : "Anonymous"}
					</strong>
					<p
						className="message-content"
						dangerouslySetInnerHTML={parseContentForMedia(props.content)}
					/>
				</div>
			);
		case "incomingNotification":
			return <div className="message system">{props.content}</div>;
	}
};

export default Message;
