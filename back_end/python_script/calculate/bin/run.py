#coding:utf-8
#!C:\Users\shopAdmin\AppData\Roaming\Microsoft\Windows\Start Menu\Programs\Python 3.6
#usage: run.py --C=<project ID>


import sys
import getopt
import numpy 
import pymysql
import copy
from decimal import *

global HOST,USER,PASSWD,DB,TASK

#########################################################

def init():
	global HOST,USER,PASSWD,DB,PORT
	HOST = "127.0.0.1"
	USER = "phimath"
	PASSWD = "Hello@world"
	DB = "shqdb"
	PORT = 3307

#########################################################

def showUsage():
	print("usage: run.py --C=<project ID>")
	sys.exit(-1)

#########################################################

def getArgv(argv):
	res = {}
	showUsage() if len(argv) == 0 else None
	try:
		opts,args = getopt.getopt(argv,"h",["help","C="])
	except getopt.GetoptError:
		showUsage()
		sys.exit(-1)

	for opt,arg in opts:
		if opt == "-h" or opt == "--help":
			showUsage()
			sys.exit(-1)
		elif opt == "--C":
			res["CUT"] = arg
	return res

#########################################################

def getDBConnection():
	global HOST,USER,PASSWD,DB,PORT
	conn = pymysql.connect(HOST,USER,PASSWD,DB,PORT)
	return conn

#########################################################

def releaseDBConnection(conn):
	conn.close()

#########################################################

def getNodeInfo(conn,pid):
	res = dict()
	sqlStr = "select a.Id as NODE_ID,a.NodeName as NODE_NAME,c.Description as NODE_TYPE_DESC,a.ParentId as PARENT_ID,b.Id as GATE_ID,b.NodeGateName as GATE_NAME,d.Description as GATE_TYPE_DESC \
              from FTANodes a \
              LEFT join FTANodeGates b \
              on a.FTANodeGateId = b.Id \
              and b.FTAProjectId = a.FTAProjectId \
              LEFT JOIN FTANodeTypes c \
              on a.FTANodeTypeId = c.Id \
              LEFT JOIN FTANodeGateTypes d \
              on b.FTANodeGateTypeId = d.Id \
              where a.FTAProjectId = %s order by a.FTANodeTypeId"
	cur = conn.cursor()
	cur.execute(sqlStr,pid)
	results = cur.fetchall()
	for r in results:
		res[r[0]] = {"NODE_NAME":r[1],"NODE_TYPE_DESC":r[2],"PARENT_ID":r[3],"GATE_ID":r[4],"GATE_NAME":r[5],"GATE_TYPE_DESC":r[6]}
	cur.close()
	return res

#########################################################

def getRootInfo(conn,pid):
	res = ""
	sqlStr = "select Id as NODE_ID from FTANodes where FTAProjectId = %s and FTANodeTypeId = 1"
	cur = conn.cursor()
	cur.execute(sqlStr,pid)
	try:
		res = cur.fetchone()[0]
	except Exception as e:
		print("the project id does not exist")
		cur.close()
		sys.exit(0)
	cur.close()
	return res

#########################################################

def getCUTSCombine(cuts,childGate,linkNodeID,remove):
	if childGate["GATE_TYPE_DESC"] in ("AND"):
		for n in cuts:
			if linkNodeID in n:
				m = copy.deepcopy(n)
				n.remove(linkNodeID)
				for t in childGate["CUTS"]:
					n.extend(t)
		if not remove:
			cuts.append(m)
	elif childGate["GATE_TYPE_DESC"] in ("OR","XOR"):
		for n in cuts:
			if linkNodeID in n:
				m = copy.deepcopy(n)
				n.remove(linkNodeID)
				for t in childGate["CUTS"]:
					temp = copy.deepcopy(n)
					temp.extend(t)
					cuts.extend([temp])
					del temp
				cuts.remove(n)	
		if not remove:
			cuts.append(m)	

#########################################################

def getBranchs(cuts,nodes):
	branchs = list()
	for n in cuts:
		for m in n:
			if nodes[m]["NODE_TYPE_DESC"] in ("BRANCH"):
				branchs.append(m)
	if len(branchs):
		return branchs
	else:
		return False

#########################################################

