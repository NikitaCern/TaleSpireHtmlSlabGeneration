// This file conains all the interactive functionallity with the website
// All the value input/ output


PopulateModalAssets();

PopulateAssetList(presetAssets['mixed']);

var assetWindowGround = false;

document.querySelector(".modal").addEventListener("click", function(e) {
  if (e.target.className == "modal") {
    document.getElementById('AssetSelect').style.display = "none";
  }
});


//Function for updating slider values, it takes the current element and ouput element id
function sliderUpdate(element, output) {
  elevation.generateElevation();
  scaledElevation.generateElevation();
  updateCanvas();
  var slider = document.getElementById(element.id);
  document.getElementById(output).innerHTML = slider.value;
}

//Function for showing messages on screen
function ShowMessage(message, color = "black", timeout = 3000) {
  var x = document.getElementById("snackbar");
  x.innerHTML = message;
  x.style.backgroundColor = color;
  x.className = "show";
  x.style.textAlign = "center";
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
function Generate() {
  clearPrintResults();

  slab = [];

  const groundsliders = document.querySelectorAll("input[groundnguid]"); //all ground tile sliders
  const sliderpercents = document.querySelectorAll("input[nguid]"); // all scatter sliders

  var floorvalues = {};

  groundsliders.forEach(function(item) {
    floorvalues[item.getAttribute("groundnguid")] = item.value; // for each ground tile add it's percentage
  });

  var terrain = GenerateTerrain(floorvalues); // generate terrain

  terrain.forEach(function(layer) {
      slab.push(layer);
  });

  GenerateScatter(sliderpercents);

  var results = TalespireSlabs.CreateSlab(slab);
  document.getElementById("forest").value = results;
  printResults(TalespireSlabs.DecodeSlab(results));
  ShowMessage("Complete", "green" , 2000);
}

//Function is called when checkbox "Select Custom Assets" is checked
function ShowCustomAssets() {
  if (document.getElementById("custom").checked) {
    document.getElementById("standardassets").style.display = "none";
    document.getElementById("customassets").style.display = "block";
  } else {
    document.getElementById("standardassets").style.display = "block";
    document.getElementById("customassets").style.display = "none";
  }
}

//Function adds items to the "Randomness" section with sliders
function AddAssetToList(nguid, defaultpercent, custom = false) {
  var sliderdiv = document.createElement("div");

  //sliderdiv.style.width = "100";


/*
<fieldset class="form-group">
  <label for="Wslider">Width: </label>
  <span id="W"></span>
  <input type="range" class="custom-range" min="1" max="50" value="5" step="1" id="Wslider" oninput="sliderUpdate(this, 'W')">
</fieldset>


<fieldset class="form-group"><button onClick="this.parentNode.parentNode.innerHTML=\'\';" class="btn" id="' + nguid + 'removebtn"></button><label class="sliderheader" >' + asset['name'] + ':</label><span id="' + nguid + 'percent"></span><input type="range" min="0" max="100" nguid="' + nguid + '"  value="' + defaultpercent + '" class="custom-range" id="' + nguid + 'slider"></fieldset>';


<fieldset class="form-group"><button onClick="this.parentNode.parentNode.innerHTML=\'\';" class="btn" id="' + nguid + 'removebtn"></button><label class="sliderheader" >Custom - ' + nguid.substring(nguid.indexOf('-') + 1) + ':</label><span id="' + nguid + 'percent"></span><input type="range" min="0" max="100" nguid="' + nguid + '" custom="true" value="' + defaultpercent + '" class="custom-range" id="' + nguid + 'slider"></fieldset>';


<p class="sliderheader">
  <button onClick="this.parentNode.parentNode.innerHTML=\'\';" class="btn" id="' + nguid + 'removebtn">
    <i class="fa fa-close"></i>
  </button>
  Custom - ' + nguid.substring(nguid.indexOf('-') + 1) + ':
  <strong><span id="' + nguid + 'percent"></span>%</strong>
  </p>
  <input type="range" min="0" max="100" nguid="' + nguid + '" custom="true" value="' + defaultpercent + '" class="custom-range" id="' + nguid + 'slider">';


  '<p class="sliderheader">
    <button onClick="this.parentNode.parentNode.innerHTML=\'\';" class="btn" id="' + nguid + 'removebtn">
      <i class="fa fa-close"></i>
    </button>
    ' + asset['name'] + ':
    <strong><span id="' + nguid + 'percent"></span>%</strong>
    </p>
    <input type="range" min="0" max="100" nguid="' + nguid + '" value="' + defaultpercent + '" class="custom-range" id="' + nguid + 'slider">';




*/
  if (custom) {
    sliderdiv.innerHTML ='<fieldset class="form-group"><button onClick="this.parentNode.parentNode.innerHTML=\'\';" class="btn" id="' + nguid + 'removebtn"><i class="fa fa-close"></i></button><label class="sliderheader" >Custom - ' + nguid.substring(nguid.indexOf('-') + 1) + ':  </label><span id="' + nguid + 'percent"></span>%<input type="range" min="0" max="100" nguid="' + nguid + '" custom="true" value="' + defaultpercent + '" class="custom-range" id="' + nguid + 'slider"></fieldset>';
    document.getElementById("randomsliders").appendChild(sliderdiv);

    var randslider = document.getElementById(nguid + "slider");

    document.getElementById("randomsliders").appendChild(sliderdiv);
    document.getElementById(nguid + "percent").innerHTML = randslider.value;

    randslider.oninput = function() {
      document.getElementById(nguid + "percent").innerHTML = this.value;
    }
  } else {
    nguid = nguid.trim();

    var asset = TalespireSlabs.GetAsset(nguid);

    sliderdiv.innerHTML ='<fieldset class="form-group"><button onClick="this.parentNode.parentNode.innerHTML=\'\';" class="btn" id="' + nguid + 'removebtn"><i class="fa fa-close"></i></button><label class="sliderheader" >' + asset['name'] + ':  </label><span id="' + nguid + 'percent"></span>%<input type="range" min="0" max="100" nguid="' + nguid + '"  value="' + defaultpercent + '" class="custom-range" id="' + nguid + 'slider"></fieldset>';
    document.getElementById("randomsliders").appendChild(sliderdiv);

    var randslider = document.getElementById(nguid + "slider");

    document.getElementById("randomsliders").appendChild(sliderdiv);
    document.getElementById(nguid + "percent").innerHTML = randslider.value;

    randslider.oninput = function() {
      document.getElementById(nguid + "percent").innerHTML = this.value;
    }
  }
}

//Function adds items to the "Ground" section with sliders
function AddAssetToGround(nguid, defaultpercent) {
  nguid = nguid.trim();

  var sliderdiv = document.createElement("div");
  var asset = TalespireSlabs.GetAsset(nguid);

  sliderdiv.innerHTML = '<p class="sliderheader"><button onClick="if (document.querySelectorAll(\'input[groundnguid]\').length > 1) {this.parentNode.parentNode.innerHTML=\'\';} else {ShowError(\'Must have at least 1 ground tile\');} " class="btn" id="' + nguid + 'removebtn"><i class="fa fa-close"></i></button> ' + asset['name'] + ': <span id="' + nguid + 'percent"></span>%</p><input type="range" min="1" max="100" groundnguid="' + nguid + '" value="' + defaultpercent + '" class="custom-range" id="' + nguid + 'groundslider">';

  document.getElementById("groundsliders").appendChild(sliderdiv);

  var randslider = document.getElementById(nguid + "groundslider");

  document.getElementById("groundsliders").appendChild(sliderdiv);
  document.getElementById(nguid + "percent").innerHTML = randslider.value;

  randslider.oninput = function() {
    document.getElementById(nguid + "percent").innerHTML = this.value;
  }
}

//Function populates the both lists
function PopulateAssetList(assetList) {
  document.getElementById("groundsliders").innerHTML = "";
  document.getElementById("randomsliders").innerHTML = "";
  assetList['randoms'].forEach(function(prop_asset) {
    if (prop_asset['nguid'].startsWith('builtin')) {
      AddAssetToList(prop_asset['nguid'], prop_asset['defaultpercent'], true);
    } else {
      AddAssetToList(prop_asset['nguid'], prop_asset['defaultpercent']);
    }
  });
  Object.entries(assetList['floors']).forEach(function(prop_asset) {
    AddAssetToGround(prop_asset[0], prop_asset[1]);
  });
}

//Function populates the list of local assets
function PopulateModalAssets() {
  var tmpTable =
    '<span id="standardassets" style="display: block;"><table class="assetTable" style="margin-top: 20px; width: 810px" cellspacing="0" cellpadding="0" border="0"><tr></tr><tr><td style=" border: 1px solid #AAA" colspan="3"><div style="height: 400px; width: 810px; overflow-y:none; overflow-y:auto;"><table  width="790px" align="left" id="assetTable" cellspacing="0" cellpadding="0" border="1">';
  var assets = TalespireSlabs.GetAllAssets();

  tmpTable += '<tr><th>Name</th><th>Size</th><th>GUID</th><th></th></tr>';

  Object.entries(assets).forEach(function(asset) {
    tmpTable += '<tr><td>' + asset[1]["name"] + '</td><td><strong>' + asset[1]["Info"]["colliderBounds"][0]["m_Extent"]["x"]*2.0 +"x"+ asset[1]["Info"]["colliderBounds"][0]["m_Extent"]["z"]*2.0  + '</strong></td><td>' + asset[0] + '</td><td><button onClick="if (assetWindowGround) {AddAssetToGround(\'' + asset[0] + '\', 10); } else {AddAssetToList(\'' + asset[0] +
      '\', 10);}" class="addbtn"><i class="fa fa-plus"> Select</i></button></td></tr>';
  });
  tmpTable += "</table></div></td></tr></table></span>";

  tmpTable +=
    '<span id="customassets" style="display: none"><table class="assetTable" style="margin-top: 20px; width: 810px" cellspacing="0" cellpadding="0" border="0"><tr></tr><tr><td style=" border: 1px solid #AAA" colspan="3"><div style="height: 400px; width: 810px; overflow-y:none; overflow-y:auto;"><table class="assetTable" width="790px" align="left" id="assetTable" cellspacing="0" cellpadding="0" border="1">';

  tmpTable += '<tr><th>Name</th><th></th><th></th></tr>';

  Object.entries(window.localStorage).forEach(function(storeVal) {
    // console.log(storeVal);
    if (storeVal[0].startsWith('slab-')) {
      tmpTable += '<tr><td>' + storeVal[0].substring(storeVal[0].indexOf('-') + 1) + '</td><td><button onClick="RemoveFromLocal(\'' + storeVal[0] +
        '\');" class="addbtn"><i class="fa fa-trash"> Delete</i></button></td><td><button onClick="AddAssetToList(\'' + storeVal[0] + '\', 10, true);" class="addbtn"><i class="fa fa-plus"> Select</i></button></td></tr>';
    }
  });
  tmpTable += "</table></div></td></tr></table></span>";
  document.getElementById("assetTable").innerHTML = tmpTable;
}

//Function prints to output the list of blocks used in a slab
function ReadSlab() {
  clearPrintResults();
  try {
    printResults(TalespireSlabs.DecodeSlab(document.getElementById("forest").value));
  } catch (err) {
    console.log(err);
    ShowError(err);
  }
}

//Function removes a custom asset from local save data
function RemoveFromLocal(name) {
  window.localStorage.removeItem(name);
  PopulateModalAssets();
  SwapAssets();
  ShowMessage(name.substring(name.indexOf('-') + 1) + " has been removed.", 5000);
}

//Function saves a custom asset to local save data
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
  ShowMessage("Saved Slab as: " + customSlabName + " <br>To delete or select use the \"Add Asset\" window.", "green", 6000);
}

//Function for displaying slab saving dialog
function ShowSaveDialog() {
  document.getElementById('slabname').value = "";
  document.getElementById('SlabNameDialog').style.display = "block";
}

//Function for searching assets
function searchAssets() {
  var input = document.getElementById("assetSearch");
  var filter = input.value.toUpperCase();
  var table = document.getElementById("assetTable");
  var tr = table.getElementsByTagName("tr");

  for (var i = 0; i < tr.length; i++) {
    //td = tr[i].getElementsByTagName("td")[0];
    var tds = tr[i].getElementsByTagName("td");
    for (var x = 0; x < tds.length; x++) {
      var txtValue = tds[x].textContent || tds[x].innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
        break;
      } else {
        tr[i].style.display = "none";
      }
    }
  }
}

//Function for displaying asset list dialog
function ShowAssetWindow(ground = false) {
  assetWindowGround = ground;
  document.getElementById('AssetSelect').style.display = "block";
  if (ground) {
    document.getElementById("custom").checked = false;
    SwapAssets();
    document.getElementById('swapassets').style.display = "none";
  } else {
    document.getElementById('swapassets').style.display = "inline";
  }
}
