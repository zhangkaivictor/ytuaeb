function GenerateId() {
  var array = new Uint32Array(1)
  var id = window.crypto.getRandomValues(array)
  return String(array.join())
}

/*
	定义失效类
*/
function FunctionFailure(name) {
  this.id = GenerateId()
  this.name = name
  this.description = ''

  this.structureNodeId = ''
  this.functionId = ''

  this.dependentFailureSet = []

  this.sValue = 0
  this.oValue = 0
  this.dValue = 0
  this.lambdaValue = 0

  this.detectionSet = []
  this.preCautionSet = []
}

FunctionFailure.prototype.appendDependentFailure = function(child) {
  for (var i = 0, length = this.dependentFailureSet.length; i < length; i++) {
    if (this.dependentFailureSet[i].id == child.id) {
      return
    }
  }

  var parentId = this.id
  ;(function recurse(currentFailure) {
    for (
      var i = 0, length = currentFailure.dependentFailureSet.length;
      i < length;
      i++
    ) {
      var depFailure = currentFailure.dependentFailureSet[i]
      if (parentId == depFailure.id) {
        throw 'Error to change because it will become closed cycle'
      }

      recurse(depFailure)
    }
  })(child)

  this.dependentFailureSet.push(child)
}

FunctionFailure.prototype.removeDependentFailureById = function(
  dependentFailureId
) {
  for (
    var i = this.dependentFailureSet.length - 1, length = 0;
    i >= length;
    i--
  ) {
    if (this.dependentFailureSet[i].id == dependentFailureId) {
      this.dependentFailureSet.splice(i, 1)
      return
    }
  }
}

/*
	定义功能类
*/
function StructureFunction(name) {
  this.id = GenerateId()
  this.name = name
  this.description = ''

  this.structureNodeId = ''

  this.dependentFunctionSet = []
  this.FailureSet = []
}

StructureFunction.prototype.appendDependentFunction = function(
  dependentFunction
) {
  for (var i = 0, length = this.dependentFunctionSet.length; i < length; i++) {
    if (this.dependentFunctionSet[i].id == dependentFunction.id) {
      return
    }
  }

  var parentId = this.id
  ;(function recurse(currentFunction) {
    for (
      var i = 0, length = currentFunction.dependentFunctionSet.length;
      i < length;
      i++
    ) {
      var depFunction = currentFunction.dependentFunctionSet[i]

      if (parentId == depFunction.id) {
        throw 'Error to change because it will become closed cycle'
      }

      recurse(depFunction)
    }
  })(dependentFunction)

  this.dependentFunctionSet.push(dependentFunction)
}

StructureFunction.prototype.removeDependentFunctionId = function(
  dependentFunctionId
) {
  for (
    var i = this.dependentFunctionSet.length - 1, length = 0;
    i >= length;
    i--
  ) {
    if (this.dependentFunctionSet[i].id == dependentFunctionId) {
      this.dependentFunctionSet.splice(i, 1)
      return
    }
  }
}

StructureFunction.prototype.findFailureById = function(failureId) {
  for (var i = 0, length = this.FailureSet.length; i < length; i++) {
    if (this.FailureSet[i].id == failureId) {
      return this.FailureSet[i]
    }
  }

  return null
}

StructureFunction.prototype.appendFailure = function(functionFailure) {
  for (var i = 0, length = this.FailureSet.length; i < length; i++) {
    if (this.FailureSet[i].id == functionFailure.id) {
      return
    }
  }
  functionFailure.structureNodeId = this.structureNodeId
  functionFailure.functionId = this.id
  this.FailureSet.push(functionFailure)
}

StructureFunction.prototype.removeFailureById = function(failureId) {
  for (var i = this.FailureSet.length - 1, length = 0; i >= length; i--) {
    if (this.FailureSet[i].id == failureId) {
      this.FailureSet.splice(i, 1)
      return
    }
  }
}

/*
	定义结构树形点类
*/
function StructureNode(name) {
  this.id = GenerateId()
  this.name = name
  this.description = ''

  this.uri = ''
  this.html = ''

  this.shape = ''
  this.x = 0
  this.y = 0

  this.parent = null
  this.children = []

  this.FunctionSet = []
}

StructureNode.prototype.findFunctionById = function(functionId) {
  for (var i = 0, length = this.FunctionSet.length; i < length; i++) {
    if (this.FunctionSet[i].id == functionId) {
      return this.FunctionSet[i]
    }
  }

  return null
}

StructureNode.prototype.appendFunction = function(child) {
  for (var i = 0, length = this.FunctionSet.length; i < length; i++) {
    if (this.FunctionSet[i].id == child.id) {
      return
    }
  }

  for (var i = 0, length = child.FailureSet.length; i < length; i++) {
    child.FailureSet[i].structureNodeId = this.id
  }

  child.structureNodeId = this.id
  this.FunctionSet.push(child)
}

StructureNode.prototype.removeFunctionById = function(functionId) {
  for (var i = this.FunctionSet.length - 1, length = 0; i >= length; i--) {
    if (this.FunctionSet[i].id == functionId) {
      this.FunctionSet.splice(i, 1)
      return
    }
  }
}

StructureNode.prototype.render = function(callBack) {
  callBack(this)
}

