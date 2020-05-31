import json
import os
import re
from flask import Flask, render_template, request, make_response
import pandas as pd

app = Flask(__name__)

path = os.path.dirname(__file__)
path2 = os.path.relpath('../data/', path)
path_logs = path2 + '/logs/'
path_conf = os.path.relpath('../conf/', path)
data = list()
def available_logs():
    return sorted(os.listdir(path=path_logs), key=natural_keys)
    
def metrics():
    with open(path_conf + '/metrics.json') as f:
        return [x.replace('/', '-').replace(' ', '_') for x in json.load(f)]
    

def get_user_conf():
    user_batches = dict()
    user_metrics = dict()
    if os.path.exists(path_conf + '/user_conf/batches.json'):
        with open(path_conf + '/user_conf/batches.json') as f:
            user_batches = json.load(f)
    if os.path.exists(path_conf + '/user_conf/batches_metrics.json'):
        with open(path_conf + '/user_conf/batches_metrics.json') as f:
            user_metrics = json.load(f)
            
    return {'batches': user_batches, 'metrics': user_metrics}


@app.route("/")
def index():

    data = {'batches': available_logs(), 'metrics':metrics(), 'conf':dict()}
  #  print(data)
    return render_template("index.html", data=data)

    
@app.route('/save', methods=['POST'])
def save():

    conf_data = request.get_json()
    print(conf_data.keys())
    
    with open(path_conf + '/user_conf/batches.json', 'w') as f:
        json.dump(conf_data['batches'], f)
    with open(path_conf + '/user_conf/batches_metrics.json', 'w') as f:
        json.dump(conf_data['metrics'], f)
        
    resp = make_response(json.dumps(conf_data))
    resp.status_code = 200
    resp.headers['Access-Control-Allow-Origin'] = '*'
    return resp

@app.route('/load', methods=['GET'])
def load():

    conf_data = get_user_conf()
    resp = make_response(json.dumps(conf_data))
    resp.status_code = 200
    resp.headers['Access-Control-Allow-Origin'] = '*'
    return resp

def atoi(text):
    return int(text) if text.isdigit() else text

def natural_keys(text):
    return [ atoi(c) for c in re.split(r'(\d+)', text) ]


if __name__ == "__main__":
    app.run(debug=True)
    
    

