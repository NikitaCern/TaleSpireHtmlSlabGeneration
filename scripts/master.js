
var includes = [
  'scripts/assetdata.js',
  'https://cdn.jsdelivr.net/pako/1.0.3/pako.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/mathjs/6.6.4/math.min.js',
  'https://cdn.jsdelivr.net/npm/noisejs'
];

includes.forEach((include) => {
  var script = document.createElement("script");
  script.src = include;
  document.head.appendChild(script);
});

var seed = 0;

var slab = [];

var width = 0;
var depth = 0;
var height = 0;

var groundTileWidth;
var groundTileDepth;

var noiseWscale = 0;
var noiseDscale = 0;

var noiseWoffset = 0;
var noiseDoffset = 0;

var terrainThickness = 2;

var heightArray;

var elevation;


/*
var flag = false;

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
