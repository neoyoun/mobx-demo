import { observable,computed,autorun,action } from 'mobx';
import 'whatwg-fetch';
class AppState {
  @observable showTypeFilter=false;
  @observable messageType = 0;
  @observable userMobile = '';
  @observable loading = false;
  @observable loadTimes = 0;
  @observable data = [];
  @observable hasHistoryMessage = true;
  @observable leastId = 0;
  @observable totalHeight =0;
  loadCount = 20;
  dataUrl = `http://xaljbbs.com/dist/services/loaddata.php?amount=${this.loadCount}`;
  historyDataUrl = `${this.dataUrl}&startIndex=`;
  listeningUrl = `http://xaljbbs.com/dist/services/loaddata.php?leastId=`;
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
      this.loading = false;
      let currMobile = this.getMobileFromCookie();
      this.userMobile = currMobile.length>0?currMobile:'';
      if(json.length < this.loadCount){
        this.hasHistoryMessage = false;
      }
      this.listeningData()
    }))
    .catch(e => {console.error('fetch error>>'+e);this.loading=false;})
  }
  @action('listening new messages')
  listeningData() {
    let self = this;
    let targetUrl = this.listeningUrl+this.leastId;
    let xhr = new XMLHttpRequest();
    window.xhr = xhr;
    xhr.onreadystatechange = function () {
      if(xhr.readyState == 4 && xhr.responseText){
        console.log(xhr.responseText)
        let newOne = JSON.parse(xhr.responseText);
        self.leastId = newOne.id;
        self.userMobile = newOne.mobile;
        self.data.push(newOne);
        self.scrollMessageBox();
        self.listeningData();
      }
    }
    xhr.onerror = function (e) {
      console.error(e);
      setTimeout(function () {
          self.listeningData()
        }, 500)
    }
    xhr.ontimeout = function () {
      setTimeout(function () {
          self.listeningData()
        }, 500)
    }
    xhr.timeout = 20000;
    xhr.open('GET',targetUrl);
    xhr.send()
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
          let startT = new Date().getTime(),T =curTop>100?200:this.scrollInterval;
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
      if(pointY > maxScrollTop){this.loadTimes = 0 }
    }else{
      if(curScrollTop <= 0 && this.hasHistoryMessage==true){
        this.loadHistoryData() 
      }
      if(curScrollTop >= maxScrollTop){
        this.loadTimes=0; 
      }
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
  @action ('getUserMobile from cookie')
  getMobileFromCookie() {
    let cookies = document.cookie;
    let idx = cookies.indexOf('userMobile');
    if(idx<0){
      return '';
    }else{
      let mobile = cookies.slice(idx).split('=')[1].split(';')[0].trim();
      return mobile;
    }
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
