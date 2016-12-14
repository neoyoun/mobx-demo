import React,{Component} from 'react'
import { observer } from 'mobx-react';
@observer
class LoadingMask extends Component {
  render(){
    return(
      <div className={"loading-mask"}>
        <div className="loading">
        <img src="./imgs/loading.gif" />
        </div>
      </div>
      )
  }
}
export default LoadingMask;