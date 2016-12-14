import React,{Component} from 'react'
import { observer } from 'mobx-react';
@observer
class MessagesList extends Component {
  render() {
    let {messages,userMobile} = this.props;
    return (
      <div className="messages-list" id="messagesList">
       {messages.map((message)=>{
          if(message.mobile == userMobile){
            return <MessageItem message={message} key={message.id} source="send"/>
          }else{
            return <MessageItem message={message} key={message.id} source="received"/>
          }
          })}
      </div>
    )
  }
}
@observer
class MessageItem extends Component {
  render() {
    let {source,message} = this.props;
    let faceSrc = './imgs/'+ message.typename +'.png';
    return (
        <div className={"message-item "+ source}>
          <div className="item-face">
            <img src={faceSrc}/>
          </div>
          <div className="item-content">
            <h5 className="media-heading">{message.mobile}<small>&nbsp;@{message.addtime}</small></h5>
            <div className="message-content">{message.content}</div>
          </div>
        </div>
      )
  }
}
export default MessagesList;