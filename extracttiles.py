import json
import os
import glob
import pprint

path = 'C:\\Program Files (x86)\\Steam\\steamapps\\common\\TaleSpire\\Taleweaver\\boardAssets\\Tiles' #insert path here!

output = {}

for root,d_names,f_names in os.walk(path):
    #print(root, d_names, f_names)
    for f in f_names:
        #print(f)
        if not f.endswith('boardAsset'):
            continue
        filename = os.path.join(root, f)
        with open(filename, encoding='utf-8', mode='r') as currentFile:
            currentFile.readline()
            asset = json.loads(currentFile.read())
            nguid = asset["GUID"]
            output[nguid] = asset
with open("scripts/assetdata.js", "w") as fout:
    fout.write("asset_data = " + json.dumps(output) + ";")
print("ALL Done!")
