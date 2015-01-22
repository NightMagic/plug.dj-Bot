// Calling in required scripts!
// Calling in the PlugAPI
var PlugAPI = require('plugapi');
// Calling the the IRC used to connect to the Twitch channel, File System and GameDig
var TwitchIRC, fs, gamedig;
// Calling in the Bot Configuration file and some awesome Utilities written by TATDK
var botConfig, utils;
// Setting the blank channel var
var channel = [];
// Calling in the default ExubotAdmins (Remove if you don't want to give these individuals complete access to the bot)
var Exubotadmins = ['techgo', 'exuviax', 'mangermouse', 'andrewbie'];
// Auto shout out song in chat on DJ Advance is default off
var Auto = ['off'];
var cats = ['./cats.json']
// setting some Var's
fs = require('fs');
TwitchIRC = require('twitch-irc');
utils = require('./utils');
// Making sure the Congig exsists. 
if (fs.existsSync(process.argv.length > 2 ? process.argv[2] : './config.json')) {
    botConfig = require(process.argv.length > 2 ? process.argv[2] : './config.json');
} else {
    console.log('Missing config file - ' + (process.argv.length > 2 ? process.argv[2] : './config.json') + ' does not exist');
    process.exit(1);
}
if (fs.existsSync(process.argv.length > 2 ? process.argv[2] : './cats.json')) {
    botCats = require(process.argv.length > 2 ? process.argv[2] : './cats.json');
} else {
    console.log('No cats file :( - ' + (process.argv.length > 2 ? process.argv[2] : './cats.json') + ' does not exist');
    process.exit(1);
}


// Creating the twitch connection information
var client = new TwitchIRC.client({
    identity: {
        username: botConfig['username'],
        password: 'oauth:' + botConfig['oauth']
    },
    channels: botConfig['channels']
});

// Connecting to the Twitch IRC room
client.connect();

// Creating an easy way to Capitalize names: with.capitalize() = With
String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

client.addListener('join', function(channel, username) {
    // Check if it's really the bot that is joining the channel..
    if (utils.equalsIgnoreCaseTrim(username, botConfig['username'])) {
        if (botConfig['sayOnEnter'] != null && botConfig['sayOnEnter'] !== false) {
            client.say(channel, botConfig['sayOnEnter']);
        }
    }
});

new PlugAPI({
    "email": botConfig['plugEmail'],
    "password": botConfig['plugPassword'],
}, function(bot) {
    bot.connect('exuviax'); // The part after https://plug.dj

    bot.on('roomJoin', function(room) {
        console.log("Joined " + room);
        if (botConfig['sayOnEnter'] != null && botConfig['sayOnEnter'] !== false) {
            bot.sendChat(botConfig['sayOnEnter']);
        }
    });
    client.addListener('chat', function(channel, user, message) {
        var opUsers = ['mod', 'broadcaster', 'staff', 'admin', 'global_mod'];

        var isOp = user.special.some(function(v) {
            return opUsers.indexOf(v) >= 0;
        });
        if (isOp || Exubotadmins.indexOf(user.username) >= 0) {
            if (message.toLowerCase() == '!woot') {
                client.say(channel, '@' + user.username.capitalize() + ' I Wooted the current song!');
                bot.sendChat('NightBat ' + user.username.capitalize() + ' uses woot!');
                bot.woot();
            } else if (message.toLowerCase() == '!skip') {
                client.say(channel, '@' + user.username + ' I skipped the current song.');
                bot.sendChat('NightBat ' + user.username.capitalize() + ' uses Skip!');
                bot.moderateForceSkip();
            } else if (message.toLowerCase() == '!autooff') {
                client.say(channel, '@' + user.username + ' I stop shouting out the new song title!');
                Auto = 'off'
            } else if (message.toLowerCase() == '!autoon') {
                client.say(channel, '@' + user.username + ' I will now shout out the new song title!');
                Auto = 'on'
            }
        }
    });
    bot.on('chat', function(data) {
        if (data.message.indexOf('!meow') === 0) {
            bot.moderateDeleteChat(data.raw.cid);
            var meow = botCats['cats']
            var rand = meow[Math.floor(Math.random() * meow.length)];
            bot.sendChat('@' + data.from + " " + rand, 30);
        } else if (data.message.indexOf('!link') === 0) {
            bot.moderateDeleteChat(data.raw.cid);
            var song = bot.getMedia()
            bot.sendChat('@' + data.from + " https://www.youtube.com/watch?v=" + song.cid);
        } else if (data.message.indexOf('!stream') === 0) {
            bot.moderateDeleteChat(data.raw.cid);
            bot.sendChat('@' + data.from + " check out the exuStream at http://twitch.tv/exuviax");
        } else if (data.message.indexOf('!theme') === 0) {
            bot.moderateDeleteChat(data.raw.cid);
            bot.sendChat('@' + data.from + " Today's Base Genre is EDM! Read the room Desc for more information!");
        } else if (data.message.indexOf('!plug') === 0) {
            bot.moderateDeleteChat(data.raw.cid);
            var result = data.message.replace('!plug ', '');
            bot.sendChat('@' + data.from + " Get Plug3 from https://plugcubed.net/ to make this room look better!");
        } else if (data.message.indexOf('!dance') === 0) {
            bot.moderateDeleteChat(data.raw.cid);
            var result = data.message.replace('!plug ', '');
            bot.sendChat('@' + data.from + " http://i.imgur.com/QE9MD52.gif", 60);
        }
    });
    bot.on('advance', function(data) {
        var song = bot.getMedia()
        var channel = '#exuviax'
        var str = song.author.toLowerCase();
        if (song.duration >= 600) {
            var user = bot.getDJ();
            bot.sendChat('@' + user.username + ' Your song is over 10 minutes and was skipped!')
            bot.moderateForceSkip();
        } else if (str.indexOf('taylor swift') >= 0) {
            var user = bot.getDJ();
            bot.sendChat('@' + user.username + ' Eww gross, you did not just try to play Taylor Swift!')
            bot.moderateForceSkip();
        } else {
            if (Auto) {
                if (Auto.indexOf('on') >= 0) {
                    client.say(channel, 'Song: ' + song.author + ' ' + song.title + ' @ https://plug.dj/exuviax');
                    console.log(str)
                    bot.woot();
                } else {
                    bot.woot();
                }
            }
        }
    });
    client.addListener('chat', function(channel, user, message) {
        if (message.toLowerCase() == '!song') {
            var song = bot.getMedia()
            client.say(channel, 'Current song: ' + song.author + ' - ' + song.title + ' @ https://plug.dj/exuviax');
        }
    });
    setInterval(function() {
        bot.sendChat('/me Don\'t forget to get the awesome Plug3! Adding new dimensions to plug.dj and to this room! https://plugcubed.net/', 60)
    }, 1800000);
});