StructureNode.prototype.appendChild = function(child) {
  var parent = this.parent
  while (parent != null) {
    if (parent.id == child.id) {
      throw 'Error to change because it will become closed cycle'
    }

    parent = parent.parent
  }

  child.parent = this
  for (var i = 0, length = this.children.length; i < length; i++) {
    if (this.children[i].id == child.id) {
      return
    }
  }
  this.children.push(child)
}

StructureNode.prototype.find = function(callBack) {
  if (callBack(this) == true) {
    return this
  }

  return this.findFirstChild(callBack)
}

StructureNode.prototype.findFirstChild = function(callBack) {
  for (var i = 0, length = this.children.length; i < length; i++) {
    if (callBack(this.children[i]) == true) {
      return this.children[i]
    }
  }

  return null
}

StructureNode.prototype.findFirstChildren = function(callBack) {
  // depth-first search
  ;(function recurse(currentNode) {
    for (var i = 0, length = currentNode.children.length; i < length; i++) {
      if (callBack(currentNode.children[i]) == true) {
        return currentNode.children[i]
      }

      recurse(currentNode.children[i])
    }
  })(this)

  return null
}

StructureNode.prototype.traverse = function(callback) {
  ;(function recurse(currentNode) {
    for (var i = 0, length = currentNode.children.length; i < length; i++) {
      recurse(currentNode.children[i])
    }

    callback(currentNode)
  })(this)
}

StructureNode.prototype.removeChildById = function(id) {
  for (var i = this.children.length - 1, length = 0; i >= length; i--) {
    if (this.children[i].id == id) {
      this.children[i].parent = null
      this.children.splice(i, 1)
      return
    }
  }
}

StructureNode.prototype.GetLayer = function() {
  var parent = this.parent
  var rootNode = this
  var layer = 1
  while (parent != null) {
    rootNode = parent
    parent = parent.parent
    layer++
  }

  return layer
}

StructureNode.prototype.allAboveNodes = function() {
  var ndArray = []
  var parent = this.parent
  var rootNode = this
  var layer = 1
  while (parent != null) {
    rootNode = parent
    parent = parent.parent
    layer++
  }

  console.log(rootNode)

  var startLayer = 1
  ;(function recurse(currentNode, currentLayer) {
    if (currentLayer < layer) {
      ndArray.push(currentNode)
      for (var i = 0, length = currentNode.children.length; i < length; i++) {
        recurse(currentNode.children[i], currentLayer + 1)
      }
    }
  })(rootNode, startLayer)

  return ndArray
}

/*
	定义结构画布类
*/
function StructurePane(projectName) {
  this.id = GenerateId()
  this.projectName = projectName
  this.description = ''

  this.structureTreeRoot = null
  this.structureNodes = []
  this.None = {
    id: -1,
    name: 'NA',
    description: '',
    structureNodeId: '-1',
    dependentFunctionSet: [],
    FailureSet: [],
    functionId: '-1',
    dependentFailureSet: [],
    detectionSet: [],
    preCautionSet: [],
  }
}

/*
	methods for structure node
*/
StructurePane.prototype.SetStructureTreeRootById = function(structureNodeId) {
  var node = this.findStructureNodeById(structureNodeId)
  if (node != null) {
    node.parent = null
    this.structureTreeRoot = node
  } else {
    throw 'Not found the root node in the StructurePane!'
  }
}

StructurePane.prototype.findStructureNodeById = function(structureNodeId) {
  for (var i = 0, length = this.structureNodes.length; i < length; i++) {
    if (this.structureNodes[i].id == structureNodeId) {
      return this.structureNodes[i]
    }
  }

  return null
}

StructurePane.prototype.addStructureNode = function(structureNode) {
  CheckObjectValueType(structureNode, StructureNode)

  var ifexisted = this.findStructureNodeById(structureNode.id)
  if (ifexisted == null) {
    this.structureNodes.push(structureNode)
  }
}

StructurePane.prototype.changeStructureNodeParent = function(
  structureNodeId,
  newParentId
) {
  var node = this.findStructureNodeById(structureNodeId)
  if (node == null) {
    return
  }

  if (node.parent != null) {
    node.parent.removeChildById(structureNodeId)
  }

  var parentNode = this.findStructureNodeById(newParentId)
  if (parentNode != null) {
    parentNode.appendChild(node)
  }
}

StructurePane.prototype.deleteStructureNodeById = function(structureNodeId) {
  for (var i = this.structureNodes.length - 1, length = 0; i >= length; i--) {
    if (this.structureNodes[i].id == structureNodeId) {
      this.structureNodes.forEach(node => {
        node.FunctionSet.forEach(fs => {
          fs.FailureSet.forEach(ff => {
            ff.dependentFailureSet.forEach(dff => {
              if (dff.structureNodeId == this.structureNodes[i].id) {
                ff.dependentFailureSet[
                  ff.dependentFailureSet.indexOf(dff)
                ] = this.None
              }
            })
          })

          fs.dependentFunctionSet.forEach(dfs => {
            if (dfs.structureNodeId == this.structureNodes[i].id) {
              fs.dependentFunctionSet[
                fs.dependentFunctionSet.indexOf(dfs)
              ] = this.None
            }
          })
        })
      })

      var parentNode = this.structureNodes[i].parent
      if (parentNode != null) {
        parentNode.removeChildById(structureNodeId)
      }

      for (
        var j = 0, nlength = this.structureNodes[i].children.length;
        j < nlength;
        j++
      ) {
        this.structureNodes[i].children[j].parent = null
      }

      this.structureNodes.splice(i, 1)

      return
    }
  }
}

