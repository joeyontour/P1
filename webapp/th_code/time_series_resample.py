import numpy as np
import pandas as pd
from datetime import datetime
import glob
import os
import matplotlib.pyplot as plt


def resample(metrics, batch):

    if not os.path.exists("../data/resampled/"):
        os.makedirs("../data/resampled/")

    for metric in metrics:
        csv_files = glob.glob('../data/single_runs/batch' + str(batch) + '/*' + metric + '.csv')
        #csv_files = glob.glob('../data/single_runs/*/*' + metric + '.csv')
        
        dfs = []
        
        for csv_file in csv_files:
            df = pd.read_csv(csv_file)
            df.index = df.timestamp
            df = df.drop('timestamp', axis=1)
            df.index = pd.to_datetime(df.index)
            df = df.resample('100L').pad()
            df = df.dropna()
            df = df.reset_index()
            df = df.drop('timestamp', axis=1)
            dfs.append(df)

        sizes = [df.shape[0] for df in dfs]
        if len(sizes) > 3:
            median = np.median(sizes)
            dfs_cleaned = []
            for df in dfs:
                if df.shape[0] >= median*0.8 and df.shape[0] <= median*1.2:
                    dfs_cleaned.append(df)
            
            sizes = [df.shape[0] for df in dfs_cleaned]
            num_of_bins = 3
            
            quantiles = pd.qcut(sizes, num_of_bins, duplicates='drop').categories
            if len(quantiles) == num_of_bins:
                bin = [ [] for i in range(num_of_bins) ]

                for df in dfs_cleaned:
                    for j in range(num_of_bins):
                        if df.shape[0] >= quantiles[j].left and df.shape[0] < quantiles[j].right:
                            bin[j].append(df)
 

                for j in range(num_of_bins):
                    if len(bin[j]) > 0:
                        min_length = np.min([df.shape[0] for df in bin[j]])
                        bin_shaped = []
                        for df in bin[j]:
                            df = df[0:min_length]
                            bin_shaped.append(df)
                        write_csv(bin_shaped,j,metric,batch)


def write_csv(bin, bin_num, metric, batch):

    for i in range(len(bin)):
        df = bin[i]
        df.to_csv('../data/resampled/batch' + str(batch) + '_' + metric + '_bin' + str(bin_num) + '_' + str(i) + '.csv', header=False)
    #    df.to_csv('../data/resampled/batch' + str(batch) + '_' + metric + '_bin' + str(bin_num) + '_complete.csv', header=False, mode='a')


def run(metrics, r1, r2):   
    print("resample start")    
    for i in range(r1,r2+1):
        if (i != 13):
            print("batch " + str(i))                               
            resample(metrics, i)
    print("resample end")  
    print("--------------------------------")