import React,{Component} from 'react'
import { observer } from 'mobx-react';
@observer
class LoadingMask extends Component {
  render(){
    let isVisible = this.props.isVisible;
    let isVisibleStyle = isVisible?' on':'';
    return(
      <div className={"loading-mask"+isVisibleStyle}>
        <div className="loading">
        <img src="./imgs/loading.gif" />
        </div>
      </div>
      )
  }
}
export default LoadingMask;