/*
	methods for functions and failures
*/
StructurePane.prototype.FindAllAboveNodes = function(structureNodeId) {
  var node = this.findStructureNodeById(structureNodeId)
  if (node != null) {
    return node.allAboveNodes()
  }

  return null
}

StructurePane.prototype.AllStructureFunctions = function() {
  var sfArray = []
  this.structureTreeRoot.traverse(node => {
    sfArray = sfArray.concat(node.FunctionSet)
  })

  return sfArray
}

StructurePane.prototype.GetStructureFunctionDepTree = function(
  structureNodeId,
  functionId
) {
  var sfArray = this.AllStructureFunctions()
  var fs = sfArray.find(item => {
    return item.structureNodeId === structureNodeId && item.id === functionId
  })

  var result = {}
  result.Id = functionId
  result.Name = fs.name
  result.structureNodeId = fs.structureNodeId
  result.leftChilds = []
  result.rightChilds = []

  // build left child
  ;(function recurse(currentFunction, childs) {
    for (
      var i = 0, length = currentFunction.dependentFunctionSet.length;
      i < length;
      i++
    ) {
      var depFunction = currentFunction.dependentFunctionSet[i]
      var r = {}
      r.Id = depFunction.id
      r.Name = depFunction.name
      r.structureNodeId = depFunction.structureNodeId
      r.Childs = []
      childs.push(r)

      recurse(depFunction, r.Childs)
    }
  })(fs, result.leftChilds)

  // build right child
  ;(function recurse(currentFunction, childs) {
    var asParentFs = sfArray.filter(item => {
      return item.dependentFunctionSet.find(chld => {
        return (
          chld.structureNodeId === currentFunction.structureNodeId &&
          chld.id === currentFunction.id
        )
      })
    })

    for (var i = 0, length = asParentFs.length; i < length; i++) {
      var depFunction = asParentFs[i]
      var r = {}
      r.Id = depFunction.id
      r.Name = depFunction.name
      r.structureNodeId = depFunction.structureNodeId
      r.Childs = []
      childs.push(r)

      recurse(depFunction, r.Childs)
    }
  })(fs, result.rightChilds)

  return result
}

StructurePane.prototype.FindStructureFunction = function(
  structureNodeId,
  functionId
) {
  var node = this.findStructureNodeById(structureNodeId)
  if (node != null) {
    return node.findFunctionById(functionId)
  }

  return null
}

StructurePane.prototype.addFunctionToStructureNode = function(
  structureNodeId,
  newFunction
) {
  CheckObjectValueType(newFunction, StructureFunction)

  var node = this.findStructureNodeById(structureNodeId)
  if (node != null) {
    node.appendFunction(newFunction)
  } else {
    throw 'The Structure ' + structureNodeId + ' not found'
  }
}

StructurePane.prototype.deleteFunctionInStructureNode = function(
  structureNodeId,
  functionId
) {
  var nodeExisted = this.findStructureNodeById(structureNodeId)
  if (nodeExisted != null) {
    this.structureNodes.forEach(node => {
      node.FunctionSet.forEach(fs => {
        fs.FailureSet.forEach(ff => {
          ff.dependentFailureSet.forEach(dff => {
            if (dff.functionId == functionId) {
              ff.dependentFailureSet[
                ff.dependentFailureSet.indexOf(dff)
              ] = this.None
            }
          })
        })

        fs.dependentFunctionSet.forEach(dfs => {
          if (dfs.id == functionId) {
            fs.dependentFunctionSet[
              fs.dependentFunctionSet.indexOf(dfs)
            ] = this.None
          }
        })
      })
    })

    nodeExisted.removeFunctionById(functionId)
  }
}

StructurePane.prototype.addDependentFunction = function(
  structureNodeId,
  functionId,
  dependentStructureNodeId,
  dependentFunctionId
) {
  var node = this.findStructureNodeById(structureNodeId)
  var depentNode = this.findStructureNodeById(dependentStructureNodeId)
  if (node != null && depentNode != null) {
    var sf = node.findFunctionById(functionId)
    var dsf = depentNode.findFunctionById(dependentFunctionId)
    if (sf != null && dsf != null) {
      sf.appendDependentFunction(dsf)
    }
  }
}

StructurePane.prototype.deleteDependentFunction = function(
  structureNodeId,
  functionId,
  dependentStructureNodeId,
  dependentFunctionId
) {
  var node = this.findStructureNodeById(structureNodeId)
  if (node != null) {
    var sf = node.findFunctionById(functionId)
    if (sf != null) {
      sf.removeDependentFunctionId(dependentFunctionId)
    }
  }
}

StructurePane.prototype.AllFunctionFailures = function() {
  var sfArray = this.AllStructureFunctions()
  var ffArray = []
  for (var i = 0, length = sfArray.length; i < length; i++) {
    ffArray = ffArray.concat(sfArray[i].FailureSet)
  }

  return ffArray
}