def getChildGates(branch,nodes):
	childGates = dict()
	for n in nodes.keys():
		if nodes[n]["PARENT_ID"] == branch:
			myKey = (nodes[n]["GATE_ID"],nodes[n]["GATE_TYPE_DESC"])
			if myKey not in childGates.keys():
				childGates[myKey] = {"CUTS":list()}
			if nodes[n]["GATE_TYPE_DESC"] in ("AND"):
				if childGates[myKey]["CUTS"]:
					childGates[myKey]["CUTS"][0].append(n)
				else:
					childGates[myKey]["CUTS"].append([n])
			if nodes[n]["GATE_TYPE_DESC"] in ("OR","XOR"):
				childGates[myKey]["CUTS"].append([n])
	return childGates

#########################################################

def checkLeafs(cuts,nodes):
	branchs = getBranchs(cuts,nodes)
	while(branchs):
		for r in branchs:
			childGates = getChildGates(r,nodes)
			n = 0
			remove = False
			for k in childGates.keys():
				n = n + 1
				if n == len(childGates):
					remove = True
				getCUTSCombine(cuts,{"GATE_TYPE_DESC":k[1],"CUTS":childGates[k]["CUTS"]},r,remove)
				branchs = getBranchs(cuts,nodes)
	return False

#########################################################

def getCUTS(root,nodes):
	res = dict()
	cuts = list()
	for k in nodes.keys():
		if nodes[k]["PARENT_ID"] == root:
			if nodes[k]["GATE_ID"] not in res.keys():
				res[nodes[k]["GATE_ID"]] = {"GATE_NAME":nodes[k]["GATE_NAME"],"GATE_TYPE_DESC":nodes[k]["GATE_TYPE_DESC"],"CUTS":list()}
			if nodes[k]["GATE_TYPE_DESC"] in ("AND"):
				if (res[nodes[k]["GATE_ID"]]["CUTS"]):
					res[nodes[k]["GATE_ID"]]["CUTS"][0].append(k)
				else:
					res[nodes[k]["GATE_ID"]]["CUTS"].append([k])
			elif nodes[k]["GATE_TYPE_DESC"] in ("OR","XOR"):
				res[nodes[k]["GATE_ID"]]["CUTS"].append([k])
	for k in res.keys():
		cuts.extend(res[k]["CUTS"])
	while checkLeafs(cuts,nodes):		
		None
	return cuts

#########################################################

def computeForCUTS(pid):
	conn = getDBConnection()
	nodes = getNodeInfo(conn,pid)
	root = getRootInfo(conn,pid)
	if root == "0":
		print("the project id does not exist")
		sys.exit(0)
	cuts = getCUTS(root,nodes)
	persisCUTSByID(cuts,pid)
	persisCUTSByNAME(cuts,pid,nodes)
	releaseDBConnection(conn)
	return cuts

#########################################################

def persisCUTSByID(cuts,pid):
	sqlStr = "insert into FTAAnalysisResultByIds(BranchId,FTANodeId,FTAProjectId)values( %s, %s, %s )"
	conn = getDBConnection()
	cur = conn.cursor()
	cur.execute("delete from FTAAnalysisResultByIds where FTAProjectId = %s",pid)
	conn.commit();

	for n in cuts:
		branchID = cuts.index(n)
		for m in n:
			cur.execute(sqlStr,(branchID,m,pid))
	conn.commit()
	cur.close()
	releaseDBConnection(conn)

#########################################################

def persisCUTSByNAME(cuts,pid,nodes):
	names = list()
	for n in cuts:
		temp = list()
		for m in n:
			temp.append(nodes[m]["NODE_NAME"])
		temp.sort()
		names.append(temp)
		del temp
	names.sort()
	names = list(set([tuple(r) for r in names]))
	names = [list(r) for r in names]

	sqlStr = "insert into FTAAnalysisResultBynames(BranchId,FTANodeName,FTAProjectId)values( %s, %s, %s )"
	conn = getDBConnection()
	cur = conn.cursor()
	cur.execute("delete from FTAAnalysisResultBynames where FTAProjectId = %s",pid)
	conn.commit();
	
	for n in names:
		branchID = names.index(n)
		for m in n:
			cur.execute(sqlStr,(branchID,m,pid))

	conn.commit()
	cur.close()
	releaseDBConnection(conn)

#########################################################


#########################################################

