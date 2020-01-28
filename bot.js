// Replacement of console.log
function log(message) {
	if (message instanceof Error) {
		message = message.stack;
	}
	console.log("[" + new Date().toLocaleTimeString() + "] " + message);
};

log("Starting Gnomesweeper Bot version ");
var Discord = require('discord.js');
var auth = require('./auth.json');
var pack = require('./package.json');

log("All modules loaded");
/*
// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';
*/
// Initialise Discord Bot
var bot = new Discord.Client();
bot.login(auth.token).catch(log);
/*
// Initialize Discord Bot
var bot = new Discord.Client({
   token: auth.token,
   autorun: true
});
*/
bot.on('ready', function (evt) {
    log('Connected');
    log(pack.name);
});

const prefix = '!';
const gnomeEmoji = getEmoji("gnome");

bot.on('message', message => {
	
	if (message.author.bot) {
		return;
	}
	
	// Commands
	if (message.content.substring(0, 1) == prefix) {
		executeCommand(message, message.content.substring(1));
	}
});

function executeCommand(message, command) {
    if(command == 'gs' || command == 'gnomesweeper'){
        message.channel.send(generateGame()).catch(log);
        return;
	}
}

function generateGame() {
	gameWidth = 8;
	gameHeight = 8;
	numMines = Math.round(gameWidth * gameHeight / 5);
	
	// Generate game (2D array sorted [y][x], -1 means a mine, positive number is the amount of neighbouring mines)
	var game = [];
	
	for (var y = 0; y < gameHeight; y++) {
		game.push([]);
		for (var x = 0; x < gameWidth; x++) {
			game[y].push(0);
		}
	}
	
	// Fill it with mines!
	for (var mine = 0; mine < numMines; mine++) {
		var x = Math.floor(Math.random()*gameWidth),
		    y = Math.floor(Math.random()*gameHeight);
		
		// Retry if there was already a mine there
		if (game[y][x] === -1) {
			mine--;
			continue;
		}
		
		game[y][x] = -1;
		
		// Add 1 to neighbouring tiles
		if (x > 0                && y > 0             && game[y-1][x-1] !== -1) { game[y-1][x-1]++; }
		if (                        y > 0             && game[y-1][x  ] !== -1) { game[y-1][x  ]++; }
		if (x < game[y].length-1 && y > 0             && game[y-1][x+1] !== -1) { game[y-1][x+1]++; }
		if (x < game[y].length-1                      && game[y  ][x+1] !== -1) { game[y  ][x+1]++; }
		if (x < game[y].length-1 && y < game.length-1 && game[y+1][x+1] !== -1) { game[y+1][x+1]++; }
		if (                        y < game.length-1 && game[y+1][x  ] !== -1) { game[y+1][x  ]++; }
		if (x > 0                && y < game.length-1 && game[y+1][x-1] !== -1) { game[y+1][x-1]++; }
		if (x > 0                                     && game[y  ][x-1] !== -1) { game[y  ][x-1]++; }
	}
	
	// Create the reply
	let returnTxt;
	if (numMines === 1) { returnTxt = "Here's a board sized " + gameWidth + "x" + gameHeight + " with 1 mine:"; }
	else                { returnTxt = "Here's a board sized " + gameWidth + "x" + gameHeight + " with " + numMines + " mines:"; }
	
	for (var y = 0; y < game.length; y++) {
		returnTxt += "\n"
		for (var x = 0; x < game[y].length; x++) {
			if (game[y][x] === -1) {
				returnTxt += "||:gnome:||";
			}
			else {
				returnTxt += "||" + numberEmoji[game[y][x]] + "||";
			}
		}
	}
	
	// Send the message if it's not longer than 2000 chars (Discord's limit)
	if (returnTxt.length <= 2000) {
		return returnTxt;
	}
	
	// Otherwise, split the message
	let splitReturns = [];
	do {
		let splitIndex = returnTxt.substring(0, 1900).lastIndexOf("\n");
		if (splitIndex === -1) {
			log("A too large message was generated after creating a game.");
			return "Sorry, your message appears to be too large to send. Please try a smaller game next time.";
		}
		splitReturns.push(returnTxt.substring(0, splitIndex));
		returnTxt = returnTxt.substring(splitIndex+1);
	} while (returnTxt.length > 1900)
	
	splitReturns.push(returnTxt);
	
	// Send the messages one by one
	let i = 0;
	function sendNextMessage() {
		if (i < splitReturns.length) { message.channel.send(splitReturns[i++]).then(sendNextMessage, log); }
	};
	sendNextMessage();
};

