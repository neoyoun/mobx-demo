import React,{Component} from 'react'
import { observer } from 'mobx-react';
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
          <div className="item-content" onClick={(e,id)=>this.setVisibleId(e,message.id)}>
            <div className="message-content">车型:{message.brand}</div>
            <div className="message-content">配件代码:{message.code}</div>
            <div className="message-content">配件名称:{message.codeDesc}</div>
          </div>
        </div>
      )
  }
  setVisibleId(e, id){
    e.stopPropagation()
    this.props.setVisibleMessage(id)
  }

}



export default MessagesList;