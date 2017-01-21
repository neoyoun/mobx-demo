import { observable,computed,autorun,action } from 'mobx';
const ORIGINURL = module.hot?'http://xaljbbs.com/':'/';

class AppState {
  @observable showTypeFilter = false;
  @observable isShowAddNewBox = false;
  @observable messageType = 0;
  @observable userMobile = '';
  @observable loading = true;
  @observable loadTimes = 0;
  @observable data = [];
  @observable hasHistoryMessage = true;
  @observable leastId = 0;
  @observable totalHeight =0;
  @observable hasUnread = false;
  @observable isShowMessageDetail = false;
  @observable showingMessageId = 0;
  @observable filterOption = {
    brand:'',
    offType:''
  }
  loadCount = 20;
  offTypeList = ['新件','旧件','拆件'];
  brandList = ['海格','宇通','金龙','申龙','海格','金旅','福田','安凯','中通'];
  dataUrl = `${ORIGINURL}services/loaddata.php?amount=${this.loadCount}`;
  historyDataUrl = `${this.dataUrl}&startIndex=`;
  listeningUrl = `${ORIGINURL}services/loaddata.php?leastId=`;
  
  
  @action('get user from cookie')
  getMobileFromCookie() {
    let userMobile = ''
    let cookies = document.cookie;
    let idx = cookies.indexOf('userMobile');
    if(idx>-1){
      let cookieMobile = cookies.slice(idx).split('=')[1].split(';')[0].trim();
      if(cookieMobile && !isNaN(parseInt(cookieMobile,10))){
        userMobile = parseInt(cookieMobile,10)
      }
      return userMobile;
    }
  }
  @action('initial load data')
  initialLoad() {
    let self = this;
    let getDataReq = new Request(this.dataUrl,{method:'GET',mode:'cors', 'Accept': 'application/json', 'Content-Type': 'application/json'});
    fetch(getDataReq)
    .then(res => res.json())
    .then(action(json => {
      if(json.length > 0){
        this.data = json.messages;
        this.leastId = json.leastId;
        this.userMobile = this.getMobileFromCookie();
        if(json.length < this.loadCount){
          this.hasHistoryMessage = false;
        }
        setTimeout(function () {
          self.scrollMessageBox();
        }, 100)
      }else {
        this.hasHistoryMessage= false;
      }
      this.loading = false;
      setTimeout(function () {
          self.listeningData()
        }, 500)
    }))
    .catch(e => {console.error('fetch error>>'+e);})
  }
  @action('listening new messages')
  listeningData() {
    let self = this;
    let targetUrl = this.listeningUrl+this.leastId;
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      if(xhr.readyState == 4 && xhr.responseText){
        let newOne = JSON.parse(xhr.responseText);
        if(!self.boxAtBottom){
          self.hasUnread = true;
        }else{
          setTimeout(function () {
            self.scrollMessageBox();
          }, 100)
        }
        self.leastId = newOne.id;
        self.data.push(newOne);
        self.userMobile = self.getMobileFromCookie();
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
  @action toggleAddBox(e) {
    e.stopPropagation()
    this.isShowAddNewBox = !this.isShowAddNewBox;
    this.isShowMessageDetail = false;
  }
  @action ('hide modal')
  hidePopupLayer() {
    if(this.showTypeFilter){
      this.showTypeFilter= false;
    }
    if(this.isShowAddNewBox){
      this.isShowAddNewBox= false;
    }
    if(this.isShowMessageDetail){
      this.isShowMessageDetail = false;
    }
  }
  @action setVisibleType(type) {
    if(type != this.messageType){
     this.messageType = type;
     this.runToBottom() 
   }
  }
  @action('auto scroll the messagesBox') 
  scrollMessageBox() {
     let messageBox = this.rollBox;
     //判断盒子高度 如果不比屏幕高 就不用滚动
      if( messageBox.offsetHeight < messageBox.scrollHeight ){
        let curTop = messageBox.scrollTop;
        //let D = messageBox.scrollHeight - this.totalHeight;
        let D = messageBox.scrollHeight - messageBox.offsetHeight-curTop;
        if(this.loadTimes > 0 ){
          //加载历史数据时 不需要滚动效果 只需要把scrollTop设置就好
          messageBox.scrollTop = curTop + messageBox.scrollHeight-this.totalHeight;
        }else{
          let startT = new Date().getTime(),T = this.totalHeight==0?400:100;
          requestAnimationFrame(function step() {
            let movingT = new Date().getTime() - startT;
            messageBox.scrollTop = curTop + (movingT/T * D);
            if(movingT < T ){
              requestAnimationFrame(step)
            }
          })
        }
      }
    this.totalHeight = messageBox.scrollHeight;
  }
  @action('wheel the messages box')
  onMessagesBoxWheel(evt) {
    let messageBox = this.rollBox;
    let curScrollTop = messageBox.scrollTop;
    let maxScrollTop = messageBox.scrollHeight - messageBox.offsetHeight;
    if(evt.type == 'wheel'){
      let pointY = curScrollTop + evt.deltaY;
      if(pointY < 0 && this.hasHistoryMessage==true){
        this.loadHistoryData() 
      }
      if(pointY > maxScrollTop){
        this.loadTimes = 0;
        this.hasUnread =false
      }
    }else{
      if(curScrollTop <= 0 && this.hasHistoryMessage==true){
        this.loadHistoryData() 
      }
      if(curScrollTop >= maxScrollTop){
        this.loadTimes=0;
        this.hasUnread =false 
      }
    }
  }
  @action('loading the history messages')
  loadHistoryData() {
    this.loading = true;
    this.loadTimes++;
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
      this.scrollMessageBox();
      this.loading = false;
    })
    .catch(err=>{console.error(err);})
  }
  @action ('roll to then bottom')
  runToBottom() {
    let self = this;
    this.loadTimes = 0;
    this.hasUnread = false;
    setTimeout(function () {
      self.scrollMessageBox()
    }, 100)
  }
  @computed get boxAtBottom() {
    let messageBox = this.rollBox;
    let curTop = messageBox.scrollTop;
    let maxTop = messageBox.scrollHeight - messageBox.offsetHeight;
    return curTop>=maxTop;
  }
  @computed get pageTitle() {
    switch(this.messageType) {
      case 0: return '实时交易信息'
      case 10: return '实时求购信息'
      case 20: return '实时出售信息'
    }
  }
  @action ('setVisibleBrand')
  setVisibleBrand(brand){
    this.filterOption.brand = brand || '';
  }
  @action ('setVisibleOffType')
  setVisibleOffType(offType){
    this.filterOption.offType = offType || '';
  }
  @computed get visibilityMessageList() {
    let filterResultList = [];
    let filter = this.filterOption
    if(!filter.brand && !filter.offType ){
      filterResultList = this.data
    }else {
      if(filter.brand.length > 0){
        filterResultList = this.data.filter(item=>item.brand == filter.brand)
      }else{
        filterResultList = this.data
      }
       if(filter.offType.length > 0){
        filterResultList = filterResultList.filter(item=>item.offType == filter.offType)
      }
      let filterBrand = this.data.filter
    }
    return filterResultList;
  }
  @action ('set visible message id')
  setVisibleMessage(id) {
    if(id != undefined){
      this.showingMessageId = id;
      this.isShowMessageDetail = true;
    } 
  }
  @computed get messageDetailShowing() {
    let fetchData = {};
    if(this.data.length > 0){
      try {
        let detailMessageArr = this.data.filter(message=>message.id == this.showingMessageId);
        fetchData = detailMessageArr[0];
      }catch(err){
        fetchData = {}
      }
    }
    return fetchData
  }
}


export default AppState;
