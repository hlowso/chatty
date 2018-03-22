import React, {Component} from 'react';
import Message            from './Message.jsx';
import Notification       from './Notification.jsx'
import uuid               from 'uuid-v4';

function MessageList({messages}) {
	return (	
		<section className>
			{messages.map(
				function(message_obj) {
					let key = uuid();
					if(message_obj.type !== 'incomingNotification') {
						return (<Message key={key} username={message_obj.username} message={message_obj.content} />);
					}
					return <Notification key={key} content={message_obj.content} />
				}
			)}
		</section>
	);
}


export default MessageList;