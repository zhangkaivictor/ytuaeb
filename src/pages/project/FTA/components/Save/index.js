import React from "react";
import { withPropsAPI } from "gg-editor";

const hash = ["name", "failureRateQ", "invalidRate", "failureTime", "dCrf", "dClf", "referenceFailureRateq"];

class Save extends React.Component {
  handleClick = () => {
    const { propsAPI } = this.props;
    let saveData = propsAPI.save();
    console.log(saveData);

    let attributes = [];
    const itemType = ["andGate","orGate","nonGate"];
    if(Object.keys(saveData).length == 0){
      alert('画布为空！！！')
    }else {
      let nodes = saveData.nodes;
      for (let i=0; i<=nodes.length-1; i++){
        if(itemType.indexOf(nodes[i].itemType) < 0){
          for(let j in nodes[i]){
            if(nodes[i].hasOwnProperty(j)){
              if(!hash.includes(j)){
                delete nodes[i][j]
              }
            }
          }
          attributes.push(nodes[i])
        }
      }

    }
    saveData.attributes = attributes;
    console.log(saveData);
  };

  render() {
    return (
       <button onClick={this.handleClick}>保存</button>
    );
  }
}

export default withPropsAPI(Save);
