// This file conains all the functions that pretend to the generation of terrain and addition of scatered objects onto it


//Function uses perlin noise to generate a value at x,y coordinates
function generateNoise(w,d){
  var noise = new Noise(seed);

  //var ow = offsetW*10.0/width;
  //var od = offsetD*10.0/width;

  var nw = w*0.01*scaleW;
  var nd = d*0.01*scaleD;

  var result = 0.5+noise.perlin2( (nw*1.0), (nd*1.0));

  result = Math.floor(height * result);

  return result;
}

//Seeded random function
function getRandom(){
  return Math.random(seed);
}

//Function returns the elevation at point x,y
function getElevation(w,d){
  return elevation[w*width+d];
}

//Function sets the elevation value at point x,y
function setElevation(w,d,value){
  elevation[w*width+d] = value;
}


//Function generates a 2d array of elevation
function generateElevation(){

  width = document.getElementById("widthslider").value;
  depth = document.getElementById("depthslider").value;
  height = document.getElementById("heightslider").value;

  elevation = new Array((width)*(depth));

  scaleW = document.getElementById("noisewidthslider").value;
  scaleD = document.getElementById("noisedepthslider").value;

  offsetW = document.getElementById("Woffsetslider").value;
  offsetD = document.getElementById("Doffsetslider").value;

  seed = document.getElementById("seedslider").value;

  for (var w = 0; w <= width; w++) {
    for (var d = 0; d <= depth; d++) {
      setElevation(w,d,generateNoise(w,d));
    }
  }
}

//Function generates terrain with a perlin noise map
function GenerateTerrain(floor, center_height){
  generateElevation();

  var output = {};
  var heightArray = [];

  for (var w = 0; w < width; w++) {
    for (var d = 0; d < depth; d++) {
      var selectedFloorGuid = GetWeightedValue(floor);
      var selectedFloor = TalespireSlabs.GetAsset(selectedFloorGuid);

      var tileHeight = selectedFloor['height'];
      var tileWidth = selectedFloor['width']-1.0;
      var tileDepth = selectedFloor['depth']-1.0;

      if(groundTileDepth == null || groundTileWidth){
        groundTileDepth = tileDepth;
        groundTileWidth = tileWidth;
      }

      var currentElevation = getElevation(w,d);
      setElevation(w,d, tileHeight*(currentElevation-0.5));

      for (var h = currentElevation - terrainThickness; h < currentElevation; h++) {
        if (output[selectedFloorGuid] == null) {
          output[selectedFloorGuid] = [];
        }
        //console.log(center_height);
        output[selectedFloorGuid].push({
          'rotation':Math.floor(getRandom()*4)*4,
          'bounds': {
            'center': {
              'x': w*tileWidth,
              'y': (tileHeight * h * 2.0) ,
              'z': d*tileDepth
            },
            'extents': {
              'x': tileWidth*0.5,
              'y': tileHeight,
              'z': tileDepth*0.5
            }
          }
        });
      }
    }
  }
  var response = [];
  Object.entries(output).forEach(function(outputItem) {
    response.push({
      'nguid': outputItem[0],
      'assets': outputItem[1]
    });
  });
  return response;
}

//Function that generates scatter objects ontop of the terrain
function GenerateScatter(sliderpercents) {

  sliderpercents.forEach(function(percent) {

      if (percent.getAttribute("custom")) {
        var customAssetData = AddCustomAsset(percent.getAttribute("nguid"), percent.value);

        for (var i = 0; i < customAssetData.length; i++) {
          var found = false;

          for (var s = 0; s < slab.length; s++) {

            if (slab[s]['nguid'] == customAssetData[i]['nguid']) {
              found = true;
              for (var a = 0; a < customAssetData[i]['assets'].length; a++) {
                slab[s]['assets'].push(customAssetData[i]['assets'][a]);
              }
              break;
            }
          }
          if (!found) {
            console.log("!found",customAssetData[i]);
            slab.push(customAssetData[i]);
          }
        }
      } else {
        var x = AddAsset(percent.getAttribute("nguid"), percent.value);
        console.log("!custom",x)
        slab.push(x); // 1.38
      }
    });
}

//Function for selecting a random object with its corresponding weight
function GetWeightedValue(weightedDict) {
  weightedArr = [];
  Object.entries(weightedDict).forEach(function(val) {
    for (let j = 0; j < val[1]; ++j) {
      weightedArr.push(val[0]);
    }
  });
  return weightedArr[Math.floor(getRandom() * weightedArr.length)];
}

//Functon for adding simple scatter objects ontop of terrain
function AddAsset(nguid, percentage) {
  //console.log("Adding asset: " + nguid + " Width: " + width + " Depth: " + depth + " Percentage: " + percentage);
  var asset = TalespireSlabs.GetAsset(nguid);


  var tileWidth = Math.max(asset['width']-1.0, 1.0);
  var tileHeight = asset['height'];
  var tileDepth = Math.max(asset['depth']-1.0, 1.0);
  var assets = [];
  for (var w = 0; w < width; w++) {
    for (var d = 0; d < depth; d++) {
      if ((Math.floor(getRandom() * 100) + 1) <= percentage) {
        assets.push({
          'rotation': Math.floor(getRandom()*4)*4 ,
          'bounds': {
            'center': {
              'x': (w*tileWidth*groundTileWidth),
              'y': (getElevation(w,d)*2),
              'z': (d*tileDepth*groundTileDepth)
            },
            'extents': {
              'x': tileWidth*0.5,
              'y': 1,
              'z': tileDepth*0.5
            }
          }
        });
      }
    }
  }
  return {
    'nguid': nguid,
    'assets': assets
  };
}

//Functon for adding custom scatter objects ontop of terrain
function AddCustomAsset(customName ,percentage) {
  //console.log("Adding custom asset: " + customName + " Width: " + width + " Depth: " + depth + " Percentage: " + percentage);
  var customAssetPayload;
  if (customName.startsWith('builtin')) {
    customAssetPayload = TalespireSlabs.DecodeSlabToPayload(builtInCustoms[customName]);
  } else {
    customAssetPayload = TalespireSlabs.DecodeSlabToPayload(window.localStorage.getItem(customName));
  }

  var assetPayload = [];
  var centerMin = [0, 0, 0];
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
      var center_height = getElevation( w, d);
      if ((Math.floor(getRandom() * 100) + 1) <= percentage) {
      newRotation = Math.floor(getRandom() * 4) * 4*0;
      for (var a = 0; a < customAssetPayload.length; a++) {
        var assets = [];
        //var centerMin;
        for (var x = 0; x < customAssetPayload[a]['assets'].length; x++) {
          var asset = customAssetPayload[a]['assets'][x];
          assets.push({
            'rotation': newRotation + asset['rotation'],
            'bounds': {
              'center': {
                'x': (asset['bounds']['center']['x'] - centerMin[0]) + (w * 2),
                'y': asset['bounds']['center']['y'] - asset['bounds']['extents']['y'] + center_height+1,
                'z': (asset['bounds']['center']['z'] - centerMin[2]) + d * 2
              },
              'extents': {
                'x': asset['bounds']['extents']['x'],
                'y': 1,
                'z': asset['bounds']['extents']['z']
              }
            }
          });
        }
        console.log("guid: " + customAssetPayload[a]['nguid'] + " Asset Count: " + assets.length);

        assetPayload.push({
          'nguid': customAssetPayload[a]['nguid'],
          'assets': assets
        })
      }
    }
    }
  }
  return assetPayload;
}
