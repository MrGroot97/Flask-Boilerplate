// .............. Private functions ..........................

// function for finding gcd for aspectRatio
function gcd (a, b) {
  return (b == 0) ? a : gcd (b, a%b);
};
// function to get aspect ratio of image
function get_aspect_ratio(imageTag){
  const imgNatureWidth = inputImg.naturalWidth;
  const imgNatureHeight = inputImg.naturalHeight;

  var ratio = gcd (imgNatureWidth, imgNatureHeight);
  var aspectRatio = (imgNatureWidth/ratio)/(imgNatureHeight/ratio);
  aspectRatio = Math.round((aspectRatio + Number.EPSILON) * 100) / 100
  // console.log("Resized Image aspect ratio is : ",aspectRatio);
  return aspectRatio;
};

// resize image function with given htmltag and return dataURL
function resizeImage(inputImg){
  inputImg.setAttribute('crossOrigin', 'anonymous');

  // process of resizing image
  const imgNatureWidth = inputImg.naturalWidth;
  const imgNatureHeight = inputImg.naturalHeight;

  const canvas = document.createElement("canvas");
  const MAX_WIDTH = 960;
  const scaleSize = MAX_WIDTH / imgNatureWidth;
  canvas.width = MAX_WIDTH;
  canvas.height = imgNatureHeight * scaleSize;
  const ctx = canvas.getContext("2d");

  ctx.drawImage(inputImg, 0, 0, canvas.width, canvas.height);
  const srcEncoded = ctx.canvas.toDataURL("image/jpeg",1.0);
  return [srcEncoded, canvas.width,canvas.height];
};

function resizeImageCallback(inputImg,callback){
  
  inputImg.setAttribute('crossOrigin', 'anonymous');

  // process of resizing image
  const imgNatureWidth = inputImg.naturalWidth;
  const imgNatureHeight = inputImg.naturalHeight;
  inputImg.onload =function(){
    const canvas = document.createElement("canvas");
    const MAX_WIDTH = 960;
    const scaleSize = MAX_WIDTH / imgNatureWidth;
    canvas.width = MAX_WIDTH;
    canvas.height = imgNatureHeight * scaleSize;
    const ctx = canvas.getContext("2d");

    ctx.drawImage(inputImg, 0, 0, canvas.width, canvas.height);
    const srcEncoded = ctx.canvas.toDataURL("image/jpeg",1.0);
    callback(srcEncoded,canvas.width,canvas.height);
  }
};

function getBase64Image(imgUrl,callback) {
  var img = new Image();
  // set attributes and src 
  img.setAttribute('crossOrigin', 'anonymous'); //
  img.src = imgUrl;
  // onload fires when the image is fully loadded, and has width and height
  img.onload = function(){

    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    var dataURLSrc = canvas.toDataURL("image/jpeg");
    // var dataURL = canvas.toDataURL("image/jpeg"),
    //   dataURL = dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
    // console.log("converted base64 image is ",dataURL);// the base64 string

    callback(dataURLSrc);
  };

};
// function to calculate adjusted value for sliders
function calculateNewVal(OldValue,OldMin,OldMax){
  const NewMin = 0;
  const NewMax = 100;
  var NewValue;

  OldRange = (OldMax - OldMin);
  OldRange = (OldMax - OldMin);
  NewRange = (NewMax - NewMin);
  NewValue = (((OldValue - OldMin) * NewRange) / OldRange) + NewMin;

  return NewValue;

};
function dataURLtoBlob(dataURL) {
  // Decode the dataURL    
  var binary = atob(dataURL.split(',')[1]);
  // Create 8-bit unsigned array
  var array = [];
  for(var i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
  }
  // Return our Blob object
  // return new Blob([new Uint8Array(array)], {type: 'image/png'});
  return new Blob([new Uint8Array(array)], {type: 'image/jpeg'});
};
function xhrPostrequest(data,url) {
  // input is form data
  var xhr = new XMLHttpRequest();

  // File received / failed
  xhr.onreadystatechange = function(e) {
      if (xhr.readyState == 4) {
        console.log("Everything is good!");
      }
  };

  xhr.open("post",url, true);
  // xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');

  xhr.onload = function(){
      console.log("in xhr http request",xhr.responseText);
  }
  xhr.onerror = function() {
    // There was a connection error of some sort
    console.log("upload error" , xhr.responseText);
    var headers = XMLHttpRequest.getAllResponseHeaders();
    console.log("upload headers" , headers);
  };

  xhr.send(data);  /* Send to server */
};
function checkFileSize(rawImage){
  // input rawImage is dataURL
  var file = dataURLtoBlob(rawImage);
  var size = file.size;
  var sizeMB = size/1000000;
  sizeMB = Math.round((sizeMB + Number.EPSILON) * 100) / 100
  // console.log("file size is ", sizeMB ,"MB");
  return sizeMB;
};
// selector matching function
var matches = function(el, selector) {
  return (el.matches || el.matchesSelector || el.msMatchesSelector || el.mozMatchesSelector || el.webkitMatchesSelector || el.oMatchesSelector).call(el, selector);
};
// example 
// matches(el, '.my-class');