StructurePane.prototype.GetFunctionFailureDepTree = function(
  structureNodeId,
  functionId,
  failureId
) {
  var ffArray = this.AllFunctionFailures()
  var fs = ffArray.find(item => {
    return (
      item.structureNodeId === structureNodeId &&
      item.functionId == functionId &&
      item.id === failureId
    )
  })

  var result = {}
  result.Id = failureId
  result.Name = fs.name
  result.structureNodeId = fs.structureNodeId
  result.functionId = fs.functionId
  result.leftChilds = []
  result.rightChilds = []

  // build left child
  ;(function recurse(currentFailure, childs) {
    for (
      var i = 0, length = currentFailure.dependentFailureSet.length;
      i < length;
      i++
    ) {
      var depFailure = currentFailure.dependentFailureSet[i]
      var r = {}
      r.Id = depFailure.id
      r.Name = depFailure.name
      r.structureNodeId = depFailure.structureNodeId
      r.functionId = depFailure.functionId
      r.Childs = []
      childs.push(r)

      recurse(depFailure, r.Childs)
    }
  })(fs, result.leftChilds)

  // build right child
  ;(function recurse(currentFailure, childs) {
    var asParentFs = ffArray.filter(item => {
      return item.dependentFailureSet.find(chld => {
        return (
          chld.structureNodeId === currentFailure.structureNodeId &&
          chld.functionId == currentFailure.functionId &&
          chld.id === currentFailure.id
        )
      })
    })

    for (var i = 0, length = asParentFs.length; i < length; i++) {
      var depFailure = asParentFs[i]
      var r = {}
      r.Id = depFailure.id
      r.Name = depFailure.name
      r.structureNodeId = depFailure.structureNodeId
      r.functionId = depFailure.functionId
      r.Childs = []
      childs.push(r)

      recurse(depFailure, r.Childs)
    }
  })(fs, result.rightChilds)

  return result
}

StructurePane.prototype.UpdateFunctionFailureSValue = function(
  structureNodeId,
  functionId,
  failureId,
  sValue
) {
  var ffArray = this.AllFunctionFailures()
  var ff = ffArray.find(item => {
    return (
      item.structureNodeId === structureNodeId &&
      item.functionId == functionId &&
      item.id === failureId
    )
  })
  ff.sValue = sValue

  var result = []
  result.push(ff)

  // build right child
  ;(function recurse(currentFailure) {
    var asParentFf = ffArray.filter(item => {
      return item.dependentFailureSet.find(chld => {
        return (
          chld.structureNodeId === currentFailure.structureNodeId &&
          chld.functionId == currentFailure.functionId &&
          chld.id === currentFailure.id
        )
      })
    })

    for (var i = 0, length = asParentFf.length; i < length; i++) {
      var depFailure = asParentFf[i]
      if (depFailure.sValue < currentFailure.sValue) {
        depFailure.sValue = currentFailure.sValue
        result.push(depFailure)
        recurse(depFailure)
      }
      /*
        	var existBigger = depFailure.dependentFailureSet.find(df => {return df.sValue > currentFailure.sValue;});
        	if(existBigger == undefined)
        	{
        		depFailure.sValue = currentFailure.sValue;
        		result.push(depFailure);
        		recurse(depFailure);
        	}*/
    }
  })(ff)

  return result
}

StructurePane.prototype.FindFunctionFailure = function(
  structureNodeId,
  functionId,
  failureId
) {
  var node = this.findStructureNodeById(structureNodeId)
  if (node != null) {
    var sf = node.findFunctionById(functionId)
    if (sf != null) {
      return sf.findFailureById(failureId)
    }
  }

  return null
}

StructurePane.prototype.addFailureToFunction = function(
  structureNodeId,
  functionId,
  newFailure
) {
  var node = this.findStructureNodeById(structureNodeId)
  if (node != null) {
    var structureFunction = node.findFunctionById(functionId)
    if (structureFunction != null) {
      structureFunction.appendFailure(newFailure)
    } else {
      throw 'The function ' + functionId + ' not found'
    }
  } else {
    throw 'The Structure ' + structureNodeId + ' not found'
  }
}

StructurePane.prototype.deleteFailureInFunction = function(
  structureNodeId,
  functionId,
  failureId
) {
  var node = this.findStructureNodeById(structureNodeId)
  if (node != null) {
    var structureFunction = node.findFunctionById(functionId)
    if (structureFunction != null) {
      this.structureNodes.forEach(node => {
        node.FunctionSet.forEach(fs => {
          fs.FailureSet.forEach(ff => {
            ff.dependentFailureSet.forEach(dff => {
              if (dff.id == failureId) {
                ff.dependentFailureSet[
                  ff.dependentFailureSet.indexOf(dff)
                ] = this.None
              }
            })
          })
        })
      })

      structureFunction.removeFailureById(failureId)
    }
  }
}

StructurePane.prototype.addDependentFailure = function(
  structureNodeId,
  functionId,
  failureId,
  dependtentStructureNodeId,
  dependtentFunctionId,
  dependtentFailureId
) {
  var node = this.findStructureNodeById(structureNodeId)
  var dependentNode = this.findStructureNodeById(dependtentStructureNodeId)
  if (node != null && dependentNode != null) {
    var structureFunction = node.findFunctionById(functionId)
    var dependtentStructureFunction = dependentNode.findFunctionById(
      dependtentFunctionId
    )

    if (structureFunction != null && dependtentStructureFunction != null) {
      var failure = structureFunction.findFailureById(failureId)
      var dependentFailure = dependtentStructureFunction.findFailureById(
        dependtentFailureId
      )
      if (failure != null && dependentFailure != null) {
        failure.appendDependentFailure(dependentFailure)
      }
    }
  }
}

