// namespace
var cgts = cgts || {};

(function($) {

	cgts.resizeTimeout = null;
	cgts.resizeThrottle = 250;
	cgts.defaultOptions = {
		regenOnWinResize	: true,
		canvasClassName	: 'cgtsCanvas',
		bgColor			: 'white',
		minRadius		: 30,
		maxRadius		: 48,
		minRectSide		: 60,
		maxRectSide		: 150,
		rMin			: 0,
		rMax			: 255,
		gMin			: 0,
		gMax			: 255,
		bMin			: 0,
		bMax			: 255,
		aMin			: 0.2,
		aMax			: 1,
		spacing			: 80,
		jitter			: 8
	};
	cgts.randomColor = function(rMin, rMax, gMin, gMax, bMin, bMax, aMin, aMax) {
		return 'rgba(' +
			(Math.floor(Math.random()*rMax) + rMin) +
			',' +
			(Math.floor(Math.random()*gMax) + gMin) + 
			',' + 
			(Math.floor(Math.random()*bMax) + bMin) + 
			',' + 
			Math.floor(Math.random() * ((aMax*10) - (aMin*10)) + (aMin * 10)) / 10 +
			')';
	};
	cgts.randomAngle = function() {
		return Math.floor(Math.random()*360);
	};
	cgts.randomRadius = function(minRadius, maxRadius){
		return (Math.floor(Math.random()*minRadius) + maxRadius);
	},
	cgts.jitterPoint =	function(point, jitter){
		var jittered = point + cgts.posNeg(Math.ceil(Math.random()* jitter)-1);
		return jittered;
	}
	cgts.posNeg = function(num) {
		if (num == undefined) num = 1;
		var gen = (Math.floor(Math.random()*5)) + 1;
		return ((gen % 2 == 0) ? 1 : -1) * num;
	},
	cgts.drawCircle = function(ctx, jx, jy, r){
		ctx.beginPath();
		ctx.arc(jx, jy, r, 0, 2*Math.PI, true)
		ctx.closePath();
		ctx.fill();
	},
	cgts.drawRectangle = function(ctx, jx, jy, o) {
		var
			rectWidth = Math.floor(Math.random() * (o.maxRectSide - o.minRectSide)) + o.minRectSide,
			rectHeight = Math.floor(Math.random() * (o.maxRectSide - o.minRectSide)) + o.minRectSide,
			offsetX = -rectWidth/2,
			offsetY = -rectHeight/2,
			rotationInDegrees = cgts.randomAngle();
			
			ctx.translate(jx + rectWidth/2, jy + rectHeight/2);
			ctx.rotate(Math.PI/180 * rotationInDegrees);
			ctx.translate(offsetX, offsetY);   
			ctx.fillRect(0, 0, rectWidth, rectHeight);
					
	}

	cgts.generate = function($elem, options) {
		var hasCanvas = !!document.createElement('canvas').getContext;
		if(!hasCanvas) return;
		var
			o 				= $.extend({}, cgts.defaultOptions, options),
			c,
			ctx,
			resizeTimeout,
			resizeThrottle 	= o.resizeThrottle,
			width			= $elem.width(),
			height			= $elem.height();
		if (o.bgColor) $elem[0].style.backgroundColor = o.bgColor;
		// test if an cgts canvas is there and reuse if it is
		var $firstChild = $elem.children(':eq(0)');
		var prevCanvas = $firstChild.is('canvas.'+o.canvasClassName);
		if ( prevCanvas ) {
				c	= $firstChild[0];
		}						
		else {
			var 
				c	= document.createElement('canvas'),
				$c	= $(c).addClass(o.canvasClassName).prependTo($elem);		
		}
	
		var ctx = c.getContext('2d');			
		c.width = width;
		c.height = height;
		ctx.clearRect(0, 0, width, height);	
		for (var y = 0; y < height; y = y + o.spacing) {
			for (var x = 0; x < width; x = x + o.spacing ) {
				ctx.save();
				ctx.fillStyle = cgts.randomColor(o.rMin, o.rMax, o.gMin, o.gMax, o.bMin, o.bMax, o.aMin, o.aMax);
				var jx = cgts.jitterPoint(x, o.jitter);
				var jy = cgts.jitterPoint(y, o.jitter);
				var rand = cgts.posNeg();
				if (rand > 0) {
					cgts.drawCircle(ctx, jx, jy, cgts.randomRadius(o.minRadius, o.maxRadius));
				}
				else {
					cgts.drawRectangle(ctx, jx, jy, o);
				}
				ctx.restore();
			}
		}
		if(o.regenOnWinResize)
		{
			$(window).bind('resize.cgts', function(){
				clearTimeout(cgts.resizeTimeout);
				cgts.resizeTimeout = setTimeout( function() {
					cgts.generate($elem, o);
				}, 250);
			});
		}
	};
	
	// turn into jQuery plugin
	jQuery.fn.cgts = function (options) {
		return this.each(function () {
			new cgts.generate($(this), options);
		});
	};

})(jQuery);