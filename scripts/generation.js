function AddTerrain(floors, width, depth, height, seed, scaleW, scaleD, offsetW, offsetD, center_height) {
        //console.log("Adding asset: " + nguid + " Width: " + width + " Depth: " + depth + " Height: " + center_height + " Percentage: " + percentage);
        var output = {};
        var heightArray = [];
        var noise = new Noise(seed);

        for (var w = 0; w < width; w++) {
            for (var d = 0; d < depth; d++) {
                var selectedFloorGuid = GetWeightedValue(floors);

                var tileHeight = TalespireSlabs.GetAsset(selectedFloorGuid)['height'];
                var tileWidth = TalespireSlabs.GetAsset(selectedFloorGuid)['width'];
                var tileDepth = TalespireSlabs.GetAsset(selectedFloorGuid)['depth'];

                var noiseValue = Math.floor(height*(1+noise.perlin2( w/scaleW , d/scaleD )));

                var finalHeight = (noiseValue*2*tileHeight)-(tileHeight*1.5);

                heightArray.push([w, d, finalHeight]);

                for (var h = finalHeight-2; h <= finalHeight; h++) {
                  if (output[selectedFloorGuid] == null) {
                      output[selectedFloorGuid] = [];
                  }
                  //console.log(center_height);
                  output[selectedFloorGuid].push({'rotation': 0,
                      'bounds':
                      {
                          'center': {'x': w*(tileWidth-1), 'y': (tileHeight*2.0*h)+tileHeight, 'z': d*(tileDepth-1)},
                          'extents': {'x': 1, 'y': 1, 'z': 1}
                      }
                  });
                }
            }
        }
        var response = [];
        Object.entries(output).forEach(function(outputItem) {
           response.push({'nguid': outputItem[0], 'assets': outputItem[1]});
        });
        return [response, heightArray];
    }

function AddAsset(nguid, width, depth, heightArray, percentage) {
  console.log("Adding asset: " + nguid + " Width: " + width + " Depth: " + depth + " Percentage: " + percentage);
  var asset = TalespireSlabs.GetAsset(nguid);
  var assets = [];
  for (var w = 0; w < width; w++) {
      for (var d = 0; d < depth; d++) {
          var center_height;
          //console.log(center_height);
          heightArray.forEach(function (h) {
              if (h[0] == w && h[1] == d) {
                  center_height = h[2] + 1.13;
                  return;
              }
          });
          if ((Math.floor(random() * 100) + 1) > percentage) {
              continue;
          }
          assets.push({'rotation': 0,
              'bounds':
              {
                  'center': {'x': w*2, 'y': center_height, 'z': d*2},
                  'extents': {'x': 1, 'y': 1, 'z': 1}
              }
          });
      }
  }
  return {'nguid': nguid, 'assets': assets};
}

function AddCustomAsset(customName, width, depth, heightArray, percentage) {
  console.log("Adding custom asset: " + customName + " Width: " + width + " Depth: " + depth + " Percentage: " + percentage);
  var customAssetPayload;
  if (customName.startsWith('builtin')) {
      customAssetPayload = TalespireSlabs.DecodeSlabToPayload(builtInCustoms[customName]);
  } else {
      customAssetPayload = TalespireSlabs.DecodeSlabToPayload(window.localStorage.getItem(customName));
  }

  var assetPayload = [];
  var centerMin = [0,0,0];
  for (var a = 0; a < customAssetPayload.length; a++) {
      if (a > 0) {
          break;
      }
      for (var x = 0; x < customAssetPayload[a]['assets'].length; x++) {
          var asset = customAssetPayload[a]['assets'][x];
          if (a == 0 && x == 0) {
              centerMin = [asset['bounds']['center']['x'], asset['bounds']['center']['y'], asset['bounds']['center']['z']]
          }
          if (a == 0) {
              centerMin[0] = Math.min(asset['bounds']['center']['x'], centerMin[0]);
              centerMin[1] = Math.min(asset['bounds']['center']['y'], centerMin[1]);
              centerMin[2] = Math.min(asset['bounds']['center']['z'], centerMin[2]);
          }
      }
  }
  for (var w = 0; w < width; w++) {
      for (var d = 0; d < depth; d++) {
          var center_height;
          //console.log(center_height);
          heightArray.forEach(function (h) {
              if (h[0] == w && h[1] == d) {
                  center_height = h[2] + 1.13;
                  return;
              }
          });
          if ((Math.floor(random() * 100) + 1) > percentage) {
              continue;
          }

          newRotation = Math.floor(Math.random() * 3) * 4
          for (var a = 0; a < customAssetPayload.length; a++) {
              var assets = [];
              //var centerMin;
              for (var x = 0; x < customAssetPayload[a]['assets'].length; x++) {
                  var asset = customAssetPayload[a]['assets'][x];
                  assets.push({'rotation': newRotation + asset['rotation'],
                      'bounds':
                      {
                          'center': {'x': (asset['bounds']['center']['x'] - centerMin[0]) + (w*2), 'y': asset['bounds']['center']['y'] - asset['bounds']['extents']['y'] + center_height, 'z': (asset['bounds']['center']['z'] - centerMin[2]) + d*2},
                          'extents': {'x': asset['bounds']['extents']['x'], 'y': 1, 'z': asset['bounds']['extents']['z']}
                      }
                  });
              }
              console.log("guid: " + customAssetPayload[a]['nguid'] + " Asset Count: " + assets.length);

              assetPayload.push({'nguid': customAssetPayload[a]['nguid'], 'assets': assets})
          }
      }
  }
  return assetPayload;
}
