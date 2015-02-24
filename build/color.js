/* Color.js 1.0.0
 * -----------------
 *
 * (c) 2015 Hunter Larco <larcolabs.com>
 * Color.js may be freely distributed under the MIT license.
 * For all details and documentation:
 * <https://github.com/HunterLarco/Color.js>
*/

(function(){
	
	var util = {};
	
	(function Hex(){
		function HexToRgb(hex) {
			var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
			hex = hex.replace(shorthandRegex, function(m, r, g, b) {
				return r + r + g + g + b + b;
			});

			var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
			return result ? {
				r: parseInt(result[1], 16),
				g: parseInt(result[2], 16),
				b: parseInt(result[3], 16)
			} : null;
		}

		function RgbToHex(r, g, b){
			return ''+((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
		}
	
		util.Hex = {
			HexToRgb: HexToRgb,
			RgbToHex: RgbToHex
		}
	})();
	(function Overload(){
		
		var Overload = new Object();
		Overload.function = function(){
			var funct = function(){return funct['__overload__'].apply(funct, arguments)};
			funct.overload = AddMethod.bind(funct);
			return funct;
		};
	
		function AddMethod(funct, types){
			if(GetType(types) != 'array') types = [];
		
			for(var i=types.length; i<funct.length; i++) types.push('*');
			var old = this['__overload__'];
		
			this['__overload__'] = function(){
				if (funct.length == arguments.length && MatchesTypes(arguments, types)) return funct.apply(this, arguments);
				else if (typeof old == 'function') return old.apply(this, arguments);
			};
		}
	
		function MatchesTypes(arguments, types){
			for(var i=0; i<arguments.length; i++){
				var arg = arguments[i],
						type = types[i];
				if(type == '*') continue;
				if(GetType(arg) != type) return false;
			}
			return true;
		}
		function GetType(variable){
			if(typeof variable != 'object') return typeof variable;
			else if(variable.constructor == Array) return 'array';
			else return 'object';
		}
	
		util.Overload = Overload;
		
	})();
	
	var root = {};
	
	(function SmartRandom(){
	
		var used_colors = [];
		function ColorDistance(c1, c2){
			return Math.sqrt(Math.pow(c1[0]-c2[0],2)+Math.pow(c1[1]-c2[1],2)+Math.pow(c1[2]-c2[2],2));
		}
		function ColorIsUsed(color, constant){
			for(var i=0,used; used=used_colors[i++];)
				if(ColorDistance(used, color) < constant) return true;
			return false;
		}
		function IsGray(color, constant){
			return ColorDistance([color[0], color[0], color[1]], [color[1], color[2], color[2]]) < constant;
		}


		var gray_constant = 50,
				diff_constant = 180;
		function SmartRandomColor(){
			var point = FindPoint(0, 0, 0, 255, 255, 255, function(x, y, z){
				return IsGray([x, y, z], gray_constant) || ColorIsUsed([x, y, z], diff_constant);
			});
			if(!point){
				gray_constant *= 0.9;
				diff_constant *= 0.75;
				default_grid_size = 0.125;
				return SmartRandomColor();
			}
			var color = [point.x, point.y, point.z];
			used_colors.push(color);
			return new Color(color);
		}


		var default_grid_size = 0.125;
		function FindPoint(x, y, z, width, height, depth, Intersects){
			// grid_size is a percent of the width and height
			function CompletelyFilled(x, y, z, width, height, depth, grid_size){
				for(var _x=x; _x<=x+width; _x+=width*grid_size)
					for(var _y=y; _y<=y+height; _y+=height*grid_size)
						for(var _z=z; _z<=z+depth; _z+=depth*grid_size)
							if(!Intersects(_x, _y, _z))
								return false;
				return true;
			}
			function CompletelyEmpty(x, y, z, width, height, depth, grid_size){
				for(var _x=x; _x<=x+width; _x+=width*grid_size)
					for(var _y=y; _y<=y+height; _y+=height*grid_size)
						for(var _z=z; _z<=z+depth; _z+=depth*grid_size)
							if(Intersects(_x, _y, _z))
								return false;
				return true;
			}
			function GeneratePoint(x, y, z, width, height, depth, grid_size){
				for(var _x=x; _x<=x+width; _x+=width*grid_size)
					for(var _y=y; _y<=y+height; _y+=height*grid_size)
						for(var _z=z; _z<=z+depth; _z+=depth*grid_size)
							if(!Intersects(_x, _y))
								return {x:_x, y:_y, z:_z};
				return GeneratePoint(x, y, z, width, height, depth, grid_size/2);
			}
			function dive(x, y, z, width, height, depth, intersection_accuracy){
			    if(CompletelyFilled(x, y, z, width, height, depth, intersection_accuracy)) return;
			    if(CompletelyEmpty(x, y, z, width, height, depth, intersection_accuracy))
						return GeneratePoint(x, y, z, width, height, depth, intersection_accuracy);
			    if(width < 1 || height < 1 || depth < 1) return {x:x, y:y, z:z};
  
			    var functs = [
			        function(){return dive(x,         y,          z,         width/2, height/2, height/2, intersection_accuracy);},
			        function(){return dive(x+width/2, y,          z,         width/2, height/2, height/2, intersection_accuracy);},
			        function(){return dive(x,         y+height/2, z,         width/2, height/2, height/2, intersection_accuracy);},
			        function(){return dive(x+width/2, y+height/2, z,         width/2, height/2, height/2, intersection_accuracy);},
			        function(){return dive(x,         y,          z+depth/2, width/2, height/2, height/2, intersection_accuracy);},
			        function(){return dive(x+width/2, y,          z+depth/2, width/2, height/2, height/2, intersection_accuracy);},
			        function(){return dive(x,         y+height/2, z+depth/2, width/2, height/2, height/2, intersection_accuracy);},
			        function(){return dive(x+width/2, y+height/2, z+depth/2, width/2, height/2, height/2, intersection_accuracy);}
			    ];
  
			    while(functs.length > 0){
			        var funct = functs.splice(Math.floor(Math.random()*functs.length), 1)[0],
									response = funct();
			        if(!!response) return response;
			    }
  
			    return;
			}
			function controller(){
				if(default_grid_size*width < 1 || default_grid_size*height < 1 || default_grid_size*depth < 1) return;
				var response = dive(x, y, z, width, height, depth, default_grid_size);
				if(!!response) return response;
				default_grid_size /= 4;
				return controller();
			}

			return controller();
		}
	
		root.SmartRandomColor = SmartRandomColor;
	
	})();
	(function Color(){
	
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
		    return util.Hex.RgbToHex(GetR(), GetG(), GetB());
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
	
			var Constructor = util.Overload.function();
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
				Constructor(util.Hex.HexToRgb(hex));
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
		Color.smartRandom = root.SmartRandomColor;
	
		root.Color = Color;
	
	})();
	
	window.Color = root.Color;
	
})();