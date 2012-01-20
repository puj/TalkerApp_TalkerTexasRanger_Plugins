var talker  = require('../../lib/talker'),
		npm = require('npm'),
		nconf = require('nconf');

var svn;


try{
	// Try to require SVN
	svn = require('../../svnmonitor');
	initSvnMonitor();
}catch(e){	
	// Install it if it's missing
	npm.load({},npmLoaded);	

}

function npmLoaded(er){
	// After npm has been installed and loaded
	if (er) return talker.log(er)

	// Install svnmonitor prereq
	npm.config.set('loglevel','silent');
	npm.on("log", function (message) { /*Do nothing*/})
	npm.commands.install(['svnmonitor'],svnMonitorInstalled);
	
};

function svnMonitorInstalled(er, data){
	if(er) {
		talker.log("Could not install svnmonitor...");
		return;
	}

	// svnmonitor installed
	svn = require('svnmonitor');

	// Hook into Talker
	initSvnMonitor();

};

// Load configuration file.
nconf.file({file: './plugins/svnmonitor/config.json'});

var svnmonitor = {
	conf : {
		repository : nconf.get('repository'),
		username : nconf.get('username'),
		password : nconf.get('password'),
		pollInterval : nconf.get('pollInterval') || 2, // Default 2 seconds
		messageFormat : nconf.get('messageFormat') || "%r : %a committed -- %m"
	}
};

var lastRevision;

function initSvnMonitor(){

	// We are going to setup the command to get the latest commits
	talker.command('svn', function (data, args) {	
		// Show default 5 commits
		var numCommits = args[0] || 5;

		// Show latest numCommits back room
		showLatestCommits(data.room,numCommits);

	});

	// We are going to setup the command to monitor SVN status
	svn.init(svnmonitor.conf.repository,{
	    user : svnmonitor.conf.username,
	    pass : svnmonitor.conf.password,    
	    callback : function(){
	    	setInterval(showLatestCommit, svnmonitor.conf.pollInterval * 1000);
		}
	});
};

function showLatestCommit(){
	svn.getLatestCommits({
	    limit:1,
	    callback: function(err, revisions){
	        if(err){
		        console.log('Error: ' + err);
		        return;
		    }
		    
		    // Get the latest revision live from the repo
		    var thisRevision = revisions[0];

		    if(thisRevision.revision !== lastRevision){
		    	// Create the message
		    	var message = getMessageFromRevision(svnmonitor.conf.messageFormat,thisRevision);

		    	// Something newer has come!
		    	talker.broadcast(message);

		    	// Update last revision
		    	lastRevision = thisRevision.revision;
		    }
	    }
	});
}

function showLatestCommits(room,numCommits){
	svn.getLatestCommits({
	    limit: numCommits,
	    callback: function(err, revisions){
	        if(err){
		        console.log('Error: ' + err);
		        return;
		    }
		    
		    // Multiple messages
		    var multilineMessage = "";

		    for(var i in revisions){
		    	// Get this revision
			    var thisRevision = revisions[i];

		    	// Create the message
		    	multilineMessage += getMessageFromRevision(svnmonitor.conf.messageFormat,thisRevision) + '\n';

		    }

		    // Something newer has come!
	    	talker.message(room,multilineMessage);

	    }
	});
}

function getMessageFromRevision(format,revision){
	var message = format;
    	message = message.replace("%r",revision.revision);
    	message = message.replace("%a",revision.author);
    	message = message.replace("%m",revision.message);
   	return message;
}