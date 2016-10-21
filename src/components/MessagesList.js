import React,{Component} from 'react'
import { observer } from 'mobx-react';
@observer
class MessagesList extends Component {
  render() {
    console.log('rendering MessageList');
    let {messages,userMobile} = this.props;
    return (
      <div className="messages-list" id="messagesList">
       {this.props.messages.map((message)=>{
          if(mobile == userMobile){
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
    console.log('rendering MessageItem');
    let {source,message} = this.props;
    let faceSrc = '/src/imgs/'+ message.typename +'.png';
    return (
        <div className={"message-item "+ source}>
          <div className="item-face">
            <img src={faceSrc}/>
          </div>
          <div className="item-content">
            <h4 className="media-heading">{message.mobile}<small>&nbsp;&nbsp;@{message.addtime}</small></h4>
            <div className="message-content">{message.content}</div>
          </div>
        </div>
      )
  }
}
export default MessagesList;