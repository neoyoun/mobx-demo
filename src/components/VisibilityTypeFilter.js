import React,{Component} from 'react'
import { observer } from 'mobx-react';
@observer
export default class VisibilityTypeFilter extends Component {
  render() {
    const {setVibibleOffType, setVisibleBrand,brandList,offTypeList} = this.props
    const styleList = ['btn-warning','btn-primary','btn-danger'];
    return (
      <div className="fixed-bottom filter-box">
        <div className={"col-xs-6 btn btn-default"}>车型筛选</div>
        <div className={"col-xs-6 btn btn-primary"}>新旧件筛选</div>
      </div>
      )
  }
}