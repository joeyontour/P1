import time_series_single_runs
import time_series_resample
#import measuring
import sys
import os
import json

arg1 = 4
arg2 = 16

def read_metrics():
    path = os.path.dirname(__file__)
    new_path = os.path.relpath('../conf/', path)
    with open(new_path + '/metrics.json') as file:
        return json.load(file)

try:
    arg1 = int(sys.argv[1])

    arg2 = int(sys.argv[2])

   # measuring.run(arg1,arg2)

    time_series_single_runs.run(read_metrics(), arg1, arg2)
    metric = read_metrics()[0]
  #  time_series_resample.run(metric)
 #   time_series_aggregations_outliers.run(arg1, arg2)
    
except ValueError as err:
    print(err)


