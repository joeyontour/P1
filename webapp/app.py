import json
import os
import re
from flask import Flask, render_template, request, make_response
import pandas as pd
import th_code.lstm as lstm
import th_code.generate_yaml as generate_yaml
import threading
import glob

app = Flask(__name__)

path = os.path.dirname(__file__)
path2 = os.path.relpath('../data/', path)
path_logs = path2 + '/logs/'
path_conf = os.path.relpath('../conf/', path)
data = list()

current_size = 0
target_size = 1

def available_logs():
    return sorted(os.listdir(path=path_logs), key=natural_keys)
    
def metrics():
    with open(path_conf + '/metrics.json') as f:
        return [x.replace('/', '_').replace(' ', '+') for x in json.load(f)]
    
    
def num_of_generated_data():
    result = dict()
    for metric in  metrics():
        result[metric] = len(glob.glob('../data/generated/batch*_' + metric + '*'))
    return result

def batch_progress():
    folder_path = glob.glob('../generated_batches/*')[-1]
    print(folder_path)

    return [len(glob.glob(folder_path + '/*')), 40]


def available_models():
    result = dict()
    for batch in available_logs():
        for metric in  metrics():
            key = batch + '_' + metric
            if  glob.glob('../models/lstm/' + key + '*'):
                result[key] = 1
            else:
                result[key] = 0
       
    return result
    

def get_user_conf():
    user_batches = dict()
    user_metrics = dict()
    if os.path.exists(path_conf + '/user_conf/batches.json'):
        with open(path_conf + '/user_conf/batches.json') as f:
            user_batches = json.load(f)
    if os.path.exists(path_conf + '/user_conf/batches_metrics.json'):
        with open(path_conf + '/user_conf/batches_metrics.json') as f:
            user_metrics = json.load(f)
            user_metrics['batch6_Spindle-driveLoad'] = 'ready'
            
    return {'batches': user_batches, 'metrics': user_metrics}

def train_models(conf):
    lstm.train_handler(conf['metrics'])
    

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
        
 #   train_models(get_user_conf())
    resp = make_response(json.dumps(conf_data))
    resp.status_code = 200
    resp.headers['Access-Control-Allow-Origin'] = '*'
    return resp
    
@app.route('/generate', methods=['POST'])
def generate():

  #  json_data = request.get_json()
  #  current_size = 0
    b_metrics = get_user_conf()['metrics']
    keys = [key for key in b_metrics if b_metrics[key] == 'active']
    metrics_l = metrics()
    data = {}
    for metric in metrics_l:
        keys_active = [key for key in keys if metric in key]
        data[metric] = keys_active
    x = threading.Thread(target=lstm.generate_data, args=(data, 0, 2))
    x.start()
   # folder_path = lstm.generate_data(data, 0, 2)

    resp = make_response(json.dumps([current_size, target_size]))
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
    
@app.route('/state', methods=['GET'])
def state():

    state_data = batch_progress()
    resp = make_response(json.dumps(state_data))
    resp.status_code = 200
    resp.headers['Access-Control-Allow-Origin'] = '*'
    return resp
    

@app.route('/models', methods=['GET'])
def models():

    models_data = available_models()
    resp = make_response(json.dumps(models_data))
    resp.status_code = 200
    resp.headers['Access-Control-Allow-Origin'] = '*'
    return resp

def atoi(text):
    return int(text) if text.isdigit() else text

def natural_keys(text):
    return [ atoi(c) for c in re.split(r'(\d+)', text) ]


if __name__ == "__main__":
    app.run(threaded=False)
    
    

