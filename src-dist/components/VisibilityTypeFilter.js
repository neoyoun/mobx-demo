import React,{Component} from 'react'
import { observer } from 'mobx-react';
@observer
export default class VisibilityTypeFilter extends Component {
  render() {
    const setVisibleType = this.props.setVisibleType
    return (
      <div className="fixed-bottom filter-box">
        <div className="col-xs-4 btn btn-default" onClick={()=>setVisibleType(0)}>全部</div>
        <div className="col-xs-4 btn btn-danger" onClick={()=>setVisibleType(10)}>仅看求购</div>
        <div className="col-xs-4 btn btn-primary" onClick={()=>setVisibleType(20)}>仅看出售</div>
      </div>
      )
  }
}