import { observable,computed,autorun,action } from 'mobx';
const ORIGINURL = 'http://xaljbbs.com/dist/';
class AddMessageState {
  @observable content='';
  @observable mobile='';
  @observable type=10;
  @observable mobileSet = '';
  @observable contentSet = '';

  postMessageUrl = ORIGINURL+'services/insertData.php';
  
  @computed get validateMobile() {
    let mobileTest = /^1([358]\d|47|7[017])\d{8}$/;
    return mobileTest.test(this.mobile);
  }
  @computed get validateContent() {
      return this.content.length > 5
    }
  @computed get messageTypeName() {
    switch(this.type){
      case 10: return '求购';
      case 20: return '出售';
    }
  }
  @action ('getUserMobile from cookie')
  getMobileFromCookie() {
    let cookies = document.cookie;
    let idx = cookies.indexOf('userMobile');
    if(idx>-1){
      this.mobile = cookies.slice(idx).split('=')[1].split(';')[0].trim();
    }
  }
  @action checkMobile(value) {
    if(!value) return false;
    this.mobile = value
      if(!this.validateMobile){
        this.mobileSet.parentNode.classList.add('has-error')
      }
    }
  @action setMessageType(type){
    this.type = type;
  }
  @action('add message to database') 
  onAddNewOne(e){
    if(!(this.validateMobile && this.validateContent)){
      this.contentSet.parentNode.classList.add('has-error')
      e.stopPropagation()
      return false;
    }
    let data = {
      mobile : this.mobile,
      content : this.content,
      type : this.type
    }
    data = JSON.stringify(data);
    console.log(data)
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
    let userMobile = this.mobile;
    let exp = new Date();
    let expiresTimeStamp = 60*1000*60;
    exp.setTime(exp.getTime() + expiresTimeStamp*24);
    document.cookie = `userMobile=${this.mobile};path=/;expires=${exp.toGMTString()}`;
  }
}
export default AddMessageState;