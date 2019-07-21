# coding=utf8
from flask import Flask, request
from flask_restful import Resource, Api
#from sqlalchemy import create_engine
import json
import femaexport
#from flask_cors import CORS

#from flask_jsonpify import Jsonpify
#pip install flask flask-jsonpify flask-sqlalchemy flask-restful

app = Flask(__name__)
api = Api(app)

@app.route('/test',methods = ['GET'])
def test():
	return 'test ok'

@app.route('/export',methods = ['POST','GET'])
def export():
	targetId = request.args.get('id')
	content = request.json
	print(type(content))
	structureNodes = content['structureNodes']

	return femaexport.ExportDataToTemplate(targetId, structureNodes)

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
    return response
#class Employees(Resource):
#    def get(self):
#        return 'hello world'
#api.add_resource(Employees, '/employees') # Route_1

if __name__ == '__main__':
     app.run(port='5002')
