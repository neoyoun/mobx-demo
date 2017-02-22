import React from 'react'

function MessageItem({source,message,setVisibleMessage}) {
	let faceSrc = './imgs/sale.png';
	return (
		<div className={"message-item "+ source}>
      <div className="item-face">
        <img src={faceSrc}/>
      </div>
      <div className="item-content" onClick={e=>{e.stopPropagation();return setVisibleMessage(message.id)}}>
        <div className="message-content">车型:{message.brand}</div>
        <div className="message-content">配件代码:{message.code}</div>
        <div className="message-content">配件名称:{message.codeDesc}</div>
      </div>
    </div>
		)
}
export default MessageItem