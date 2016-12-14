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
			<div className="new_message_box panel panel-default" onClick={e=>this.prevent(e)}>
				<div className="panel-heading">
					<div className="panel-title text-center">发布消息</div>
				</div>
				<div className="panel-body">
					<form role="form" className="form-horizontal">
						<div className="form-group">
							<div className="col-xs-12 input-box" data-error="手机号码不正确" >
							<input id="userMobile" type="text" className="form-control" value={addMessageState.mobile} placeholder="手机号码" ref="mobileSet" onChange={this.onMobileChange} onBlur={this.onMobileBlur}/>
							</div>
						</div>
						<div className="form-group">
							<div className="col-xs-12 input-box" data-error="至少输入5个字消息">
							<textarea name="" id="messageContent" ref="contentSet" className="form-control" placeholder="输入消息内容" rows="5" onBlur={this.onContentBlur} onChange={this.onContentChange}></textarea>
							</div>
						</div>
						<div className="form-group">
							<div className="radio col-xs-4" onClick={()=>this.setMessageType(10)}>
								<label>
								    <input type="radio" name="message_type" value="10" defaultChecked/>求购
								</label>
							</div>
							<div className="radio col-xs-4" onClick={()=>this.setMessageType(20)}>
								<label>
								    <input type="radio" name="message_type"  value="20" />出售
								</label>
							</div>
							
							<div className="col-xs-4 text-right">
								<button type="button" id="add_new" onClick={this.onAddNewOne} className="btn btn-success">发布</button>
							</div>
						</div>
					</form>
				</div>
			</div>
			
			)
	}
	componentDidMount() {
		this.addMessageState.mobileSet = this.refs.mobileSet;
		this.addMessageState.contentSet = this.refs.contentSet;
		this.addMessageState.getMobileFromCookie()
	}
	prevent(e) {
		if(e.target.id !== 'add_new')
		e.stopPropagation()
	}
	onMobileChange = (e)=>{
		e.target.parentNode.classList.remove('has-error')
		this.addMessageState.mobile = e.target.value
	}
	onMobileBlur = (e) => {
		this.addMessageState.checkMobile(e.target.value)
	}
	onContentChange =(e) => {
		e.target.parentNode.classList.remove('has-error')
		this.addMessageState.content = e.target.value
	}
	setMessageType = (type) => {
		this.addMessageState.setMessageType(type)
	}
	onAddNewOne = (e) => {
		this.addMessageState.onAddNewOne(e)
	} 
}

export default AddMessage;