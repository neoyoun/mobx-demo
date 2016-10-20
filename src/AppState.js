import { observable,computed,autorun } from 'mobx';
import mockData from './api/data.json';
class AppState {
	@observable	timer = 0;
  @observable showTypeFilter=false;
  @observable messageType = 0;
  @observable userMobile = '18664623402';
  constructor() {
    autorun(()=>this.filterShowMessage)
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
  }
  @computed get pageTitle() {
    switch(this.messageType) {
      case 0: return '实时交易信息'
      case 10: return '实时求购信息'
      case 20: return '实时出售信息'
    }
  }
}
const data = observable([])
mockData.forEach(message =>{
  data.push(message)
})
const appState = new AppState();

export {appState,data};
