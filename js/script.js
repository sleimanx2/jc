window.alert = function() {};

/**
 * Hex => RGB Cache
 */
var h2rs = {};

var colorThief = new ColorThief();

var webCamLoaded = false;

Webcam.set({
  width: 1024,
  height: 768,
  image_format: 'jpeg',
  jpeg_quality: 100
});

Webcam.attach('#camera');


Webcam.on('load', function() {
  console.log('loaded');
  webCamLoaded = true;
});

var color_map = {
  "white-1": "FFFFFF",
  "white-2": "F8F8F8",
  "white-3": "F8F8F8",
  "white-4": "F5F5F5",
  "white-5": "d8d4ca",
  "white-6": "ecf0f1",

  "black-1": "000000",
  "black-2": "080808",
  "black-3": "101010",
  "black-4": "181818",
  "black-5": "2c3e50",

  "red-1": "FF0000",
  "red-2": "b30000",
  "red-3": "e60000",
  "red-4": "ff3333",
  "red-5": "c0392b",
  "red-6": "e74c3c",
  "red-7": "a12221",

  "blue-1": "0000FF",
  "blue-2": "0000e6",
  "blue-3": "0000cc",
  "blue-4": "0000b3",
  "blue-5": "3498db",
  "blue-6": "227093",
  "blue-7": "34ace0",

  "pink-1": "FFC0CB",
  "pink-2": "f78fb3",
  "pink-3": "ff8da1",
  "pink-4": "ff748c",
  "pink-5": "f78fb3",
  "pink-6": "cf6a87",

  "yellow-1": "FFFF00",
  "yellow-2": "e6e600",
  "yellow-3": "ffea00",
  "yellow-4": "ffff33",
  "yellow-5": "f1c40f",
  "yellow-6": "ffda79",
  "yellow-7": "f5cd79",

  "green-1": "008000",
  "green-2": "006700",
  "green-3": "009a00",
  "green-4": "004d00",
  "green-5": "27ae60",
  "green-6": "2ecc71",
  "green-7": "218c74",
  "green-8": "33d9b2",
  "green-9": "316b37",

  "orange-1": "FFA500",
  "orange-2": "ff7b00",
  "orange-3": "ff9000",
  "orange-4": "ffa500",
  "orange-5": "c08b60",
  "orange-6": "d35400",
  "orange-7": "ff793f",
  "orange-8": "c26c40",

  "purple-1": "831b92",
  "purple-2": "aa23bd",
  "purple-3": "70177c",
  "purple-4": "bd27d3",
  "purple-5": "8e44ad",
  "purple-6": "9b59b6",
  "purple-8": "c44569",
  "purple-9":"443287",

}


$("html").click(function() {
  snap();
});


// Snap and start playing
function snap() {

  var colorScore = {};

  var rounds = 3;
  var completed = 0;
  var hex = null;

  for (var i = 0; i < rounds; i++) {


    // take snapshot and get image data
    Webcam.snap(function(data_uri) {

      console.log("captured");

      var image = new Image();

      image.src = data_uri;

      image.addEventListener('load', function() {

        var tcolor = colorThief.getColor(image);

        console.log(tcolor);

        hex = r2h(tcolor[0], tcolor[1], tcolor[2]);

        console.log(hex);
        console.log(colorToName(hex, color_map));


        var colorName = colorToName(hex, color_map).split('-')[0];

        if (!colorScore[colorName]) {
          colorScore[colorName] = 1;
        } else {

          colorScore[colorName] = colorScore[colorName] + 1;
        }

        completed = completed + 1

        if (completed >= rounds) {

          $('#overlay').css("display", "none");

          var color = computeScore(colorScore);
          playColorSong(color);
        }


        //
        // Vibrant.from(data_uri).getPalette(function(err, palette) {
        //
        //   console.log(palette.Vibrant.hex, colorToName(palette.Vibrant.hex, color_map), palette);
        //
        //
        //
        //
        //   var colorName = colorToName(palette.Vibrant.hex, color_map).split('-')[0];
        //
        //   if (!colorScore[colorName]) {
        //     colorScore[colorName] = 1;
        //   } else {
        //
        //     colorScore[colorName] = colorScore[colorName] + 1;
        //   }
        //
        //   completed = completed + 1
        //
        //

        //
        // });

      });





    });
  }




}


