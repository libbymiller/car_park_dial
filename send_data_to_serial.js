// http://nodejs.org/api.html#_child_processes
var sleep = require('sleep');
var sys = require('sys')
var exec = require('child_process').exec;
var SerialPort = require("serialport").SerialPort;
var port = "/dev/cu.wchusbserial1410"; //for mac
//var port = "/dev/ttyUSB0"; // for pi
var serialPort = new SerialPort(port, {
  baudrate: 57600
});

serialPort.on("open", function () {
  console.log('open');

  serialPort.on('data', function(data) {
    console.log('data received: ' + data);
  });

});

var child;

// Get key from https://portal-bristol.api.urbanthings.io/
// This part of the api is rate limited to 1400 requests a day, slightly less than one a minute.
// Using curl because I'm lazy...

var key = process.env.KEY;

var cmd = "curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' --header 'X-Api-Key: "+key+"' -d '[\"UK_BRIS_CP:BRIS-C91221\",\"UK_BRIS_CP:BRIS-C00011\"]' 'https://bristol.api.urbanthings.io/api/2.0/rti/resources/status'";

// Just two since I can only display two on one arduino - the total for Bristol is 4 - https://opendata.bristol.gov.uk/Mobility/Car-Park-Occupancy/a427-ptgs
// var cmd = "curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' --header 'X-Api-Key: xxxxxx' -d'[\"UK_BRIS_CP:BRIS-C00001\",\"UK_BRIS_CP:BRIS-C91221\",\"UK_BRIS_CP:BRIS-C00011\",\"UK_BRIS_CP:BRIS-C00012\"]' 'https://bristol.api.urbanthings.io/api/2.0/rti/resources/status'";

var minutes = 1, the_interval = minutes * 60 * 1000;
setInterval(function() {

  child = exec(cmd, function (error, stdout, stderr) {
  //  sys.print('stdout: ' + stdout);
  //  sys.print('stderr: ' + stderr);
    if (error !== null) {
      console.log('exec error: ' + error);
    }
    var j = JSON.parse(stdout);
    console.log(j["data"]);
    if(j["data"]){
     var c = j["data"].length
     for(var i = 0; i < c; i++){
      var code = j.data[i].primaryCode;
      var availablePlaces = parseInt((j.data[i].availablePlaces));
      var takenPlaces = parseInt(j.data[i].takenPlaces);
      // proportion in use
      var prop = availablePlaces/(availablePlaces+takenPlaces);
      // these motors come in two different gear rations, 
      // see http://42bots.com/tutorials/28byj-48-stepper-motor-with-uln2003-driver-and-arduino-uno/ 
      // and http://forum.arduino.cc/index.php?topic=71964.15
      var steps =  ((4076/2) * prop);
      console.log(prop+" "+steps);
      console.log("code is "+code);

      if(code == "UK_BRIS_CP:BRIS-C00011"){
        console.log("code is cabot "+code);
        serialPort.write(new Buffer('s='+steps+'\n','ascii'), function(err, results) {
          console.log('err ' + err);
          console.log('results ' + results);
        });
      }
      if(code == "UK_BRIS_CP:BRIS-C91221"){
        console.log("code is galleries "+code);
        sleep.sleep(5);
        serialPort.write(new Buffer('t='+steps+'\n','ascii'), function(err, results) {
          console.log('err ' + err);
          console.log('results ' + results);
        });
      }

     }
    }
  });
}, the_interval);
