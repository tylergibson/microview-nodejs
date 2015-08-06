var mraa = require('mraa');
var OledFonts = require('./oledfonts');
var fonts = new OledFonts();
var BLACK = 0;
var WHITE = 1;
var LCDWIDTH = 64;
var LCDHEIGHT = 48;
var FONTHEADERSIZE = 6;
var NORM = 0;
var XOR = 1;
var PAGE = 0;
var ALL = 1;
var SETCONTRAST = 0x81;
var DISPLAYALLONRESUME = 0xA4;
var DISPLAYALLON = 0xA5;
var NORMALDISPLAY = 0xA6;
var INVERTDISPLAY = 0xA7;
var DISPLAYOFF = 0xAE;
var DISPLAYON = 0xAF;
var SETDISPLAYOFFSET = 0xD3;
var SETCOMPINS = 0xDA;
var SETVCOMDESELECT = 0xDB;
var SETDISPLAYCLOCKDIV = 0xD5;
var SETPRECHARGE = 0xD9;
var SETMULTIPLEX = 0xA8;
var SETLOWCOLUMN = 0x00;
var SETHIGHCOLUMN = 0x10;
var SETSTARTLINE = 0x40;
var MEMORYMODE = 0x20;
var COMSCANINC = 0xC0;
var COMSCANDEC = 0xC8;
var SEGREMAP = 0xA0;
var CHARGEPUMP = 0x8D;
var EXTERNALVCC = 0x01;
var SWITCHCAPVCC = 0x02;

var CS_PIN = new mraa.Spi(9); //SPI-5-CS1 GPIO 111
//CS_PIN(mraa.DIR_OUT);
var RST_PIN = new mraa.Gpio(48); //GPIO 15
RST_PIN.dir(mraa.DIR_OUT);
var DC_PIN = new mraa.Gpio(36); // GPIO 14
DC_PIN.dir(mraa.DIR_OUT);
var SCLK_PIN = new mraa.Spi(10); //SPI-5-SCK GPIO 109
var MOSI_PIN = new mraa.Spi(11); //SPI-5-MOSI GPIO 115

var HIGH = 1;
var LOW = 0;

var screenmemory = new Uint8Array([
    // ROW0, unsigned char0 to unsigned char63
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xE0, 0xF8, 0xFC, 0xFE, 0xFF, 0xFF, 0xFF, 0xFF,
	0xFF, 0xFF, 0xFF, 0x0F, 0x07, 0x07, 0x06, 0x06, 0x00, 0x80, 0x80, 0x00, 0x00, 0x00, 0x00, 0x00,
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,

	// ROW1, unsigned char64 to unsigned char127
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
	0x00, 0x00, 0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x81, 0x07, 0x0F, 0x3F, 0x3F, 0xFF, 0xFF, 0xFF,
	0xFF, 0xFF, 0xFF, 0xFF, 0xFE, 0xFE, 0xFC, 0xFC, 0xFC, 0xFE, 0xFF, 0xFF, 0xFF, 0xFC, 0xF8, 0xE0,
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,

	// ROW2, unsigned char128 to unsigned char191
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xFC,
	0xFE, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xF1, 0xE0, 0xE0, 0xE0, 0xE0, 0xE0, 0xF0, 0xFD, 0xFF,
	0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF,
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,

	// ROW3, unsigned char192 to unsigned char255
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xFF,
	0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF,
	0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0x7F, 0x3F, 0x1F, 0x07, 0x01,
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,

	// ROW4, unsigned char256 to unsigned char319
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xFF,
	0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0x7F, 0x3F, 0x1F, 0x1F, 0x0F, 0x0F, 0x0F, 0x0F,
	0x0F, 0x0F, 0x0F, 0x0F, 0x07, 0x07, 0x07, 0x03, 0x03, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,

	// ROW5, unsigned char320 to unsigned char383
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xFF,
	0x7F, 0x3F, 0x1F, 0x0F, 0x07, 0x03, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]);

