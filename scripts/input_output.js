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
  return;
  var x = document.getElementById("snackbar");
  x.innerHTML = message;
  x.style.backgroundColor = color;
  x.style.textAlign = "center";
}

function ShowError(errorMessage, timeout = 3000) {
  ShowMessage(errorMessage, "red");
}

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
  elevation.generateElevation();
  scaledElevation.generateElevation();

  updateCanvas();
  slab = [];

  const groundSliders = document.getElementById("groundsliders").childNodes; //all ground tile sliders
  const scatterPercents = document.getElementById("randomsliders").childNodes; // all scatter sliders

  var floorAssets = {};
  var scatterAssets = {};

  groundSliders.forEach(function(item) {
    var nguid = item.getElementsByTagName("input")[0].getAttribute("nguid");
    var percent = item.getElementsByTagName("span")[0].innerHTML;
    floorAssets[nguid] = percent; // for each ground tile add it's percentage
  });

  scatterPercents.forEach(function(item) {
    var nguid = item.getElementsByTagName("input")[0].getAttribute("nguid");
    var asset = item.getElementsByTagName("input");
    scatterAssets[nguid] = asset; // for each scatter tile add it's percentage
  });

  var terrain = GenerateTerrain(floorAssets); // generate terrain

  terrain.forEach(function(layer) {
      slab.push(layer);
  });
  GenerateScatter(scatterAssets);

  var results = TalespireSlabs.CreateSlab(slab);
  document.getElementById("forest").value = results;
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

function AddToList(nguid, defaultpercent, ground = false, custom = false){

  var groundRemoveOnClick = "if ( document.getElementById(\'groundsliders\').childElementCount > 1) {this.parentNode.parentNode.removeChild(this.parentNode);} else {ShowError(\'Must have at least 1 ground tile\');}";
  var scatterRemoveOnClick = "this.parentNode.parentNode.removeChild(this.parentNode);";

  var groundSliderId = "groundsliders";
  var scatterSliderId = "randomsliders";

  var removeOnClick = "";
  var sliderId="";

  if(ground){
    removeOnClick = groundRemoveOnClick;
    sliderId = groundSliderId;
  }
  else{
    removeOnClick = scatterRemoveOnClick;
    sliderId = scatterSliderId;
  }

  if (!custom) {
    nguid = nguid.trim();
    var asset = TalespireSlabs.GetAsset(nguid);
  }

  var field = document.createElement("fieldset");
  field.setAttribute( 'class' , "form-group");

  var button = document.createElement("button");
  button.setAttribute( 'class' , "btn btn-danger mr-2");
  button.setAttribute( 'id' , nguid + "removebtn");
  button.setAttribute( 'onClick' , removeOnClick);

  var icon = document.createElement("i");
  icon.setAttribute( 'class' , "fa fa-close");

  var label = document.createElement("label");
  label.setAttribute( 'class' , "sliderheader");

  if (custom){
    label.innerText = "Custom - " + nguid.substring(nguid.indexOf('-') + 1) + ": ";
  }
  else {
    label.innerText = asset['boardAssetName'] + ": ";
  }

  var span = document.createElement("span");
  span.setAttribute( 'id', nguid + "percent");

  var input = document.createElement("input");
  input.setAttribute( 'class' , "custom-range");
  input.setAttribute( 'id' , nguid + "slider");
  input.setAttribute( 'type' , "range");
  input.setAttribute( 'min' , 0);
  input.setAttribute( 'max' , 100);
  input.setAttribute( 'value' , defaultpercent);
  input.setAttribute( 'nguid' , nguid);
  input.setAttribute( 'custom' , custom);

  button.appendChild(icon);
  field.appendChild(button);
  field.appendChild(label);
  field.appendChild(span);
  field.appendChild(input);

  document.getElementById(sliderId).appendChild(field);
  var slider = document.getElementById(nguid + "slider");

  document.getElementById(nguid + "percent").innerHTML = slider.value;

  slider.oninput = function() {
    document.getElementById(nguid + "percent").innerHTML = this.value ;
  }

}


//Function adds items to the "Randomness" section with sliders
function AddAssetToList(nguid, defaultpercent, custom = false){
  AddToList(nguid, defaultpercent, false, custom);

}

//Function adds items to the "Ground" section with sliders
function AddAssetToGround(nguid, defaultpercent){
  AddToList(nguid, defaultpercent, true, false);
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
    '<div id="standardassets" class="table-responsive"><table class="table table-hover" if="assetTable">';
  var assets = TalespireSlabs.GetAllAssets();

  tmpTable += '<tr><th scope="col">Name</th><th scope="col">Size</th><th scope="col">GUID</th><th scope="col"></th></tr>';

  Object.entries(assets).forEach(function(asset) {

    var name = asset[1]["boardAssetName"];

    var sizeX = (asset[1]["colliderBounds"][0]["m_Extent"]["x"]*2.0).toFixed(1);
    var sizeY = (asset[1]["colliderBounds"][0]["m_Extent"]["z"]*2.0).toFixed(1);
    var size =  sizeX+"x"+ sizeY;

    var guid = asset[0];

    tmpTable += '<tr><td>' + name + '</td><td><strong>' + size + '</strong></td><td>' + guid + '</td><td><button class="btn btn-success" onClick="if (assetWindowGround) {AddAssetToGround(\'' + guid + '\', 10); } else {AddAssetToList(\'' + guid +
      '\', 10);}" class="addbtn"><i class="fa fa-plus"> Select</i></button></td></tr>';
  });
  tmpTable += "</table></div>";

  tmpTable +=
    '<div id="customassets" style="display: none"><table class="table table-hover table-striped" id="assetTable">';

  tmpTable += '<tr><th>Name</th><th></th><th></th></tr>';

  Object.entries(window.localStorage).forEach(function(storeVal) {
    // console.log(storeVal);
    if (storeVal[0].startsWith('slab-')) {
      tmpTable += '<tr><td>' + storeVal[0].substring(storeVal[0].indexOf('-') + 1) + '</td><td><button onClick="RemoveFromLocal(\'' + storeVal[0] +
        '\');" class="addbtn btn btn-danger"><i class="fa fa-trash"> Delete</i></button></td><td><button onClick="AddAssetToList(\'' + storeVal[0] + '\', 10, true);" class="addbtn btn btn-success"><i class="fa fa-plus"> Select</i></button></td></tr>';
    }
  });
  tmpTable += "</table></div>";
  document.getElementById("assetTable").innerHTML = tmpTable;
}

//Function prints to output the list of blocks used in a slab
function ReadSlab() {
  return;
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

  var slabValue = document.getElementById("forest").value;

  window.localStorage.setItem('slab-' + customSlabName, slabValue);

  PopulateModalAssets();
  SwapAssets();
  ShowMessage("Saved Slab as: " + customSlabName + " <br>To delete or select use the \"Add Asset\" window.", "green", 6000);
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
    //SwapAssets();
    document.getElementById('swapassets').style.display = "none";
  } else {
    document.getElementById('swapassets').style.display = "inline";
  }
}