StructurePane.prototype.deleteDependentFailure = function(
  structureNodeId,
  functionId,
  failureId,
  dependtentStructureNodeId,
  dependtentFunctionId,
  dependtentFailureId
) {
  var node = this.findStructureNodeById(structureNodeId)
  if (node != null) {
    var structureFunction = node.findFunctionById(functionId)
    if (structureFunction != null) {
      var failure = structureFunction.findFailureById(failureId)
      if (failure != null) {
        failure.removeDependentFailureById(dependtentFailureId)
      }
    }
  }
}

/*
	method for data validation
*/
StructurePane.prototype.validateData = function() {
  var result = {}
  result.Error = []
  result.functionDependentStructureNodeNotExist = []
  result.functionDependentStructureNodeNotInTree = []
  result.functionDependentStructureNodeNotInAbove = []
  result.functionDependentFunctionNotExist = []

  result.failureDependentStructureNodeNotExist = []
  result.failureDependentStructureNodeNotInTree = []
  result.failureDependentStructureNodeNotInAbove = []
  result.failureDependentFunctionNotExist = []
  result.failureDependentFailureNotExist = []

  if (this.structureTreeRoot == null) {
    var errorCode = {}
    errorCode.code = -1
    errorCode.message = 'No root node is found'
    result.Error.push(errorCode)
    return result
  }

  this.structureTreeRoot.traverse(node => {
    node.FunctionSet.forEach(nodeFunction => {
      nodeFunction.dependentFunctionSet.forEach(dependentFunction => {
        // validate dependent functions
        var dependentNode = this.findStructureNodeById(
          dependentFunction.structureNodeId
        )
        var errorData = {}
        errorData.node = node
        errorData.function = nodeFunction
        errorData.dependentFunction = dependentFunction

        if (dependentNode == null) {
          // dependtent node not exist
          result.functionDependentStructureNodeNotExist.push(errorData)
        } else {
          var nodeInTree = this.structureTreeRoot.find(node => {
            return node.id === dependentNode.id
          })
          if (nodeInTree == null) {
            // dependent node not in the tree
            result.functionDependentStructureNodeNotInTree.push(errorData)
          } else {
            var allAbove = node.allAboveNodes()
            if (allAbove == null) {
              // dependent node not in the above layer
              result.functionDependentStructureNodeNotInAbove.push(errorData)
            } else {
              var existInAbove = allAbove.find(
                node => node.id === nodeInTree.id
              )
              if (existInAbove == null) {
                // dependent node not in the above layer
                result.functionDependentStructureNodeNotInAbove.push(errorData)
              } else {
                var df = dependentNode.findFunctionById(dependentFunction.id)
                if (df == null) {
                  // dependent function not exist
                  result.functionDependentFunctionNotExist.push(errorData)
                }
              }
            }
          }
        }
      })

      // check failure
      nodeFunction.FailureSet.forEach(fFailure => {
        fFailure.dependentFailureSet.forEach(dependentFailure => {
          var dependentNode = this.findStructureNodeById(
            dependentFailure.structureNodeId
          )
          var errorData = {}
          errorData.node = node
          errorData.function = nodeFunction
          errorData.failure = fFailure
          errorData.dependentFailure = dependentFailure

          if (dependentNode == null) {
            // dependtent node not exist
            result.failureDependentStructureNodeNotExist.push(errorData)
          } else {
            var nodeInTree = this.structureTreeRoot.find(node => {
              return node.id === dependentNode.id
            })
            if (nodeInTree == null) {
              // dependent node not in the tree
              result.failureDependentStructureNodeNotInTree.push(errorData)
            } else {
              var allAbove = node.allAboveNodes()
              if (allAbove == null) {
                // dependent node not in the above layer
                result.failureDependentStructureNodeNotInAbove.push(errorData)
              } else {
                var existInAbove = allAbove.find(
                  node => node.id === nodeInTree.id
                )
                if (existInAbove == null) {
                  // dependent node not in the above layer
                  result.failureDependentStructureNodeNotInAbove.push(errorData)
                } else {
                  var df = dependentNode.findFunctionById(
                    dependentFailure.functionId
                  )
                  if (df == null) {
                    // dependent function not exist
                    result.failureDependentFunctionNotExist.push(errorData)
                  } else {
                    var ddf = df.findFailureById(dependentFailure.id)
                    if (ddf == null) {
                      // dependent failure not exit
                      result.failureDependentFailureNotExist.push(errorData)
                    }
                  }
                }
              }
            }
          }
        })
      })
    })
  })

  return result
}

StructurePane.prototype.CheckIfRePositionAble = function() {
  if (this.structureTreeRoot == null) {
    return -1 // no root node is found
  }

  return 0 // it is ok to continue the reposition
}

