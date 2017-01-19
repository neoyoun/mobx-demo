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
	let {messageInfo,isShowBrandList,isShowOffTypeList,isShowContentArea,offTypeList,brandList} = this.store;
		return(
			<div className="new_message_box panel panel-default" onClick={e=>this.prevent(e)}>
				<div className="panel-heading">
					<div className="panel-title text-center">尾货处理发布</div>
				</div>
				<div className="panel-body input-area">
					<div className="row">
						<div className="col-xs-12">
							<div className="input-group input-box" data-error="手机号码不正确">
							<span className="input-group-addon">联系方式</span>
							<input id="userMobile" type="text" className="form-control" value={messageInfo.mobile} placeholder="输入手机号码" ref="mobileSet" onChange={this.onMobileChange} onBlur={this.onMobileBlur}/>
							</div>
						</div>
					</div>
					<div className="row">
						<div className="col-xs-12">
								<div className="input-group">
								<div className="input-group-btn">
									<button type="button" className="btn btn-default" onClick={this.toggleBrandListShow}>
										车型选择
									</button>
									{isShowBrandList &&
									<ul className="brand-list">
										{brandList.map((brand, idx)=><li key={idx} onClick={()=>this.onBrandChange(brand)}>{brand}</li>)}
									</ul>
									 }
								</div>
									<input id="brand" type="text" value={messageInfo.brand} className="form-control" readOnly/>
								</div>
							</div>
					</div>
					<div className="row">
						<div className="col-xs-12">
							<div className="input-group">
								<span className="input-group-addon">配件代码</span>
								<input id="goodCode" type="text" className="form-control"placeholder="配件代码(可选)" value={messageInfo.code} onChange={this.onCodeChange} required/>
							</div>
							</div>
					</div>
					<div className="row">
						<div className="col-xs-12">
							<div className="input-group">
							<span className="input-group-addon">配件名称</span>
								<input id="goodDesc" type="text" className="form-control" placeholder="配件名称(可选)" value={messageInfo.desc} onChange={this.onDescChange} required/>
							</div>
						</div>
					</div>
					<div className="row">
						<div className="col-xs-12">
							<div className="input-group">
							<span className="input-group-addon">配件价格</span>
								<input id="goodPrice" key="goodPrice" type="number" className="form-control" onChange={this.onPriceChange} required/>
							</div>
						</div>
					</div>
					<div className="row">
						<div className="col-xs-12">
							<div className="input-group">
							<span className="input-group-addon">处理数量</span>
								<input id="goodCount" key="goodCount" type="number" className="form-control" onChange={this.onCountChange}/>
							</div>
						</div>
					</div>
					{isShowContentArea &&
					<div className="row">
						<div className="col-xs-12 input-box" data-error="至少输入5个字消息">
							<textarea name="" id="messageContent" ref="contentSet" className="form-control" placeholder="输入消息内容" rows="3" onBlur={this.onContentBlur} onChange={this.onContentChange}></textarea>
						</div>
					</div>
					}

					<div className="row">
						{offTypeList.map((offType, idx)=>{
							return (<div className="col-xs-3" onClick={()=>this.onOffTypeChange(offType)}>
								<label>
								    <input type="radio" name="good_off_type" />{offType}
								</label>
						</div>)
						})}
						{/*<div className="col-xs-4" onClick={()=>this.store.setMessageType(10)}>
								<label>
								    <input type="radio" name="message_type" value="10" />求购
								</label>
						</div>
						<div className="col-xs-4" onClick={()=>this.store.setMessageType(20)}>
							<label>
							    <input type="radio" name="message_type" value="20" defaultChecked/>出售
							</label>
						</div>*/}
						<div className="col-xs-3 text-right">
							<button type="button" id="add_new" onClick={(e)=>this.store.onAddNewOne(e)} className="btn btn-success">发布</button>
						</div>
					</div>
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
	onBrandChange = (val)=>{
		this.store.messageInfo.brand = val
		this.store.isShowBrandList = false;
	}
	onOffTypeChange = (val)=>{
		this.store.messageInfo.offType = val
		this.store.isShowOffTypeList = false;
	}
	onCodeChange = (e)=>{
		this.store.messageInfo.code = e.target.value
	}
	onDescChange = (e)=>{
		this.store.messageInfo.desc = e.target.value
	}
	onPriceChange = (e)=>{
		this.store.messageInfo.price = e.target.value
	}
	onCountChange = (e)=>{
		this.store.messageInfo.count = e.target.value
	}
	onMobileBlur = (e) => {
		this.store.checkMobile(e.target.value)
	}
	onContentChange =(e) => {
		e.target.parentNode.classList.remove('has-error')
		this.store.messageInfo.content = e.target.value
	}
	toggleBrandListShow = () => {
		this.store.isShowBrandList = !this.store.isShowBrandList
	}
}

export default AddMessage;