def nodesAnalyse(pid):
	conn = getDBConnection()
	cur = conn.cursor()

	#clean his records
	cur.execute("delete from ftanodeeventreports where FTAProjectId = %s",pid)
	conn.commit()

	#top event
	cur.execute("select id from ftanodes where FTAProjectId = %s and FTANodeTypeId = 1",pid)
	rootID = cur.fetchone()[0]
	cur.execute("insert into ftanodeeventreports(ID,FTAProjectId,FTANodeId,FTAEventTypeId) values (uuid(),%s,%s,5)",(pid,rootID))
	conn.commit()

	#base event
	cur.execute("select id from ftanodes where FTAProjectId = %s and FTANodeTypeId = 3",pid)
	baseIDs = cur.fetchall()
	for r in baseIDs:
		cur.execute("insert into ftanodeeventreports(ID,FTAProjectId,FTANodeId,FTAEventTypeId) values (uuid(),%s,%s,6)",(pid,r[0]))

	#minimal cut set
	cur.execute("select distinct FTANodeId from ftaanalysisresultbyids where FTAProjectId = %s",pid)
	mcsIDs = cur.fetchall()
	for r in mcsIDs:
		cur.execute("insert into ftanodeeventreports(ID,FTAProjectId,FTANodeId,FTAEventTypeId) values (uuid(),%s,%s,7)",(pid,r[0]))

	#single point event/dual point event/safe event
	cur.execute("select distinct a.FTANodeId,b.SetNum from ftaanalysisresultbyids a,v_cutset b where a.FTAProjectId = %s and a.FTAProjectId = b.FTAProjectId and a.BranchId = b.BranchId",pid)
	eventIDs = cur.fetchall()
	for r in eventIDs:
		#single
		if r[1] == 1:
			cur.execute("insert into ftanodeeventreports(ID,FTAProjectId,FTANodeId,FTAEventTypeId) values (uuid(),%s,%s,1)",(pid,r[0]))
			conn.commit()
			cur.execute("select a.Id,ifnull(b.FailureRateQ,0),ifnull(b.InvalidRate,0),ifnull(b.FailureTime,0),ifnull(b.DCrf,0),ifnull(b.DClf,0) \
				 	     from ftanodes a left outer join ftanodeproperties b on a.FTANodePropertiesId = b.Id \
                         where a.FTAProjectId = %s and a.FTANodeTypeId = 3 and a.Id = %s",(pid,r[0]))
			myNode = cur.fetchone()
			myQ = float(myNode[1])
			myN = float(myNode[2])
			myT = float(myNode[3])
			myRF = float(myNode[4])
			myLF = float(myNode[5])
			
			if(myRF == 0 and myLF == 0):
				cur.execute("insert into ftanodeeventreports(ID,FTAProjectId,FTANodeId,FTAFailureTypeId,EventValue) values (uuid(),%s,%s,1,%s)",(pid,myNode[0],myNode[2]))
			else:
				cur.execute("insert into ftanodeeventreports(ID,FTAProjectId,FTANodeId,FTAFailureTypeId,EventValue) values (uuid(),%s,%s,2,%s)",(pid,myNode[0],float(myN)*(1-float(myRF))))
				cur.execute("insert into ftanodeeventreports(ID,FTAProjectId,FTANodeId,FTAFailureTypeId,EventValue) values (uuid(),%s,%s,3,%s)",(pid,myNode[0],float(myN)*float(myRF)*(1-float(myLF))))
				cur.execute("insert into ftanodeeventreports(ID,FTAProjectId,FTANodeId,FTAFailureTypeId,EventValue) values (uuid(),%s,%s,4,%s)",(pid,myNode[0],float(myN)*float(myRF)*float(myLF)))
		#dual
		elif r[1] ==2:
			cur.execute("insert into ftanodeeventreports(ID,FTAProjectId,FTANodeId,FTAEventTypeId) values (uuid(),%s,%s,2)",(pid,r[0]))
			conn.commit()
			cur.execute("select a.Id,ifnull(b.FailureRateQ,0),ifnull(b.InvalidRate,0),ifnull(b.FailureTime,0),ifnull(b.DCrf,0),ifnull(b.DClf,0) \
				 	     from ftanodes a left outer join ftanodeproperties b on a.FTANodePropertiesId = b.Id \
                         where a.FTAProjectId = %s and a.FTANodeTypeId = 3 and a.Id = %s",(pid,r[0]))
			myNode = cur.fetchone()
			myQ = float(myNode[1])
			myN = float(myNode[2])
			myT = float(myNode[3])
			myRF = float(myNode[4])
			myLF = float(myNode[5])

			if(myRF == 0 and myLF == 0):
				cur.execute("insert into ftanodeeventreports(ID,FTAProjectId,FTANodeId,FTAFailureTypeId,EventValue) values (uuid(),%s,%s,3,%s)",(pid,myNode[0],myNode[2]))
			else:
				cur.execute("insert into ftanodeeventreports(ID,FTAProjectId,FTANodeId,FTAFailureTypeId,EventValue) values (uuid(),%s,%s,2,%s)",(pid,myNode[0],float(myN)*(1-float(myRF))))
				cur.execute("insert into ftanodeeventreports(ID,FTAProjectId,FTANodeId,FTAFailureTypeId,EventValue) values (uuid(),%s,%s,3,%s)",(pid,myNode[0],float(myN)*float(myRF)*(1-float(myLF))))
				cur.execute("insert into ftanodeeventreports(ID,FTAProjectId,FTANodeId,FTAFailureTypeId,EventValue) values (uuid(),%s,%s,4,%s)",(pid,myNode[0],float(myN)*float(myRF)*float(myLF)))

		#safe
		else:
			cur.execute("insert into ftanodeeventreports(ID,FTAProjectId,FTANodeId,FTAEventTypeId) values (uuid(),%s,%s,3)",(pid,r[0]))
			conn.commit()
			cur.execute("select a.Id,ifnull(b.FailureRateQ,0),ifnull(b.InvalidRate,0),ifnull(b.FailureTime,0),ifnull(b.DCrf,0),ifnull(b.DClf,0) \
				 	     from ftanodes a left outer join ftanodeproperties b on a.FTANodePropertiesId = b.Id \
                         where a.FTAProjectId = %s and a.FTANodeTypeId = 3 and a.Id = %s",(pid,r[0]))
			myNode = cur.fetchone()
			myQ = float(myNode[1])
			myN = float(myNode[2])
			myT = float(myNode[3])
			myRF = float(myNode[4])
			myLF = float(myNode[5])

			cur.execute("insert into ftanodeeventreports(ID,FTAProjectId,FTANodeId,FTAFailureTypeId,EventValue) values (uuid(),%s,%s,5,%s)",(pid,myNode[0],myNode[2]))

	conn.commit()
	cur.close()
	releaseDBConnection(conn)

