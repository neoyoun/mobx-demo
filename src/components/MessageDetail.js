import React from 'react';
function MessageDetail({message}) {
  let {id,brand, code, codeDesc, price, count,manufacturer, offType, addtime,mobile} = message;
  return (
    <div className="message-detail-box panel panel-default" onClick={(e)=>{if(e.target.id !== 'closeBtn'){e.stopPropagation()}} }>
        <div className="panel-heading">
          <div className="panel-title text-center">详细信息<span id="closeBtn" className="close-btn">&times;</span> </div>
        </div>
        <div className="panel-body">
          <p>配件代码:{code}</p>
          <p>配件名称:{codeDesc}</p>
          <p>适用车型:{brand}</p>
          <p>处理价格:{price}</p>
          <p>处理数量:{count}</p>
          <p>厂家:{manufacturer}</p>
          <p>配件状态:{offType}</p>
          <p>联系电话:<span className="text-primary">{mobile}</span></p>
          <p>发布时间:{addtime}</p>
        </div>
    </div>
    )
}
export default MessageDetail;