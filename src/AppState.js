import { observable,computed,autorun,action } from 'mobx';
class AppState {
  @observable showTypeFilter=false;
  @observable messageType = 0;
  @observable userMobile = '18664623402';
  @observable loading = true;
  @observable loadTimes = 0;
  @observable data = [];
  @observable hasHistoryMessage = true;
  @observable leastId = 0;
  firstLoadMount = 50;
  dataUrl = `http://xaljbbs.com/dist/services/loaddata.php?amount=${this.firstLoadMount}`;
  listeningDataUrl = 'http://xaljbbs.com/dist/services/loaddata.php?leastId=';
  constructor() {
    this.initialLoad()
  }
  @action('initial load data')
  initialLoad() {
    let getDataReq = new Request(this.dataUrl,{method:'GET',mode:'cors'})
    window.fetch(getDataReq)
    .then(res => res.json())
    .then(action(json => {
      this.data = json.messages;
      this.leastId = json.leastId;
      this.userMobile = json.userMobile || this.userMobile;
      if(json.length < this.firstLoadMount){
        this.hasHistoryMessage = false;
      }
    }))
    .catch(e => console.error('fetch error'+e))
  }
  @action('listening new messages')
  listeningData() {

  }
  @action toggleTypeFilter(e) {
    e.stopPropagation()
    this.showTypeFilter = !this.showTypeFilter;
  }
  @action hideTypeFilter() {
    if(this.showTypeFilter){
      this.showTypeFilter= false;
    }
  }
  @action setVisibleType(type) {
    if(type != this.messageType){
     this.messageType = type; 
   }
  }
  @action scrollMessageBox() {

  }
  @computed get totalHeight() {
    return this.rollBox.scrollHeight;
  }
  @computed get pageTitle() {
    switch(this.messageType) {
      case 0: return '实时交易信息'
      case 10: return '实时求购信息'
      case 20: return '实时出售信息'
    }
  }
  @computed get showingMessages() {
    if(this.messageType == 0){
      return this.data
    }else{
      return this.data.filter(item=>item.type == this.messageType)
    }
  }
}


export default AppState;
