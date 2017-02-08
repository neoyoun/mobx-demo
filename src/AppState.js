import { observable,computed,autorun,action } from 'mobx';
import AddMessageState from './AddMessageState';
const ORIGINURL = module.hot?'http://xaljbbs.com/':'/';
const addMessageStore = new AddMessageState;
class AppState {
  
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
    offType:'',
    isShowBrandFilter:false,
    isShowOffTypeFilter:false
  }
  addMessageStore = addMessageStore;
  loadCount = 20;
  offTypeList = ['全新件','库存件','拆车件'];
  brandList = ['海格客车','宇通客车','金龙客车','申龙客车','金旅客车','福田客车','安凯客车','中通客车'];
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
    let getDataReq = new Request(self.dataUrl,{method:'GET',mode:'cors', 'Accept': 'application/json', 'Content-Type': 'application/json'});
    fetch(getDataReq)
    .then(res => res.json())
    .then(action(json => {
      this.data = json.messages;
      this.leastId = json.leastId;
      this.userMobile = this.getMobileFromCookie();
      if(json.length<=0 || json.length < this.loadCount){
        this.hasHistoryMessage = false;
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
        self.leastId = newOne.leastId;
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
  @action ('toggle brand filter')
  toggleBrandFilter() {
    this.filterOption.isShowBrandFilter = !this.filterOption.isShowBrandFilter;
    this.hidePopupLayer('brand')
  }
  @action ('toggle offtype filter')
  toggleOffTypeFilter() {
    this.filterOption.isShowOffTypeFilter = !this.filterOption.isShowOffTypeFilter;
    this.hidePopupLayer('offType')
  }
  @action toggleAddBox(e) {
    e.stopPropagation()
    this.isShowAddNewBox = !this.isShowAddNewBox;
    this.hidePopupLayer('addBox')
  }
  @action ('hide modal')
  hidePopupLayer(box) {
    if(box != 'addBox' && this.isShowAddNewBox){
      this.isShowAddNewBox= false;
    }
    if(this.isShowMessageDetail){
      this.isShowMessageDetail = false;
    }
    if(box != 'brand' && this.filterOption.isShowBrandFilter){
      this.filterOption.isShowBrandFilter = false
    }
    if(box != 'offType' && this.filterOption.isShowOffTypeFilter){
      this.filterOption.isShowOffTypeFilter = false
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
    let pageTitle = '配件处理信息';
    let brand = this.filterOption.brand;
    let offType = this.filterOption.offType;
    if(brand.length>0 && offType.length>0){
      pageTitle = `${brand}${offType}信息`
    }else if(brand.length>0 || offType.length>0){
      pageTitle = (brand || offType) + '配件信息';
    }
    return pageTitle
  }
  @action ('set Visible Brand')
  setVisibleBrand(brand){
    this.filterOption.brand = brand || '';
    this.runToBottom()
  }
  @action ('set Visible OffType')
  setVisibleOffType(offType){
    this.filterOption.offType = offType || '';
    this.runToBottom() 
  }
  @computed get visibilityMessageList() {
    if(this.data.length == 0){
      return []
    }
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
  @action ('set visible message detail')
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
