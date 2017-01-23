import React,{Component} from 'react'
import { observer } from 'mobx-react';
@observer
class VisibilityTypeFilter extends Component {
  render() {
    const {onToggleBrandFilter,onToggleOffTypeFilter,brandList,offTypeList,filterOption} = this.props
    const styleList = ['btn-warning','btn-primary','btn-danger'];
    return (
      <div className="fixed-bottom filter-box">
        <div className="filter-ctrl">
          <div  className="btn btn-default" onClick={(e)=>onToggleBrandFilter(e)}>车型筛选</div>
          {filterOption.isShowBrandFilter && <FilterList list={brandList} selected={filterOption.brand} clickHandle={this.props.setVisibleBrand} type="brand"/>}
        </div>
        <div className="filter-ctrl">
         <div className="btn btn-primary" onClick={(e)=>onToggleOffTypeFilter(e)}>新旧件筛选</div>
          {filterOption.isShowOffTypeFilter && <FilterList list={offTypeList} selected={filterOption.offType} clickHandle={this.props.setVisibleOffType} type="offType"/>}
        </div>
      </div>
      )
  }
}
function FilterList({list,type,selected,clickHandle}) {
  return (
    <ul className={"filter-list "+ type}>
      {list.map((item,idx)=>{
        if(item == selected) {
          return (<li onClick={()=>clickHandle(item)} className="select" key={item+'_'+idx}>{item}</li>)
        }else {
          return (<li onClick={()=>clickHandle(item)} key={item+'_'+idx}>{item}</li>)
        }
      })}
      <li onClick={()=>clickHandle('')}>不限</li>
    </ul>
    )
}
export default VisibilityTypeFilter;