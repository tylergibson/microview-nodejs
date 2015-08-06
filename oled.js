var mraa = require('mraa');
var OledFonts = require('./oledfonts');
var FONTS = new OledFonts();
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

var RST_PIN = new mraa.Gpio(48); //GPIO 15
RST_PIN.dir(mraa.DIR_OUT);
var DC_PIN = new mraa.Gpio(36); // GPIO 14
DC_PIN.dir(mraa.DIR_OUT);
var MOSI_PIN = new mraa.Spi(0); //SPI-5-MOSI GPIO 115

var HIGH = 1;
var LOW = 0;

var FONTTYPES = [FONTS.font5x7, FONTS.font8x16, FONTS.sevensegment, FONTS.fontlargenumber];
var screenbuffer = new Buffer(1024);

var screenmemory = new Buffer([
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
    this.font = FONTTYPES[0];
    this.fontWidth;
    this.fontHeight;
    this.fontStartChar;
    this.fontTotalChar;
    this.fontMapWidth;
    this.cursorX;
	this.cursorY;
    this.firstClear = true;
};
EdisonOLED.prototype.swap = function(pos){
    var t = pos.x; pos.x = pos.y; pos.y = t;
};
EdisonOLED.prototype.begin = function(callback){
    this.setFontType(0);
    this.setColor(WHITE);
    this.setDrawMode(NORM);
    this.setCursor(0, 0);

    this.spiSetup(25000);

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
EdisonOLED.prototype.write = function(c){
    if (c == '\n')
	{
		this.cursorY += this.fontHeight;
		this.cursorX  = 0;
	}
	else if (c == '\r')
	{
		// skip
	}
	else
	{
		this.drawChar(this.cursorX, this.cursorY, c, this.foreColor, this.drawMode);
		this.cursorX += this.fontWidth+1;
		if ((this.cursorX > (LCDWIDTH - this.fontWidth)))
		{
			this.cursorY += this.fontHeight;
			this.cursorX = 0;
		}
	}

	return 1;
};
EdisonOLED.prototype.print = function (c) {
    var len = c.length;

	for (var i=0; i<len; i++)
	{
		this.write(c[i]);
	}	
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
/*    if(this.firstClear){
        this.firstClear = false;
        this.spiSetup(25000);
    }*/
    
    //	unsigned char page=6, col=0x40;
	if (mode==ALL)
	{
		for (var i=0;i<8; i++)
		{
			this.setPageAddress(i);
			this.setColumnAddress(0);
            var packet = new Buffer(128);
            for(var b=0;b<packet.length;b++){
                packet[b] = 0x00;   
            }
            this.spiWrite(packet);
/*			for (var j=0; j<0x80; j++)
			{
                if(c){
                    this.data(c.charCodeAt(0));
                }else{
				    this.data(0x00);
                }
			}*/
		}
	}
	else
	{
        //the GDDRAM is 128x64 - 
        for(var i = 0; i < screenbuffer.length; i++){
            screenbuffer.writeUInt8(0x00, i);   
        }
//        for(var i = 0; i < screenmemory.length; i++){
//            screenmemory.writeUInt8(0x00, i);   
//        }
	}
};
EdisonOLED.prototype.setCursor = function (x, y) {
    this.cursorX=x;
	this.cursorY=y;
};
EdisonOLED.prototype.pixel = function (x, y, color, mode) {
    if(typeof color === 'undefined') color = this.foreColor;
    if(typeof mode === 'undefined') mode = this.drawMode;
    
    if ((x<0) ||  (x>=LCDWIDTH) || (y<0) || (y>=LCDHEIGHT))
    return;
    
    if (mode==XOR)
    {
        if (color==WHITE)
            screenbuffer[x+ Math.floor(y/8)*LCDWIDTH] ^= (1<<(y%8));
    }
    else
    {
        
        if (color==WHITE)
            screenbuffer[x+ Math.floor(y/8)*LCDWIDTH] |= (1<<(y%8));
        else
            screenbuffer[x+ Math.floor(y/8)*LCDWIDTH] &= ~(1<<(y%8));
    }
};
EdisonOLED.prototype.line = function (x0, y0, x1, y1, color, mode) {
    if(typeof color === 'undefined') color = this.foreColor;
    if(typeof mode === 'undefined') mode = this.drawMode;
    
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
    if(typeof color === 'undefined') color = this.foreColor;
    if(typeof mode === 'undefined') mode = this.drawMode;
    
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
    if(typeof color === 'undefined') color = this.foreColor;
    if(typeof mode === 'undefined') mode = this.drawMode;    
    
    for (var i=x; i<x+width;i++)
	{
		this.lineV(i,y, height, color, mode);
	}
};
EdisonOLED.prototype.circle = function (x0, y0, radius, color, mode) {
    if(typeof color === 'undefined') color = this.foreColor;
    if(typeof mode === 'undefined') mode = this.drawMode;  
    
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
    if(typeof color === 'undefined') color = this.foreColor;
    if(typeof mode === 'undefined') mode = this.drawMode;
    
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
    if(typeof color === 'undefined') color = this.foreColor;
    if(typeof mode === 'undefined') mode = this.drawMode;
    
    var rowsToDraw,row, tempC;
	var i,j,temp;
	var charPerBitmapRow,charColPositionOnBitmap,charRowPositionOnBitmap,charBitmapStartPosition;

    var charCode = c.charCodeAt(0);
	if ((charCode<this.fontStartChar) || (charCode>(this.fontStartChar+this.fontTotalChar-1)))		// no bitmap for the required c
	return;
    
    //console.log(charCode);
	tempC=charCode-this.fontStartChar;
    //console.log(tempC);

	// each row (in datasheet is call page) is 8 bits high, 16 bit high character will have 2 rows to be drawn
	rowsToDraw=this.fontHeight/8;	// 8 is LCD's page size, see SSD1306 datasheet
    //console.log('rowstodraw: ' + rowsToDraw);
	if (rowsToDraw<=1) rowsToDraw=1;

	// the following draw function can draw anywhere on the screen, but SLOW pixel by pixel draw
	if (rowsToDraw==1)
	{
        //console.log('fontWidth: ' + this.fontWidth);
		for  (i=0;i<this.fontWidth+1;i++)
		{
			if (i==this.fontWidth) // this is done in a weird way because for 5x7 font, there is no margin, this code add a margin after col 5
				temp=0;
			else
                temp=this.font.readUInt8(FONTHEADERSIZE+(tempC*this.fontWidth)+i);
            
            //console.log('temp: ' + temp);

			for (j=0;j<8;j++)
			{			
                // 8 is the LCD's page height (see datasheet for explanation)
				if (temp & 0x1)
				{
					this.pixel(x+i, y+j, color,mode);
				}
				else
				{
                    var tempColor = 0;
                    if(color == 1)
                        tempColor = 0;
                    else if(color == 0)
                        tempColor =1;
                    
					this.pixel(x+i, y+j, tempColor,mode);
				}
				
				temp >>=1;
			}
		}
		return;
	}

	// font height over 8 bit
	// take character "0" ASCII 48 as example
	charPerBitmapRow=this.fontMapWidth/this.fontWidth;  // 256/8 =32 char per row
	charColPositionOnBitmap=tempC % charPerBitmapRow;  // =16
	charRowPositionOnBitmap=Math.floor(tempC/charPerBitmapRow); // =1
	charBitmapStartPosition=(charRowPositionOnBitmap * this.fontMapWidth * (this.fontHeight/8)) + (charColPositionOnBitmap * this.fontWidth) ;

	// each row on LCD is 8 bit height (see datasheet for explanation)
	for(row=0;row<rowsToDraw;row++)
	{
		for (i=0; i<this.fontWidth;i++)
		{
			//temp=pgm_read_byte(fontsPointer[fontType]+FONTHEADERSIZE+(charBitmapStartPosition+i+(row*this.fontMapWidth)));
            temp=this.font.readUInt8(FONTHEADERSIZE+(charBitmapStartPosition+i+(row*this.fontMapWidth)));

			for (j=0;j<8;j++)
			{			
                // 8 is the LCD's page height (see datasheet for explanation)
				if (temp & 0x1)
				{
					this.pixel(x+i,y+j+(row*8), color, mode);
				}
				else
				{
                    var tempColor = 0;
                    if(color == 1)
                        tempColor = 0;
                    else if(color == 0)
                        tempColor =1;
                    
					this.pixel(x+i,y+j+(row*8), tempColor, mode);
				}
				temp >>=1;
			}
		}
	}
};
EdisonOLED.prototype.drawBitmap = function (data, x, y, width, height) {
    var pixelArrayByteOffset = data.readUInt32LE(10);
    var DIBHeader = data.readInt32LE(14);
    var width = data.readUInt32LE(18);
    var height = data.readUInt32LE(22);
    var bitsPerPixel = data.readUInt16LE(28);
    var pixelArray = data.slice(pixelArrayByteOffset);
    var currentByte = 0;
    var paddingCount = 0; //account for 32bit dword padding for rows.
    var column = 0;
    var row = 0;
    
    var rowLogBuffer1 = "";
    var rowLogBuffer2 = "";
    
    //var RowSize = [(1 * 24 + 31) / 32] * 4
    //console.log(RowSize);
    //console.log("DIBHeader: "+DIBHeader);
    //console.log("height: "+height+ ", width: "+width);
    //console.log("bitsperpixel: "+ bitsPerPixel + ", pixeloffset: "+pixelArrayByteOffset + ", pixelLength: "+pixelArray.length);
    //Assuming for now that bmp is 1 bit
    for(var i=0; i<width; i++) {
        rowLogBuffer1 += " " + i;
    }
    //console.log("    " + rowLogBuffer1);
    for(var pos=0;pos<pixelArray.length;pos++){
        //console.log(pos);
        if(bitsPerPixel == 1) {  
            currentByte = pixelArray[pos];
            //console.log("Pos: "+pos + "    -   CurrentByte: "+currentByte);
            for(var i=7; i>=0; i--) {
                //Need to check for the X bits of padding on the end of each row
                //Where X is the difference of row size - width?
                if((currentByte>>i) % 2 != 0 && paddingCount < width) {
                    rowLogBuffer2 += " * "; 
                    //console.log("Column: " +column + "  -  Row: " +row);
                    //console.log("BIT BLIT");
                    this.pixel(x + column, y + row, 1, 0);
                } else {
                    rowLogBuffer2 += "   ";
                }
                column++;
                paddingCount++;
            }
            if(paddingCount >= 31) {
                //bitmaps pad rows in 32bit dwords, so we need to track for padding independent of columns.
                //console.log(rowLogBuffer2 + " Row: " + row);
                rowLogBuffer2 = "";
                row++;
                paddingCount = 0;
                column = 0;
            }
        }
        if(bitsPerPixel == 24) {    
            var r = data[pos];
            var g = data[pos + 1];
            var b = data[pos + 2];
            if(r > 0x00 || g > 0x00 || b > 0x00){
                var px = x + col;
                var py = y + row;
                //console.log('x: ' + px + ' | y: ' + py);
                this.pixel(px, py, 1, 0);
            }
        }
    }
};
EdisonOLED.prototype.getLCDWidth = function () {
    return LCDWIDTH;
};
EdisonOLED.prototype.getLCDHeight = function () {
    return LCDHEIGHT;
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
        // write the whole page buffer
        this.setPageAddress(i);
        this.setColumnAddress(0);
        var start = i*64;
        var end = start + 64;
        //console.log('start: ' + start + '| end: ' +end);
        var packet = new Buffer(128);
        screenbuffer.copy(packet, 0, start, end);
        this.spiWrite(packet);
    }
};
// Font functions
EdisonOLED.prototype.setFontType = function (type) {
    if(type >= FONTTYPES.length || type < 0) throw new Error("invalid font type");
    
    this.fontType = type;
    this.font = FONTTYPES[type];
    this.fontWidth = this.font.readUInt8(0);
    this.fontHeight = this.font.readUInt8(1);
    this.fontStartChar = this.font.readUInt8(2);
    this.fontTotalChar = this.font.readUInt8(3);
    this.fontMapWidth = (this.font.readUInt8(4) * 100) + this.font.readUInt8(5);
};
EdisonOLED.prototype.spiSetup = function (freq) {
    MOSI_PIN.mode(0);
    //MOSI_PIN.frequency(10000000);
    MOSI_PIN.frequency(freq); // reduce the clock speed work around an Intel kernel issue
};
EdisonOLED.prototype.spiTransfer = function (data) {
    MOSI_PIN.writeByte(data);
};
EdisonOLED.prototype.spiWrite = function (data) {
    //console.log('spiWrite - length: ' + data.length);
    DC_PIN.write(HIGH);
    MOSI_PIN.write(new Buffer(data));
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
