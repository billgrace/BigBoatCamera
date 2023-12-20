function horizontalSlider( parameters ) {
	// horizontalSlider creates a left-right slide control within a named HTML element.
	// The control is meant to visually resemble a slider-type level control on a typical sound board in appearance and use.
	// The control's track location and size are determined by percentage proportions of the browser window.
	// The control's sliding "knob" is rendered from a graphic image file. The height of the slider is determined by a percentage of the
	//   height of the browser window and the width of the slider is determined by maintaining the original aspect ratio of the graphic image.

	// make a persistent variable of this instance for later reference during event handling
	var inst = this;
	// make a variable allowing the label to become dormant
	this.dormant = true;

	// sort the arguments
	parameters = parameters || {};
	this.sliderImageFileName = (parameters.sliderImageFileName != undefined)?parameters.sliderImageFileName:'image/controls/defaultSliderImage.png';
	this.leftLimitPercent = (parameters.leftLimitPercent != undefined)?parameters.leftLimitPercent:0.1;
	this.verticalCenterPercent = (parameters.verticalCenterPercent != undefined)?parameters.verticalCenterPercent:0.1;
	this.limitToLimitPercent = (parameters.limitToLimitPercent != undefined)?parameters.limitToLimitPercent:0.4;
	this.sliderHeightPercent = (parameters.sliderHeightPercent != undefined)?parameters.sliderHeightPercent:0.1;
	this.trackHeightPercent = (parameters.trackHeightPercent != undefined)?parameters.trackHeightPercent:0.03;
	this.trackColor = (parameters.trackColor != undefined)?parameters.trackColor:'brown';
	this.leftLimitValue = (parameters.leftLimitValue != undefined)?parameters.leftLimitValue:0;
	this.rightLimitValue = (parameters.rightLimitValue != undefined)?parameters.rightLimitValue:100;
	this.currentValue = (parameters.startingValue != undefined)?parameters.currentValue:50;
	this.hostElementId = (parameters.hostElementId != undefined)?parameters.hostElementId:'document';
	// establish some other handy values
	this.homeValue = this.currentValue;
	this.valueRange = this.rightLimitValue - this.leftLimitValue;
	this.leftLimitPixel = 0;
	this.rightLimitPixel = 0;
	this.motionPixelRange = 0;
	this.nowTracking = false;
	// create the control's visible elements
	this.track = document.createElement( "div" );
	this.track.style.cssText = "position:absolute;background-color:" + this.trackColor;
	document.body.appendChild( this.track );
	this.slider = document.createElement( "div" );
	this.slider.style.cssText = "position:absolute";
	document.body.appendChild( this.slider );
	this.imageElement = new Image();
	this.imageElement.onload = function() { inst.windowResizeHandler(); };
	this.imageElement.src = this.sliderImageFileName;
	this.slider.appendChild( this.imageElement );

	// a routine to figure the geometry of this control
	this.resize = function( leftLimitPercent, verticalCenterPercent, limitToLimitPercent, trackHeightPercent, hostElementId ) {
		if( inst.hostElementId == 'document' ) {
			var windowLeft = 0;
			var windowTop = 0;
			var windowWidth = window.innerWidth;
			var windowHeight = window.innerHeight;
		} else {
			var hostElement = document.getElementById( inst.hostElementId );
			var windowLeft = hostElement.offsetLeft;
			var windowTop = hostElement.offsetTop;
			var windowWidth = hostElement.offsetWidth;
			var windowHeight = hostElement.offsetHeight;
		}
		// calculate the control's pixel geometry according to the specified proportions
		var trackLeft = ( windowLeft + ( ( inst.leftLimitPercent - ( inst.trackHeightPercent / 2 ) ) * windowWidth ) ) | 0;
		var trackTop = ( windowTop + ( ( inst.verticalCenterPercent - ( inst.trackHeightPercent / 2 ) ) * windowHeight ) ) | 0;
		var trackWidth = ( ( inst.limitToLimitPercent + inst.trackHeightPercent ) * windowWidth ) | 0;
		var trackHeight = ( inst.trackHeightPercent * windowHeight ) | 0;
		// calculate the slider image's natural aspect ratio
		var imageAspectRatio = inst.imageElement.naturalWidth / inst.imageElement.naturalHeight;
		// calculate the pixel positions of the end points of the slider's motion
		inst.leftLimitPixel = ( trackLeft + trackHeight / 2 ) | 0;
		inst.rightLimitPixel = (trackLeft + trackWidth - trackHeight / 2 ) | 0;
		// calculate the slider range in terms of equivalent pixels
		inst.motionPixelRange = inst.rightLimitPixel - inst.leftLimitPixel;
		// calculate the proportional height of the slider image and the necessary width to retain the image's aspect ratio
		var sliderHeight = ( inst.sliderHeightPercent * windowHeight ) | 0;
		var sliderWidth = ( sliderHeight * imageAspectRatio ) | 0;
		// calculate the pixel location of the slider image according to present value
		var sliderLeft = ( inst.leftLimitPixel + ( inst.motionPixelRange * ( inst.currentValue / ( inst.rightLimitValue - inst.leftLimitValue ) ) ) - ( sliderWidth / 2 ) ) | 0;
		var sliderTop = ( ( inst.verticalCenterPercent - ( inst.sliderHeightPercent / 2 ) ) * windowHeight ) | 0;
		// set the calculated geometry into the control's elements
		inst.track.style.left = "0" + trackLeft + "px";
		inst.track.style.top = "0" + trackTop + "px";
		inst.track.style.width = "0" + trackWidth + "px";
		inst.track.style.height = "0" + trackHeight + "px";
		inst.track.style.borderRadius = "0" + ( ( trackHeight / 2 ) | 0 ) + "px";
		inst.imageElement.style.left = inst.slider.style.left = "0" + sliderLeft + "px";
		inst.imageElement.style.top = inst.slider.style.top = "0" + sliderTop + "px";
		inst.imageElement.style.width = inst.slider.style.width = "0" + sliderWidth + "px";
		inst.imageElement.style.height = inst.slider.style.height = "0" + sliderHeight + "px";
	}
	// an event handler to call the resizing routine whenever there's a change in browser geometry
	this.windowResizeHandler = function() {
		if( inst.dormant ) return;
		inst.resize( inst.leftLimitPercent, inst.verticalCenterPercent, inst.limitToLimitPercent, inst.trackHeightPercent, inst.hostElementId );
	}

	// a routine to make the control visible and responsive
	this.activate = function() {
		inst.dormant = false;
		inst.track.style.display = "block";
		inst.slider.style.display = "block";
		inst.windowResizeHandler();
	}
	// a routine to make the control invisible and dormant
	this.deactivate = function() {
		inst.dormant = true;
		inst.track.style.display = "none";
		inst.slider.style.display = "none";
	}

	this.disableOrbitControls = function() {
		orbitControls.enabled = false;
	}

	this.enableOrbitControls = function() {
		orbitControls.enabled = true;
	}

	// a routine to programatically set the slider to a given position
	this.setSlider = function( givenValue ) {
		inst.currentValue = givenValue;
		inst.windowResizeHandler();
	}

	// a routine to convert click/touch screen geometry into the equivalent slider value
	this.updateControlValue = function( pixelX ) {
		if( pixelX < inst.leftLimitPixel ) pixelX = inst.leftLimitPixel;
		if( pixelX > inst.rightLimitPixel ) pixelX = inst.rightLimitPixel;
		inst.currentValue = inst.leftLimitValue + inst.valueRange * ( pixelX - inst.leftLimitPixel ) / inst.motionPixelRange;
		inst.windowResizeHandler();
	}

	// handlers for mouse and touch events
	this.mouseDownEventHandler = function( e ) {
		if( inst.dormant ) return;
		e.preventDefault();
		orbitControls.enabled = false;
		// a click on the slider "grabs" the slider...
		inst.nowTracking = true;
		// and sets the slider's horizontal position to that of the point clicked
		inst.updateControlValue( e.clientX );
	}
	this.mouseMoveEventHandler = function( e ) {
		if( inst.dormant ) return;
		e.preventDefault();
		if( !inst.nowTracking ) return;
		// dragging with the mouse varies the slider's horizontal position
		inst.updateControlValue( e.clientX );
	}
	this.mouseUpEventHandler = function( e ) {
		if( inst.dormant ) return;
		e.preventDefault();
		// releasing the mouse button stops any further moving of the slider
		inst.nowTracking = false;
	}
	this.touchStartEventHandler = function( e ) {
		if( inst.dormant ) return;
		e.preventDefault();
		orbitControls.enabled = false;
		// touching the slider "grabs" it...
		inst.nowTracking = true;
		// and sets the slider's horizontal position to that of the point touched
		inst.updateControlValue( e.touches[ 0 ].clientX );
	}
	this.touchMoveEventHandler = function( e ) {
		if( inst.dormant ) return;
		e.preventDefault();
		if( !inst.nowTracking ) return;
		// dragging the slider varies its horizontal position
		inst.updateControlValue( e.touches[ 0 ].clientX );
	}
	this.touchEndEventHandler = function( e ) {
		if( inst.dormant ) return;
		e.preventDefault();
		// lifting the touch finger stops any further moving of the slider
		inst.nowTracking = false;
	}

	// at time of instantiation/creation, be dormant until activation is invoked
	this.deactivate();

	// add event listeners to invoke the resize handler
	window.addEventListener( "resize", this.windowResizeHandler, false );
	window.addEventListener( "orientationchange", this.windowResizeHandler, false );
	// add event listeners to invoke the mouse/touch handlers
	this.track.addEventListener( "mousedown", this.mouseDownEventHandler, false );
	this.slider.addEventListener( "mousedown", this.mouseDownEventHandler, false );
	this.track.addEventListener( "mousemove", this.mouseMoveEventHandler, false );
	this.slider.addEventListener( "mousemove", this.mouseMoveEventHandler, false );
	window.addEventListener( "mouseup", this.mouseUpEventHandler, false );
	this.track.addEventListener( "touchstart", this.touchStartEventHandler, false );
	this.slider.addEventListener( "touchstart", this.touchStartEventHandler, false );
	this.track.addEventListener( "touchmove", this.touchMoveEventHandler, false );
	this.slider.addEventListener( "touchmove", this.touchMoveEventHandler, false );
	this.slider.addEventListener( 'mouseover', function() { inst.disableOrbitControls() }, false );
	this.slider.addEventListener( 'mouseout', function() { inst.enableOrbitControls() }, false );
	this.slider.addEventListener( 'touchenter', function() { inst.disableOrbitControls() }, false );
	this.slider.addEventListener( 'touchleave', function() { inst.enableOrbitControls() }, false );
	this.slider.addEventListener( 'touchend', function() { inst.enableOrbitControls() }, false );
	document.addEventListener( "touchend", this.touchEndEventHandler, false );
}

