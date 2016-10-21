import React,{Component} from 'react'
import { observer } from 'mobx-react';
@observer
class MessageTypeFilter extends Component {
	render() {
		let isVisible = this.props.isVisible;
		let filterStyle = {
			display:isVisible?'':'none'
		}
		return (
				<ul className="list-unstyled types-list" style={filterStyle}>
          <li className="type-item" value="0" onClick={this.setType}>全部</li>
          <li className="type-item" value="10" onClick={this.setType}>仅看求购</li>
          <li className="type-item" value="20" onClick={this.setType}>仅看求售</li>
        </ul>
			)
	}
	setType = (e) =>{
    //e.stopPropagation()
    this.props.clickHandle(e.target.value)
  }
}

export default MessageTypeFilter;