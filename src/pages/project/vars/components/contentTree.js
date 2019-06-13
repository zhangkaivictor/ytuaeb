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
    if (selectedKeys[0] == 100 || selectedKeys[0] == 200) {
      return
    }
    const { projectContent } = this.props.VARS
    this.getActiveNode(projectContent, selectedKeys[0])
  }
  getActiveNode(folder, id) {
    if (folder.id == id) {
      const { dispatch } = this.props
      dispatch({ type: 'VARS/selectTreeNode', payload: folder })
      // return folder
    } else {
      folder.subFolders.forEach(f => {
        this.getActiveNode(f, id)
      })
    }
  }
  render() {
    const { projectContent } = this.props.VARS
    const getTreeData = array => {
      return array.map(content => {
        if (content.subFolders.length > 0) {
          return (
            <TreeNode title={content.name} key={content.id}>
              {getTreeData(content.subFolders)}
            </TreeNode>
          )
        } else {
          return <TreeNode title={content.name} key={content.id} />
        }
      })
    }
    return (
      <DirectoryTree
        defaultExpandAll
        onSelect={this.onSelect}
        onExpand={this.onExpand}
      >
        {/* <TreeNode title={projectContent.name} key={projectContent.id}>
        {getTreeData(projectContent.subFolders)}
      </TreeNode> */}
        {projectContent.subFolders.map(folder => {
          return <TreeNode title={folder.name} key={folder.id} />
        })}
        <TreeNode title={'FMEA项目分析'} key={100} />
        <TreeNode title={'FTA项目分析'} key={200} />
      </DirectoryTree>
    )
  }
}
export default ContentTree
