import React, {Component} from 'react';
 
export default function Notification({content}) { 
  return (
  	<div className="message system">
    	{content}
    </div>
  );	
};