import React,{Component} from 'react'
import { observer } from 'mobx-react';
@observer
export default class UnreadTips extends Component {
  render(){
    return(
      <div className="unread-tips" onClick={this.props.clickHandle}>
      	有新消息
      </div>
      )
  }
}