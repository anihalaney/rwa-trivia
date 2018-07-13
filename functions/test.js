var admin = require("firebase-admin");

var serviceAccount = require("./config/rwa-trivia-dev-e57fc-firebase-adminsdk-ksltx-ccd27f44a3.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "gs://rwa-trivia-dev-e57fc.appspot.com"
});

var bucket = admin.storage().bucket();

const fileName = 'social_share/9K3sL9eHEZYXFZ68oRrW7a6wUmV2/score_images/1528119085610'
const file = bucket.file(fileName);

// const gcs = require('@google-cloud/storage')({ keyFilename: './config/rwa-trivia-dev-e57fc-firebase-adminsdk-ksltx-ccd27f44a3.json' });
// // ...
// const bucket = gcs.bucket('rwa-trivia-dev-e57fc');
// const fileName = 'social_share/9K3sL9eHEZYXFZ68oRrW7a6wUmV2/score_images/1528119085610/'
// const file = bucket.file(fileName);

const fs = require('fs');
const request = require('request');

return file.getSignedUrl({
    action: 'read',
    expires: '03-09-2491'
}).then(signedUrls => {
    // signedUrls[0] contains the file's public URL
    console.log(signedUrls);

    var download = function(uri, filename, callback){
        request.head(uri, function(err, res, body){    
          request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
        });
      };
      
      download(signedUrls[0], './images/google.jpg', function(){
        console.log('done');
      });


    // download('https://www.google.com/images/srpr/logo3w.png', './images/google.png', function () {
    //     console.log('done');
    // });

   
    // downalod((uri, filename, callback) => {
    //     request.head(uri, function (err, res, body) {
    //         request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
    //     });
    // });

});



//  // download('https://www.google.com/images/srpr/logo3w.png', './images/google.png', function () {
//     //     console.log('done');
//     // });



// // var download = function (uri, filename, callback) {
// //     request.head(uri, function (err, res, body) {
// //         request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
// //     });
// // };