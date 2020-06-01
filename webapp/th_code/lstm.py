from keras.models import Sequential
from keras.layers import LSTM
from keras.layers import Dense
from keras.models import load_model
from keras.callbacks import EarlyStopping
from numpy import array
import pandas as pd
import numpy as np
from matplotlib import pyplot as plt
import glob
import tensorflow as tf
physical_devices = tf.config.list_physical_devices('GPU') 
tf.config.experimental.set_memory_growth(physical_devices[0], True)

def get_resampled_data(metric, batch):
    if batch == -1:
        return glob.glob('../data/resampled/*.csv')
    return glob.glob('../data/resampled/batch' + str(batch) + '_' + metric + '*.csv')


def split_series(series, steps):
    X = list()
    y = list()
    for i in range(len(series)):
        offset = i + steps
        if offset < len(series)-1:
            X.append(series[i:offset])
            y.append(series[offset])
    return array(X), array(y)

def split_path(path):
    if '\\' in path:
        return path.split('\\')
    return path.split('/')

def train_models(metric, batch):
    csv_files = get_resampled_data(metric, batch)
    
    for csv_file in csv_files:
        file_name = split_path(csv_file)[-1][:-4]
        print(file_name)
        if not glob.glob('../models/lstm/' + file_name):
            print(' ' + metric)   
            df = pd.read_csv(csv_file, header=None)
            raw_seq = df[1].to_numpy()
            n_steps = 3
            X, y = split_series(raw_seq, n_steps)
            n_features = 1
            X = X.reshape((X.shape[0], X.shape[1], n_features))

            model = Sequential()
        #  model.add(LSTM(50, activation='relu', return_sequences=True, input_shape=(n_steps, n_features)))
        #  model.add(LSTM(50, activation='relu'))
            model.add(LSTM(50, activation='relu', input_shape=(n_steps, n_features)))
            model.add(Dense(1))
            model.compile(optimizer='adam', loss='mse')
            callbacks = [EarlyStopping(monitor='loss', patience=10)]
            model.fit(X, y, epochs=100, verbose=0, callbacks=callbacks)
            model.save('../models/lstm/' + file_name)


def train_handler(user_conf):
    
    actives = list()
    for key in user_conf:
        if user_conf[key] == 'active':
            actives.append(key)
            
    for active in actives:
        batch = active.split('_')[0]
        batch = int(batch[5:])
        metric = '_'.join(active.split('_')[1:])
        metric = metric.replace('+', ' ')
        print(batch, metric)
        train_models(metric, batch)
    


def run(metrics, r1, r2):   
    print("lstm training start")    
    for i in range(r1,r2+1):
        if (i != 13):
            print("batch " + str(i))        
            for metric in metrics:                    
                train_models(metric, i)
            print('\n')
    print("lstm training end")  
    print("--------------------------------")
