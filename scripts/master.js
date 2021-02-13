
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


function Elevation(){
  this.elevation;

  this.init = function(){
        this.elevation = new Array((width)*(depth));
  };

  this.getElevation = function(w,d){
    var w_new = Math.max(Math.min(w,width-1),0);
    var d_new = Math.max(Math.min(d,depth-1),0);
    return this.elevation[w_new*width+d_new];
  };

  this.setElevation = function (w,d,value){
    this.elevation[w*width+d] = value;
  };

  this.generateElevation = function(){

    this.init();

    width = document.getElementById("widthslider").value;
    depth = document.getElementById("depthslider").value;
    height = document.getElementById("heightslider").value;

    scaleW = document.getElementById("noisewidthslider").value;
    scaleD = document.getElementById("noisedepthslider").value;

    offsetW = document.getElementById("Woffsetslider").value;
    offsetD = document.getElementById("Doffsetslider").value;

    seed = document.getElementById("seedslider").value;

    for (var w = 0; w < width; w++) {
      for (var d = 0; d < depth; d++) {
        this.setElevation(w,d,generateNoise(w,d));
      }
    }
  };
}


//Function uses perlin noise to generate a value at x,y coordinates
function generateNoise(w,d){
  var noise = new Noise(seed);

  var nw = w*0.01*scaleW;
  var nd = d*0.01*scaleD;

  var result = 0.5+noise.perlin2( (nw*1.0), (nd*1.0));

  result = Math.floor(height * result);

  return result;
}
