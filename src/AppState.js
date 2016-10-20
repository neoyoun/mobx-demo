import { observable } from 'mobx';
import mockData from './api/data.json';
class AppState {
	@observable	timer = 0;
	@observable showTypeFilter=false;
  
  curTitle = '实时交易信息';
  data =[];
  loaded = mockData;
    
  messageType = '0';

  constructor() {
    setInterval(() => {
      this.timer += 1;
    }, 1000);
  }

  resetTimer() {
    this.timer = 0;
  }
  toggleShowFilter() {
  	this.showTypeFilter = !this.showTypeFilter;
  }

  setMessageType(type) {
  	this.messageType = type;
  }
}

export default AppState;
