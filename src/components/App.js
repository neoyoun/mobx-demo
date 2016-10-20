require('bootstrap-loader');
require('../scss/main.scss');
import React,{Component} from 'react'
import ReactDOM from 'react-dom'
import PubSub from 'pubsub-js'
import AddMessage from 'components/AddMessage'
const ChangeVisibilityType = 'setMessagesType';
//const loadServer = './services/loaddata.php';
const loadServer = './api/loaddata.text';
const insertServer =  './services/insertData.php';
var _ConstantlyMessage,
		_MessagesList,
		_MessageItem;

export default class App extends Component {
	constructor(props){
		super(props)
		_ConstantlyMessage = this;
		this.state ={
			messageType: '',
			data: [],
			loadTimes: 0,
			leastId: 0,
			userMobile: '',
			firstTimeLoad: 50,
			chatHistory: true,
			loading:false,
			totalHeight : 0,
			showTypeFilter:false
		}
	}
	onVisibilityTypeChange(topic,type) {
		this.setState({messageType : type });
	}
	sendNewMessage(message) {
		if( typeof message != 'object' ) return;
		var xhr = new XMLHttpRequest();
		var targetUrl = this.props.insertURL;
		xhr.onreadystatechange = function () {
		}
		xhr.onerror = function (e) {
			console.log(e);
		}
		xhr.timeout = 3000;
		xhr.ontimeout = function () {
			alert('网络不给力,请稍后再试..')
		}
		xhr.open('POST' , targetUrl);
		xhr.setRequestHeader("Content-type","application/json; charset=utf-8");
		xhr.send(JSON.stringify(message));
	}
	loadDataFromServer (amount , startIndex , source){
		amount = amount || 10;
		var targetUrl = this.props.sourceURL+'?amount='+amount;
		if(startIndex != undefined ){
			targetUrl += '&startIndex='+startIndex;
		}
		var xhr = new XMLHttpRequest();
			xhr.onreadystatechange = manipulateData; 
			xhr.timeout = 5000;
			xhr.ontimeout = function () {
				alert('数据加载超时，请稍后重试...');
				this.setState({loading:true})
			}
			xhr.open('GET',targetUrl);
			xhr.send();

			function manipulateData () {
				var datas;
				var newdata=[];
				var userMobile = _ConstantlyMessage.state.userMobile
				var leastId = _ConstantlyMessage.state.leastId;
				if( xhr.readyState == 4 ){
					if ( xhr.status == 200 ){
						if(xhr.responseText == '400' ){
							alert('服务异常,请稍后再试')
							return;
						}
						datas = JSON.parse(xhr.responseText);
						//console.log(datas);
						if( datas.length == 0 ){
							_ConstantlyMessage.setState({chatHistory:false})
							return;
						}
						var messages = datas.messages;
						var length = +datas.length;
						if(datas.userMobile){
							userMobile = datas.userMobile;
						}
						if( source == 'early' ){
							//load 旧数据
							newdata = messages.concat(_ConstantlyMessage.state.data);
						}else{
							//首次 load 数据
							if( userMobile ){
								//AddMessage.setState({mobile:userMobile,mobileValidate:true});
							}
							leastId = +datas.leastId;
							newdata = _ConstantlyMessage.state.data.concat(messages);
							setTimeout(_ConstantlyMessage.onListeningData,3000);
						}
						if( length < _ConstantlyMessage.state.firstTimeLoad) {
							_ConstantlyMessage.setState({data:newdata,leastId:leastId,userMobile:userMobile,loading:false,chatHistory:false})
						}else {
							_ConstantlyMessage.setState({data:newdata,leastId:leastId,userMobile:userMobile,loading:false});
						}
					}else {
						alert('数据加载出错，请刷新重试...');
						_ConstantlyMessage.setState({loading:true})
					}
				}
			}
	}
	/*
	 * @数据处理方法
	 * @param data json格式化后的字符串
	 * data.length    --    数据长度
	 * data.leastId   --  	最近一条消息的ID
	 * userMobile     --    浏览器保存的 user   
	 * 在三种情况下调用 
	 * 1、初始化数据;
	 * 2、监听数据变化，接受服务器 push
	 * 3、加载消息记录
	 * post方法不传回数据，由 Push流 接收;
	 */
	processData(data) {
		let newdata = [];
		let datas;
		if( typeof data == 'string' ){
			datas = JSON.parse(data);
			let leastId = +datas.leastId;
			let messages = datas.messages;
			//let	userMobile = AddMessage.state.mobile;
			let userMobile = this.state.userMobile;
			if( leastId > this.state.leastId ){
				newdata = this.state.data.concat(messages);
				this.setState({data:newdata,leastId:leastId,userMobile:userMobile});
			}
		}
	}
	onListeningData() {
		let leastId = this.state.leastId;
		let xhr = new XMLHttpRequest();
		let targetUrl = this.props.sourceURL+'?leastId='+leastId;
		xhr.onreadystatechange = function () {
				if( xhr.readyState == 3 && xhr.responseText){
					_ConstantlyMessage.processData(xhr.responseText);
				}else if( xhr.readyState == 4 ){
					setTimeout(_ConstantlyMessage.onListeningData, 4000);
				}
			}
			xhr.timeout = 5000;
			xhr.ontimeout = function () {
				xhr = null;
			}
			xhr.onerror = function () {
				console.log('error....');
				xhr = null;
			}
			xhr.open('GET',targetUrl);
			xhr.send(); 
	}
	componentDidMount() {
		this.loadDataFromServer(this.state.firstTimeLoad);
		PubSub.subscribe(ChangeVisibilityType,this.onVisibilityTypeChange);
		PubSub.subscribe('ceshiyixia',this.onVisibilityTypeChange);
	}
	componentDidUpdate() {
		let messageBox = this.refs.messageBox;
		if( this.state.loadTimes == 0 ){
			this.scrollMessageBox(this.state.totalHeight,200);
		}else{
			this.scrollMessageBox(this.state.totalHeight);
		}
	}
	scrollMessageBox(totalHeight,interval) {
		let messageBox = this.refs.messageBox;
			if( messageBox.offsetHeight < messageBox.scrollHeight ){
				let curTop = messageBox.scrollTop,D = messageBox.scrollHeight - totalHeight;
				if( interval != undefined ){
					let startT = new Date().getTime(),T = interval;
					requestAnimationFrame(function step() {
						let movingT = new Date().getTime() - startT;
						messageBox.scrollTop = curTop + (movingT/T * D);
						if(movingT < T ){
							requestAnimationFrame(step)
						}
					})
				}	else {
					messageBox.scrollTop = curTop + D;
				}
			}else {
					return
			}
	}
	listWheelHandle(event) {
		var messageBox = this.refs.messageBox;
		var currScrollTop = messageBox.scrollTop;
		var maxScrollTop = messageBox.scrollHeight - messageBox.offsetHeight;
		if( (currScrollTop + event.deltaY)< 0 ){
			this.setState({totalHeight:messageBox.scrollHeight})
			var startIndex = +this.state.data[0].id;
			if( this.state.chatHistory ){
				this.setState({loading:true,loadTimes:this.state.loadTimes+1});
				this.loadDataFromServer(this.state.firstTimeLoad , startIndex , 'early')
			}
		}else if( (currScrollTop + event.deltaY ) > maxScrollTop ){
			this.setState({loadTimes:0})
		}
	}
	onTouchEndHandle(event) {
		event.stopPropagation();
		var messageBox = this.refs.messageBox;
		var currScrollTop = messageBox.scrollTop;
		var maxScrollTop = messageBox.scrollHeight - messageBox.offsetHeight;
		if( currScrollTop <= 0 ){
			this.setState({totalHeight:messageBox.scrollHeight})
			var startIndex = +this.state.data[0].id;
			if( this.state.chatHistory ){
				this.setState({loading:true,loadTimes:this.state.loadTimes+1});
				this.loadDataFromServer(this.state.firstTimeLoad , startIndex , 'early')
			}
		}else if(currScrollTop>=maxScrollTop){
			this.setState({loadTimes:0})
		}
	}
	toggleShowFilter(e) {
		e.stopPropagation()
		this.setState({showTypeFilter:!this.state.showTypeFilter})
	}
	render() {
		let currTitle;
		let messageType = this.state.messageType;
		let loadingStyle = '';
		if(this.state.loading){loadingStyle = 'on'}
		switch(messageType) {
			case "0":
				currTitle = "实时交易信息";
				break;
			case "10":
				currTitle = "实时求购信息";
				break;
			case "20":
				currTitle = "实时求售信息";
				break;
		}
		return (
			<div className={this.props.className}>
				<nav className = "navbar-fixed-top panel-info text-center">
					<div className ="panel-heading">{curTitle}
					</div>
					<span value="20" className="filter-btn" onClick={this.toggleShowFilter}>筛选</span>
				</nav>
				<MessageTypeFilter isVisible={this.state.showTypeFilter}/>
				<div className={"loading-mask "+loadingStyle}>
					<div className="loading">
						<img src="./imgs/loading.gif"/>
					</div>
				</div>
				<div className="messages-list-box" ref="messageBox" onTouchEnd={this.onTouchEndHandle} onWheel={this.listWheelHandle}>
					<MessagesList messagesCollection={this.state.data} type={this.state.messageType} />
				</div>
				<AddMessage sendNewMessage = {this.sendNewMessage} mobile={this.state.userMobile}/>
			</div>
			)
	}
}


