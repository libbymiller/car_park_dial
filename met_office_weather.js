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

// Get key from http://www.metoffice.gov.uk/datapoint/API

var key = process.env.KEY;
var location = "310004"; // bristol - London southwark is 353605

var cmd = 'curl "http://datapoint.metoffice.gov.uk/public/data/val/wxfcs/all/json/'+location+'?res=daily&key='+key+'"';
console.log(cmd);
var minutes = 60, the_interval = minutes * 60 * 1000;
setInterval(function() {

  child = exec(cmd, function (error, stdout, stderr) {
    //sys.print('stdout: ' + stdout);
    //sys.print('stderr: ' + stderr);
    if (error !== null) {
      console.log('exec error: ' + error);
    }
    
    var j = JSON.parse(stdout);
    var data = j["SiteRep"]["DV"]["Location"]["Period"][0];
    var now = new Date();
    console.log(now.getFullYear()+" "+now.getMonth()+" "+now.getDate());
    var then = new Date(data["value"]);
    console.log(now);
    console.log(then);
    if(now.getFullYear() == then.getFullYear() && now.getMonth() == then.getMonth() && now.getDate() == then.getDate()){
      console.log("ok");
      var feels_like = data["Rep"][0]["FDm"];
      var preciptiation = data["Rep"][0]["PPd"];
      console.log("feels like "+feels_like);
      console.log("rain: "+preciptiation);
      var cold = null;
      var rain = null;
      if(parseInt(feels_like) < 10){
        cold = true;        
      }else{
        cold = false;        
      }
      console.log("is it cold? "+cold);
      if(parseInt(preciptiation) > 30){
        rain = true;        
      }else{
        rain = false;        
      }

      console.log("is it going to rain? "+rain);
      // prop is proportion of the 180 degree possibility
      // this one is discrete
      var prop =  0;
      if(rain && cold){
        prop = 0.16;
      }else if(!rain && cold){
        prop = 0.33;
      }else if(rain && !cold){
        prop = 0.66;
      }else if(!rain && !cold){
        prop = 0.82;
      }
      var steps =  ((4076/2) * prop);
      console.log(prop+" "+steps);
      serialPort.write(new Buffer('s='+steps+'\n','ascii'), function(err, results) {
          console.log('err ' + err);
          console.log('results ' + results);
      });

    }

  });
}, the_interval);
