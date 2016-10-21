import { observable,computed,autorun,action } from 'mobx';
class AppState {
  @observable showTypeFilter=false;
  @observable messageType = 0;
  @observable userMobile = '18664623402';
  @observable loading = true;
  @observable data = [];
  firstLoad = 50;
  constructor() {
    this.initialLoad()
  }
  @action('initial load data')
  initialLoad() {
    let dataUrl = `http://xaljbbs.com/dist/services/loaddata.php?amount=${this.firstLoad}`;
    let mockUrl = '/src/api/data.json';
    let getDataReq = new Request(dataUrl,{method:'GET',mode:'cors'})
    window.fetch(getDataReq)
    .then(res => res.json())
    .then(action(json => {
      this.data = json.messages;
    }))
    .catch(e => console.error('fetch error'+e))
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
