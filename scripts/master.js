
var includes = [
  'assetdata.js',
  'https://cdn.jsdelivr.net/pako/1.0.3/pako.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/mathjs/6.6.4/math.min.js',
  'https://cdn.jsdelivr.net/npm/noisejs'
];

includes.forEach((include) => {
  var script = document.createElement("script");
  script.src = include;
  document.head.appendChild(script);
});

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