class MessagesList extends Component {
	render() {
		let {messageType,messagesCollection} = this.props;
		let messageList = [];
		messagesCollection.map(function (messageItem) {
			if( receivedType != 0 ){
				if( receivedType == messageItem.type ){
					messageList.push(<MessageItem key={messageItem.id} message={messageItem}/>)
				}
			}else {
				messageList.push(<MessageItem key={messageItem.id}  message={messageItem}/>)
			}
		})
		return (
			<div className="messages-list" id="messagesList" ref="messagesList">
				{messageList}
			</div>
			)
	}
}
class MessageItem extends Component {
	render() {
		let userMobile = _ConstantlyMessage.state.userMobile;
		let message = this.props.message;
		if( message.mobile  == userMobile ){
			return (
			<div className="media">
				<MessageContent type={message.typename} mobile={message.mobile} addtime={message.addtime} content={message.content} source='send'/>
				<MessageFace position="right"  type={message.typename}/>
			</div>
			)
		} else {
			return (
			<div className="media">
				<MessageFace position="left"  type={message.typename}/>
				<MessageContent type={message.typename} mobile={message.mobile} addtime={message.addtime} content={message.content} source='received'/>
			</div>
			)
		}
	}
}
class MessageContent extends Component {
	render() {
		return (
			<div className="media-body">
				<div className={this.props.source+'-message'}>
					<h4 className="media-heading">{this.props.mobile}<small>&nbsp;&nbsp;@{this.props.addtime}</small></h4>
					<div className="message-content">{this.props.content}</div>
				</div>
			</div>
			)
	}
}
class MessageFace extends Component {
		render() {
		let classNameStr = 'media-'+ this.props.position;
		let faceSrc = './imgs/'+ this.props.type +'.png';
		return (
			<div className={classNameStr}>
				<img src={faceSrc} alt={this.props.type} />
			</div>
			)
	}
}

