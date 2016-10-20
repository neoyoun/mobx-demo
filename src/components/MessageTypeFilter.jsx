import React,{Component} from 'react'
import {typeFilterState} from '../AppState';
import { observer } from 'mobx-react';

@observer
class MessageTypeFilter extends Component {
	render() {
		let isVisible = this.props.isVisible;
		let style = {
      display:isVisible?'':'none'
    }
		return (
				<ul className="list-unstyled types-list" style={style}>
					<li className="type-item" value="0" onClick={this.setVisibleType}>全部</li>
					<li className="type-item" value="10" onClick={this.setVisibleType}>仅看求购</li>
					<li className="type-item" value="20" onClick={this.setVisibleType}>仅看求售</li>
				</ul>
			)
	}
	setVisibleType = (e) => {
		e.stopPropagation()
		this.props.typeFilterState.messageType(e.target.value)
	}
}
MessageTypeFilter.defaultProps = {
	filterState : typeFilterState
}
export default MessageTypeFilter;