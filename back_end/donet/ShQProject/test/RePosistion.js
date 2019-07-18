function CheckIfRePositionAble(jsonTree)
{
	var rootNodes = jsonTree.nodes.filter(node=>{return node.shape == "square";});
	if(rootNodes.length == 0)
	{
		return -1; // no root node is found
	}

	return 0; // it is ok to continue the reposition
}

function RePositionTree(jsonTree, xSpace, ySpace)
{
	var rootNodes = jsonTree.nodes.filter(node=>{return node.shape == "square";});
	if(rootNodes.length == 0)
	{
		return jsonTree;
	}
	
	for(var i = 0; i < rootNodes.length; i++)
		{
			var rootBaseX = rootNodes[i].x;
			var rootBaseY = rootNodes[i].y;

			var rootTreeNode = {};
			rootTreeNode.node = rootNodes[i];
			rootTreeNode.parent = null;
			rootTreeNode.children = [];
			rootTreeNode.layer = 0;

			var endNodes = [];
			var maxLayer = 0;
			var existNodes = [];
			existNodes.push(rootNodes[i].id);
			(function Recurse(rootNode)
			{
				var edges = jsonTree.edges.filter(edge=>{return edge.source === rootNode.node.id;});

				var childNodes = jsonTree.nodes.filter(node => {return edges.find(edge => {return edge.target == node.id;}) != undefined;});
				childNodes = childNodes.sort((left, right) => {return left.x - right.x;});
				for(var j = 0; j < childNodes.length; j++)
				{
					var childNode = childNodes[j];
					if(existNodes.find(item=>{ return item === childNode.id;}) == undefined)
					{
						existNodes.push(childNode.id);

						var treeNode = {};
						treeNode.node = childNode
						treeNode.parent = rootNode;
						treeNode.children = [];
						treeNode.layer = rootNode.layer + 1;
						if(maxLayer < treeNode.layer)
						{
							maxLayer = treeNode.layer;
						}
						treeNode.node.y = rootNode.node.y + ySpace;

						rootNode.children.push(treeNode);

						Recurse(treeNode);
					}
				}

				if(rootNode.children.length == 0)
				{
					endNodes.push(rootNode);
				}
			})(rootTreeNode);

			var x = rootTreeNode.node.x - (endNodes.length - 1) * xSpace / 2;
			for(var u = 0; u < endNodes.length; u++)
			{
				endNodes[u].node.x = x;
				x = x + ySpace;
			}

			var sameLayerNode = [];
			for(var k = maxLayer; k > 0 ; k--)
			{
				var layerNodes = endNodes.filter(item => {return item.layer === k});
				layerNodes = layerNodes.concat(sameLayerNode);
				sameLayerNode = [];

				var parent =  null;
				layerNodes.forEach(item => {
					if(item.parent != null && parent != item.parent)
					{
						parent = item.parent;
						parent.node.x = (parent.children[0].node.x + parent.children[parent.children.length - 1].node.x) / 2;
						sameLayerNode.push(parent);
					}
				});
			}

			var movX = (rootBaseX - rootNodes[i].x);
			var movY = (rootBaseY - rootNodes[i].y);
			rootNodes[i].x = rootNodes[i].x + movX;
			rootNodes[i].y = rootNodes[i].y + movY;
			(function MoveBaseRootXY(rootNode)
			{
				for(var n = 0; n < rootNode.children.length; n++)
				{
					var childNode = rootNode.children[n].node;
					childNode.x = childNode.x + movX;
					childNode.y = childNode.y + movY;

					MoveBaseRootXY(rootNode.children[n])
				}

			})(rootTreeNode);
		}

	return jsonTree;
}

function RePositionTreeNA(jsonTree, xSpace, ySpace)
{
	var rootNodes = jsonTree.nodes.filter(node=>{return node.shape == "square";});
	if(rootNodes.length == 0)
	{
		return jsonTree;
	}

	var rootBaseX = rootNodes[0].x;
	var rootBaseY = rootNodes[0].y;
	for(var i = 0; i < rootNodes.length; i++)
		{
			var rootNode = rootNodes[i];
			rootNode.x = rootBaseX;
			rootNode.y = rootBaseY;
			var uiNodessInSameLayer = [];
			uiNodessInSameLayer.push(rootNode);

			(function Recurse(parentNodes)
			{
				var uiNodes = [];
				for(var i = 0; i < parentNodes.length; i++)
				{
					var edges = jsonTree.edges.filter(edge=>{return edge.source === parentNodes[i].id;});
					for(var j = 0; j < edges.length; j++)
					{
						var childNode = jsonTree.nodes.find(node => {return node.id == edges[j].target;});
						if(childNode != undefined)
						{
							uiNodes.push(childNode);
						}
					}
				}

				if(uiNodes.length > 0)
				{
					var x = rootBaseX - (uiNodes.length - 1) * xSpace / 2;
					rootBaseY = rootBaseY + ySpace;

					for(var u = 0; u < uiNodes.length; u++)
					{
						uiNodes[u].x = x;
						uiNodes[u].y = rootBaseY;
						x = x + xSpace;
					}

					Recurse(uiNodes);
				}

			})(uiNodessInSameLayer);

			rootBaseY = rootBaseY + ySpace;
		}

	return jsonTree;
}