StructurePane.prototype.RePositionTree = function(xSpace, ySpace) {
  if (this.structureTreeRoot != null) {
    var rootNode = this.structureTreeRoot
    var rootBaseX = rootNode.x
    var rootBaseY = rootNode.y
    var vNodeArray = []
    var maxLayer = 0
    ;(function AddEndNode(root, layerIndex) {
      root.children = root.children.sort((top, bottom) => {
        return top.y - bottom.y
      })

      for (var i = 0; i < root.children.length; i++) {
        var childNode = root.children[i]
        childNode.x = root.x + xSpace

        if (childNode.children.length == 0) {
          var element = {}
          element.layerIndex = layerIndex + 1
          element.node = childNode
          vNodeArray.push(element)
          if (maxLayer < element.layerIndex) {
            maxLayer = element.layerIndex
          }
        } else {
          AddEndNode(childNode, layerIndex + 1)
        }
      }
    })(rootNode, 0)

    var y = rootNode.y - ((vNodeArray.length - 1) * ySpace) / 2
    for (var u = 0; u < vNodeArray.length; u++) {
      vNodeArray[u].node.y = y
      y = y + ySpace
    }

    var sameLayerNode = []
    for (var i = maxLayer; i > 0; i--) {
      var layerNodes = vNodeArray
        .filter(item => {
          return item.layerIndex === i
        })
        .map(element => element.node)
      layerNodes = layerNodes.concat(sameLayerNode)
      sameLayerNode = []

      var parent = null
      layerNodes.forEach(item => {
        if (item.parent != null && parent != item.parent) {
          parent = item.parent
          parent.y =
            (parent.children[0].y +
              parent.children[parent.children.length - 1].y) /
            2
          sameLayerNode.push(parent)
        }
      })
    }

    var movX = rootBaseX - rootNode.x
    var movY = rootBaseY - rootNode.y
    rootNode.x = rootNode.x + movX
    rootNode.y = rootNode.y + movY
    ;(function MoveBaseRootXY(rootNode) {
      for (var n = 0; n < rootNode.children.length; n++) {
        var childNode = rootNode.children[n]
        childNode.x = childNode.x + movX
        childNode.y = childNode.y + movY

        MoveBaseRootXY(rootNode.children[n])
      }
    })(rootNode)
  }
}

StructurePane.prototype.RePositionTreeMA = function(xSpace, ySpace) {
  if (this.structureTreeRoot != null) {
    var uiNodes = []
    var rootNode = this.structureTreeRoot
    uiNodes.push(rootNode)

    var baseX = rootNode.x
    ;(function Recurse(parentNodes) {
      var uiNodes = []
      for (var i = 0; i < parentNodes.length; i++) {
        uiNodes = uiNodes.concat(parentNodes[i].children)
      }

      if (uiNodes.length > 0) {
        baseX = baseX + xSpace
        var y = rootNode.y - ((uiNodes.length - 1) * ySpace) / 2
        for (var u = 0; u < uiNodes.length; u++) {
          uiNodes[u].x = baseX
          uiNodes[u].y = y
          y = y + ySpace
        }

        Recurse(uiNodes)
      }
    })(uiNodes)
  }
}

StructurePane.prototype.toJSONString = function() {
  return FMEAObjectToJSONString(this)
}

StructurePane.prototype.saveToLocalStorage = function() {
  localStorage.setItem(this.id, this.toJSONString())
}

function ConvertJsonToStructurePane(jsonString) {
  var jsonObject = JSON.parse(jsonString)

  var sp = JsonCloneNonObject(jsonObject, StructurePane)

  jsonObject.structureNodes.forEach(function(item, index, array) {
    var node = JsonCloneNonObject(item, StructureNode)
    if (item.hasOwnProperty('parent')) {
      node.parent = item.parent
    }

    item.FunctionSet.forEach(function(fsitem, fsindex, fsarray) {
      var sf = JsonCloneNonObject(fsitem, StructureFunction)
      sf.dependentFunctionSet = fsitem.dependentFunctionSet

      fsitem.FailureSet.forEach(function(ffitem, ffindex, ffarray) {
        var fs = JsonCloneNonObject(ffitem, FunctionFailure)
        fs.dependentFailureSet = ffitem.dependentFailureSet

        sf.FailureSet.push(fs)
      })

      node.FunctionSet.push(sf)
    })

    sp.structureNodes.push(node)
  })

  // build tree mode
  sp.structureTreeRoot = sp.findStructureNodeById(
    jsonObject.structureTreeRoot.id
  )

  for (var i = 0, length = sp.structureNodes.length; i < length; i++) {
    var node = sp.structureNodes[i]
    // build structure tree mode
    if (node.parent != null) {
      node.parent = sp.findStructureNodeById(node.parent)
      node.parent.appendChild(node)
    }

    // build function tree mode
    for (var j = 0, fslength = node.FunctionSet.length; j < fslength; j++) {
      var fs = node.FunctionSet[j]
      var fsdependentFunctionSet = []
      for (
        var k = 0, pfslength = fs.dependentFunctionSet.length;
        k < pfslength;
        k++
      ) {
        var jsonFSParentFunction = fs.dependentFunctionSet[k]
        var fsParentNode = sp.findStructureNodeById(
          jsonFSParentFunction.structureNodeId
        )
        if (fsParentNode == null) {
          fsdependentFunctionSet.push(
            JsonCloneNonObject(jsonFSParentFunction, StructureFunction)
          )
        } else {
          var fsParentFunction = fsParentNode.FunctionSet.find(item => {
            return item.id === jsonFSParentFunction.id
          })
          if (fsParentFunction == null) {
            fsdependentFunctionSet.push(
              JsonCloneNonObject(jsonFSParentFunction, StructureFunction)
            )
          } else {
            fsdependentFunctionSet.push(fsParentFunction)
          }
        }
      }

      fs.dependentFunctionSet = fsdependentFunctionSet

      // build failure tree mode
      for (var n = 0, faslength = fs.FailureSet.length; n < faslength; n++) {
        var failure = fs.FailureSet[n]

        var ffdependentFailureSet = []
        for (
          var m = 0, flength = failure.dependentFailureSet.length;
          m < flength;
          m++
        ) {
          var parentFailure = failure.dependentFailureSet[m]
          var ffParentNode = sp.findStructureNodeById(
            parentFailure.structureNodeId
          )
          if (ffParentNode == null) {
            ffdependentFailureSet.push(
              JsonCloneNonObject(parentFailure, FunctionFailure)
            )
          } else {
            var ffParentFunction = ffParentNode.FunctionSet.find(item => {
              return item.id === parentFailure.functionId
            })
            if (ffParentFunction == null) {
              ffdependentFailureSet.push(
                JsonCloneNonObject(parentFailure, FunctionFailure)
              )
            } else {
              var ffParentFailure = ffParentFunction.FailureSet.find(item => {
                return item.id === parentFailure.id
              })
              if (ffParentFailure == null) {
                ffdependentFailureSet.push(
                  JsonCloneNonObject(parentFailure, FunctionFailure)
                )
              } else {
                ffdependentFailureSet.push(ffParentFailure)
              }
            }
          }
        }

        failure.dependentFailureSet = ffdependentFailureSet
      }
    }
  }

  return sp
}

