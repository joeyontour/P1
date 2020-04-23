import numpy as np
import pandas as pd
from datetime import datetime
import glob
import matplotlib.pyplot as plt


def resample(metric):
    metric = metric.replace('/', '_')
    csv_files = glob.glob('../data/single_runs/*/*' + metric + '.csv')
    
    dfs = []
    
    for csv_file in csv_files:
        print(csv_file)
        df = pd.read_csv(csv_file)
        print(df)
        df.index = df.timestamp
        df = df.drop('timestamp', axis=1)
        df.index = pd.to_datetime(df.index)
        df = df.resample('100L').pad()
        df = df.dropna()
        dfs.append(df)

    sizes = [df.shape[0] for df in dfs]

    median = np.median(sizes)
    dfs_cleaned = []
    for df in dfs:
        if df.shape[0] >= median*0.8 and df.shape[0] <= median*1.2:
            print(df.shape[0])
            dfs_cleaned.append(df)

    sizes = [df.shape[0] for df in dfs_cleaned]

    bin_0 = []
    bin_1 = []
    bin_2 = []

    for df in dfs_cleaned:
        if df.shape[0] <= quantiles[0].right:
            bin_0.append(df)
        elif df.shape[0] <= quantiles[1].right:
            bin_1.append(df)
        else:
            bin_2.append(df)

    min_0 = np.min([df.shape[0] for df in bin_0])
    bin_0_shaped = []
    for df in bin_0:
        df = df[0:min_0]
        bin_0_shaped.append(df)

    [print(df.shape[0]) for df in bin_0_shaped]

    min_1 = np.min([df.shape[0] for df in bin_1])
    bin_1_shaped = []
    for df in bin_1:
        df = df[0:min_1]
        bin_1_shaped.append(df)

    [print(df.shape[0]) for df in bin_1_shaped]

    min_2 = np.min([df.shape[0] for df in bin_2])
    bin_2_shaped = []
    for df in bin_2:
        df = df[0:min_2]
        df.drop(['timestamp'], axis=1)
        bin_2_shaped.append(df)

    write_csv(bin_0_shaped, metric)


def write_csv(bin, metric):

    for i, df in bin:
        df.to_csv('../data/resampled/' + metric + str(i) + '.csv', index=False)


def run(metric):   
    print("resample start")                                   
    resample(metric)
    print("resample end")  
    print("--------------------------------")