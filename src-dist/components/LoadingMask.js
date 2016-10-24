import React,{Component} from 'react'
import { observer } from 'mobx-react';
@observer
class LoadingMask extends Component {
  render(){
  	console.log('rendering LoadingMask');
    let isVisible = this.props.isVisible;
    let isVisibleStyle = isVisible?' on':'';
    return(
      <div className={"loading-mask"+isVisibleStyle}>
        <div className="loading">
        <img src="/src/imgs/loading.gif" />
        </div>
      </div>
      )
  }
}
export default LoadingMask;