function JsonCloneNonObject(jsonObject, toType) {
  var to = new toType()
  if (null == jsonObject || 'object' != typeof jsonObject) return to

  for (var attr in jsonObject) {
    if (jsonObject.hasOwnProperty(attr)) {
      if ('object' != typeof jsonObject[attr]) {
        to[attr] = jsonObject[attr]
      }
    }
  }
  return to
}

function Clone(obj) {
  if (null == obj || 'object' != typeof obj) return obj
  var copy = {}
  for (var attr in obj) {
    if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr]
  }
  return copy
}

function FMEAObjectToJSONString(fmeaObject) {
  var jsonString = JSON.stringify(fmeaObject, function(key, value) {
    if (value instanceof StructureNode && value !== null) {
      var temp = Clone(value)
      if (value.parent != null) {
        temp.parent = value.parent.id
      }
      temp.children = []
      return temp
    }
    return value
  })

  return jsonString
}

function CheckObjectValueType(objectValue, objectType) {
  if (objectValue instanceof objectType == false) {
    throw 'Object value type error, please check the input value type! The expected value type is ' +
      objectType
  }
}

////////////////////////////////////////////////////////////////更改
StructurePane.prototype.GetStructureFunctionDepTree = function(
  structureNodeId,
  functionId
) {
  var sfArray = this.AllStructureFunctions()
  var fs = sfArray.find(item => {
    return item.structureNodeId === structureNodeId && item.id === functionId
  })
  if (!fs) return
  var result = {}
  result.Id = functionId
  result.Name = fs.name
  result.structureNodeId = fs.structureNodeId
  result.leftChilds = []
  result.rightChilds = []

  // build left child
  ;(function recurse(currentFunction, childs) {
    for (
      var i = 0, length = currentFunction.dependentFunctionSet.length;
      i < length;
      i++
    ) {
      var depFunction = currentFunction.dependentFunctionSet[i]
      var r = {}
      r.Id = depFunction.id
      r.Name = depFunction.name
      r.label = depFunction.name
      r.side = 'left'
      r.structureNodeId = depFunction.structureNodeId
      r.children = []
      childs.push(r)

      recurse(depFunction, r.children)
    }
  })(fs, result.leftChilds)

  // build right child
  ;(function recurse(currentFunction, childs) {
    var asParentFs = sfArray.filter(item => {
      return item.dependentFunctionSet.find(chld => {
        return (
          chld.structureNodeId === currentFunction.structureNodeId &&
          chld.id === currentFunction.id
        )
      })
    })

    for (var i = 0, length = asParentFs.length; i < length; i++) {
      var depFunction = asParentFs[i]
      var r = {}
      r.Id = depFunction.id
      r.Name = depFunction.name
      r.structureNodeId = depFunction.structureNodeId
      r.children = []
      r.side = 'right'
      r.label = depFunction.name
      childs.push(r)

      recurse(depFunction, r.children)
    }
  })(fs, result.rightChilds)

  return result
}
StructurePane.prototype.GetFunctionFailureDepTree = function(
  structureNodeId,
  functionId,
  failureId
) {
  var ffArray = this.AllFunctionFailures()
  var fs = ffArray.find(item => {
    return (
      item.structureNodeId === structureNodeId &&
      item.functionId == functionId &&
      item.id === failureId
    )
  })
  if (!fs) return
  var result = {}
  result.Id = failureId
  result.Name = fs.name
  result.structureNodeId = fs.structureNodeId
  result.functionId = fs.functionId
  result.leftChilds = []
  result.rightChilds = []

  // build left child
  ;(function recurse(currentFailure, childs) {
    for (
      var i = 0, length = currentFailure.dependentFailureSet.length;
      i < length;
      i++
    ) {
      var depFailure = currentFailure.dependentFailureSet[i]
      var r = {}
      r.Id = depFailure.id
      r.Name = depFailure.name
      r.structureNodeId = depFailure.structureNodeId
      r.functionId = depFailure.functionId
      r.children = []
      r.side = 'left'
      r.label = depFailure.name
      r.oValue = depFailure.oValue
      r.sValue = depFailure.sValue
      r.dValue = depFailure.dValue
      r.lambdaValue = depFailure.lambdaValue
      childs.push(r)

      recurse(depFailure, r.children)
    }
  })(fs, result.leftChilds)

  // build right child
  ;(function recurse(currentFailure, childs) {
    var asParentFs = ffArray.filter(item => {
      return item.dependentFailureSet.find(chld => {
        return (
          chld.structureNodeId === currentFailure.structureNodeId &&
          chld.functionId == currentFailure.functionId &&
          chld.id === currentFailure.id
        )
      })
    })

    for (var i = 0, length = asParentFs.length; i < length; i++) {
      var depFailure = asParentFs[i]
      var r = {}
      r.Id = depFailure.id
      r.Name = depFailure.name
      r.structureNodeId = depFailure.structureNodeId
      r.functionId = depFailure.functionId
      r.children = []
      r.side = 'right'
      r.oValue = depFailure.oValue
      r.sValue = depFailure.sValue
      r.dValue = depFailure.dValue
      r.lambdaValue = depFailure.lambdaValue
      // r.shape='custom-node'
      r.label = depFailure.name
      childs.push(r)

      recurse(depFailure, r.children)
    }
  })(fs, result.rightChilds)

  return result
}
StructurePane.prototype.SetStructureTreeRootById = function(structureNodeId) {
  var node = this.findStructureNodeById(structureNodeId)
  if (node != null) {
    node.parent &&
      (node.parent.children = node.parent.children.filter(
        _ => _.id !== structureNodeId
      ))
    node.parent = null
    this.structureTreeRoot = node
  } else {
    throw 'Not found the root node in the StructurePane!'
  }
}
const RePositionTree = function(jsonTree, xSpace, ySpace) {
  var rootNodes = jsonTree.nodes.filter(node => {
    return node.shape == 'square'
  })
  if (rootNodes.length == 0) {
    return jsonTree
  }

  var rootBaseX = rootNodes[0].x
  var rootBaseY = rootNodes[0].y
  for (var i = 0; i < rootNodes.length; i++) {
    var rootNode = rootNodes[i]
    rootNode.x = rootBaseX
    rootNode.y = rootBaseY
    var uiNodessInSameLayer = []
    uiNodessInSameLayer.push(rootNode)
    ;(function Recurse(parentNodes) {
      var uiNodes = []
      for (var i = 0; i < parentNodes.length; i++) {
        var edges = jsonTree.edges.filter(edge => {
          return edge.source === parentNodes[i].id
        })
        for (var j = 0; j < edges.length; j++) {
          var childNode = jsonTree.nodes.find(node => {
            return node.id == edges[j].target
          })
          if (childNode != undefined) {
            uiNodes.push(childNode)
          }
        }
      }

      if (uiNodes.length > 0) {
        var x = rootBaseX - ((uiNodes.length - 1) * xSpace) / 2
        rootBaseY = rootBaseY + ySpace

        for (var u = 0; u < uiNodes.length; u++) {
          uiNodes[u].x = x
          uiNodes[u].y = rootBaseY
          x = x + xSpace
        }

        Recurse(uiNodes)
      }
    })(uiNodessInSameLayer)

    rootBaseY = rootBaseY + ySpace
  }

  return jsonTree
}
StructurePane.prototype.UpdateFunctionFailureSValue = function(
  structureNodeId,
  functionId,
  failureId,
  sValue
) {
  var ffArray = this.AllFunctionFailures()
  var ff = ffArray.find(item => {
    return (
      item.structureNodeId === structureNodeId &&
      item.functionId == functionId &&
      item.id === failureId
    )
  })
  ff.sValue = Number(sValue.S)
  ff.oValue = Number(sValue.O)
  ff.dValue = Number(sValue.D)
  ff.lambdaValue = Number(sValue.λ)
  var result = []
  result.push(ff)

  // build right child
  ;(function recurse(currentFailure) {
    var asParentFf = ffArray.filter(item => {
      return item.dependentFailureSet.find(chld => {
        return (
          chld.structureNodeId === currentFailure.structureNodeId &&
          chld.functionId == currentFailure.functionId &&
          chld.id === currentFailure.id
        )
      })
    })

    for (var i = 0, length = asParentFf.length; i < length; i++) {
      var depFailure = asParentFf[i]
      if (Number(depFailure.sValue) < Number(currentFailure.sValue)) {
        depFailure.sValue = currentFailure.sValue
        result.push(depFailure)

        recurse(depFailure)
      }
      /*
        	var existBigger = depFailure.dependentFailureSet.find(df => {return df.sValue > currentFailure.sValue;});
        	if(existBigger == undefined)
        	{
        		depFailure.sValue = currentFailure.sValue;
        		result.push(depFailure);

        		recurse(depFailure);
        	}*/
    }
  })(ff)
  return result
}
export {
  StructurePane,
  StructureFunction,
  FunctionFailure,
  StructureNode,
  FMEAObjectToJSONString,
  ConvertJsonToStructurePane,
}
