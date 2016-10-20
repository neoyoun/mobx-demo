require('bootstrap-loader');
require('./scss/main.scss');
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import DevTools from 'mobx-react-devtools';
//import MessageTypeFilter from 'components/MessageTypeFilter';

@observer
class App extends Component {
  render() {
    return (
      <div className='main-container'>
        <nav className = "navbar-fixed-top panel-info text-center">
          <div className ="panel-heading">{this.props.appState.curTitle}</div>
          <span value="20" className="filter-btn" onClick={this.toggleShowFilter}>筛选</span>
        </nav>
        <MessageTypeFilter isVisible={this.props.appState.showTypeFilter}/>
        {/*<button onClick={this.onReset}>
          Seconds passed: {this.props.appState.timer}
        </button>*/}
        
        {/*<DevTools />*/}
      </div>
    );
  }
  onReset = () => {
    this.props.appState.resetTimer();
  }
  toggleShowFilter = () => {
    this.props.appState.toggleShowFilter();
  }
};

class MessageTypeFilter extends Component {
  render() {
    let isVisible = this.props.isVisible;
    let style = {
      display:isVisible?'':'none'
    }
    return (
        <ul className="list-unstyled types-list" style={style}>
          <li className="type-item" value="0" onClick={this.filterTypeHandle}>全部</li>
          <li className="type-item" value="10" onClick={this.filterTypeHandle}>仅看求购</li>
          <li className="type-item" value="20" onClick={this.filterTypeHandle}>仅看求售</li>
        </ul>
      )
  }
}

export default App;
