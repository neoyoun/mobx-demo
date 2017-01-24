import { observable,computed,autorun,action } from 'mobx';
const ORIGINURL = module.hot?'http://xaljbbs.com/':'/';
class AddMessageState {
  @observable mobileSet = '';
  @observable contentSet = '';
  @observable errorTip = '';
  @observable messageInfo = {
    type:20,
    mobile:'',
    brand:'海格客车',
    offType:'全新件',
    count:1,
    price:0.00,
    code:'',
    desc:'',
    manufacturer:'',
    content:'',
  }
  @observable isShowBrandList = false;
  @observable isShowContentArea = false;
  @observable isShowErrorTip = false;

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
  @computed get allInputFieldPass(){
    let result = true;
    for(let i in this.messageInfo){
      if(i!='content' && this.messageInfo[i].length == 0){
        result = false;
      }else{
        if(i=='mobile' && !this.validateMobile){
          result = false;
        }else if(i=='count' && this.messageInfo[i] <= 0 ){
          result = false;
        }else if(i=='price' && this.messageInfo[i]<=0){
          result = false;
        }
      }
    }
    return result;
  }
  @action ('check input field at blur')
  checkInput(fieldName, fieldVal){
    let validateResult = false;
    switch(fieldName){
      case 'mobile':
        validateResult = this.validateMobile;
        break;
      default:
        validateResult = fieldVal.length >=1;
      break;
    }
    return validateResult;
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
  @action('add message to database') 
  onAddNewOne(e){
    if(!this.allInputFieldPass){
      for(let i in this.messageInfo){
        console.log(i+' is '+ this.messageInfo[i])
      }
      this.errorTip = '信息输入不完整或有错误，请返回修改！'
      this.isShowErrorTip = true;
      e.stopPropagation();
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
     Object.assign(this.messageInfo,{
      count:1,
      price:0.00,
      code:'',
      desc:'',
      manufacturer:'',
     })
     this.rememberUser()
  }
  @action('set user mobile to cookie')
  rememberUser() {
    let userMobile = this.messageInfo.mobile;
    let exp = new Date();
    let expiresTimeStamp = 60*1000*60*24;
    exp.setTime(exp.getTime() + expiresTimeStamp*30);
    document.cookie = `userMobile=${this.messageInfo.mobile};path=/;expires=${exp.toGMTString()}`;
  }
}
export default AddMessageState;