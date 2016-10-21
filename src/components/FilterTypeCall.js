import React,{Component} from 'react'
import { observer } from 'mobx-react';
@observer
class FilterTypeCall extends Component {
  render() {
    return (
      <span className="filter-btn text-success" onClick={this.props.onClick}>筛选</span>
      )
  }
}
export default 