function processImage(inImg) {
const width = inImg.width;
const height = inImg.height;
const src = new Uint32Array(inImg.data.buffer);
const isValueHistogram = $("#typeValue").prop('checked');

var histBrightness = (new Array(256)).fill(0);
var histR = (new Array(256)).fill(0);
var histG = (new Array(256)).fill(0);
var histB = (new Array(256)).fill(0);
for (var i = 0; i < src.length; i++) {
  var r = src[i] & 0xFF;
  var g = (src[i] >> 8) & 0xFF;
  var b = (src[i] >> 16) & 0xFF;
  histBrightness[r]++;
  histBrightness[g]++;
  histBrightness[b]++;
  histR[r]++;
  histG[g]++;
  histB[b]++;
}

var maxBrightness = 0;
if (isValueHistogram) {
  for (var i = 1; i < 256; i++) {
  if (maxBrightness < histBrightness[i]) {
      maxBrightness = histBrightness[i]
  }
  }
} else {
  for (var i = 0; i < 256; i++) {
  if (maxBrightness < histR[i]) {
      maxBrightness = histR[i]
  } else if (maxBrightness < histG[i]) {
      maxBrightness = histG[i]
  } else if (maxBrightness < histB[i]) {
      maxBrightness = histB[i]
  }
  }
}

const canvas = document.getElementById('canvasHistogram');
const ctx = canvas.getContext('2d');
var guideHeight = 8;
var startY = (canvas.height - guideHeight);
var dx = canvas.width / 256;
var dy = startY / maxBrightness;
ctx.lineWidth = dx;
ctx.fillStyle = "#fff";
ctx.fillRect(0, 0, canvas.width, canvas.height);

for (var i = 0; i < 256; i++) {
  var x = i * dx;
  if (isValueHistogram) {
  // Value
  ctx.strokeStyle = "#000000";
  ctx.beginPath();
  ctx.moveTo(x, startY);
  ctx.lineTo(x, startY - histBrightness[i] * dy);
  ctx.closePath();
  ctx.stroke(); 
  } else {
  // Red
  ctx.strokeStyle = "rgba(255,0,0,0.9)";
  ctx.beginPath();
  ctx.moveTo(x, startY);
  ctx.lineTo(x, startY - histR[i] * dy);
  ctx.closePath();
  ctx.stroke(); 
  // Green
  ctx.strokeStyle = "rgba(0,255,0,0.9)";
  ctx.beginPath();
  ctx.moveTo(x, startY);
  ctx.lineTo(x, startY - histG[i] * dy);
  ctx.closePath();
  ctx.stroke(); 
  // Blue
  ctx.strokeStyle = "rgba(0,0,255,0.9)";
  ctx.beginPath();
  ctx.moveTo(x, startY);
  ctx.lineTo(x, startY - histB[i] * dy);
  ctx.closePath();
  ctx.stroke(); 
  }
  // Guide
  ctx.strokeStyle = 'rgb(' + i + ', ' + i + ', ' + i + ')';
  ctx.beginPath();
  ctx.moveTo(x, startY);
  ctx.lineTo(x, canvas.height);
  ctx.closePath();
  ctx.stroke(); 
}
}

function getImageData(el) {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  const img = document.getElementById(el);

  canvas.width = img.width;
  canvas.height = img.height;
  context.drawImage(img, 0, 0);
  return context.getImageData(0, 0, img.width, img.height);
}
var imgHist = document.getElementById('file-image');
imgHist.onload = update;
$('input[name="rType"]').on('click change', update);
function update(e) {
processImage(getImageData('file-image'));
}
imgHist.onload = function(){
update();
}