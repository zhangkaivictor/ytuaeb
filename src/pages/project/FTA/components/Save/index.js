import React from "react";
import { Row, Col, Button } from 'antd';
import { withPropsAPI } from "gg-editor";

const hash = ["name", "failureRateQ", "invalidRate", "failureTime", "dCrf", "dClf", "referenceFailureRateq","smallFailureRateQValueType","invalidRateValueIsModifiedByUser"];
const itemType = ["andGate","orGate","nonGate"];
const attrData = (arr) => {
  let data = [];
  for (let i=0; i<=arr.length-1; i++){
    if(itemType.indexOf(arr[i].itemType) < 0){
      data.push(arr[i])
    }
  }
  let arrHash = {};
  data = data.reduce((preVal, curVal) => {
    arrHash[curVal.name] ? '' : arrHash[curVal.name] = true && preVal.push(curVal);
    return preVal
  }, [])

  return data;
}
const deepClone = (obj) => {
  let objClone = Array.isArray(obj)?[]:{};
  if(obj && typeof obj==="object"){
    for(let key in obj){
      if(obj.hasOwnProperty(key)){
        //判断ojb子元素是否为对象，如果是，递归复制
        if(obj[key]&&typeof obj[key] ==="object"){
          objClone[key] = deepClone(obj[key]);
        }else{
          //如果不是，简单复制
          objClone[key] = obj[key];
        }
      }
    }
  }
  return objClone;
}
const findHash = (arr) => {
  for(let i=0; i<=arr.length-1; i++){
    for(let j in arr[i]){
      if(arr[i].hasOwnProperty(j) ){
        if(!hash.includes(j)){
          delete arr[i][j]
        }
      }
    }
  }
  return arr;
}

class Save extends React.Component {

  handleClick = () => {
    console.log(this.props);
    const { onOk, propsAPI } = this.props;
    let saveData = propsAPI.save();

    if(Object.keys(saveData).length == 0){
      alert('画布为空！！！')
      return;
    }else {
      let nodes = saveData.nodes;
      let attributes = findHash(deepClone(attrData(nodes)));
      saveData.attributes = attributes;
    }
    console.log(saveData);
    // AddTree接口定义
    let data = {
      Content: JSON.stringify(saveData),
    }
    onOk(data)
  };

  render() {
    return (
       <Button onClick={this.handleClick}>保存</Button>
    );
  }
}

export default withPropsAPI(Save);
