import { observable,computed,autorun,action } from 'mobx';

class AddMessageState {
  @observable content='';
  @observable mobile='';
  @observable type=10;
  //@observable validateMobile=false;
  @observable showTypeList = false;
  postMessageUrl = "http://xaljbbs.com/dist/services/insertData.php";
  
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
  @action checkMobile() {
      if(!this.validateMobile){
        alert('请正确输入手机号码')
      }
    }
  @action toggleTypeList() {
    this.showTypeList = !this.showTypeList;
  }
  @action messageTypeChange(e) {
    this.type = e.target.value
    }
  @action setContent(value){
    this.content = value
  }
  @action setMessageType(type){
    this.type = type;
    this.showTypeList = false;
  }
  @action onAddNewOne(){
    if(! (this.validateMobile && this.validateContent)){
      alert('输入内容不能少于5个字')
      return false;
    }
    let data = {
      mobile : this.mobile,
      content : this.content,
      type : this.type
    }
    data = JSON.stringify(data);
    let postConfig = {
      method:'POST',
      mode:'cors',
      body:data,
      credentials: 'include'
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
  }
  /*@computed set setMessageType(e){
    this.type = e.target.
  }*/
}
export default AddMessageState;