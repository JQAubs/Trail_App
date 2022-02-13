import json
import pandas as pd

df = pd.read_csv('./src/utils/trail_data.csv')

latitude = 32.80006
longitude = -85.00003
distance = 10
difficulty = 4

lst = []

for index, row in df.iterrows():
    print(row['distance'])




print(lst)
