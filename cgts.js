/* global window, document, HTMLElement, setTimeout, clearTimeout */

function CircleGetsTheSquare(elem, options) {
  var hasCanvas = !!document.createElement('canvas').getContext;
  if (!hasCanvas) {
    return new Error('CircleGetsTheSquare: requires the canvas element');
  }
  if (elem instanceof HTMLElement) {
    this.elem = elem;
    this.resizeTimeout = null;
    this.setOptions(options);
    this.canvas = document.createElement('canvas');
    this.canvas.classList.add(this.options.canvasClassName);
    this.context =this.canvas.getContext('2d');
    this.elem.prepend(this.canvas);
    this.generate();
    if(this.options.regenOnWinResize) {
      var self = this;
      window.addEventListener('resize', function(){
        clearTimeout(self.resizeTimeout);
        self.resizeTimeout = setTimeout( function() {
          self.generate();
        }, self.options.resizeThrottle);
      });
    }
  } else {
    return new Error('CircleGetsTheSquare: invalid target element');
  }
}

CircleGetsTheSquare.prototype.setOptions = function(options, regenerate) {
  this.options = Object.assign({}, CircleGetsTheSquare.defaultOptions, this.options, options);
  if (regenerate) {
    this.generate();
  }
};

CircleGetsTheSquare.prototype.drawCircle = function(jx, jy, r){
  var ctx = this.context;
  ctx.beginPath();
  ctx.arc(jx, jy, r, 0, 2 * Math.PI, true)
  ctx.closePath();
  ctx.fill();
};

CircleGetsTheSquare.prototype.drawRectangle = function(jx, jy, o) {
  var ctx = this.context;
  var rectWidth = CircleGetsTheSquare.constrainedRandomInteger(o.minRectSide, o.maxRectSide);
  var rectHeight = CircleGetsTheSquare.constrainedRandomInteger(o.minRectSide, o.maxRectSide);
  var offsetX = -rectWidth/2;
  var offsetY = -rectHeight/2;
  var rotationInDegrees = CircleGetsTheSquare.randomAngle();
  ctx.translate(jx + rectWidth/2, jy + rectHeight/2);
  ctx.rotate(Math.PI/180 * rotationInDegrees);
  ctx.translate(offsetX, offsetY);   
  ctx.fillRect(0, 0, rectWidth, rectHeight);   
};

CircleGetsTheSquare.prototype.generate = function() {
  var o = this.options;
  var c = this.canvas;
  var ctx = this.context;
  var elem = this.elem;
  var width = elem.offsetWidth;
  var height = elem.offsetHeight;
  c.width = width;
  c.height = height;
  ctx.clearRect(0, 0, width, height); 
  for (var y = 0; y < height; y = y + o.spacing) {
    for (var x = 0; x < width; x = x + o.spacing ) {
      ctx.save();
      ctx.fillStyle = CircleGetsTheSquare.randomColor(o.rMin, o.rMax, o.gMin, o.gMax, o.bMin, o.bMax, o.aMin, o.aMax);
      var jx = CircleGetsTheSquare.jitterPoint(x, o.jitter);
      var jy = CircleGetsTheSquare.jitterPoint(y, o.jitter);
      var rand = CircleGetsTheSquare.posNeg();
      if (rand > 0) {
        this.drawCircle(jx, jy, CircleGetsTheSquare.constrainedRandomInteger(o.minRadius, o.maxRadius));
      }
      else {
        this.drawRectangle(jx, jy, o);
      }
      ctx.restore();
    }
  }
};

/*
 *
 * static functions and properties
 *
 */
CircleGetsTheSquare.randomColor = function(rMin, rMax, gMin, gMax, bMin, bMax, aMin, aMax) {
  return 'rgba(' +
    CircleGetsTheSquare.constrainedRandomInteger(rMin, rMax) +
    ',' +
    CircleGetsTheSquare.constrainedRandomInteger(gMin, gMax) + 
    ',' + 
    CircleGetsTheSquare.constrainedRandomInteger(bMin, bMax) + 
    ',' + 
    (CircleGetsTheSquare.constrainedRandomInteger(aMin * 10, aMax * 10) / 10) +
    ')';
};

CircleGetsTheSquare.randomAngle = function() {
  return Math.floor(Math.random()*360);
};

CircleGetsTheSquare.constrainedRandomInteger = function(min, max){
  var num = Math.floor(Math.random() * (max - min + 1)) + min;
  if (num >= min && num <= max ) return num;
};

CircleGetsTheSquare.jitterPoint = function(point, jitter){
  var jittered = point + CircleGetsTheSquare.posNeg(CircleGetsTheSquare.constrainedRandomInteger(0, jitter));
  return jittered;
};

CircleGetsTheSquare.posNeg = function(num) {
  if (num == undefined) num = 1;
  var gen = (Math.floor(Math.random()*5)) + 1;
  return ((gen % 2 == 0) ? 1 : -1) * num;
};

CircleGetsTheSquare.defaultOptions = {
  canvasClassName : 'cgtsCanvas',
  minRadius: 20,
  maxRadius: 60,
  minRectSide: 40,
  maxRectSide: 120,
  rMin: 0,
  rMax: 255,
  gMin: 0,
  gMax: 255,
  bMin: 0,
  bMax: 255,
  aMin: 0.2,
  aMax: 0.8,
  spacing: 40,
  jitter: 6,
  regenOnWinResize : true,
  resizeThrottle: 100,
};

window.CircleGetsTheSquare = CircleGetsTheSquare;
