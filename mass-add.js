// This code By @Suissa on github. Me just Recode for make mass add wm

var ffmpeg = require('ffmpeg');
var fs = require('fs');
var path = require('path');
var readlineSync = require('readline-sync');

// Dapatkan lokasi input folder dan output folder dari pengguna
var inputFolder = readlineSync.question('Masukkan lokasi input folder: ');
var outputFolder = readlineSync.question('Masukkan lokasi output folder: ');
var watermarkPath = 'wm-white.png';

// Pastikan folder output sudah ada, jika belum, buat folder tersebut
if (!fs.existsSync(outputFolder)) {
  fs.mkdirSync(outputFolder);
}

fs.readdir(inputFolder, function(err, files) {
  if (err) {
    console.log('Error reading input folder:', err);
    return;
  }

  files.forEach(function(file) {
    var inputPath = path.join(inputFolder, file);
    var outputPath = path.join(outputFolder, file.replace(/\.[^/.]+$/, '_watermarked.mp4'));

    try {
      var process = new ffmpeg(inputPath);
      process.then(
        function (video) {
          console.log('Video ' + file + ' sedang di Proses');

          var settings = {
            position: "C", // Position: NE NC NW SE SC SW C CE CW
            margin_nord: null, // Margin nord
            margin_sud: null, // Margin sud
            margin_east: null, // Margin east
            margin_west: null, // Margin west
          };

          var callback = function (error, files) {
            if (error) {
              console.log('ERROR: ', error);
            } else {
              console.log('Sukses menambahkan Watermark', files);
            }
          };

          // add watermark
          video.fnAddWatermark(watermarkPath, outputPath, settings, callback);
        },
        function (err) {
          console.log('Error processing video ' + file + ': ' + err);
        }
      );
    } catch (e) {
      console.log('Error processing video ' + file + ': ' + e.code);
      console.log(e.msg);
    }
  });
});