import React,{Component} from 'react'
import { observer } from 'mobx-react';
@observer
class MessageTypeFilter extends Component {
  render() {
    let appState = this.props.appState;
    let isVisible = appState.showTypeFilter;
    let filterStyle = {
      display:isVisible?'':'none'
    }
    return (
      <ul className="list-unstyled types-list" style={filterStyle}>
          <li className="type-item" value="0" onClick={()=>appState.setVisibleType(0)}>全部</li>
          <li className="type-item" value="10" onClick={()=>appState.setVisibleType(10)}>仅看求购</li>
          <li className="type-item" value="20" onClick={()=>appState.setVisibleType(20)}>仅看求售</li>
      </ul>
      )
  }
}

export default MessageTypeFilter;