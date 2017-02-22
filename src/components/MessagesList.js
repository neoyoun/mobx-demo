import React,{Component} from 'react'
import { observer } from 'mobx-react';
import MessageItem from './MessageItem'
@observer
class MessagesList extends Component {
  render() {
    let {messages,userMobile,setVisibleMessage} = this.props;
    return (
      <div className="messages-list" id="messagesList" >
       {messages.length>0 && messages.map((message)=>{
          if(message.mobile == userMobile){
            return <MessageItem setVisibleMessage={setVisibleMessage} message={message} key={message.id} source="send"/>
          }else{
            return <MessageItem setVisibleMessage={setVisibleMessage} message={message} key={message.id} source="received" />
          }
          })}
      </div>
    )
  }
}
export default MessagesList;