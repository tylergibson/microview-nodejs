var mraa = require('mraa');
console.log("mraa version: " + mraa.getVersion());

var fs = require('fs');
var path = require('path');
var OLED = require('./oled');
//var oled = new EdisonOLED();
var oled = new OLED();
oled.begin(function(){
    oled.clear(0); // 0 clears the screen buffer, 1 clears the screen hardware
    //oled.display();
/*    oled.pixel(0,0, 1);
    oled.pixel(63,0, 1);
    oled.pixel(0,47, 1);
    oled.pixel(63,47, 1);*/
/*    oled.line(0, 23, 63, 23, 1, 0);
    oled.line(31, 0, 31, 47, 1, 0);*/
    //oled.line(0, 2, 63, 2, 1, 0);
/*    oled.rectFill(5, 5, 15, 15, 1, 1);
    oled.rectFill(22, 5, 15, 15, 1);
    oled.rectFill(5, 22, 15, 15, 1);
    oled.rectFill(22, 22, 15, 15, 1);*/
    //oled.circleFill(31, 23, 10, 1);
    //oled.print('1');
    //oled.display();
    //oled.clear(0);
    oled.setFontType(0);
    oled.setCursor(0,0);
    //oled.print('2');
/*    oled.write('1');
    oled.write('2');
    oled.write('3');
    oled.display();*/
    
    fs.readFile(path.join(__dirname, '/images/sample.bmp'), function(err, data){
        if(err) throw err;
        //console.log(data);
        for(var i=0; i<15; i++) {
            oled.clear(0);
            oled.setCursor(0,0)
            oled.print((i + 1).toString());
            oled.drawBitmap(data, i, i);      
            oled.display();
        }
    });

});

