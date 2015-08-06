var mraa = require('mraa');
var fs = require('fs');
var path = require('path');
var OLED = require('./oled');
//var oled = new EdisonOLED();
var oled = new OLED();
oled.begin(function(){
    oled.clear(0);
    //oled.display();
/*    oled.pixel(0,0, 1);
    oled.pixel(63,0, 1);
    oled.pixel(0,47, 1);
    oled.pixel(63,47, 1);*/
/*    oled.line(0, 23, 63, 23, 1, 0);
    oled.line(31, 0, 31, 47, 1, 0);*/
    //oled.line(0, 2, 63, 2, 1, 0);
    //oled.rect(5, 5, 30, 30, 1);
    oled.circleFill(31, 23, 10, 1);
    oled.display();
    
/*    fs.readFile(path.join(__dirname, '/images/Delta_seatMaintenance_24x24.bmp'), function(err, data){
        if(err) throw err;
        console.log(data);
        //oled.clear(1);
        oled.drawBitmap(data, 5, 5, 24, 24);
        oled.display();
    });*/

});

