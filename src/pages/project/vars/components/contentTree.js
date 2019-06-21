import React from 'react'
import { Tree } from 'antd'
const { TreeNode, DirectoryTree } = Tree

class ContentTree extends React.Component {
  constructor(props) {
    super(props)
    console.log(props)
  }
  onSelect = (selectedKeys, info) => {
    // console.log('selected', selectedKeys, info);
    const { dispatch, VARS } = this.props
    if (selectedKeys[0] == 'fmea') {
      dispatch({
        type: 'VARS/selectTreeNode',
        payload: { type: 'fmea', files: VARS.projectContent.fmeaProjects },
      })
      return
    }
    if (selectedKeys[0] == 'fta') {
      dispatch({
        type: 'VARS/selectTreeNode',
        payload: { type: 'fta', files: VARS.projectContent.ftaProjects },
      })
      return
    }
    this.getActiveNode(VARS.projectContent.projectFiles, selectedKeys[0])
  }
  getActiveNode(folder, id) {
    if (folder.id == id) {
      const { dispatch } = this.props
      dispatch({
        type: 'VARS/selectTreeNode',
        payload: { ...folder, type: 'project', id: id },
      })
      // return folder
    } else {
      folder.subFolders.forEach(f => {
        this.getActiveNode(f, id)
      })
    }
  }
  render() {
    const { projectContent } = this.props.VARS
    console.log(projectContent)
    // const getTreeData = array => {
    //   return array.map(content => {
    //     if (content.subFolders.length > 0) {
    //       return (
    //         <TreeNode title={content.name} key={content.id}>
    //           {getTreeData(content.subFolders)}
    //         </TreeNode>
    //       )
    //     } else {
    //       return <TreeNode title={content.name} key={content.id} />
    //     }
    //   })
    // }
    return (
      <DirectoryTree
        defaultExpandAll
        onSelect={this.onSelect}
        onExpand={this.onExpand}
      >
        {/* <TreeNode title={projectContent.name} key={projectContent.id}>
          {getTreeData(projectContent.subFolders)}
        </TreeNode> */}
        {projectContent != null &&
          projectContent.projectFiles.subFolders.map(folder => {
            return <TreeNode title={folder.name} key={folder.id} />
          })}
        <TreeNode title={'FMEA项目分析'} key={'fmea'} />
        <TreeNode title={'FTA项目分析'} key={'fta'} />
      </DirectoryTree>
    )
  }
}
export default ContentTree
