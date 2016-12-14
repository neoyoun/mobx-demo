import React,{Component} from 'react'
import { observer } from 'mobx-react';
@observer
class MessageTypeFilter extends Component {
  render() {
    const setVisibleType = this.props.setVisibleType
    return (
      <ul className="list-unstyled types-list">
          <li className="type-item" value="0" onClick={()=>setVisibleType(0)}>全部</li>
          <li className="type-item" value="10" onClick={()=>setVisibleType(10)}>仅看求购</li>
          <li className="type-item" value="20" onClick={()=>setVisibleType(20)}>仅看求售</li>
      </ul>
      )
  }
}

export default MessageTypeFilter;