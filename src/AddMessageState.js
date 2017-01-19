import { observable,computed,autorun,action } from 'mobx';
const ORIGINURL = module.hot?'http://xaljbbs.com/dist/':'http://bbs.pjsw.cn';
class AddMessageState {
  constructor(){
    this.offTypeList = ['新件','旧件','拆件'];
    this.brandList = ['海格','宇通','金龙','申龙','海格','金旅','福田','安凯','中通'];
  }
  @observable mobileSet = '';
  @observable contentSet = '';
  @observable messageInfo = {
    type:20,
    mobile:'',
    brand:'海格',
    offType:'全新件',
    code:'',
    desc:'',
    content:'',
    count:0,
    price:0,
  }
  @observable isShowBrandList = false;
  @observable isShowContentArea = false;

  postMessageUrl = ORIGINURL+'services/insertData.php';
  
  @computed get validateMobile() {
    let mobileTest = /^1([358]\d|47|7[017])\d{8}$/;
    return mobileTest.test(this.messageInfo.mobile);
  }
  @computed get validateContent() {
      //return this.messageInfo.content.length >= 5
      return true
    }
  @computed get messageTypeName() {
    switch(this.messageInfo.type){
      case 10: return '求购';
      case 20: return '出售';
    }
  }
  @action ('getUserMobile from cookie')
  getMobileFromCookie() {
    let cookies = document.cookie;
    let idx = cookies.indexOf('userMobile');
    if(idx>-1){
      let cookieMobile = cookies.slice(idx).split('=')[1].split(';')[0].trim();
      if(cookieMobile && !isNaN(parseInt(cookieMobile,10))){
        this.messageInfo.mobile = parseInt(cookieMobile,10)
      }
    }
  }
  @action checkMobile(value) {
    if(!value) return false;
    this.messageInfo.mobile = value
      if(!this.validateMobile){
        this.mobileSet.parentNode.classList.add('has-error')
      }
    }
  @action setMessageType(type){
    this.messageInfo.type = type;
  }
  @action('add message to database') 
  onAddNewOne(e){
    if(!this.validateMobile){
      this.mobileSet.parentNode.classList.add('has-error')
    }
    if(!this.validateContent){
      this.contentSet.parentNode.classList.add('has-error')
    }
    if(!(this.validateMobile && this.validateContent)){
      e.stopPropagation()
      return false;
    }
    let data = Object.assign({},this.messageInfo);
    data = JSON.stringify(data);
    let postConfig = {
      method:'POST',
      mode:'cors',
      body:data,
    }
    let postReq = new Request(this.postMessageUrl,postConfig)
    fetch(postReq)
      .then(res=>{
        if(res.status !=200){
          alert('服务异常，请刷新页面重试')
        }
      })
      .catch(err=>console.error(`fetch fail:${err}`))
     this.content = '';
     this.rememberUser()
  }
  @action('set user mobile to cookie')
  rememberUser() {
    let userMobile = this.messageInfo.mobile;
    let exp = new Date();
    let expiresTimeStamp = 60*1000*60;
    exp.setTime(exp.getTime() + expiresTimeStamp*24);
    document.cookie = `userMobile=${this.messageInfo.mobile};path=/;expires=${exp.toGMTString()}`;
  }
}
export default AddMessageState;