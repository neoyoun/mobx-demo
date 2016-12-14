import React,{Component} from 'react'
import { observer } from 'mobx-react';
import AddMessageState from '../AddMessageState';
@observer
class AddMessage extends Component {
	constructor(){
		super()
		this.addMessageState = new AddMessageState();
	}
	render() {
	let addMessageState = this.addMessageState;
	let hasMobile = addMessageState.validateMobile?' up':'';
	let typeShow = addMessageState.showTypeList?' active':'';
		return(
			<div className={"new-message-box"+hasMobile} onClick={this.onHideTypeList}>
				<div className={"message-input"} data-error="输入正确手机号码">
					<span className="input-type btn-default">手机</span>
					<input type="text" className="form-control" value={addMessageState.mobile} placeholder="手机号码" ref="inputMobile" onChange={this.onMobileChange}/>
					<button className="input-button btn btn-success" type="button" onClick={this.onCheckMobile} ref="mobileSet">设置</button>
				</div>
				<div className={"message-input"} data-error="输入不少于5个字的信息">
					<ul className ={"send-type-list"+typeShow}>
						<li className="user-mobile" onClick={this.onModifyMobile}>{addMessageState.mobile}</li>
			  		<li className="send-type-item" value="20" onClick={this.onMessageTypeChange}>出售</li>
			  		<li className="send-type-item" value="10" onClick={this.onMessageTypeChange}>求购</li>
			  	</ul>
					<span className="input-type btn-info" onClick={this.onToggleTypeList}>{addMessageState.messageTypeName}</span>
					<input type="text" className="form-control" value={addMessageState.content} placeholder="输入你的信息" onChange={this.onContentChange}/>
					<button className="input-button btn btn-success" type="button" onClick={this.onAddNewOne} ref="contentSet">发送</button>
			</div>
		</div>
			)
	}
	componentDidMount() {
		this.addMessageState.mobileSet = this.refs.mobileSet;
		this.addMessageState.contentSet = this.refs.contentSet;
		this.addMessageState.getMobileFromCookie()
	}
	onMobileChange = (e) => {
		e.target.parentNode.classList.remove('tip')
		this.addMessageState.mobile = e.target.value
	}
	onCheckMobile = () => {
		this.addMessageState.checkMobile(this.refs.inputMobile.value)
	}
	onModifyMobile = (e) => {
		this.addMessageState.mobile = '';
		this.refs.inputMobile.value = '';
		this.addMessageState.showTypeList = false
	}
	onContentChange =(e) => {
		e.target.parentNode.classList.remove('tip')
		this.addMessageState.content = e.target.value
	}
	onMessageTypeChange = (e) => {
		e.stopPropagation()
		this.addMessageState.setMessageType(e.target.value)
	}
	onToggleTypeList = (e) => {
		e.stopPropagation()
		this.addMessageState.toggleTypeList();
	}
	onHideTypeList = (e) => {
		e.stopPropagation()
		this.addMessageState.hideTypeList();
	}
	onAddNewOne = () => {
		this.addMessageState.onAddNewOne()
	} 
}

export default AddMessage;