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
var heightArray;

var elevation = new Elevation();
var scaledElevation = new Elevation();

var noise;

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

updateCanvas();

function float2color( percentage ) {
    var color_part_dec = 255 * percentage;
    var color_part_hex = Number(parseInt( color_part_dec , 10)).toString(16);
    return "#" + color_part_hex + color_part_hex + color_part_hex;
}

function updateCanvas(){
  var squareW = (canvas.width+1.0)/width;
  var squareD = (canvas.height+1.0)/depth;

  var smallestDist = Math.min(squareW,squareD);

ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (var w = 0; w < width; w++) {
    for (var d = 0; d < depth; d++) {
      var hexColor = float2color(elevation.getElevation(w,d)/height);
      var x0 = w*smallestDist;
      var y0 = d*smallestDist;
      ctx.fillStyle = hexColor;
      ctx.fillRect(x0,y0,smallestDist,smallestDist);
      //console.log(w,d,hexColor);
    }
  }
}

function Elevation(){
  this.elevation;

  this.init = function(){
      this.elevation = new Array(width);
      for (var i = 0; i < width; i++) {
        this.elevation[i] = new Array(depth);
      }

  };

  this.getElevation = function(w,d){
    var w_new = Math.max(Math.min(w,width-1),0);
    var d_new = Math.max(Math.min(d,depth-1),0);
    return this.elevation[w_new][d_new];
  };

  this.setElevation = function (w,d,value){
    this.elevation[w][d] = value;
  };

  this.generateElevation = function(){

    width = document.getElementById("Wslider").value;
    depth = document.getElementById("Dslider").value;
    height = document.getElementById("Hslider").value;

    this.init();

    scaleW = document.getElementById("nsWslider").value;
    scaleD = document.getElementById("nsDslider").value;

    offsetW = document.getElementById("noWslider").value;
    offsetD = document.getElementById("noDslider").value;

    seed = document.getElementById("Sslider").value;

    for (var w = 0; w < width; w++) {
      for (var d = 0; d < depth; d++) {
        this.setElevation(w,d,generateNoise(w,d));
      }
    }
  };
}

//Function uses perlin noise to generate a value at x,y coordinates
function generateNoise(w,d){
  if(w==0 && d==0){
    noise = new Noise(seed);
  }
  var nw = ((w-offsetW)/width-1)*0.5;
  var nd = ((d-offsetD)/depth-1)*0.5;


  var result = 0.5*(1.0+noise.perlin2( nw*scaleW, nd*scaleD));
  result = Math.floor(result*height);

  return result;
}
