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
            asset_name = asset["boardAssetName"]
            board_asset_group = asset["boardAssetGroup"]
            e_height = asset["colliderBounds"][0]["m_Extent"]["y"]
            e_width = asset["colliderBounds"][0]["m_Extent"]["x"]
            e_depth = asset["colliderBounds"][0]["m_Extent"]["z"]
            c_height = asset["colliderBounds"][0]["m_Center"]["y"]
            c_width = asset["colliderBounds"][0]["m_Center"]["x"]
            c_depth = asset["colliderBounds"][0]["m_Center"]["z"]
            extents = {"width": e_width, "height": e_height, "depth": e_depth}
            center = {"width": c_width, "height": c_height, "depth": c_depth}
            output[nguid] = {"name": asset_name, "group": board_asset_group, "extents": extents, "center":center }
with open("scripts/assetdata.js", "w") as fout:
    fout.write("asset_data = " + json.dumps(output) + ";")
print("ALL Done!")
