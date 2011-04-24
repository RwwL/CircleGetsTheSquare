function randomColor(rMin, rMax, gMin, gMax, bMin, bMax, aMin, aMax) {
	return 'rgba(' +
		(Math.floor(Math.random()*rMax) + rMin) +
		',' +
		(Math.floor(Math.random()*gMax) + gMin) + 
		',' + 
		(Math.floor(Math.random()*bMax) + bMin) + 
		',' + 
		(Math.floor( Math.random()*(aMax-aMin)*10) / 10 + aMin) +
		')'
}

var o = {
			minShapeSize	: 20,
			maxShapeSize	: 50,
			rMin			: 0,
			rMax			: 255,
			gMin			: 0,
			gMax			: 255,
			bMin			: 0,
			bMax			: 255,
			aMin			: 0.2,
			aMax			: 1,
			frequency		: 0.2
		}

function randomAngle() {
	return Math.floor(Math.random()*360);
}

function argGen(element, options) {

	var
		$elem 	= $(element),
		defaultOptions = {
			minShapeSize	: 20,
			maxShapeSize	: 50,
			rMin			: 0,
			rMax			: 255,
			gMin			: 0,
			gMax			: 255,
			bMin			: 0,
			bMax			: 255,
			aMin			: 0.2,
			aMax			: 1,
			frequency		: 0.2
		},
		width	= $(element).width(),
		height	= $(element).height(),
		c		= document.createElement('canvas');
		ctx		= c.getContext('2d'),
		$c		= $(c).prependTo('body'),

		o = $.extend({}, defaultOptions, options);
		
		console.log(randomColor(o.rMin, o.rMax, o.gMin, o.gMax, o.bMin, o.bMax, o.aMin, o.aMax));
		console.log('blah');
}

$(document).ready(function(){
	argGen( document.body, {} );
})