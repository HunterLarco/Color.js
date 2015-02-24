(function(){
	
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
	
	window.SmartRandomColor = SmartRandomColor;
	
})();