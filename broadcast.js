/*
 *  The Talker Texas Ranger bot has the ability to connect to multiple rooms.
 *   A feature lacking within the TalkerApp framework is the ability 
 *    to broadcast throughout all rooms within a single account.
 * 
 *  This plugin is designed to broadcast a message through the bot to all rooms.
 *
 *  Luckily talker has a broadcast method to rely upon, so this becomes trivial.
 */
var talker = require('../lib/talker');

talker.command('broadcast', function (data, args) {

	// Just concat args to a string and make sure command is gone
	var broadcastMessage = args.join(" ").replace("!broadcast", "");

	// Identify the user broadcasting
	var userPrefix = "(" + data.user.name + ") : ";

	// Send broadcast
	talker.broadcast(userPrefix + broadcastMessage, data.room);
});


