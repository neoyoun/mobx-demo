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
        {store.data.length == 0 && 
          <h5 className="text-center">还没有人发布信息，点击右上角'发布'按钮发布</h5>
        }
        <div className="messages-list-box" ref="messageBox" onTouchEnd={e=>this.onTouchEndHandle(e)} onWheel={e=>this.onMessagesBoxWheel(e)}>
        <MessagesList count={store.visibilityMessageList.length} setVisibleMessage={(id)=>this.onSetVisibleMessage(id)} messages={store.visibilityMessageList} userMobile={store.userMobile}/>
        {store.hasUnread && 
          <UnreadTips clickHandle={this.onRunToButtom}/>
        }
        </div>
        <VisibilityTypeFilter setVisibleBrand={type=>store.setVisibleBrand(type)}  setVisibleOffType={type=>store.setVisibleOffType(type)} filterOption={store.filterOption} brandList={store.brandList} offTypeList={store.offTypeList} onToggleBrandFilter={this.onToggleBrandFilter} onToggleOffTypeFilter={this.onToggleOffTypeFilter}/>
        {store.isShowMessageDetail && <MessageDetail message={store.messageDetailShowing} />}
        <AddMessage addMessageStore={store.addMessageStore} isShow={store.isShowAddNewBox} brandList={store.brandList} offTypeList={store.offTypeList}/>
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

  onToggleBrandFilter = (e)=>{
    e.stopPropagation()
    this.props.store.toggleBrandFilter();
  }
  onToggleOffTypeFilter = (e)=>{
    e.stopPropagation()
    this.props.store.toggleOffTypeFilter();
  }
};

export default App;
