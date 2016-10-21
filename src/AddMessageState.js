import { observable,computed,autorun,action } from 'mobx';

class AddMessageState {
  @observable content='';
  @observable mobile='';
  @observable type=10;
  @computed get validateMobile() {
      let mobileTest = /^1([358]\d|47|7[017])\d{8}$/;
      return mobileTest.test(this.mobile)
    }
  @computed get validateContent() {
      return this.content.length > 5
    }
  @action messageTypeChange(e) {
    this.type = e.target.value
    }
  @action onMobileChange = (e) => {
    this.mobile = e.target.value
  }
  @action setMessageType = (e) => {
    this.type = e.target.value
  }
  /*@computed set setMessageType(e){
    this.type = e.target.
  }*/
}
export default AddMessageState;