#########################################################


#########################################################

def projectAnalyse(pid):
	conn = getDBConnection()
	cur = conn.cursor()

	cur.execute("delete from ftaprojectreports where FTAProjectId = %s",pid)
	conn.commit()

	cur.execute("select FTAFailureTypeId,sum(EventValue) from ftanodeeventreports where FTAProjectId = %s and FTAFailureTypeId in (1,2,3,4,5) group by FTAFailureTypeId",pid)
	myProject = cur.fetchall()
	mySPF,myRF,myLF,myDDPF,mySF,myTotal = tuple([0]*6)
	for r in myProject:
		cur.execute("insert into ftaprojectreports(ID,FTAProjectId,ProjectValueType,ProjectValue) values (uuid(),%s,%s,%s)",(pid,r[0],r[1]))
		if r[0] == 1:
			mySPF = r[1]
		elif r[0] == 2:
			myRF = r[1]
		elif r[0] == 3:
			myLF = r[1]
		elif r[0] == 4:
			myDDPF = r[1]
		elif r[0] == 5:
			mySF = r[1]
	myTotal = mySPF + myRF + myLF + myDDPF + mySF

	#print("mySPF:"+str(mySPF)+"/myRF:"+str(myRF)+"/myLF:"+str(myLF)+"/myDDPF:"+str(myDDPF)+"/mySF:"+str(mySF)+"/myTotal:"+str(myTotal))
	#SPFM
	if myTotal == 0:
		temp = 1
	else:
		temp = (1-(mySPF+myRF)/myTotal)
	cur.execute("insert into ftaprojectreports(ID,FTAProjectId,ProjectValueType,ProjectValue) values (uuid(),%s,%s,%s)",(pid,"6",temp))
	conn.commit()
	#LFM
	if (myTotal-mySPF-myRF) == 0:
		temp = 1
	else:
		temp = (1-myLF/(myTotal-mySPF-myRF))
	cur.execute("insert into ftaprojectreports(ID,FTAProjectId,ProjectValueType,ProjectValue) values (uuid(),%s,%s,%s)",(pid,"7",temp))
	conn.commit()
	#PMHF
	cur.execute("select b.InvalidRate from ftanodes a,ftanodeproperties b where a.FTANodeTypeId = 1 \
                 and a.FTAProjectId = %s and a.FTAProjectId = b.FTAProjectId and a.FTANodePropertiesId = b.Id",pid)
	myRoot = cur.fetchone()
	cur.execute("insert into ftaprojectreports(ID,FTAProjectId,ProjectValueType,ProjectValue) values (uuid(),%s,%s,%s)",(pid,"8",myRoot[0]))

	conn.commit()
	cur.close()
	releaseDBConnection(conn)

