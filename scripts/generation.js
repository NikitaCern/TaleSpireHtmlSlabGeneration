// This file conains all the functions that pretend to the generation of terrain and addition of scatered objects onto it


//Seeded random function
function getRandom(){
  return Math.random(seed);
}


//Function returns the right thickness for a specific point in the terrainThickness
function adaptiveThickness(w,d){
  var x = elevation.getElevation(w,d);
  var w0 = elevation.getElevation(w-1,d)-x;
  var w1 = elevation.getElevation(w+1,d)-x;
  var d0 = elevation.getElevation(w,d-1)-x;
  var d1 = elevation.getElevation(w,d+1)-x;

  var deltaW = Math.abs(Math.min(w0, w1));
  var deltaD = Math.abs(Math.min(d0, d1));

  var delta = Math.ceil(Math.max(deltaW, deltaD));

  if(delta > 0){
    return delta+1;
  }
  return 1;
}


//Function generates terrain with a perlin noise map
function GenerateTerrain(floorAssets){

  var output = {};
  var heightArray = [];

  for (var w = 0; w < width; w++) {
    for (var d = 0; d < depth; d++) {

      var selectedFloorGuid = GetWeightedValue(floorAssets);
      var selectedFloor = TalespireSlabs.GetAsset(selectedFloorGuid);

      var centerHeight = selectedFloor["colliderBounds"][0]["m_Center"]["y"];
      var centerWidth = selectedFloor["colliderBounds"][0]["m_Center"]["x"];
      var centerDepth = selectedFloor["colliderBounds"][0]["m_Center"]["z"];

      var extentHeight =  selectedFloor["colliderBounds"][0]["m_Extent"]["y"];
      var extentWidth = selectedFloor["colliderBounds"][0]["m_Extent"]["x"];
      var extentDepth = selectedFloor["colliderBounds"][0]["m_Extent"]["z"];

      var rotation = Math.floor(getRandom()*3)*4;

      groundTileDepth = extentDepth*2.0;
      groundTileWidth = extentWidth*2.0;

      var currentElevation = elevation.getElevation(w,d);
      var thickness = adaptiveThickness(w,d);

      scaledElevation.setElevation(w,d, currentElevation*extentHeight*2.0-extentHeight);

      for (var h = currentElevation - thickness; h < currentElevation; h++) {
        if (output[selectedFloorGuid] == null) {
          output[selectedFloorGuid] = [];
        }
        output[selectedFloorGuid].push({
          'rotation':rotation,
          'bounds': {
            'center': {
              'x': w*centerWidth*2.0+extentWidth,
              'y': h*centerHeight*2.0,
              'z': d*centerDepth*2.0+extentDepth
            },
            'extents': {
              'x': extentWidth,
              'y': extentHeight,
              'z': extentDepth
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
function GenerateScatter(scatterAssets) {

  Object.entries(scatterAssets).forEach(function(asset) {

      var custom = asset[1][0].getAttribute("custom");
      var nguid = asset[0];
      var value = asset[1][0].value;
      if (custom == "true") {
        var customAssetData = AddCustomAsset(nguid,value);

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
            slab.push(customAssetData[i]);
          }
        }
      } else {
        console.log("normal!");
        var x = AddAsset(nguid, value);
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

  var assets = [];

    console.log(nguid);

  var asset = TalespireSlabs.GetAsset(nguid);

  console.log(asset);

  var centerHeight = asset["colliderBounds"][0]["m_Center"]["y"];
  var centerWidth = asset["colliderBounds"][0]["m_Center"]["x"];
  var centerDepth = asset["colliderBounds"][0]["m_Center"]["z"];

  var extentHeight =  asset["colliderBounds"][0]["m_Extent"]["y"];
  var extentWidth = asset["colliderBounds"][0]["m_Extent"]["x"];
  var extentDepth = asset["colliderBounds"][0]["m_Extent"]["z"];


  var scalingFactorW = groundTileWidth/(extentWidth*2.0);
  var scalingFactorD = groundTileDepth/(extentDepth*2.0);

  for (var w = 0; w < width*scalingFactorW; w++) {
    for (var d = 0; d < depth*scalingFactorD; d++) {

      var rotation = Math.floor(getRandom()*3)*4;
      var scaledWidth = Math.floor(w/scalingFactorW);
      var scaledDepth = Math.floor(d/scalingFactorD);

      var h = scaledElevation.getElevation(scaledWidth,scaledDepth);

      if ((Math.floor(getRandom() * 100) + 1) <= percentage) {
        assets.push({
          'rotation': rotation,
          'bounds': {
            'center': {
              'x': w*centerWidth*2.0+extentWidth,
              'y': h+extentHeight,
              'z': d*centerDepth*2.0+extentDepth
            },
            'extents': {
              'x': extentWidth,
              'y': extentHeight,
              'z': extentDepth
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
  var customAssetPayload;

  if (customName.startsWith('builtin')) {
    customAssetPayload = TalespireSlabs.DecodeSlabToPayload(builtInCustoms[customName]);
  } else {
    customAssetPayload = TalespireSlabs.DecodeSlabToPayload(window.localStorage.getItem(customName));
  }

  var assetPayload = [];
  var centerMin = [0, 0, 0];

  for (var a = 0; a < customAssetPayload.length; a++) {

    for (var x = 0; x < customAssetPayload[a]['assets'].length; x++) {

      var asset = customAssetPayload[a]['assets'][x];
      if (a == 0) {
        if (x == 0) {
          centerMin = [Math.abs(asset['bounds']['center']['x']), Math.abs(asset['bounds']['center']['y']), Math.abs(asset['bounds']['center']['z'])];
        }
        centerMin[0] = Math.max(Math.abs(asset['bounds']['center']['x']), centerMin[0]);
        centerMin[1] = Math.max(Math.abs(asset['bounds']['center']['y']), centerMin[1]);
        centerMin[2] = Math.max(Math.abs(asset['bounds']['center']['z']), centerMin[2]);
      }
    }
  }

  for (var w = 0; w < width; w++) {
    for (var d = 0; d < depth; d++) {


      var centerHeight = scaledElevation.getElevation( w, d);

      if ((Math.floor(getRandom() * 100) + 1) <= percentage) {

      newRotation = Math.floor(getRandom() * 3) * 4*0;

      for (var a = 0; a < customAssetPayload.length; a++) {

        var assets = [];

        for (var x = 0; x < customAssetPayload[a]['assets'].length; x++) {

          var asset = customAssetPayload[a]['assets'][x];


          assets.push({
            'rotation': newRotation + asset['rotation'],
            'bounds': {
              'center': {
                'x': w* groundTileWidth + (asset['bounds']['center']['x']+centerMin[0])+asset['bounds']['extents']['x'],
                'y': centerHeight +asset['bounds']['center']['y'],
                'z': d* groundTileDepth + (asset['bounds']['center']['z']+centerMin[2]+asset['bounds']['extents']['z'])
              },
              'extents': {
                'x': asset['bounds']['extents']['x'],
                'y': asset['bounds']['extents']['y'],
                'z': asset['bounds']['extents']['z']
              }
            }
          });
        }
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
