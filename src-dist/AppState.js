import { observable,computed,autorun,action } from 'mobx';
import 'whatwg-fetch';
class AppState {
  @observable showTypeFilter=false;
  @observable messageType = 0;
  @observable userMobile = '18664623402';
  @observable loading = false;
  @observable loadTimes = 0;
  @observable data = [];
  @observable hasHistoryMessage = true;
  @observable leastId = 0;
  @observable totalHeight =0;
  loadCount = 20;
  dataUrl = `http://xaljbbs.com/dist/services/loaddata.php?amount=${this.loadCount}`;
  historyDataUrl = `${this.dataUrl}&startIndex=`;
  //socketUrl = 'xaljbbs.com/dist/services/listening.php';
  socketUrl = 'ws://xaljbbs.com/dist/services/listening.php';
  socketCfg = {
    ip:'',
    port:'',
  }
  constructor() {
    //this.initialLoad()
  }
  @action('initial load data')
  initialLoad() {
    this.loading=true;
    let getDataReq = new Request(this.dataUrl,{method:'GET',mode:'cors', 'Accept': 'application/json', 'Content-Type': 'application/json'});
    fetch(getDataReq)
    .then(res => res.json())
    .then(action(json => {
      this.data = json.messages;
      this.leastId = json.leastId;
      this.userMobile = json.userMobile || this.userMobile;
      this.loading = false;
      if(json.length < this.loadCount){
        this.hasHistoryMessage = false;
      }
    }))
    .catch(e => {console.error('fetch error'+e);this.loading=false;})
  }
  @action('listening new messages')
  listeningData() {
    let ws = new WebSocket(this.socketUrl)
    //console.log(ws)
    ws.onopen = (e)=>console.log('open websocket')
    ws.onmessage = (e)=>console.log(e)
    ws.onerror = (e)=>console.log('websocket error')
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
  @action('auto scroll the messagesBox') 
  scrollMessageBox() {
     let messageBox = this.rollBox;
      if( messageBox.offsetHeight < messageBox.scrollHeight ){
        let curTop = messageBox.scrollTop,D = messageBox.scrollHeight - this.totalHeight;
        if( this.scrollInterval != 0 ){
          let startT = new Date().getTime(),T = this.scrollInterval;
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
        return;
      }
    this.totalHeight = messageBox.scrollHeight;
  }
  @action('wheel the messages box')
  onMessagesBoxWheel(evt) {
    evt.stopPropagation();
    //console.info(evt)
    let messageBox = this.rollBox;
    let curScrollTop = messageBox.scrollTop;
    let maxScrollTop = messageBox.scrollHeight - messageBox.offsetHeight;
    if(evt.type == 'wheel'){
      let pointY = curScrollTop + evt.deltaY;
      if(pointY < 0 && this.hasHistoryMessage==true){ this.loadHistoryData() }
      if(pointY > maxScrollTop){ console.log('max scroll');this.loadTimes = 0 }
    }else{
      if(curScrollTop <= 0 && this.hasHistoryMessage==true){ this.loadHistoryData() }
      if(curScrollTop >= maxScrollTop){ console.log('max scroll');this.loadTimes = 0 }
    }
  }
  @action('loading the history messages')
  loadHistoryData() {
    this.loadTimes++;
    this.loading=true;
    let targetUrl = this.historyDataUrl+this.data[0].id;
    let getEarlyReq = new Request(targetUrl,{method:'GET',mode:'cors', 'Accept': 'application/json', 'Content-Type': 'application/json'});
    fetch(getEarlyReq)
    .then(res=>res.json())
    .then(json=>{
      let newData = [...json.messages,...this.data];
      if(json.length < this.loadCount){
        this.hasHistoryMessage = false;
      }
      this.data = newData;
      console.log(this.data.length);
      this.loading = false;
    })
    .catch(err=>{console.error(err);this.loading=false})
  }
  @computed get scrollInterval() {
    return this.loadTimes == 0?500:0;
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
