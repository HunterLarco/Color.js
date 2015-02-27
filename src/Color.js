(function(){
	
  function Color(){
    var self = this;
	
    var color = [0,0,0];
	
    self.toHex = ToHex;
    self.toRawHex = ToRawHex;
    self.toRGB = ToRGB;
    self.toRGBArray = ToRGBArray;
    self.toRGBString = ToRGBString;
	
    self.invert = Invert;
    self.distance = DistanceTo;
	
    self.getR = GetR;
    self.getG = GetG;
    self.getB = GetB;
	
    function Invert(){
      return new Color(color.map(function(value){return 255-value;}));
    }
    function DistanceTo(color){
      return Math.sqrt(Math.pow(GetR()-color.getR(),2)+Math.pow(GetG()-color.getG(),2)+Math.pow(GetB()-color.getB(),2));
    }
	
    function GetR(){
      return color[0];
    }
    function GetG(){
      return color[1];
    }
    function GetB(){
      return color[2];
    }
	
    function ToHex(){
      return '#'+ToRawHex();
    }
    function ToRawHex(){
      return RgbToHex(GetR(), GetG(), GetB());
    }
    function ToRGB(){
      return {
        r: color[0],
        g: color[1],
        b: color[2]
      }
    }
    function ToRGBArray(){
      return color;
    }
    function ToRGBString(){
      return 'rgb('+ToRGBArray().join(',')+')';
    }
	
    var Constructor = Overload.function();
    Constructor.overload(new Function());
    Constructor.overload(function(clr){
      color = clr.slice(0,3).map(function(val){return Math.min(255, Math.max(0, Math.round(val)));});
    }, ['array']);
    Constructor.overload(function(r,g,b){
      Constructor([r,g,b]);
    }, ['number', 'number', 'number']);
    Constructor.overload(function(obj){
      Constructor(obj.r||0, obj.g||0, obj.b||0);
    }, ['object']);
    Constructor.overload(function(hex){
      Constructor(HexToRgb(hex));
    }, ['string']);
    Constructor.apply(this, arguments);
  }

  Color.random = function Random(){
    return new Color([
      Math.floor(Math.random()*256),
      Math.floor(Math.random()*256),
      Math.floor(Math.random()*256)
    ]);
  }
  Color.smartRandom = SmartRandomColor;
	
  window.Color = Color;
	
})();