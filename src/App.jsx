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
      <DevTools />
        <LoadingMask/>
        <nav className = "page-title panel-info">
          <div className ="panel-heading">{appState.pageTitle}</div>
          <span className="filter-btn text-success" onClick={(e)=>appState.toggleTypeFilter(e)}>筛选</span>
        </nav>
        <MessageTypeFilter appState={appState}/>
        <div className="messages-list-box" ref="messageBox">
        <MessagesList messages={appState.showingMessages} userMobile={appState.userMobile}/>
        </div>
       <AddMessage/>
        {/*<button onClick={this.onReset}>
          Seconds passed: {this.props.appState.timer}
        </button>*/}
      </div>
    );
  }
  componentDidMount() {
    let messageBox = this.refs.messageBox;
    let appState = this.props.appState;
    appState.rollBox = messageBox;
  }
  componentDidUpdate() {
    let messageBox = this.refs.messageBox;
    console.log(messageBox.scrollHeight);
    let appState = this.props.appState;
    if( appState.loadTimes == 0 ){
      this.scrollMessageBox(0,500);
    }else{
      this.scrollMessageBox(appState.totalHeight);
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
        } else {
          messageBox.scrollTop = curTop + D;
        }
      }else {
        return
      }
  }
  
  hideTypeFilter = (e) => {
    let isVisible = this.props.appState.showTypeFilter;
    if(isVisible) {
      this.props.appState.hideTypeFilter();
    }
  }
  setType = (e) =>{
    //e.stopPropagation()
    this.props.appState.setVisibleType(e.target.value)
  }
};

export default App;
