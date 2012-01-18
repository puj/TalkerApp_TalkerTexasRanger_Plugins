/*
 *  The Talker Texas Ranger bot has the ability to connect to multiple rooms.
 *  This plugin will accept the command !color and translate the color to another format
 *
 *  Currently the plugin supports:
 *   hex -> rgb
 *   rgb -> hex
 *
 */
var talker = require('../lib/talker');

talker.command('color', function (data, args) {
	// Get original argument
	var argString = args.join();

	// Remove whitespace
	argString = argString.replace(/\s/g,"")	;

	// Replace double commas in case args has an empty element
	argString = argString.replace(/,+/g,",");

	// Pattern for RGB 255,255,255 
	//  Also matches floats : 255,0.0, 125.0
	var rgbPattern  = new RegExp("([0-9]+\\.?[0-9]*),([0-9]+\\.?[0-9]*),([0-9]\\.?[0-9]*)");
	var hexPattern  = new RegExp("([0-9A-F]{2})([0-9A-F]{2})([0-9A-F]{2})");

	// Try to match the RGB
	var rgbMatches = argString.match(rgbPattern);
	var hexMatches = argString.match(hexPattern);

	if(rgbMatches === null && hexMatches === null){
		// No hexMatches
		return;
	}

	// Part of output
	var hexString,
		rgbString;

	// Use has RGB input
	if(rgbMatches !== null){
		// Check if any of the matches are invalid
		for(var i in [1,2,3]){
			var color = rgbMatches[i];

			// Invalid RGB (0-255) color
			if(color === null || color < 0 || color > 255){
				return;
			}
		}		
		var red = parseInt(rgbMatches[1]);
		var green = parseInt(rgbMatches[2]);
		var blue = parseInt(rgbMatches[3]);

		// Translate colors to hex
		hexString = "#" + 	red.toString(16) +
								green.toString(16) +
								blue.toString(16);

		rgbString = "rgb (" + 	parseInt(red) + ", " +
								 	parseInt(green) + ", " + 
								 	parseInt(blue) + ")";	
	}

	// User has hex input
	if(hexMatches !== null){
		// Check if any of the matches are invalid
		for(var i in [1,2,3]){
			var color = hexMatches[i];

			// Invalid HEX input, ranges handled by regexp
			if(color === null ){
				return;
			}
		}	

		var red = hexMatches[1];
		var green = hexMatches[2];
		var blue = hexMatches[3];

		// Translate colors to hex
		hexString = "#" + 	red + 
							green +
							blue;

		rgbString = "rgb (" + 	parseInt(red,16) + ", " +
								parseInt(green,16) + ", " + 
								parseInt(blue,16) + ")";	

	}

	talker.message(data.room, hexString.toUpperCase() + " = " + rgbString);
	
	
});
