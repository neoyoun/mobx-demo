require('bootstrap-loader');
require('./scss/main.scss');
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import DevTools from 'mobx-react-devtools';
import LoadingMask from 'components/LoadingMask';
import VisibilityTypeFilter from 'components/VisibilityTypeFilter';
import MessagesList from 'components/MessagesList';
import MessageDetail from 'components/MessageDetail';
import AddMessage from 'components/AddMessage';
import UnreadTips from 'components/UnreadTips';
@observer
class App extends Component {
  render() {
    const store = this.props.store
    return (
      <div className='main-container' onClick={(e)=>this.hidePopupLayer(e)}>
      {module.hot &&  <DevTools /> }
        {store.loading && 
          <LoadingMask />
        }
        <nav className="page-title panel-default">
          <div className="panel-heading">{store.pageTitle}</div>
         <span className="btn btn-warning add-btn" onClick={ e =>store.toggleAddBox(e)}>发布</span>
        </nav>
        <div className="messages-list-box" ref="messageBox" onTouchEnd={e=>this.onTouchEndHandle(e)} onWheel={e=>this.onMessagesBoxWheel(e)}>
        <MessagesList setVisibleMessage={(id)=>this.onSetVisibleMessage(id)} messages={store.visibilityMessageList} userMobile={store.userMobile}/>
        {store.hasUnread && 
          <UnreadTips clickHandle={this.onRunToButtom}/>
        }
        </div>
        <VisibilityTypeFilter setVisibleType={type=>store.setVisibleType(type)} brandList={store.brandList} offTypeList={store.offTypeList}/>
        {store.isShowMessageDetail && store.messageDetailShowing && <MessageDetail message={store.messageDetailShowing} />}
        <AddMessage rememberUser={store.userMobile} isShow={store.isShowAddNewBox}/>
      </div>
    );
  }
  componentDidMount() {
    let messageBox = this.refs.messageBox;
    let store = this.props.store;
    store.rollBox = messageBox;
    store.initialLoad();
  }
  hidePopupLayer(e){
    e.stopPropagation()
    this.props.store.hidePopupLayer()
  }
  onMessagesBoxWheel(e){
    e.stopPropagation()
    this.props.store.onMessagesBoxWheel(e)
  }
  onTouchEndHandle(e) {
    e.stopPropagation()
    this.props.store.onMessagesBoxWheel(e)
  }
  onSetVisibleMessage(id) {
    this.props.store.setVisibleMessage(id)
  }
  onRunToButtom = (e) => {
    e.stopPropagation()
    this.props.store.runToBottom();
  }
};

export default App;
