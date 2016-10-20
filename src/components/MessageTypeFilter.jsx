import React,{Component} from 'react'
class MessageTypeFilter extends Component {
	render() {
		let showType = this.props.showType;
		let style = showType?'':'display:none';
		return (
				<ul className="list-unstyled types-list" style={{style}}>
					<li className="type-item" value="0" onClick={this.filterTypeHandle}>全部</li>
					<li className="type-item" value="10" onClick={this.filterTypeHandle}>仅看求购</li>
					<li className="type-item" value="20" onClick={this.filterTypeHandle}>仅看求售</li>
				</ul>
			)
	}
}
export default MessageTypeFilter;