function getEmoji(emojiName) {
	const emoji = bot.emojis.find(emoji => emoji.name === emojiName);
	return(`${emoji}`);
}

// Gets called when you run the `!gnomesweeper` command
function generateGame(gameWidth, gameHeight, numMines, message) {
	
	// Check game size
	if (isNaN(gameWidth)) {
		gameWidth = 8;
	}
	else if (gameWidth <= 0 || gameHeight <= 0) {
		return "Uh, I'm not smart enough to generate a maze of that size. I can only use positive numbers. Sorry :cry:";
	}
	if (isNaN(gameHeight)) {
		gameHeight = 8;
	}
	else if (gameWidth > 40 || gameHeight > 20) {
		return "That's way too large! Think of all the mobile users who are going to see this!";
	}
	
	// Check mine count
	if (isNaN(numMines)) {
		numMines = Math.round(gameWidth * gameHeight / 5);
	}
	else {
		if (numMines <= 0) {
			return "You think you can look clever by solving a Gnomesweeper game without gnomes? Not gonna happen my friend.";
		}
		else if (numMines > gameWidth * gameHeight) {
			return "I can't fit that many gnomes in this game!";
		}
	}
	
	// Generate game (2D array sorted [y][x], -1 means a mine, positive number is the amount of neighbouring mines)
	var game = [];
	
	for (var y = 0; y < gameHeight; y++) {
		game.push([]);
		for (var x = 0; x < gameWidth; x++) {
			game[y].push(0);
		}
	}
	
	// Fill it with mines!
	for (var mine = 0; mine < numMines; mine++) {
		var x = Math.floor(Math.random()*gameWidth),
		    y = Math.floor(Math.random()*gameHeight);
		
		// Retry if there was already a mine there
		if (game[y][x] === -1) {
			mine--;
			continue;
		}
		
		game[y][x] = -1;
		
		// Add 1 to neighbouring tiles
		if (x > 0                && y > 0             && game[y-1][x-1] !== -1) { game[y-1][x-1]++; }
		if (                        y > 0             && game[y-1][x  ] !== -1) { game[y-1][x  ]++; }
		if (x < game[y].length-1 && y > 0             && game[y-1][x+1] !== -1) { game[y-1][x+1]++; }
		if (x < game[y].length-1                      && game[y  ][x+1] !== -1) { game[y  ][x+1]++; }
		if (x < game[y].length-1 && y < game.length-1 && game[y+1][x+1] !== -1) { game[y+1][x+1]++; }
		if (                        y < game.length-1 && game[y+1][x  ] !== -1) { game[y+1][x  ]++; }
		if (x > 0                && y < game.length-1 && game[y+1][x-1] !== -1) { game[y+1][x-1]++; }
		if (x > 0                                     && game[y  ][x-1] !== -1) { game[y  ][x-1]++; }
	}
	
	// Create the reply
	let returnTxt;
	if (numMines === 1) { returnTxt = "Here's a board sized " + gameWidth + "x" + gameHeight + " with 1 mine:"; }
	else                { returnTxt = "Here's a board sized " + gameWidth + "x" + gameHeight + " with " + numMines + " mines:"; }
	
	for (var y = 0; y < game.length; y++) {
		returnTxt += "\n"
		for (var x = 0; x < game[y].length; x++) {
			if (game[y][x] === -1) {
				returnTxt += "||"+gnomeEmoji+"||";
			}
			else {
				returnTxt += "||" + numberEmoji[game[y][x]] + "||";
			}
		}
	}
	
	// Send the message if it's not longer than 2000 chars (Discord's limit)
	if (returnTxt.length <= 2000) {
		return returnTxt;
	}
	
	// Otherwise, split the message
	let splitReturns = [];
	do {
		let splitIndex = returnTxt.substring(0, 1900).lastIndexOf("\n");
		if (splitIndex === -1) {
			log("A too large message was generated after creating a game.");
			return "Sorry, your message appears to be too large to send. Please try a smaller game next time.";
		}
		splitReturns.push(returnTxt.substring(0, splitIndex));
		returnTxt = returnTxt.substring(splitIndex+1);
	} while (returnTxt.length > 1900)
	
	splitReturns.push(returnTxt);
	
	// Send the messages one by one
	let i = 0;
	function sendNextMessage() {
		if (i < splitReturns.length) { message.channel.send(splitReturns[i++]).then(sendNextMessage, log); }
	};
	sendNextMessage();
};

const numberEmoji = [":zero:", ":one:", ":two:", ":three:", ":four:", ":five:", ":six:", ":seven:", ":eight:", ":nine:"];