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
            width = 0
            depth = 0
            for tag in asset["Tags"]:
                if "X" in tag:
                    try:
                        width = int(tag[:tag.index("X")])
                        depth = int(tag[tag.index("X"):])
                    except ValueError:
                        print("Invalid tag with X")
                        pass
            height = asset["colliderBounds"][0]["m_Extent"]["y"]
            if width == 0:
                width = asset["assetLoaders"][0]["occluderInfo"]["Width"]
            if depth == 0:
                depth = asset["assetLoaders"][0]["occluderInfo"]["Depth"]
            output[nguid] = {"name": asset_name, "group": board_asset_group, "width": width, "height": height, "depth": depth}
with open("scripts/assetdata.js", "w") as fout:
    fout.write("asset_data = " + json.dumps(output) + ";")
