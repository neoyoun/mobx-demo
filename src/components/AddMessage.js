import React,{Component} from 'react'
import { observer } from 'mobx-react';
import {AddMessageState} from '../AddMessageState';
@observer
class AddMessage extends Component {
	constructor(){
		super()
		this.addMessageState = new AddMessageState();
	}
	render() {
	let addMessageState = this.addMessageState;
	let hasMobile = addMessageState.validateMobile?' up':'';
	let mobileStyle = addMessageState.validateMobile?'none':'';
	let messageStyle = addMessageState.validateMobile?'':'none';
		return(
			<div className={"new-message-box"+hasMobile}>
				<div className="message-input">
					<span className="input-type">手机</span>
					<input type="text" className="form-control" placeholder="手机号码" onChange={this.onMobileChange}/>
					<button className="input-button btn btn-success" type="button">设置</button>
				</div>
				<div className="message-input">
					<ul className ="send-type-list">
			  		<li className="send-type-item" value="20" onClick={this.setMessageType}>出售</li>
			  		<li className="send-type-item" value="10" onClick={this.setMessageType}>求购</li>
			  	</ul>
					<span className="input-type">求购</span>
					<input type="text" className="form-control" placeholder="输入你的信息" onChange={this.onMobileChange}/>
					<button className="input-button btn btn-success" type="button">发送</button>
			</div>
		</div>
			)
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