function verticalSlider( parameters ) {
	// Similar to horizontalSlider but oriented vertically

	// make a persistent variable of this instance for later reference during event handling
	var inst = this;
	// make a variable allowing the label to become dormant
	this.dormant = true;

	// sort the arguments
	parameters = parameters || {};
	this.sliderImageFileName = (parameters.sliderImageFileName != undefined)?parameters.sliderImageFileName:'image/controls/defaultSliderImage.png';
	this.horizontalCenterPercent = (parameters.horizontalCenterPercent != undefined)?parameters.horizontalCenterPercent:0.2;
	this.topLimitPercent = (parameters.topLimitPercent != undefined)?parameters.topLimitPercent:0.1;
	this.sliderWidthPercent = (parameters.sliderWidthPercent != undefined)?parameters.sliderWidthPercent:0.1;
	this.trackWidthPercent = (parameters.trackWidthPercent != undefined)?parameters.trackWidthPercent:0.03;
	this.limitToLimitPercent = (parameters.limitToLimitPercent != undefined)?parameters.limitToLimitPercent:0.4;
	this.trackColor = (parameters.trackColor != undefined)?parameters.trackColor:'brown';
	this.bottomLimitValue = (parameters.bottomLimitValue != undefined)?parameters.bottomLimitValue:0;
	this.topLimitValue = (parameters.topLimitValue != undefined)?parameters.topLimitValue:100;
	this.currentValue = (parameters.startingValue != undefined)?parameters.currentValue:50;
	this.hostElementId = (parameters.hostElementId != undefined)?parameters.hostElementId:'document';
	// establish some other handy values
	this.homeValue = this.currentValue;
	this.valueRange = this.topLimitValue - this.bottomLimitValue;
	this.bottomLimitPixel = 0;
	this.topLimitPixel = 0;
	this.motionPixelRange = 0;
	this.nowTracking = false;
	// create the control's visible elements
	this.track = document.createElement( "div" );
	this.track.style.cssText = "position:absolute;background-color:" + this.trackColor;
	document.body.appendChild( this.track );
	this.slider = document.createElement( "div" );
	this.slider.style.cssText = "position:absolute";
	document.body.appendChild( this.slider );
	this.imageElement = new Image();
	this.imageElement.onload = function() { inst.windowResizeHandler(); };
	this.imageElement.src = this.sliderImageFileName;
	this.slider.appendChild( this.imageElement );

	// a routine to figure the geometry of this control
	this.resize = function( bottomLimitPercent, horizontalCenterPercent, limitToLimitPercent, sliderWidthPercent, trackWidthPercent, hostElementId ) {
		if( inst.hostElementId == 'document' ) {
			var windowLeft = 0;
			var windowTop = 0;
			var windowWidth = window.innerWidth;
			var windowHeight = window.innerHeight;
		} else {
			var hostElement = document.getElementById( inst.hostElementId );
			var windowLeft = hostElement.offsetLeft;
			var windowTop = hostElement.offsetTop;
			var windowWidth = hostElement.offsetWidth;
			var windowHeight = hostElement.offsetHeight;
		}
		// calculate the control's pixel geometry according to the specified proportions
		var trackLeft = ( windowLeft + ( ( inst.horizontalCenterPercent - ( inst.trackWidthPercent / 2 ) ) * windowWidth ) ) | 0;
		var trackTop = ( windowTop + ( ( inst.topLimitPercent - ( inst.trackWidthPercent / 2 ) ) * windowHeight ) ) | 0;
		var trackWidth = ( inst.trackWidthPercent * windowWidth ) | 0;
		var trackHeight = ( ( inst.limitToLimitPercent + inst.trackWidthPercent ) * windowHeight ) | 0;
		// calculate the slider image's natural aspect ratio
		var imageAspectRatio = inst.imageElement.naturalWidth / inst.imageElement.naturalHeight;
		// calculate the pixel positions of the end points of the slider's motion
		inst.topLimitPixel = ( trackTop + ( trackWidth / 2 ) ) | 0;
		inst.bottomLimitPixel = (trackTop + trackHeight - ( trackWidth / 2 ) ) | 0;
		// calculate the slider range in terms of equivalent pixels
		inst.motionPixelRange = inst.bottomLimitPixel - inst.topLimitPixel;
		// calculate the proportional width of the slider image and the necessary height to retain the image's aspect ratio
		var sliderWidth = ( inst.sliderWidthPercent * windowWidth ) | 0;
		var sliderHeight = ( sliderWidth / imageAspectRatio ) | 0;
		// calculate the pixel location of the slider image according to present value
		var sliderLeft = ( windowLeft + ( ( inst.horizontalCenterPercent - ( inst.sliderWidthPercent / 2 ) ) * windowWidth ) ) | 0;
		// var sliderTop = ( inst.bottomLimitPixel - ( inst.motionPixelRange * ( inst.currentValue / ( inst.topLimitValue - inst.bottomLimitValue ) ) ) - ( sliderHeight / 2 ) ) | 0;
		var sliderTop = ( inst.bottomLimitPixel - ( inst.motionPixelRange * ( ( inst.currentValue - inst.bottomLimitValue ) / ( inst.topLimitValue - inst.bottomLimitValue ) ) ) - ( sliderHeight / 2 ) ) | 0;
		// set the calculated geometry into the control's elements
		inst.track.style.left = "0" + trackLeft + "px";
		inst.track.style.top = "0" + trackTop + "px";
		inst.track.style.width = "0" + trackWidth + "px";
		inst.track.style.height = "0" + trackHeight + "px";
		inst.track.style.borderRadius = "0" + ( ( trackWidth / 2 ) | 0 ) + "px";
		inst.imageElement.style.left = inst.slider.style.left = "0" + sliderLeft + "px";
		inst.imageElement.style.top = inst.slider.style.top = "0" + sliderTop + "px";
		inst.imageElement.style.width = inst.slider.style.width = "0" + sliderWidth + "px";
		inst.imageElement.style.height = inst.slider.style.height = "0" + sliderHeight + "px";
	}
	// an event handler to call the resizing routine whenever there's a change in browser geometry
	this.windowResizeHandler = function() {
		if( inst.dormant ) return;
		inst.resize( inst.bottomLimitPercent, inst.horizontalCenterPercent, inst.limitToLimitPercent, inst.sliderWidthPercent, inst.trackWidthPercent, inst.hostElementId );
	}

	// a routine to make the control visible and responsive
	this.activate = function() {
		inst.dormant = false;
		inst.track.style.display = "block";
		inst.slider.style.display = "block";
		inst.windowResizeHandler();
	}
	// a routine to make the control invisible and dormant
	this.deactivate = function() {
		inst.dormant = true;
		inst.track.style.display = "none";
		inst.slider.style.display = "none";
	}

	this.disableOrbitControls = function() {
		orbitControls.enabled = false;
	}

	this.enableOrbitControls = function() {
		orbitControls.enabled = true;
	}

	// a routine to programatically set the slider to a given position
	this.setSlider = function( givenValue ) {
		inst.currentValue = givenValue;
		inst.windowResizeHandler();
	}

	// a routine to convert click/touch screen geometry into the equivalent slider value
	this.updateControlValue = function( pixelY ) {
		if( pixelY > inst.bottomLimitPixel ) pixelY = inst.bottomLimitPixel;
		if( pixelY < inst.topLimitPixel ) pixelY = inst.topLimitPixel;
		inst.currentValue = inst.bottomLimitValue + inst.valueRange * ( inst.bottomLimitPixel - pixelY ) / inst.motionPixelRange;
		inst.windowResizeHandler();
	}

	// handlers for mouse and touch events
	this.mouseDownEventHandler = function( e ) {
		if( inst.dormant ) return;
		e.preventDefault();
		orbitControls.enabled = false;
		// a click on the slider "grabs" the slider...
		inst.nowTracking = true;
		// and sets the slider's vertical position to that of the point clicked
		inst.updateControlValue( e.clientY );
	}
	this.mouseMoveEventHandler = function( e ) {
		if( inst.dormant ) return;
		e.preventDefault();
		if( !inst.nowTracking ) return;
		// dragging the slider with the mouse varies the slider's vertical position
		inst.updateControlValue( e.clientY );
	}
	this.mouseUpEventHandler = function( e ) {
		if( inst.dormant ) return;
		e.preventDefault();
		// releasing the mouse button stops any further moving of the slider
		inst.nowTracking = false;
	}
	this.touchStartEventHandler = function( e ) {
		if( inst.dormant ) return;
		e.preventDefault();
		orbitControls.enabled = false;
		// touching the slider "grabs" it...
		inst.nowTracking = true;
		// and sets the slider's vertical position to that of the point touched
		inst.updateControlValue( e.touches[ 0 ].clientY );
	}
	this.touchMoveEventHandler = function( e ) {
		if( inst.dormant ) return;
		e.preventDefault();
		if( !inst.nowTracking ) return;
		// dragging the slider varies its vertical position
		inst.updateControlValue( e.touches[ 0 ].clientY );
	}
	this.touchEndEventHandler = function( e ) {
		if( inst.dormant ) return;
		e.preventDefault();
		// lifting the touch finger stops any further moving of the slider
		inst.nowTracking = false;
	}

	// at time of instantiation/creation, be dormant until activation is invoked
	this.deactivate();

	// add event listeners to invoke the resize handler
	window.addEventListener( "resize", this.windowResizeHandler, false );
	window.addEventListener( "orientationchange", this.windowResizeHandler, false );
	// add event listeners to invoke the mouse/touch handlers
	this.track.addEventListener( "mousedown", this.mouseDownEventHandler, false );
	this.slider.addEventListener( "mousedown", this.mouseDownEventHandler, false );
	this.track.addEventListener( "mousemove", this.mouseMoveEventHandler, false );
	this.slider.addEventListener( "mousemove", this.mouseMoveEventHandler, false );
	window.addEventListener( "mouseup", this.mouseUpEventHandler, false );
	this.track.addEventListener( "touchstart", this.touchStartEventHandler, false );
	this.slider.addEventListener( "touchstart", this.touchStartEventHandler, false );
	this.track.addEventListener( "touchmove", this.touchMoveEventHandler, false );
	this.slider.addEventListener( "touchmove", this.touchMoveEventHandler, false );
	this.slider.addEventListener( 'mouseover', function() { inst.disableOrbitControls() }, false );
	this.slider.addEventListener( 'mouseout', function() { inst.enableOrbitControls() }, false );
	this.slider.addEventListener( 'touchenter', function() { inst.disableOrbitControls() }, false );
	this.slider.addEventListener( 'touchleave', function() { inst.enableOrbitControls() }, false );
	this.slider.addEventListener( 'touchend', function() { inst.enableOrbitControls() }, false );
	document.addEventListener( "touchend", this.touchEndEventHandler, false );
}