//Extract the color with the highest score
function computeScore(colorScore) {

  var highest = null;

  Object.keys(colorScore).forEach((key, index) => {


    if (highest == null) {
      highest = key
    } else {
      if (colorScore[key] > colorScore[highest]) {
        highest = colorScore[key]
      }
    }
  });


  return highest;

}

var audio = null;

// Play a song given a color
function playColorSong(color) {

  if (typeof color != 'string') {
    return true;
  }

  var path = './songs' + '/' + color.toUpperCase() + randomIntFromInterval(1, 2) + ".mp3";

  if (!audio) {
    audio = new Audio(path);
  } else {
    audio.src = path
  }

  audio.load()
  audio.play();

}



//Get a color name from a hex value
function colorToName(hex, color_map) {

  color_map = color_map || colors;
  var rgb = h2r(hex);
  var min = Infinity;
  var closest = null;

  for (var color in color_map) {
    var rgb2 = h2r(color_map[color])

    // distance formula
    var dist = Math.pow((rgb.r - rgb2.r) * .299, 2) +
      Math.pow((rgb.g - rgb2.g) * .587, 2) +
      Math.pow((rgb.b - rgb2.b) * .114, 2);

    if (dist <= min) {
      closest = color;
      min = dist;
    }
  }

  return closest;
}

// Hex to RGB
function h2r(hex) {

  hex = '#' == hex[0] ? hex.slice(1) : hex;
  if (h2rs[hex]) return h2rs[hex];
  var int = parseInt(hex, 16);
  var r = (int >> 16) & 255;
  var g = (int >> 8) & 255;
  var b = int & 255;
  return h2rs[hex] = {
    r: r,
    g: g,
    b: b
  };

}


// Hex to RGB
function r2h(r, g, b) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}


// Generate bounded random number
function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}


// Sort a key object
function getSortedKeys(obj) {
  var keys = keys = Object.keys(obj);
  return keys.sort(function(a, b) {
    return obj[b] - obj[a]
  });
}




// or simply
alert = function() {};

var capture;

var buff;
var lineNum = 20;
var linesColor = [lineNum];


var polySynth;
var linesToneTrigger = [lineNum];

var startPostion;


var cameraScreenRatio;

function setup() {

  createCanvas(window.innerWidth, window.innerHeight);

  capture = createCapture(VIDEO);
  capture.size(window.innerWidth, window.innerHeight);
  // capture.hide();
  cameraScreenRatio = window.innerWidth / window.innerHeight;

  buff = createImage(window.innerWidth, window.innerHeight);

  startPostion = 0 * cameraScreenRatio;


}


function draw() {

  background(0);

  lineColorCapture();
  pathLineDraw(0.5);
  push();
  stroke(255, 70);
  strokeWeight(1);
  pop();

  push();
  translate(0, 0);

  buffImageUpdate(capture)

  pop();

}

var buffImageUpdate = function(_capture) {

  _capture.loadPixels();
  buff.loadPixels();

  for (let y = 0; y < _capture.height; y++) {
    for (let x = 0; x < _capture.width; x++) {
      if (x < 80) {
        let i = y * _capture.width + (_capture.width - 1 - x);
        let _c = [_capture.pixels[i * 4 + 0], _capture.pixels[i * 4 + 1], _capture.pixels[i * 4 + 2], 255];
        buff.set(x, y, _c);
      }
    }
  }

  buff.updatePixels();

  return buff;
};



function lineColorCapture() {
  for (let i = 0; i < lineNum; i++) {
    let _index = (i + 0.5) * capture.height / lineNum * capture.width - 80;
    linesColor[i] = [capture.pixels[_index * 4 + 0], capture.pixels[_index * 4 + 1], capture.pixels[_index * 4 + 2], 255];
  }
}


function pathLineDraw(ratio) {

  push();
  for (let i = 0; i < linesColor.length; i++) {

    stroke(linesColor[i]);
    strokeWeight(height / lineNum * ratio);
    line(0 * cameraScreenRatio, (i + 0.5) * height / lineNum, width, (i + 0.5) * height / lineNum);
  }
  pop();

}
