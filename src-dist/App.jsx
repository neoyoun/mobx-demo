require('bootstrap-loader');
require('./scss/main.scss');
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import DevTools from 'mobx-react-devtools';
import LoadingMask from 'components/LoadingMask';
import MessageTypeFilter from 'components/MessageTypeFilter';
import MessagesList from 'components/MessagesList';
import AddMessage from 'components/AddMessage';
@observer
class App extends Component {
  constructor(props){
    super(props)
  }
  render() {
    let appState = this.props.appState;
    let isVisible = appState.showTypeFilter;
    let filterStyle = {
      display:isVisible?'':'none'
    }
    return (
      <div className='main-container' onClick={this.hideTypeFilter}>
        <LoadingMask isVisible={appState.loading}/>
        <nav className = "page-title panel-info">
          <div className ="panel-heading">{appState.pageTitle}</div>
          <span className="filter-btn text-success" onClick={(e)=>appState.toggleTypeFilter(e)}>筛选</span>
        </nav>
        <MessageTypeFilter appState={appState}/>
        <div className="messages-list-box" ref="messageBox" onTouchEnd={this.onTouchEndHandle} onWheel={this.onMessagesBoxWheel}>
        <MessagesList messages={appState.showingMessages} userMobile={appState.userMobile}/>
        </div>
       <AddMessage/>
      </div>
    );
  }
  componentDidMount() {
    let messageBox = this.refs.messageBox;
    let appState = this.props.appState;
    appState.rollBox = messageBox;
    appState.initialLoad();
    //监听消息 最后做
    /*setTimeout(function () {
      appState.listeningData()
    }, 500)*/
  }
  componentDidUpdate() {
    this.props.appState.scrollMessageBox()
  }
  hideTypeFilter = (e) => {
    let isVisible = this.props.appState.showTypeFilter;
    if(isVisible) {
      this.props.appState.hideTypeFilter();
    }
  }
  setType = (e) => {
    this.props.appState.setVisibleType(e.target.value)
  }
  onMessagesBoxWheel = (e) => {
    this.props.appState.onMessagesBoxWheel(e)
  }
  onTouchEndHandle = (e) => {
    this.props.appState.onMessagesBoxWheel(e)
  }
};

export default App;
