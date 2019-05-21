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

  function removeRepeat(arr, key){
    for(let i = 0; i < arr.length; i++) {
      for(let j = i+1; j < arr.length; j++) {
        if(arr[i][key] == arr[j][key]){
          arr.splice(j, 1);
          j = j-1;  // 关键，因为splice()删除元素之后，会使得数组长度减小，此时如果没有j=j-1的话，会导致相同id项在重复两次以上之后无法进行去重，且会错误删除id没有重复的项。
        }
      }
    }
    return arr;
  }
  data = removeRepeat(data,'name');
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
