import { observable,computed,autorun } from 'mobx';
import mockData from './api/data.json';
class AppState {
	@observable	timer = 0;
  @observable showTypeFilter=false;
  @observable messageType = 0;
  @observable userMobile = '18664623402';
  data = [];
  @observable showingMessages=[];
  @observable pageTitle = '实时交易信息';
  constructor() {
    autorun(()=>this.filterShowMessage)
  }
  loadData() {
    this.data = mockData;
  }
  toggleTypeFilter() {
    this.showTypeFilter = !this.showTypeFilter;
  }
  hideTypeFilter() {
    if(this.showTypeFilter){
      this.showTypeFilter= false;
    }
  }
  setVisibleType(type) {
    this.messageType = type;
    switch(type){
      case 0:
        this.pageTitle = '实时交易信息';
      break;
      case 10:
        this.pageTitle = '实时求购信息';
      break;
      case 20:
        this.pageTitle = '实时出售信息';
      break;
    }
  }
  filterShowMessage() {
    let showMessages = this.data.filter((message)=>{
      if(this.messageType != 0){
        return message.type ==this.messageType
      }else{
        return message
      }
    })
    this.showingMessages[0]=showMessages[0];
  }
}
const appState = new AppState();

export {appState};
