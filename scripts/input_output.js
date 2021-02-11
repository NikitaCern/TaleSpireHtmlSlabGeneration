// This file conains all the interactive functionallity with the website
// All the value input/ output


//Function for updating slider values, it takes the current element and ouput element id
function sliderUpdate(element, output) {
  var slider = document.getElementById(element.id);
  document.getElementById(output).innerHTML = slider.value;
  slider.oninput = function() {
    document.getElementById(output).innerHTML = this.value;
  }
}

//Function for showing messages on screen
function ShowMessage(message, color = "black", timeout = 3000) {
  var x = document.getElementById("snackbar");

  x.innerHTML = message;
  x.style.backgroundColor = color;
  x.className = "show";

  var timeoutSeconds = ((timeout / 1000) - 0.5) + "s";

  x.style.webkitAnimation = "fadein 0.5s, fadeout 0.5s " + timeoutSeconds;
  x.style.animation = "fadein 0.5s, fadeout 0.5s " + timeoutSeconds;

  setTimeout(function() {
    x.className = x.className.replace("show", "");
  }, timeout);
}

function ShowError(errorMessage, timeout = 3000) {
  ShowMessage(errorMessage, "red");
}

//Functions for dealing with output
function clearPrintResults() {
  document.getElementById('output').innerHTML = "";
}

function printResults(message) {
  document.getElementById('output').innerHTML += '<p>' + message + '</p>';
};

//Function gets called when "Copy To Clipbard" button is pushed
//Function for reading values, generating terrain, outputing result
function CopyToClipboard() {
  var forest = document.getElementById("forest");
  forest.select();
  document.execCommand('copy');
  ShowMessage("Slab Copied to Clipboard")
}

//Function gets called when "Generate terrain" button is pushed
//Function for reading values, generating terrain, outputing result
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

  const groundsliders = document.querySelectorAll("input[groundnguid]"); //all ground tile sliders
  const sliderpercents = document.querySelectorAll("input[nguid]"); // all prop sliders

  var floorvalues = {};

  groundsliders.forEach(function(item) {
    floorvalues[item.getAttribute("groundnguid")] = item.value; // for each ground tile add it's percentage
  });

  var floorData = AddTerrain(floorvalues, width, depth, height, seed, noiseWscale, noiseDscale, noiseWoffset, noiseDoffset, 1); // generate terrain

  var heightArray = floorData[1];
  var floors = floorData[0];

  floors.forEach(function(floor) {
    slab.push(floor);
  });

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


  var results = TalespireSlabs.CreateSlab(slab);
  document.getElementById("forest").value = results;
  printResults(TalespireSlabs.DecodeSlab(results));
  ShowMessage("Complete", 2000);
}



function AddAssetToList(nguid, defaultpercent, custom = false) {
  var sliderdiv = document.createElement("div");
  sliderdiv.style.width = "400px";

  if (custom) {
    sliderdiv.innerHTML = '<p class="sliderheader"><button onClick="this.parentNode.parentNode.innerHTML=\'\';" class="btn" id="' + nguid + 'removebtn"><i class="fa fa-close"></i></button> Custom - ' + nguid.substring(nguid.indexOf('-') + 1) + ': <strong><span id="' + nguid + 'percent"></span>%</strong> </p><input type="range" min="0" max="100" nguid="' + nguid + '" custom="true" value="' + defaultpercent + '" class="sliderwide" id="' + nguid + 'slider">';
    document.getElementById("randomsliders").appendChild(sliderdiv);
    var randslider = document.getElementById(nguid + "slider");
    document.getElementById(nguid + "percent").innerHTML = randslider.value;
    randslider.oninput = function() {
      document.getElementById(nguid + "percent").innerHTML = this.value;
    }

  } else {

    nguid = nguid.trim();

    var asset = TalespireSlabs.GetAsset(nguid);

    sliderdiv.innerHTML = '<p class="sliderheader"><button onClick="this.parentNode.parentNode.innerHTML=\'\';" class="btn" id="' + nguid + 'removebtn"><i class="fa fa-close"></i></button> ' + asset['name'] + ': <strong><span id="' + nguid + 'percent"></span>%</strong> </p><input type="range" min="0" max="100" nguid="' + nguid + '" value="' + defaultpercent + '" class="sliderwide" id="' + nguid + 'slider">';
    document.getElementById("randomsliders").appendChild(sliderdiv);
    var randslider = document.getElementById(nguid + "slider");
    document.getElementById(nguid + "percent").innerHTML = randslider.value;
    randslider.oninput = function() {
      document.getElementById(nguid + "percent").innerHTML = this.value;
    }
  }
}

function AddAssetToGround(nguid, defaultpercent) {
  var sliderdiv = document.createElement("div");
  sliderdiv.style.width = "400px";

  nguid = nguid.trim();

  var asset = TalespireSlabs.GetAsset(nguid);

  sliderdiv.innerHTML = '<p class="sliderheader"><button onClick="if (document.querySelectorAll(\'input[groundnguid]\').length > 1) {this.parentNode.parentNode.innerHTML=\'\';} else {ShowError(\'Must have at least 1 ground tile\');} " class="btn" id="' + nguid + 'removebtn"><i class="fa fa-close"></i></button> ' + asset['name'] + ': <strong><span id="' + nguid + 'percent"></span>%</strong> </p><input type="range" min="1" max="100" groundnguid="' + nguid + '" value="' + defaultpercent + '" class="sliderwide" id="' + nguid + 'groundslider">';
  document.getElementById("groundsliders").appendChild(sliderdiv);
  var randslider = document.getElementById(nguid + "groundslider");
  document.getElementById(nguid + "percent").innerHTML = randslider.value;
  randslider.oninput = function() {
    document.getElementById(nguid + "percent").innerHTML = this.value;
  }
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

function SaveToLocal() {
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

function ShowSlabDialog() {
  document.getElementById('slabname').value = "";
  document.getElementById('SlabNameDialog').style.display = "block";
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