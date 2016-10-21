require('bootstrap-loader');
require('./scss/main.scss');
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import DevTools from 'mobx-react-devtools';
import LoadingMask from 'components/LoadingMask';
//import MessageTypeFilter from 'components/MessageTypeFilter';
import MessagesList from 'components/MessagesList';
@observer
class App extends Component {
  constructor(props){
    super(props)
    //this.props.appState.fetch();
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
        <nav className = "navbar-fixed-top panel-info text-center">
          <div className ="panel-heading">{appState.pageTitle}</div>
          <span className="filter-btn text-success" onClick={(e)=>appState.toggleTypeFilter(e)}>筛选</span>
        </nav>
        {/*<ul className="list-unstyled types-list" style={filterStyle}>
          <li className="type-item" onClick={()=>appState.setVisibleType(0)}>全部</li>
          <li className="type-item" onClick={()=>appState.setVisibleType(10)}>仅看求购</li>
          <li className="type-item" onClick={()=>appState.setVisibleType(20)}>仅看求售</li>
        </ul>*/}
        <MessageTypeFilter appState={appState}/>
        <div className="messages-list-box">
        <MessagesList messages={appState.showingMessages} userMobile={appState.userMobile}/>
        </div>
        {/*<button onClick={this.onReset}>
          Seconds passed: {this.props.appState.timer}
        </button>*/}
      </div>
    );
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

class MessageTypeFilter extends Component {
  render() {
    let appState = this.props.appState;
    let isVisible = appState.showTypeFilter;
    let filterStyle = {
      display:isVisible?'':'none'
    }
    return (
      <ul className="list-unstyled types-list" style={filterStyle}>
          <li className="type-item" value="0" onClick={()=>appState.setVisibleType(0)}>全部</li>
          <li className="type-item" value="10" onClick={()=>appState.setVisibleType(10)}>仅看求购</li>
          <li className="type-item" value="20" onClick={()=>appState.setVisibleType(20)}>仅看求售</li>
      </ul>
      )
  }

}

export default App;