#########################################################


#########################################################

def computeQValueBase(gateType,nodes):
	getcontext().prec=6
	numpy.set_printoptions(suppress=True)
	res = Decimal(0)
	if gateType == "AND" and len(nodes) > 0:
		res = Decimal(1)
		for q in nodes:
			res = res*Decimal(q)
	elif gateType == "OR" and len(nodes) > 0:
		res = Decimal(1)
		for q in nodes:
			res = res*(1-Decimal(q))
		res = Decimal(1) - res
	elif gateType == "XOR" and len(nodes) > 0:
		res = Decimal(0)
		for i in range(len(nodes)):
			#tempRes = Decimal(round(nodes[i],6))
			tempRes = Decimal(nodes[i])
			tempNodes = copy.deepcopy(nodes)
			del tempNodes[i]
			for q in tempNodes:
				tempRes = tempRes*(1-Decimal(q))
			res = res + tempRes
	return res

#########################################################

def computeQValue(pid,high):
	#getcontext().prec = 6
	if high > 0:
		conn = getDBConnection()
		cur = conn.cursor()
		#ModifiedByUser
		cur.execute("select a.ParentId,d.QValueIsModifiedByUser,a.FTANodeGateId,c.Description,a.Id,a.SmallFailureRateQ from ftanodes a,ftanodegates b,ftanodegatetypes c,ftanodes d \
                     where a.FTAProjectId = %s  and a.LayerNumber = %s and a.FTAProjectId = b.FTAProjectId \
                     and a.FTANodeGateId = b.Id and b.FTANodeGateTypeId = c.Id and a.FTAProjectId = d.FTAProjectId and a.ParentId = d.Id order by 1",(pid,high))
		res = numpy.array(cur.fetchall())

		parentIds = list(set(tuple(t) for t in res[:,0:2]))

		myNodes = dict()
		currentGate = ""
		for r in res:
			if r[0] not in myNodes.keys():
				myNodes[r[0]] = dict()

			if r[2] not in myNodes[r[0]].keys():
				myNodes[r[0]][r[2]] = {"GATE_TYPE":r[3],"NODES":list()}
			myNodes[r[0]][r[2]]["NODES"].append(r[5])

		for r in parentIds:
			qValue = Decimal(0)
			#if the value was provided by user 
			if r[1] == "1":
				parentQvalue = list()
				pass
			#will computer the value 
			elif r[1] == "0":
				parentQvalue = list()
				for k in myNodes[r[0]].keys():
					myGateType = str(myNodes[r[0]][k]["GATE_TYPE"])
					myQList = list(myNodes[r[0]][k]["NODES"])
					qValue = computeQValueBase(myNodes[r[0]][k]["GATE_TYPE"],myNodes[r[0]][k]["NODES"])
					parentQvalue.append(qValue)
			if not(parentQvalue):
				pass
			elif len(parentQvalue) == 1:
				cur.execute("update ftanodes set SmallFailureRateQ = %s where FTAProjectId = %s and id = %s",(parentQvalue[0],pid,r[0]))
				conn.commit()
			elif len(parentQvalue) > 1:
				lastQ = computeQValueBase("AND",parentQvalue)
				cur.execute("update ftanodes set SmallFailureRateQ = %s where FTAProjectId = %s and id = %s",(lastQ,pid,r[0]))
				conn.commit()
		conn.commit()
		cur.close()
		releaseDBConnection(conn)
		computeQValue(pid,high-1)

#########################################################

def getHigh(pid):
	conn = getDBConnection()
	cur = conn.cursor()

	cur.execute("select max(LayerNumber) from ftanodes where FTAProjectId = %s",pid)
	res = cur.fetchone()
	high = res[0]

	conn.commit()
	cur.close()
	releaseDBConnection(conn)
	return high

#########################################################

