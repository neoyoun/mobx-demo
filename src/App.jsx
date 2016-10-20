require('bootstrap-loader');
require('./scss/main.scss');
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import DevTools from 'mobx-react-devtools';
//import MessageTypeFilter from 'components/MessageTypeFilter';

@observer
class App extends Component {
  constructor(props){
    super(props)
    console.log("data is ",Array.isArray(this.props.data))
    console.log("slice is ",Array.isArray(this.props.data.slice()) )

  }
  render() {
    let appState = this.props.appState;
    let data = this.props.data;
    let filterVisible = appState.showTypeFilter;
    let filterStyle = {display:filterVisible?'':'none'}
    return (
      <div className='main-container' onClick={this.hideTypeFilter}>
      <DevTools />
        <nav className = "navbar-fixed-top panel-info text-center">
          <div className ="panel-heading">{appState.pageTitle}</div>
          <span className="filter-btn text-success" onClick={this.toggleTypeFilter}>筛选</span>
        </nav>
        <ul className="list-unstyled types-list" style={filterStyle} value={filterVisible}>
          <li className="type-item" value="0" onClick={this.setVisibleType}>全部</li>
          <li className="type-item" value="10" onClick={this.setVisibleType}>仅看求购</li>
          <li className="type-item" value="20" onClick={this.setVisibleType}>仅看求售</li>
        </ul>
        <div className="messages-list-box">
        <MessageList messages={data.slice()} userMobile={appState.userMobile}/>
        </div>
        {/*<button onClick={this.onReset}>
          Seconds passed: {this.props.appState.timer}
        </button>*/}
      </div>
    );
  }
  onReset = () => {
    this.props.appState.resetTimer();
  }
  componentWillUpdate() {
    console.log('will update....');
  }
  toggleTypeFilter = (e) => {
    e.stopPropagation()
    this.props.appState.toggleTypeFilter();
  }
  hideTypeFilter = () =>{
    this.props.appState.hideTypeFilter()
  }
  setVisibleType = (e) =>{
    //e.stopPropagation()
    this.props.appState.setVisibleType(e.target.value)
  }
};

@observer 
class MessageList extends Component {
  render() {
    let {messages,userMobile} = this.props;
    return (
      <div className="messages-list" id="messagesList">
       {messages.map((message)=>{
          if(message.mobile == userMobile){
            return <MessageItem message={message} key={message.id} source="send"/>
          }else{
            return <MessageItem message={message} key={message.id} source="received"/>
          }
          })}
      </div>
    )
  }
}
class MessageItem extends Component {
  render() {
    let {source,message} = this.props;
    let faceSrc = '/src/imgs/'+ message.typename +'.png';
    return (
        <div className={"message-item "+ source}>
          <div className="item-face">
            <img src={faceSrc}/>
          </div>
          <div className="item-content">
            <h4 className="media-heading">{message.mobile}<small>&nbsp;&nbsp;@{message.addtime}</small></h4>
            <div className="message-content">{message.content}</div>
          </div>
        </div>
      )

  }
}

export default App;
