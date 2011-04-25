// namespace
var artGen = artGen || {};

(function($) {

	artGen.resizeTimeout = null;
	artGen.resizeThrottle = 250;
	artGen.defaultOptions = {
		regenOnWinResize	: true,
		canvasClassName	: 'artGenCanvas',
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
	artGen.randomColor = function(rMin, rMax, gMin, gMax, bMin, bMax, aMin, aMax) {
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
	artGen.randomAngle = function() {
		return Math.floor(Math.random()*360);
	};
	artGen.randomRadius = function(minRadius, maxRadius){
		return (Math.floor(Math.random()*minRadius) + maxRadius);
	},
	artGen.jitterPoint =	function(point, jitter){
		var jittered = point + artGen.posNeg(Math.ceil(Math.random()* jitter)-1);
		return jittered;
	}
	artGen.posNeg = function(num) {
		if (num == undefined) num = 1;
		var gen = (Math.floor(Math.random()*5)) + 1;
		return ((gen % 2 == 0) ? 1 : -1) * num;
	},
	artGen.drawCircle = function(ctx, jx, jy, r){
		ctx.beginPath();
		ctx.arc(jx, jy, r, 0, 2*Math.PI, true)
		ctx.closePath();
		ctx.fill();
	},
	artGen.drawRectangle = function(ctx, jx, jy, o) {
		var
			rectWidth = Math.floor(Math.random() * (o.maxRectSide - o.minRectSide)) + o.minRectSide,
			rectHeight = Math.floor(Math.random() * (o.maxRectSide - o.minRectSide)) + o.minRectSide,
			offsetX = -rectWidth/2,
			offsetY = -rectHeight/2,
			rotationInDegrees = artGen.randomAngle();
			
			ctx.translate(jx + rectWidth/2, jy + rectHeight/2);
			ctx.rotate(Math.PI/180 * rotationInDegrees);
			ctx.translate(offsetX, offsetY);   
			ctx.fillRect(0, 0, rectWidth, rectHeight);
					
	}

	artGen.generate = function($elem, options) {
		var hasCanvas = !!document.createElement('canvas').getContext;
		if(!hasCanvas) return;
		var
			o 				= $.extend({}, artGen.defaultOptions, options),
			c,
			ctx,
			resizeTimeout,
			resizeThrottle 	= o.resizeThrottle,
			width			= $elem.width(),
			height			= $elem.height();
		if (o.bgColor) $elem[0].style.backgroundColor = o.bgColor;
		// test if an artGen canvas is there and reuse if it is
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
				ctx.fillStyle = artGen.randomColor(o.rMin, o.rMax, o.gMin, o.gMax, o.bMin, o.bMax, o.aMin, o.aMax);
				var jx = artGen.jitterPoint(x, o.jitter);
				var jy = artGen.jitterPoint(y, o.jitter);
				var rand = artGen.posNeg();
				if (rand > 0) {
					artGen.drawCircle(ctx, jx, jy, artGen.randomRadius(o.minRadius, o.maxRadius));
				}
				else {
					artGen.drawRectangle(ctx, jx, jy, o);
				}
				ctx.restore();
			}
		}
		if(o.regenOnWinResize)
		{
			$(window).bind('resize.artGen', function(){
				clearTimeout(artGen.resizeTimeout);
				artGen.resizeTimeout = setTimeout( function() {
					artGen.generate($elem, o);
				}, 250);
			});
		}
	};
	
	// turn into jQuery plugin
	jQuery.fn.artGen = function (options) {
		return this.each(function () {
			new artGen.generate($(this), options);
		});
	};

})(jQuery);