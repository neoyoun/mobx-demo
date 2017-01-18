import React,{Component} from 'react'
import { observer } from 'mobx-react';
import AddMessageState from '../AddMessageState';
@observer
class AddMessage extends Component {
	constructor(){
		super()
		this.store = new AddMessageState();
		
	}
	render() {
	//let addMessageState = this.store;
	let {messageInfo} = this.store;
	//let hasMobile = addMessageState.validateMobile?' up':'';
	//let typeShow = addMessageState.showTypeList?' active':'';
		return(
			<div className="new_message_box panel panel-default" onClick={e=>this.prevent(e)}>
				<div className="panel-heading">
					<div className="panel-title text-center">发布消息</div>
				</div>
				<div className="panel-body">
					<form role="form" className="form-horizontal">
						<div className="form-group">
							<div className="col-xs-12 input-box" data-error="手机号码不正确" >
							<input id="userMobile" type="text" className="form-control" value={messageInfo.mobile} placeholder="手机号码" ref="mobileSet" onChange={this.onMobileChange} onBlur={this.onMobileBlur}/>
							</div>
						</div>
						<div className="form-group">
							<div className="col-xs-12 input-box" data-error="配件名称不正确" >
							<input id="brand" type="text" className="form-control" placeholder="输入车型，如 海格/宇通/金龙"  onChange={this.onBrandChange}/>
							</div>
						</div>
						<div className="form-group">
							<div className="col-xs-12 input-box" data-error="配件代码不正确" >
							<input id="goodCode" type="text" className="form-control"placeholder="配件代码" onChange={this.onCodeChange}/>
							</div>
						</div>
						<div className="form-group">
							<div className="col-xs-12 input-box" data-error="配件名称不正确" >
							<input id="goodDesc" type="text" className="form-control" placeholder="配件名称" onChange={this.onDescChange}/>
							</div>
						</div>
						<div className="form-group">
							<div className="col-xs-12 input-box" data-error="至少输入5个字消息">
							<textarea name="" id="messageContent" ref="contentSet" className="form-control" placeholder="输入消息内容" rows="3" onBlur={this.onContentBlur} onChange={this.onContentChange}></textarea>
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
		this.store.mobileSet = this.refs.mobileSet;
		this.store.contentSet = this.refs.contentSet;
		this.store.getMobileFromCookie()
	}
	prevent(e) {
		if(e.target.id !== 'add_new')
		e.stopPropagation()
	}
	onMobileChange = (e)=>{
		e.target.parentNode.classList.remove('has-error')
		this.store.messageInfo.mobile = e.target.value
	}
	onMobileChange = (e)=>{
		e.target.parentNode.classList.remove('has-error')
		this.store.messageInfo.mobile = e.target.value
	}
	onBrandChange = (e)=>{
		this.store.messageInfo.brand = e.target.value
	}
	onCodeChange = (e)=>{
		this.store.messageInfo.code = e.target.value
	}
	onDescChange = (e)=>{
		this.store.messageInfo.desc = e.target.value
	}
	onMobileBlur = (e) => {
		this.store.checkMobile(e.target.value)
	}
	onContentChange =(e) => {
		e.target.parentNode.classList.remove('has-error')
		this.store.messageInfo.content = e.target.value
	}
	setMessageType = (type) => {
		this.store.setMessageType(type)
	}
	onAddNewOne = (e) => {
		this.store.onAddNewOne(e)
	} 
}

export default AddMessage;