var EdisonOLED = function(){
    this.drawMode = NORM;
    this.foreColor = WHITE;
    this.fontType = 0;
};
EdisonOLED.prototype.swap = function(pos){
    var t = pos.x; pos.x = pos.y; pos.y = t;
};
EdisonOLED.prototype.begin = function(callback){
    this.setFontType(0);
    this.setColor(WHITE);
    this.setDrawMode(NORM);
    this.setCursor(0, 0);

    this.spiSetup();

    var _this = this;
    RST_PIN.write(HIGH);
    setTimeout(function(){
        RST_PIN.write(LOW);
        setTimeout(function(){
            RST_PIN.write(HIGH);
            // Init sequence for 64x48 OLED module
        	_this.command(DISPLAYOFF);			// 0xAE

        	_this.command(SETDISPLAYCLOCKDIV);	// 0xD5
        	_this.command(0x80);					// the suggested ratio 0x80

        	_this.command(SETMULTIPLEX);			// 0xA8
        	_this.command(0x2F);

            _this.command(SETDISPLAYOFFSET);		// 0xD3
            _this.command(0x0);					// no offset

            _this.command(SETSTARTLINE | 0x0);	// line #0

            _this.command(CHARGEPUMP);			// enable charge pump
            _this.command(0x14);

            _this.command(NORMALDISPLAY);			// 0xA6
            _this.command(DISPLAYALLONRESUME);	// 0xA4

            _this.command(SEGREMAP | 0x1);
            _this.command(COMSCANDEC);

            _this.command(SETCOMPINS);			// 0xDA
            _this.command(0x12);

            _this.command(SETCONTRAST);			// 0x81
            _this.command(0x8F);

            _this.command(SETPRECHARGE);			// 0xd9
            _this.command(0xF1);

            _this.command(SETVCOMDESELECT);			// 0xDB
            _this.command(0x40);

            _this.command(DISPLAYON);				//--turn on oled panel
            _this.clear(ALL);						// Erase hardware memory inside the OLED
            
            if(callback)
                callback();
        }, 10);
    }, 5);
};
EdisonOLED.prototype.contrast = function(contrast){
  	this.command(SETCONTRAST);			// 0x81
	this.command(contrast);  
};
EdisonOLED.prototype.write = function (char) {

};
EdisonOLED.prototype.print = function (c) {
    // body...
};
// raw LCD functions
EdisonOLED.prototype.command = function (c) {
    DC_PIN.write(LOW);
    this.spiTransfer(c);
};
EdisonOLED.prototype.data = function (c) {
    DC_PIN.write(HIGH);
    this.spiTransfer(c);
};
EdisonOLED.prototype.setColumnAddress = function (add) {
    this.command((0x10|(add>>4))+0x02);
    this.command((0x0f&add));
    return;
};
EdisonOLED.prototype.setPageAddress = function (add) {
    add=0xb0|add;
    this.command(add);
    return;
};
// LCD draw functions
EdisonOLED.prototype.clear = function (mode, c) {
    //	unsigned char page=6, col=0x40;
	if (mode==ALL)
	{
		for (var i=0;i<8; i++)
		{
			this.setPageAddress(i);
			this.setColumnAddress(0);
			for (var j=0; j<0x80; j++)
			{
                if(c){
                    this.data(c);
                }else{
				    this.data(0);
                }
			}
		}
	}
	else
	{
		//memset(screenmemory,0,384);			// (64 x 48) / 8 = 384
        for(var i = 0; i < screenmemory.length; i++){
            screenmemory[i] = 0;   
        }
        //this.spiWrite(screenmemory);
	}
};
EdisonOLED.prototype.setCursor = function (x, y) {
    cursorX=x;
	cursorY=y;
};
EdisonOLED.prototype.pixel = function (x, y, color, mode) {
    color = this.foreColor|color;
    mode = this.drawMode|mode;
    
    if ((x<0) ||  (x>=LCDWIDTH) || (y<0) || (y>=LCDHEIGHT))
    return;
    
    if (mode==XOR)
    {
        if (color==WHITE)
            screenmemory[x+ Math.floor(y/8)*LCDWIDTH] ^= (1<<(y%8));
    }
    else
    {
        
        if (color==WHITE)
            screenmemory[x+ Math.floor(y/8)*LCDWIDTH] |= (1<<(y%8));
        else
            screenmemory[x+ Math.floor(y/8)*LCDWIDTH] &= ~(1<<(y%8));
    }
};
EdisonOLED.prototype.line = function (x0, y0, x1, y1, color, mode) {
    color = this.foreColor|color;
    mode = this.drawMode|mode;
    
    var steep = Math.abs(y1 - y0) > Math.abs(x1 - x0);
    var pos = {x:x0, y:y0};
    var pos2 = {x:x1, y:y1};
    if (steep)
    {
        this.swap(pos);
        x0 = pos.x;
        y0 = pos.y;
        this.swap(pos2);
        x1 = pos2.x;
        y1 = pos2.y;
    }

    if (x0 > x1)
    {
        var pos3 = {x:x0, y:x1};
        this.swap(pos3);
        x0 = pos3.x;
        x1 = pos3.y;
        
        var pos4 = {x:y0,y:y1};
        this.swap(pos4);
        y0 = pos4.x;
        y1 = pos4.y;
    }

    var dx, dy;
    dx = x1 - x0;
    dy = Math.abs(y1 - y0);

    var err = dx / 2;
    var ystep;

    if (y0 < y1)
    {
        ystep = 1;
    }
    else
    {
        ystep = -1;
    }

    for (; x0<x1; x0++)
    {
        if (steep)
        {
            this.pixel(y0, x0, color, mode);
        } else
        {
            this.pixel(x0, y0, color, mode);
        }
        err -= dy;
        if (err < 0)
        {
            y0 += ystep;
            err += dx;
        }
    }
};
EdisonOLED.prototype.lineH = function (x, y, width, color, mode) {
    this.line(x,y,x+width,y,color,mode);
};
EdisonOLED.prototype.lineV = function (x, y, height, color, mode) {
    this.line(x,y,x,y+height,color,mode);
};
EdisonOLED.prototype.rect = function (x, y, height, width, color, mode) {
    color = this.foreColor|color;
    mode = this.drawMode|mode;
    
    var tempHeight;

	this.lineH(x,y, width, color, mode);
	this.lineH(x,y+height-1, width, color, mode);

	tempHeight=height-2;

	// skip drawing vertical lines to avoid overlapping of pixel that will
	// affect XOR plot if no pixel in between horizontal lines
	if (tempHeight<1)
		return;

	this.lineV(x,y+1, tempHeight, color, mode);
	this.lineV(x+width-1, y+1, tempHeight, color, mode);
};
EdisonOLED.prototype.rectFill = function (x, y, height, width, color, mode) {
    for (var i=x; i<x+width;i++)
	{
		this.lineV(i,y, height, color, mode);
	}
};
EdisonOLED.prototype.circle = function (x0, y0, radius, color, mode) {
    color = this.foreColor|color;
    mode = this.drawMode|mode;
    
    var f = 1 - radius;
	var ddF_x = 1;
	var ddF_y = -2 * radius;
	var x = 0;
	var y = radius;

	this.pixel(x0, y0+radius, color, mode);
	this.pixel(x0, y0-radius, color, mode);
	this.pixel(x0+radius, y0, color, mode);
	this.pixel(x0-radius, y0, color, mode);

	while (x<y)
	{
		if (f >= 0)
		{
			y--;
			ddF_y += 2;
			f += ddF_y;
		}
		x++;
		ddF_x += 2;
		f += ddF_x;

		this.pixel(x0 + x, y0 + y, color, mode);
		this.pixel(x0 - x, y0 + y, color, mode);
		this.pixel(x0 + x, y0 - y, color, mode);
		this.pixel(x0 - x, y0 - y, color, mode);

		this.pixel(x0 + y, y0 + x, color, mode);
		this.pixel(x0 - y, y0 + x, color, mode);
		this.pixel(x0 + y, y0 - x, color, mode);
		this.pixel(x0 - y, y0 - x, color, mode);

	}
};
EdisonOLED.prototype.circleFill = function (x0, y0, radius, color, mode) {
    var f = 1 - radius;
	var ddF_x = 1;
	var ddF_y = -2 * radius;
	var x = 0;
	var y = radius;

	// Temporary disable fill circle for XOR mode.
	if (mode==XOR) return;

	for (var i=y0-radius; i<=y0+radius; i++)
	{
		this.pixel(x0, i, color, mode);
	}

	while (x<y)
	{
		if (f >= 0)
		{
			y--;
			ddF_y += 2;
			f += ddF_y;
		}
		x++;
		ddF_x += 2;
		f += ddF_x;

		for (var i=y0-y; i<=y0+y; i++)
		{
			this.pixel(x0+x, i, color, mode);
			this.pixel(x0-x, i, color, mode);
		}
		for (var i=y0-x; i<=y0+x; i++)
		{
			this.pixel(x0+y, i, color, mode);
			this.pixel(x0-y, i, color, mode);
		}
	}
};
EdisonOLED.prototype.drawChar = function (x, y, c, color, mode) {
    // body...
};
EdisonOLED.prototype.drawBitmap = function (data, x, y, width, height) {
    var byteOffset = 14;
    var pos = 0;
    var stride = width; // assuming an 8-bit rgb format
    //var RowSize = [(1 * 24 + 31) / 32] * 4
    //console.log(RowSize);
    for(var row=0;row<height;row++){
        for(var col=0;col<width;col++){
            pos = (col*stride)+(row*3) + byteOffset;
            //console.log(pos);
            var r = data[pos];
            var g = data[pos + 1];
            var b = data[pos + 2];
            if(r > 0x00 || g > 0x00 || b > 0x00){
                var px = x + col;
                var py = y + row;
                //console.log('x: ' + px + ' | y: ' + py);
                this.pixel(px, py, 1, 0);
            }
/*            pos = (col*stride)+(row);
            var bit = data[row*col];
            console.log(bit);*/
        }
    }
};
EdisonOLED.prototype.getLCDWidth = function () {
    // body...
};
EdisonOLED.prototype.getLCDHeight = function () {
    // body...
};
EdisonOLED.prototype.setColor = function (color) {
    this.foreColor = color;
};
EdisonOLED.prototype.setDrawMode = function (mode) {
    this.drawMode = mode;
};
EdisonOLED.prototype.display = function (mode) {
    var i, j;

    for (i=0; i<6; i++)
    {
        this.setPageAddress(i);
        this.setColumnAddress(0);
        for (j=0;j<0x40;j++)
        {
            this.data(screenmemory[i*0x40+j]);
        }
    }
};
// Font functions
EdisonOLED.prototype.setFontType = function (type) {
    this.fontType = type;
};
EdisonOLED.prototype.spiSetup = function () {
    CS_PIN.mode(0);
    CS_PIN.frequency(10000000);
    CS_PIN.writeByte(HIGH);
    SCLK_PIN.mode(0);
    SCLK_PIN.frequency(10000000);
    MOSI_PIN.mode(0);
    MOSI_PIN.frequency(10000000);
};
EdisonOLED.prototype.spiTransfer = function (data) {
    CS_PIN.writeByte(data);
};
EdisonOLED.prototype.spiWrite = function (data) {
    console.log('spiWrite - length: ' + data.length);
    //DC_PIN.write(HIGH);
    CS_PIN.write(new Buffer(data));
};
var CMD;
(function (CMD) {
    CMD[CMD["CMD_CLEAR"] = 0] = "CMD_CLEAR";
    CMD[CMD["CMD_INVERT"] = 1] = "CMD_INVERT";
    CMD[CMD["CMD_CONTRAST"] = 2] = "CMD_CONTRAST";
    CMD[CMD["CMD_DISPLAY"] = 3] = "CMD_DISPLAY";
    CMD[CMD["CMD_SETCURSOR"] = 4] = "CMD_SETCURSOR";
    CMD[CMD["CMD_PIXEL"] = 5] = "CMD_PIXEL";
    CMD[CMD["CMD_LINE"] = 6] = "CMD_LINE";
    CMD[CMD["CMD_LINEH"] = 7] = "CMD_LINEH";
    CMD[CMD["CMD_LINEV"] = 8] = "CMD_LINEV";
    CMD[CMD["CMD_RECT"] = 9] = "CMD_RECT";
    CMD[CMD["CMD_RECTFILL"] = 10] = "CMD_RECTFILL";
    CMD[CMD["CMD_CIRCLE"] = 11] = "CMD_CIRCLE";
    CMD[CMD["CMD_CIRCLEFILL"] = 12] = "CMD_CIRCLEFILL";
    CMD[CMD["CMD_DRAWCHAR"] = 13] = "CMD_DRAWCHAR";
    CMD[CMD["CMD_DRAWBITMAP"] = 14] = "CMD_DRAWBITMAP";
    CMD[CMD["CMD_GETLCDWIDTH"] = 15] = "CMD_GETLCDWIDTH";
    CMD[CMD["CMD_GETLCDHEIGHT"] = 16] = "CMD_GETLCDHEIGHT";
    CMD[CMD["CMD_SETCOLOR"] = 17] = "CMD_SETCOLOR";
    CMD[CMD["CMD_SETDRAWMODE"] = 18] = "CMD_SETDRAWMODE";
})(CMD || (CMD = {}));

module.exports = EdisonOLED;
