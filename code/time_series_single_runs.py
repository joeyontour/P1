import yaml
import os
import json
import csv
from datetime import datetime

path = os.path.dirname(__file__)
path2 = os.path.relpath('../data', path)
base_path = path2 + '/logs/'

output = []
def machining(batch):
    files = []
    
    for file in os.listdir(base_path + "batch" + str(batch)):
        if file.endswith(".yaml"):
            
            fp = open(base_path + "batch" + str(batch)+ "/" + file)
            for j, line in enumerate(fp):
                if j == 29:
                  
                    if 'GV12 Turn Machining' in line:
                        files.append(file)
                elif j > 29:
                    break
            fp.close()
                               


    if not os.path.exists(path2 + "/machining/batch" + str(batch) + "/"):
        os.makedirs(path2 + "/machining/batch" + str(batch) + "/")
    f = path2 + "/machining/batch" + str(batch) + "/machining_files.json"
    writeJSON(f ,files)
    return files


def Sort(li):
    first = li.pop(0)
    li = sorted(li, key = lambda x: x[1])   
    li.insert(0,first)
    return li 

def writeJSON(file, output):
    with open(file, 'w') as file:
        json.dump(output, file)

def writeOutput(file, output):
    with open(file,"w+") as f:
        f.write(output)

    with open(file,"w+") as file:
        yaml.dump(output, file)

def write_csv(file, output):
    with open(file, 'w+', newline='') as writeFile:
        writer = csv.writer(writeFile)
        writer.writerows(output)

def extract(metrics, i, file = None, depth = 0, f = None):

    files = machining(i)
  
    for file in files:
        
        results = []
        for k in range(len(metrics)):
            results.append([["value", "timestamp"]]) 
        
        if not os.path.exists(path2 + "/single_runs/batch" + str(i) + "/"):
            os.makedirs(path2 + "/single_runs/batch" + str(i) + "/")
        f = path2 + "/single_runs/batch" + str(i) + "/" + file[0:-9]

        with open(base_path + "batch" + str(i)+ "/" + file, 'r') as stream:
            docs = yaml.load_all(stream)
            for doc in docs:
                for k,v in doc.items():      
                    if 'data' in v:  
                        if 'data_receiver' in v['data']:         
                            if v['data']['data_receiver'] != None:
                                for v2 in v['data']['data_receiver']: 
                                    if v2['data'] != None:
                                        for v3 in v2['data']: 
                                            timestamp = v3['timestamp']
                                            if i > 12:
                                                timestamp = v3['timestamp'][:-6]
                                            
                                            for k in range(len(metrics)):
                                                if v3['name'] == metrics[k]:
                                                    results[k].append([float(v3['value']), timestamp])

        for k in range(len(metrics)):
            result = results[k]
            if len(result) > 2:
                result = Sort(result) 
                metric = metrics[k].replace('/', '_')
                write_csv(f + "_" + metric + ".csv", result)

       
                                     
def run(metrics, r1, r2):   
    print("single runs start")                                   
    for i in range(r1,r2):
        print("batch " + str(i))
        extract(metrics, i)
    print("single runs end")  
    print("--------------------------------")
    