import React from 'react'
import { Row, Col, Button,Icon } from 'antd'
import { withPropsAPI } from 'gg-editor'
import { expotApi } from 'utils/config'

class Export extends React.Component {
  constructor(props) {
    super(props)
    console.log(props)
    this.state = {
      //检测全屏状态
      isExporting: false,
    }
  }

  export(e) {
    let _self=this
    var xhr = new XMLHttpRequest();
    const {FMEA}=this.props
    // console.log(FMEA.StructurePane.toJSONString())
    if(!FMEA.selectedStructure){
      return
    }
    let url=`${expotApi}/export?id=${FMEA.selectedStructure.id}`
    let inputData=FMEA.StructurePane.toJSONString()
    //http://39.100.49.28:8081/export?id=1761745124
    xhr.open('POST', url, true);
    this.setState({ isExporting: true });
    xhr.responseType = 'arraybuffer';
    xhr.onload = function () {
      _self.setState({ isExporting: false });
      if (this.status === 200) {
        var filename = `${FMEA.StructurePane.projectName}_${FMEA.selectedStructure.name}.xlsx`;
        /*
        var disposition = xhr.getResponseHeader('Content-Disposition');
        if (disposition && disposition.indexOf('attachment') !== -1) {
            var filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
            var matches = filenameRegex.exec(disposition);
            if (matches != null && matches[1]) filename = matches[1].replace(/['"]/g, '');
        }*/
        var type = xhr.getResponseHeader('Content-Type');
        var blob = typeof File === 'function'
          ? new File([this.response], filename, { type: type })
          : new Blob([this.response], { type: type });

        blob = new Blob([this.response], { type: type });

        if (typeof window.navigator.msSaveBlob !== 'undefined') {
          // IE workaround for "HTML7007: One or more blob URLs were revoked by closing the blob for which they were created. These URLs will no longer resolve as the data backing the URL has been freed."
          window.navigator.msSaveBlob(blob, filename);
        }
        else {
          var URL = window.URL || window.webkitURL;
          var downloadUrl = URL.createObjectURL(blob);

          if (filename) {
            // use HTML5 a[download] attribute to specify filename
            var a = document.createElement("a");
            // safari doesn't support this yet
            if (typeof a.download === 'undefined') {
              window.location = downloadUrl;
            }
            else {
              a.href = downloadUrl;
              a.download = filename;
              document.body.appendChild(a);
              a.click();
            }
          } else {
            window.location = downloadUrl;
          }

          setTimeout(function () { URL.revokeObjectURL(downloadUrl); }, 100); // cleanup
        }
      }
    };
    xhr.onerror=()=>{
      this.setState({ isExporting: false });
    };
    xhr.setRequestHeader('Content-type', 'application/json');
    //xhr.setRequestHeader('Authorization', tocken);
    xhr.send(JSON.stringify(JSON.parse(inputData)));
  }
  render() {
    const { isExporting } = this.state
    return (
      <Button type="dashed" icon={'download'} onClick={e => this.export(e)} loading={this.state.isExporting} disabled={isExporting}>
           导出
      </Button>
    )
  }
}

export default withPropsAPI(Export)
