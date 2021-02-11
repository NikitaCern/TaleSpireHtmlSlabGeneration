function GetWeightedValue(weightedDict) {
  weightedArr = [];
  Object.entries(weightedDict).forEach(function (val) {
      for (let j = 0; j < val[1]; ++j) {
          weightedArr.push(val[0]);
      }
  });
  return weightedArr[Math.floor(Math.random() * weightedArr.length)];
}

function ShowError(errorMessage, timeout=3000) {
  var x = document.getElementById("snackbar");
  x.innerHTML = errorMessage;
  x.style.backgroundColor = "red";
  x.className = "show";
  var timeoutSeconds = ((timeout / 1000) - 0.5) + "s";
  x.style.webkitAnimation = "fadein 0.5s, fadeout 0.5s " + timeoutSeconds;
  x.style.animation = "fadein 0.5s, fadeout 0.5s " + timeoutSeconds;
  setTimeout(function(){ x.className = x.className.replace("show", ""); }, timeout);
}

function ShowMessage(message, timeout=3000) {
  var x = document.getElementById("snackbar");
  x.innerHTML = message;
  x.style.backgroundColor = "black";
  x.className = "show";
  var timeoutSeconds = ((timeout / 1000) - 0.5) + "s";
  x.style.webkitAnimation = "fadein 0.5s, fadeout 0.5s " + timeoutSeconds;
  x.style.animation = "fadein 0.5s, fadeout 0.5s " + timeoutSeconds;
  setTimeout(function(){ x.className = x.className.replace("show", ""); }, timeout);
}
function CopyToClipboard() {
  var forest = document.getElementById("forest");
  forest.select();
  document.execCommand('copy');
  ShowMessage("Slab Copied to Clipboard")
}

function clearPrintResults() {
  document.getElementById('output').innerHTML = "";
}

function printResults(message) {
  document.getElementById('output').innerHTML += '<p>' + message + '</p>';
};

