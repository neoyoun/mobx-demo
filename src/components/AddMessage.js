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
			<div className={"new-message-box"+hasMobile}>
				<div className={"message-input"} data-error="输入正确手机号码">
					<span className="input-type">手机</span>
					<input type="text" className="form-control" value={addMessageState.mobile} placeholder="手机号码" onChange={this.onMobileChange}/>
					<button className="input-button btn btn-success" type="button" onClick={this.onCheckMobile}>设置</button>
				</div>
				<div className={"message-input"} data-error="输入不少于5个字的信息">
					<ul className ={"send-type-list"+typeShow}>
						<li className="user-mobile" onClick={this.onModifyMobile}>{addMessageState.mobile}</li>
			  		<li className="send-type-item" value="20" onClick={this.onMessageTypeChange}>出售</li>
			  		<li className="send-type-item" value="10" onClick={this.onMessageTypeChange}>求购</li>
			  	</ul>
					<span className="input-type" onClick={this.onToggleTypeList}>{addMessageState.messageTypeName}</span>
					<input type="text" className="form-control" value={addMessageState.content} placeholder="输入你的信息" onChange={this.onContentChange}/>
					<button className="input-button btn btn-success" type="button" onClick={this.onAddNewOne}>发送</button>
			</div>
		</div>
			)
	}
	onMobileChange = (e) => {
		this.addMessageState.mobile = e.target.value
	}
	onCheckMobile = (e) => {
		this.addMessageState.checkMobile()
	}
	onModifyMobile = (e) => {
		this.addMessageState.mobile = ''
		this.addMessageState.showTypeList = false
	}
	onContentChange =(e) => {
		this.addMessageState.content = e.target.value
	}
	onMessageTypeChange = (e) => {
		e.stopPropagation()
		this.addMessageState.setMessageType(e.target.value)
	}
	onToggleTypeList = () => {
		this.addMessageState.toggleTypeList();
	}
	onAddNewOne = () => {
		this.addMessageState.onAddNewOne()
	}
/*	/
	
 /* @action addMessageHandle(e) {
      e.preventDefault();
      let newMessage = {
        mobile : this.mobile,
        content : this.content,
        type : this.type
      }
      if( !this.state.rememberUser ){
      	this.mobile = '';
      	this.mobileValidate = false;
      }
      this.setState({content:'',contentValidate:false});
      this.content = '';
      this.contentValidate = false;
      //this.props.sendNewMessage(newMessage);
    }*/

  /* @action changeUser() {
      this.refs.remember.checked = false;
      this.setState({rememberUser:false})
    }*/
  
}

export default AddMessage;