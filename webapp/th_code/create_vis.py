import imageio
import glob
import matplotlib.pyplot as plt
import pandas as pd

def create_anim(metric):
    with imageio.get_writer('../../vis/gifs/' + metric + '.gif', mode='I', duration=0.5) as writer:
        for filename in glob.glob('../../vis/images/*' + metric + '*.png'):
            image = imageio.imread(filename)
            writer.append_data(image)
            
def create_pngs(metric):
    y_min = 0
    y_max = 0
    x_min = 0
    x_max = 0
    for filename in glob.glob('../../data/generated/*' + metric + '*.csv'):
        df = pd.read_csv(filename, header=None)
        if df[1].min() < y_min: y_min = df[1].min()  
        if df[1].max() > y_max: y_max = df[1].max() 
        if df[0].min() < x_min: x_min = df[0].min()  
        if df[0].max() > x_max: x_max = df[0].max() 
    
    for filename in glob.glob('../../data/generated/*' + metric + '*.csv'):
        df = pd.read_csv(filename, header=None)

        plt.figure(figsize=(20, 7))
        plt.ylim(y_min, y_max)
        plt.xlim(x_min, x_max)
        plt.scatter(x=df[0], y=df[1])
        plt.savefig('../../vis/images/' + filename.split('\\')[-1][:-4] + '.png')
        plt.close()
        
#create_pngs('Axis_X_aaLoad')
create_anim('Axis_X_aaLoad')