var seed = new Date() / 1000;;
function random() {
  var x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

var flag = false;
/*
function UpdateNoise(image){
  var canvas = document.getElementsByTagName('canvas')[0];
  var ctx = canvas.getContext('2d');
  ctx.fillColor = 'white';
  ctx.fillRect(0, 0, 100, 100);
  ctx.mozImageSmoothingEnabled = false;
ctx.imageSmoothingEnabled = false;
  ctx.putImageData(image, 0, 0);

  var newCanvas = document.createElement('canvas');
  newCanvas.width = image.width;
  newCanvas.height= image.height;

  newCanvas.getContext("2d").putImageData(image, 0, 0);
  if(!flag){
    flag = true;
    ctx.scale(5, 5);
  }
  ctx.drawImage(newCanvas, 0, 0);

}

function updateImage(){

    var width = document.getElementById("widthslider").value;
    var depth = document.getElementById("depthslider").value;
    var height = document.getElementById("heightslider").value;

    var noiseWscale = document.getElementById("noisewidthslider").value;
    var noiseDscale = document.getElementById("noisedepthslider").value;

    var noiseWoffset = document.getElementById("Woffsetslider").value;
    var noiseDoffset = document.getElementById("Doffsetslider").value;

    noiseWoffset *= 4;
    noiseDoffset *= 4;

    var seed = document.getElementById("seedslider").value;

    const groundsliders = document.querySelectorAll("input[groundnguid]");
    var floorvalues = {};
    groundsliders.forEach(function(percent) {
        floorvalues[percent.getAttribute("groundnguid")] = percent.value;``
    });
    //var floorData = AddFloor(floorvalues, width, depth, 1);
    var image = imageCreation(width, depth, height, seed, noiseWscale , noiseDscale,noiseWoffset, noiseDoffset);

    return image;
}

function imageCreation( width, depth, height, seed, scaleW, scaleD, offsetW, offsetD){
  var noise = new Noise(seed);

  var canvas = document.getElementsByTagName('canvas')[0];
  var ctx = canvas.getContext('2d');

  var image =  ctx.createImageData(Number(width), Number(depth));
  var data = image.data;

  for (var w = 0; w < width; w++) {
      for (var d = 0; d < depth; d++) {
        var noiseValue = Math.floor(height*(1+noise.perlin2( (w/scaleW)+(offsetW/scaleW) , (d/scaleD)+(offsetD/scaleD) )));

        var cell = (d+w*width)*4;
        data[cell] = data[cell + 1] = data[cell + 2] = 256-noiseValue*(256/height);
        data[cell + 3] = 255; // alpha.
      }
  }
  return UpdateNoise(image);
}
*/
function AddTerrain(floors, width, depth, height, seed, scaleW, scaleD, offsetW, offsetD, center_height) {
        //console.log("Adding asset: " + nguid + " Width: " + width + " Depth: " + depth + " Height: " + center_height + " Percentage: " + percentage);

        // var nguidAssets = [];
        // nguids.forEach(function(nguid) {
        //     nguidAssets.push(TalespireSlabs.GetAsset(nguid));
        // });
        var output = {};
        var heightArray = [];
        var noise = new Noise(seed);

        for (var w = 0; w < width; w++) {
            for (var d = 0; d < depth; d++) {
                var selectedFloorGuid = GetWeightedValue(floors);
                //heightArray.push([w, d, TalespireSlabs.GetAsset(selectedFloorGuid)['height']]);
                //var selectedAsset = Math.floor(random() * nguidAssets.length);

                var tileHeight = TalespireSlabs.GetAsset(selectedFloorGuid)['height'];
                var tileWidth = TalespireSlabs.GetAsset(selectedFloorGuid)['width'];
                var tileDepth = TalespireSlabs.GetAsset(selectedFloorGuid)['depth'];
                console.log("  tileHeight:"+tileHeight+"  tileWidth:"+tileWidth+"  tileDepth:"+tileDepth);

                var noiseValue = Math.floor(height*(1+noise.perlin2( w/scaleW , d/scaleD )));

                var finalHeight = (noiseValue*2*tileHeight)-(tileHeight*1.5);

                heightArray.push([w, d, finalHeight]);

                for (var h = noiseValue-2; h <= noiseValue; h++) {
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

function AddFloor(floors, width, depth, center_height) {
  //console.log("Adding asset: " + nguid + " Width: " + width + " Depth: " + depth + " Height: " + center_height + " Percentage: " + percentage);

  // var nguidAssets = [];
  // nguids.forEach(function(nguid) {
  //     nguidAssets.push(TalespireSlabs.GetAsset(nguid));
  // });
  var output = {};
  var heightArray = [];
  for (var w = 0; w < width; w++) {
      for (var d = 0; d < depth; d++) {
          var selectedFloorGuid = GetWeightedValue(floors);
          heightArray.push([w, d, TalespireSlabs.GetAsset(selectedFloorGuid)['height']]);
          //var selectedAsset = Math.floor(random() * nguidAssets.length);
          if (output[selectedFloorGuid] == null) {
              output[selectedFloorGuid] = [];
          }
          //console.log(center_height);  Math.floor(Math.random() * 3) * 4
          output[selectedFloorGuid].push({'rotation': 1,
              'bounds':
              {
                  'center': {'x': w*2, 'y': center_height, 'z': d*2},
                  'extents': {'x': 1, 'y': 1, 'z': 1}
              }
          });
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
          assets.push({'rotation': Math.floor(Math.random() * 3) * 4,
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

function WriteRandomForest() {
  clearPrintResults();

  var slab = [];

  var width = document.getElementById("widthslider").value;
  var depth = document.getElementById("depthslider").value;
  var height = document.getElementById("heightslider").value;

  var noiseWscale = document.getElementById("noisewidthslider").value;
  var noiseDscale = document.getElementById("noisedepthslider").value;

  var noiseWoffset = document.getElementById("Woffsetslider").value;
  var noiseDoffset = document.getElementById("Doffsetslider").value;
  var seed = document.getElementById("seedslider").value;

  const groundsliders = document.querySelectorAll("input[groundnguid]");
  var floorvalues = {};
  groundsliders.forEach(function(percent) {
      floorvalues[percent.getAttribute("groundnguid")] = percent.value;``
  });
  //var floorData = AddFloor(floorvalues, width, depth, 1);
    var floorData = AddTerrain(floorvalues, width, depth, height, seed, noiseWscale , noiseDscale,noiseWoffset, noiseDoffset, 1);

  var heightArray = floorData[1];
  var floors = floorData[0];
  floors.forEach(function (floor) {
      slab.push(floor);
  });

  // var grass_guid = "01c3a210-94fb-449f-8c47-993eda3e7126";
  // slab.push(AddAsset(grass_guid, width, depth, 1, 100));

  const sliderpercents = document.querySelectorAll("input[nguid]");
  sliderpercents.forEach(function(percent) {
      if (percent.getAttribute("custom")) {
          var customAssetData = AddCustomAsset(percent.getAttribute("nguid"), width, depth, heightArray, percent.value);
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
          slab.push(AddAsset(percent.getAttribute("nguid"), width, depth, heightArray, percent.value)); // 1.38
      }
  });

  // console.log(slab);
  var results = TalespireSlabs.CreateSlab(slab);
  document.getElementById("forest").value = results;
  printResults(TalespireSlabs.DecodeSlab(results));
  ShowMessage("Complete", 2000);
}

function ReadSlab() {
  clearPrintResults();
  try {
      printResults(TalespireSlabs.DecodeSlab(document.getElementById("forest").value));
  } catch (err) {
      console.log(err);
      ShowError(err);
  }
}

function RemoveFromLocal(name) {
  window.localStorage.removeItem(name);
  PopulateModalAssets();
  SwapAssets();
  ShowMessage(name.substring(name.indexOf('-') + 1) + " has been removed.", 5000);
}

function ShowSlabDialog() {
  document.getElementById('slabname').value = "";
  document.getElementById('SlabNameDialog').style.display = "block";
}

function SaveToLocal() {
  // var customSlabName = prompt("Custom Slab Name", "");
  var customSlabName = document.getElementById('slabname').value;
  console.log("Custom Slab Name: " + customSlabName);
  if (customSlabName == null) {
      return;
  }
  if (customSlabName == "") {
      ShowError("You must give the slab a name.");
  }
  clearPrintResults();
  var slabValue = document.getElementById("forest").value;
  try {
      printResults(TalespireSlabs.DecodeSlab(slabValue));
  } catch (err) {
      console.log(err);
      ShowError(err);
      return;
  }
  window.localStorage.setItem('slab-' + customSlabName, slabValue);
  PopulateModalAssets();
  SwapAssets();
  ShowMessage("Saved Slab as: " + customSlabName + " <br>To delete or select use the \"Add Asset\" window.", 6000);

}

function searchAssets() {
// Declare variables
var input, filter, table, tr, td, i, txtValue;
input = document.getElementById("assetSearch");
filter = input.value.toUpperCase();
table = document.getElementById("assetTable");
tr = table.getElementsByTagName("tr");

// Loop through all table rows, and hide those who don't match the search query
for (i = 0; i < tr.length; i++) {
  //td = tr[i].getElementsByTagName("td")[0];
  tds = tr[i].getElementsByTagName("td");
  for (var x = 0; x < tds.length; x++) {
    txtValue = tds[x].textContent || tds[x].innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      tr[i].style.display = "";
      break;
    } else {
      tr[i].style.display = "none";
    }

  }
}
}
