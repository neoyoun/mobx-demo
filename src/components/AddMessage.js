import React,{Component} from 'react'
import { observer } from 'mobx-react';
import PopupModal from './PopupModal';
@observer
class AddMessage extends Component {
	constructor(props){
		super(props)
		//this.store = new AddMessageState();
		this.store = this.props.addMessageStore;
	}
	render() {
	const {messageInfo,isShowErrorTip,errorTip,isShowBrandList,isShowOffTypeList,isShowContentArea} = this.store;
	const {rememberUser, isShow, brandList, offTypeList} = this.props;
		return(
			<div className="new_message_box panel panel-default" style={{display:isShow?'':'none'}} onClick={e=>this.prevent(e)}>
				{isShowErrorTip && <PopupModal text={errorTip} />}
				<div className="panel-heading">
					<div className="panel-title text-center">尾货处理发布</div>
				</div>
				<div className="panel-body input-area">
					<div className="row">
						<div className="col-xs-12">
							<div className="input-group input-box" data-error="手机号码不正确">
							<span className="input-group-addon">联系方式</span>
							<input name="mobile" type="text" className="form-control" value={messageInfo.mobile} placeholder="输入手机号码" ref="mobileSet" onChange={this.onInputFieldChange} onBlur={this.onInputFieldBlur}/>
							</div>
						</div>
					</div>
					<div className="row">
						<div className="col-xs-12">
								<div className="input-group">
								<span className="input-group-addon">车型选择</span>
								{/*<div className="input-group-btn">
									<button type="button" className="btn btn-default" onClick={this.toggleBrandListShow}>
										车型选择
									</button>
								</div>*/}
									<input id="brand" type="text" value={messageInfo.brand} className="form-control" onClick={this.toggleBrandListShow} readOnly/>
									<span className="caret choice-tip" onClick={this.toggleBrandListShow}></span>
									{isShowBrandList &&
									<ul className="brand-list">
										{brandList.map((brand, idx)=><li key={'brand_'+idx} onClick={()=>this.onBrandChange(brand)}>{brand}</li>)}
									</ul>
									}

								</div>

							</div>
					</div>
					<div className="row">
						<div className="col-xs-12">
							<div className="input-group input-box" data-error="不能为空">
								<span className="input-group-addon">配件代码</span>
								<input name="code" type="text" className="form-control"placeholder="输入主机厂零件号" value={messageInfo.code}  onChange={this.onInputFieldChange} onBlur={this.onInputFieldBlur}/>
							</div>
						</div>
					</div>
					<div className="row">
						<div className="col-xs-12">
							<div className="input-group input-box" data-error="不能为空">
							<span className="input-group-addon">配件名称</span>
								<input name="desc" type="text" className="form-control" placeholder="请输入零件名" value={messageInfo.desc}  onChange={this.onInputFieldChange} onBlur={this.onInputFieldBlur}/>
							</div>
						</div>
					</div>
					<div className="row">
						<div className="col-xs-12">
							<div className="input-group input-box" data-error="不能为空">
							<span className="input-group-addon">厂家品牌</span>
								<input name="manufacturer" key="goodCount" type="text" className="form-control" value={messageInfo.manufacturer} onChange={this.onInputFieldChange} onBlur={this.onInputFieldBlur}/>
							</div>
						</div>
					</div>
					<div className="row">
						<div className="col-xs-12">
							<div className="input-group input-box" data-error="不能为空">
							<span className="input-group-addon">处理价格</span>
								<input name="price" type="number" className="form-control" value={messageInfo.price} onChange={this.onInputFieldChange} onBlur={this.onInputFieldBlur}/>
							</div>
						</div>
					</div>
					<div className="row">
						<div className="col-xs-12">
							<div className="input-group input-box" data-error="不能为空">
							<span className="input-group-addon">处理数量</span>
								<input name="count" type="number" className="form-control" value={messageInfo.count} onChange={this.onInputFieldChange} onBlur={this.onInputFieldBlur}/>
							</div>
						</div>
					</div>
					{isShowContentArea &&
					<div className="row">
						<div className="col-xs-12 input-box" data-error="至少输入5个字">
							<textarea name="content" id="messageContent" ref="contentSet" className="form-control" placeholder="输入消息内容" rows="3" onBlur={this.onContentBlur} onChange={this.onInputFieldChange}></textarea>
						</div>
					</div>
					}
					<div className="row">
						{offTypeList.map((offType, idx)=>{
							return (<div className="col-xs-4 offtype-item" key={'offtype_'+idx} onClick={()=>this.onOffTypeChange(offType)}>
								<label>
									{ offType == messageInfo.offType &&
										<input type="radio" defaultChecked name="offType" />
									}
									{ offType != messageInfo.offType &&
										<input type="radio" name="offType" />
									}
									{offType}
								</label>
						</div>)
						})}
						
					</div>
					<div className="row">
						<div className="col-xs-12">
							<button type="button" id="add_new" onClick={(e)=>this.store.onAddNewOne(e)} className="btn btn-block btn-success">发布</button>
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
		// 阻止冒泡隐藏 modal 层
		if(e.target.id !== 'add_new'){
			e.stopPropagation()
		}
		this.store.isShowErrorTip = false;
	}
	onInputFieldChange = (e)=>{
		e.target.parentNode.classList.remove('has-error')
		this.store.isShowErrorTip = false;
		let fieldName = e.target.name;
		let fieldVal = e.target.value;
		switch(fieldName){
			case 'price':
				this.store.messageInfo.price = Math.round(parseFloat(fieldVal)*100)/100;
			break;
			case 'count':
				this.store.messageInfo.count = +fieldVal;
			break;
			default:
				this.store.messageInfo[''+fieldName] = fieldVal
		}
	}
	onInputFieldBlur = (e) => {
		let fieldName = e.target.name;
		let fieldVal = e.target.value;
		let isCorrect = this.store.checkInput(''+fieldName, fieldVal)
		if(!isCorrect){
			e.target.parentNode.classList.add('has-error')
		}
	}
	onBrandChange = (val)=>{
		this.store.messageInfo.brand = val
		this.store.isShowBrandList = false;
	}
	onOffTypeChange = (val)=>{
		this.store.messageInfo.offType = val
		this.store.isShowOffTypeList = false;
	}
	onMobileBlur = (e) => {
		this.store.checkMobile(e.target.value)
	}
	toggleBrandListShow = () => {
		this.store.isShowBrandList = !this.store.isShowBrandList
	}
}

export default AddMessage;