def refreshLeafQvalue(pid):
	getcontext().prec = 6
	conn = getDBConnection()
	cur = conn.cursor()

	cur.execute("select a.id,ifnull(b.InvalidRate,0),ifnull(b.FailureTime,5000),ifnull(b.DCrf,0) from ftanodes a \
				 left outer join ftanodeproperties b on a.FTAProjectId = b.FTAProjectId \
                 and a.FTANodePropertiesId = b.Id where a.FTAProjectId = %s \
				 and  a.FTANodeTypeId = 3 and a.QValueIsModifiedByUser = 0 ",pid)
	myLeafNodes = cur.fetchall()
	for r in myLeafNodes:
		myQ = Decimal(r[1])*(1-Decimal(r[3]))*Decimal(r[2])*Decimal(0.000000001)
		cur.execute("update ftanodes set SmallFailureRateQ = %s where FTAProjectId = %s and Id = %s",(myQ,pid,r[0]))
		conn.commit()

	conn.commit()
	cur.close()
	releaseDBConnection(conn)

#########################################################

def getChildNodes(conn,parentNodes,pid):
	childNodes = list()
	cur = conn.cursor()
	for parentId in parentNodes:
		cur.execute("select Id from ftanodes where FTAProjectId = %s and ParentId = %s ",(pid,parentId))
		myChildNodes = cur.fetchall()
		for r in myChildNodes:
			childNodes.append(r[0])
	conn.commit()
	cur.close()
	return childNodes	

#########################################################

def refreshHighValue(pid,currentNodes,high):
	conn = getDBConnection()
	cur = conn.cursor()

	if len(currentNodes) == 0 and high == 0:
		myRootId = getRootInfo(conn,pid)
		cur.execute("update ftanodes set LayerNumber = 0 where FTAProjectId = %s and Id = %s",(pid,myRootId))
		conn.commit()
		myChildNodes = getChildNodes(conn,[myRootId],pid)
		refreshHighValue(pid,myChildNodes,high+1)
	elif len(currentNodes) > 0 and high > 0:
		for r in currentNodes:
			cur.execute("update ftanodes set LayerNumber = %s where FTAProjectId = %s and Id = %s",(high,pid,r))
			conn.commit()
		myChildNodes = getChildNodes(conn,currentNodes,pid)
		refreshHighValue(pid,myChildNodes,high+1)

	conn.commit()
	cur.close()
	releaseDBConnection(conn)	

#########################################################

def refreshQValue(pid):
	refreshHighValue(pid,list(),0)
	refreshLeafQvalue(pid)
	myHigh = getHigh(pid) 
	computeQValue(pid,myHigh)

#########################################################

def enrichNodes(pid):
	getcontext().prec = 6
	conn = getDBConnection()
	cur = conn.cursor()
	cur.execute("select b.id,b.InvalidRateValueIsModifiedByUser,ifnull(b.FailureTime,5000),a.SmallFailureRateQ from ftanodes a \
                 left outer join ftanodeproperties b on a.FTANodePropertiesId = b.id \
                 where a.FTAProjectId = %s and FTANodeTypeId in (1,2)",pid)
	res = cur.fetchall()
	for r in res:
		if r[1] == "0":
			cur.execute("update ftanodeproperties set FailureRateQ = %s where FTAProjectId = %s and Id = %s",(r[3],pid,r[0]))
			tempN = Decimal(r[3])/Decimal(r[2])
			cur.execute("update ftanodeproperties set InvalidRate = %s where FTAProjectId = %s and Id = %s",(tempN,pid,r[0]))
			conn.commit()
	conn.commit()
	cur.close()
	releaseDBConnection(conn)


#########################################################

def refreshColor(pid):
	conn = getDBConnection()
	cur = conn.cursor()
	cur.execute("select a.FTANodeId,b.SetNum from ftaanalysisresultbyids a,v_cutset b where a.FTAProjectId = %s and a.FTAProjectId = b.FTAProjectId and a.BranchId = b.BranchId",pid)
	res = cur.fetchall()
	for r in res:
		if r[1] == 1:
			myColor = "#ff0066"
		elif r[1] == 2:
			myColor = "#ffff66"
		else:
			myColor = "#66ff66"
		cur.execute("update ftanodes set color = %s where Id = %s and FTAProjectId = %s",(myColor,r[0],pid))
		conn.commit()
	conn.commit()
	cur.close()
	releaseDBConnection(conn)



#########################################################

if __name__=="__main__":
	
	print("kick off the program")
	pid = ""
	task = {}
	init()
	task = getArgv(sys.argv[1:])
	for t in task.keys():
		if t == "CUT":
			pid = task[t]
			cuts = computeForCUTS(pid)
	nodesAnalyse(pid)
	refreshQValue(pid)
	enrichNodes(pid)
	projectAnalyse(pid)
	refreshColor(pid)
	print("the program is completed")
	




	
