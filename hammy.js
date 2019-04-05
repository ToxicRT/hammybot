const Discord = require("discord.js");
const superagent = require('superagent')
const rp = require('request-promise-native')
const client = new Discord.Client();
// owner ids for feedback
const DopplerID = "295335481179373568"
const LawlietID = "295335481179373568"
const botversion = "1.0.0"
const lynx = "295335481179373568"
const fs = require("fs");
let PREF = JSON.parse(fs.readFileSync('./prefix.json', 'utf8'));
let WelcomeM = JSON.parse(fs.readFileSync('./Welcomemessages.json', 'utf8'));

//Start blacklist
const CodyID = ""

// End blacklist

// cooldown start

var cooldownUsers = [];

const checkCooldown = ((userId) => {
    if (cooldownUsers.indexOf(userId) > -1) {
        return true;
    } else {
        return false;
    }
});

const removeCooldown = ((userId, timeInSeconds) => {
    let index = cooldownUsers.indexOf(userId);
    if (index > -1) {
        setTimeout(() => {
            cooldownUsers = cooldownUsers.splice(index, 0);
        }, timeInSeconds * 1000)
    }
});

var cooldownUsers2 = [];

const checkCooldown2 = ((userId) => {
    if (cooldownUsers2.indexOf(userId) > -1) {
        return true;
    } else {
        return false;
    }
});

const removeCooldown2 = ((userId, timeInSeconds) => {
    let index = cooldownUsers2.indexOf(userId);
    if (index > -1) {
        setTimeout(() => {
            cooldownUsers2 = cooldownUsers2.splice(index, 0);
        }, timeInSeconds * 1000)
    }
});

var cooldownUsers3 = [];

const checkCooldown3 = ((userId) => {
    if (cooldownUsers3.indexOf(userId) > -1) {
        return true;
    } else {
        return false;
    }
});

const removeCooldown3 = ((userId, timeInSeconds) => {
    let index = cooldownUsers3.indexOf(userId);
    if (index > -1) {
        setTimeout(() => {
            cooldownUsers3 = cooldownUsers3.splice(index, 0);
        }, timeInSeconds * 1000)
    }
});

//cooldown end

//client.on start

client.on('ready', () => {
    console.log("Hamster is in: " + client.guilds.size + " servers.");
    // client.user.setGame(`h!help - In ${client.guilds.size} guilds!`)
    client.user.setPresence({
        game: {
            name: `h!help - In ${client.guilds.size} servers`,
            type: 0
        }
    });
    console.log("game has been set/bot is now ready")
    superagent.post(`https://discordbots.org/api/bots/330044809651814412/stats`)
        .set('Authorization', 'token')
        .send({
            server_count: (client.guilds.size)
        })
        .then(console.log('Updated discordbots.org status.'))
        .catch(e => console.warn('dbots.org down spam @oliy'));
    superagent.post(`https://bots.discord.pw/api/bots/330044809651814412/stats`)
        .set('Authorization', 'token')
        .send({
            server_count: (client.guilds.size)
        })
        .then(console.log('Updated bots.discord.pw status.'))
        .catch(e => console.warn('bots.discord.pw down spam @oliy'));
});

client.on("guildMemberAdd", async (member) => {
    let guild = member.guild;
    const defaultwelcome = "Hey, " + member.user.username + " welcome to " + guild.name + "!";
    if (!WelcomeM[guild.id]) WelcomeM[guild.id] = {
        Welcome: defaultwelcome,
        Leave: "NA",
        Disabled: "false",
        Welcomechannel: "welcome"
    }
    if (WelcomeM[guild.id].Disabled === "true") return;
    let WelcomeMess = `${WelcomeM[guild.id].Welcome}`;
    var WelcomeFix = WelcomeMess.replace("%MENTION%", "<@" + member.user.id + ">").replace("%GUILDNAME%", guild.name).replace("%NAME%", member.user.username).replace("%MEMBERCOUNT%", guild.memberCount)
    const welcomeChannel = member.guild.channels.find('name', WelcomeM[guild.id].Welcomechannel);
    if (welcomeChannel === null) return;
    client.channels.get(welcomeChannel.id).send(WelcomeFix);
});

client.on("guildMemberRemove", async (member) => {
    let guild = member.guild;
    const defaultleave = "Hey, " + member.user.username + " has left " + guild.name + "!";
    if (!WelcomeM[guild.id]) WelcomeM[guild.id] = {
        Welcome: "NA",
        Leave: defaultleave,
        Disabled: "false",
        Welcomechannel: "welcome"
    }
    if (WelcomeM[guild.id].Disabled === "true") return;
    let WelcomeMess = `${WelcomeM[guild.id].Leave}`;
    var WelcomeFix = WelcomeMess.replace("%MENTION%", "<@" + member.user.id + ">").replace("%GUILDNAME%", guild.name).replace("%NAME%", member.user.username).replace("%MEMBERCOUNT%", guild.memberCount)
    const welcomeChannel = member.guild.channels.find('name', WelcomeM[guild.id].Welcomechannel);
    if (welcomeChannel === null) return;
    client.channels.get(welcomeChannel.id).send(WelcomeFix);
});

client.on('messageDelete', message => {
    if (message.author.bot) return;
    if (message.channel.type === 'dm') return;
    if (message.content >= 1000) return;
    if (message.content <= 0) return;
    let guild = message.guild;
    let modlog = guild.channels.find('name', "logs");
    if (!modlog) return;
    const embed = new Discord.RichEmbed()
        .setColor(0x738BD7)
        .setTitle(":hamster:   Message Deleted   :hamster:")
        .addField("Message Author:", message.author.username)
        .addField("From Channel:", message.channel)
        .addField("Message Content: ", message.cleanContent)
    return client.channels.get(modlog.id).send({
        embed
    });
});

client.on('messageUpdate', (message, UpdatedMessage) => {
    if (message.author.bot) return;
    if (message.content === UpdatedMessage.content) return
    if (message.channel.type !== 'text') return;
    if (message.content > 1000) return;
    if (message.content <= 0) return;
    if (UpdatedMessage.content >= 1000) return;
    if (UpdatedMessage.content <= 0) return;
    let guild = message.guild;
    let modlog = guild.channels.find('name', "logs");
    if (!modlog) return;
    const embed = new Discord.RichEmbed()
        .setColor(0x738BD7)
        .setTitle(":hamster:   Message Edited   :hamster:")
        .addField("Message Author:", message.author.username)
        .addField("From Channel:", message.channel)
        .addField("Before Edit: ", message.content)
        .addField("After Edit: ", UpdatedMessage.content)
    client.channels.get(modlog.id).send({
        embed
    });
});

client.on("guildCreate", guild => {
    console.log(`Someone added Hamster to their discord! ${guild.name} Member count: ${guild.memberCount}!`)
});

client.on('guildDelete', guild => {
    console.log(`Someone removed Hamster to their discord! ${guild.name} Member count: ${guild.memberCount}!`)
});

client.on('error', console.error);

client.on('warn', console.warn);

// client.on end besides message message

client.on('uncaughtException', (err) => {
    console.log("error", "Uncaught Exception", err);
});

client.on("unhandledRejection", (err) => {
    console.log("Uncaught Promise Error", err);
});

client.on('message', async (message) => {
    if (message.channel.type === 'dm') return;
    if (!message.guild.member(client.user).hasPermission('SEND_MESSAGES')) return;
    const defaultprefix = "h!";
    if (!PREF[message.guild.id]) PREF[message.guild.id] = {
        prefix: defaultprefix
    }
    const prefix = PREF[message.guild.id].prefix;
    if (prefix === undefined) return prefix = "h!";
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;

    let userData = PREF[message.guild.id];
    if (!userData) userData = {
        prefix: defaultprefix
    };
    let userDataz = WelcomeM[message.guild.id];
    if (!userDataz) userDataz = {
        Welcome: "This guild hasn't set a welcome message yet use h!setwelcome",
        Leave: "This guild hasn't set a leave message yet use h!setleave",
        Disabled: "false",
        Welcomechannel: "welcome"
    };

    let command = message.content.split(" ")[0]
    command = command.slice(prefix.length)
    console.log(`[ROBOTHAMSTER] [${message.author.username}] ${command}`);

    let args = message.content.split(" ").slice(1);

    // normal commands

    if (command === "embed") {
        message.delete();
        const embed = new Discord.RichEmbed()
            .setDescription(args.join(" "))
            .setColor(0x738BD7);
        message.channel.send(embed);
    } else

    if (message.content.includes("")) {
        // do nothing
    }

    // fun commands

    if (command === "setprefix") {
        const defaultprefix = "h!"
        if (!userData) userData = {
            prefix: defaultprefix
        };
        if (!message.member.permissions.has("ADMINISTRATOR")) return message.channel.send("Sorry, you do not have permission to change the bots prefix.");
        let newprefix = args.slice(0).join('');
        if (newprefix.length < 1) return message.reply(" you did not provide a new prefix to set")
        PREF[message.guild.id].prefix = newprefix
        message.reply(" i have set the new guild prefix to: " + newprefix)
    } else

    if (command === "setwelcome") {
        if (!message.member.permissions.has("ADMINISTRATOR")) return message.channel.send("Sorry, you do not have permission to change the bots welcome message.");
        if (message.author.bot) return;
        let newprefix = args.join(' ');
        if (newprefix.includes("<" || ">" || "#")) return message.channel.send("Can only be the channel name not id")
        if (newprefix.length > 300) return message.reply(" you cant set a welcome message over 300 characters")
        if (newprefix.length < 1) return message.reply(" you did not provide a new welcome message to set")
        WelcomeM[message.guild.id].Welcome = newprefix
        message.reply(" i have set the new guild welcome message to: " + newprefix)
    } else

    if (command === "setleave") {
        if (!message.member.permissions.has("ADMINISTRATOR")) return message.channel.send("Sorry, you do not have permission to change the bots leave message.");
        if (message.author.bot) return;
        let newprefix = args.join(' ');
        if (newprefix.length > 300) return message.reply(" you cant set a leave message over 300 characters")
        if (newprefix.length < 1) return message.reply(" you did not provide a new leave message to set")
        WelcomeM[message.guild.id].Leave = newprefix
        message.reply(" i have set the new guild leave message to: " + newprefix)
    } else

    if (command === "enablewl") {
        if (!message.member.permissions.has("ADMINISTRATOR")) return message.channel.send("Sorry, you do not have permission to enable welcome/leave messages.");
        if (message.author.bot) return;
        WelcomeM[message.guild.id].Disabled = "false"
        message.reply(" i have enabled welcome/leave messages for this guild")
    } else

    if (command === "disablewl") {
        if (!message.member.permissions.has("ADMINISTRATOR")) return message.channel.send("Sorry, you do not have permission to disable welcome/leave messages.");
        if (message.author.bot) return;
        WelcomeM[message.guild.id].Disabled = "true"
        message.reply(" i have disabled welcome/leave messages for this guild")
    } else

    if (command === "setwlchannel") {
        if (!message.member.permissions.has("ADMINISTRATOR")) return message.channel.send("Sorry, you do not have permission to change the welcome/leave  output channel..");
        if (message.author.bot) return;
        let newprefix = args.join(' ');
        if (newprefix.includes("<" || ">" || "#" || "@")) return message.channel.send("Can only be the channel name not id")
        if (newprefix.length > 30) return message.reply(" you cant set the new channel that has over 30 characters in its name")
        if (newprefix.length < 1) return message.reply(" you did not provide a new channel to change it")
        WelcomeM[message.guild.id].Welcomechannel = newprefix
        message.reply(" i have set the new welcome/leave channel to: " + newprefix)
    } else

    if (command === "wur") {
        const {
            body
        } = await superagent
            .get('http://www.rrrather.com/botapi');
        const embed = new Discord.RichEmbed()
            .setTitle(`"${body.title}" Choice A Or B?`)
            .setURL(body.link)
            .setColor(0x738BD7)
            .setDescription(`${body.choicea} OR ${body.choiceb}?`);
        message.channel.send({
            embed
        }).then(m => {
            m.react('🅰');
            m.react('🅱');
        });
    } else

        //nsfw commands

        if (command === "nsfw") {
            var nsfws = require('./assets/json/nsfw.json');
            var nsfw = nsfws[Math.floor(Math.random() * nsfws.length)];
            const embed = new Discord.RichEmbed()
                .setColor(0x94BAFA)
                .setTitle("NSFW Command - ")
                .setAuthor("Requested by: " + message.author.username)
                .setDescription("Heres a NSFW photo :hamster: ")
                .setImage(nsfw);
            if (message.channel.nsfw) return message.channel.send(embed)
        } else

    if (command === "hentai") {
        var nsfws = require('./assets/json/hentai.json');
        var nsfw = nsfws[Math.floor(Math.random() * nsfws.length)];
        const embed = new Discord.RichEmbed()
            .setColor(0x738BD7)
            .setTitle("Hentai Command - ")
            .setAuthor("Requested by: " + message.author.username)
            .setDescription("Heres a Hentai photo/gif :hamster: ")
            .setImage(nsfw);
        if (message.channel.nsfw) return message.channel.send(embed)
    } else


    if (command === "ass") {
        return rp.get('http://api.obutts.ru/butts/0/1/random').then(JSON.parse).then(function(res) {
            return rp.get({
                url: 'http://media.obutts.ru/' + res[0].preview,
                encoding: null
            });
        }).then(function(res) {
            if (message.channel.nsfw) return message.channel.sendFile(res);
        });
    }

    if (command === "tits") {
        return rp.get('https://rule34.xxx//index.php?page=dapi&s=post&q=index').then(JSON.parse).then(function(res) {
            return rp.get({
                url: 'img.rule34.xxx/images/' + res[0].preview,
                encoding: null
            });
        }).then(function(res) {
            if (message.channel.nsfw) return message.channel.sendFile(res);
        });
    }

    //nsfw cmds end

    //animal commands

    if (command === "cat") {
        const {
            body
        } = await superagent // defines body and awaits superagent
            .get('http://random.cat/meow'); // Will get the api link
        const embed = new Discord.RichEmbed() // Defines the new richembed
            .setColor(0x738BD7) // sets the embeds color use hex codes not rgb
            .setTitle("Here is cat image for, " + message.author.username) // sets the embed title
            .setImage(body.file) // sets the embed image
        message.channel.send({
            embed
        }) // finally sends the embed
    } else


    if (command === "doggo") {
        var doggos = require('./assets/json/doggo.json');
        var doggo = doggos[Math.floor(Math.random() * doggos.length)];
        const embed = new Discord.RichEmbed()
            .setColor(0x738BD7)
            .setDescription("Heres a cute doggo for: " + message.author.username)
            .setImage(doggo)
        message.channel.send(embed);
    } else

        // End animal commands

        if (command === "lottery") {
            const lottery = Math.floor(Math.random() * 100) + 1;
            if (lottery === 1) return message.reply(`Wow! You actually won! Great job!`);

            else return message.reply(`Nope, sorry, you lost.`);
        } else

    if (command === "setnick") {
        if (!message.member.hasPermission("MANAGE_NICKNAMES")) {
            message.channel.send("You do not have permission to change someones nickname")
        } else {
            if (!message.guild.member(client.user).hasPermission('MANAGE_NICKNAMES')) return message.reply('Sorry, i dont have the perms to do this cmd i need MANAGE_NICKNAMES. :x:').catch(console.error);
            let changenick = message.mentions.users.first();
            let username = args.slice(1).join(' ')
            if (username.length < 1) return message.reply('You must supply a name for the client.').catch(console.error);
            if (message.mentions.users.size < 1) return message.author.send('You must mention a user to change their nickname. :x:').catch(console.error);
            message.guild.member(changenick.id).setNickname(username);
            message.channel.send("Successfully changed: " + changenick + "'s nickname")
        }
    } else

        // math cmds

        if (command === "addition") {
            let numArray = args.map(n => parseInt(n));
            let total = numArray.reduce((p, c) => p + c);

            message.channel.send(total);
        } else

    if (command === "subtract") {
        let numArray = args.map(n => parseInt(n));
        let total = numArray.reduce((p, c) => p - c);

        message.channel.send(total);
    } else

    if (command === "multiply") {
        let numArray = args.map(n => parseInt(n));
        let total = numArray.reduce((p, c) => p * c);

        message.channel.send(total);
    } else

    if (command === "divide") {
        let numArray = args.map(n => parseInt(n));
        let total = numArray.reduce((p, c) => p / c);

        message.channel.send(total);
    } else

        // end math cmds

        if (command === "donate") {
            let embed = new Discord.RichEmbed()
                .setThumbnail("http://logok.org/wp-content/uploads/2014/05/Paypal-logo-pp-2014.png")
                .setDescription("Thank you for considering donating, the bots funding costs A LOT of money, so any bit of money would help our discord bot stay alive, thank you and bot on! :hamster:")
                .setColor("0x738BD7")
                .addField("Patreon:", "https://www.patreon.com/None")
            message.channel.send({
                embed
            });
        } else


    if (command === "say") {
        message.delete();
        const embed = new Discord.RichEmbed()
            .setColor(0x738BD7)
            .setDescription(`**${message.author.username}** says ` + (args.join(' ')))
        message.channel.send({
            embed
        })
    } else

        // All link gen commands

        if (command === "lmgtfy") {
            let saybot = args.join('+');
            if (sayclient.length < 1) return message.reply('You must supply a LMGTFY.').catch(console.error);
            const embed = new Discord.RichEmbed()
                .setColor(0x738BD7)
                .setDescription(`Here you go, **${message.author.username}**: http://lmgtfy.com/?q=` + (args.join('+')))
            message.channel.send({
                embed
            })
        } else

    if (command === "imgur") {
        let saybot = args.join('+');
        if (sayclient.length < 1) return message.reply('You must supply a search query for imgur.').catch(console.error);
        const embed = new Discord.RichEmbed()
            .setColor(0x738BD7)
            .setDescription(`Here you go, **${message.author.username}**: http://imgur.com/search?q=` + (args.join('+')))
        message.channel.send({
            embed
        })
    } else

    if (command === "roblox") {
        const snekfetch = require('snekfetch')
        let saybot = args.join('_');
        const url = `https://api.roblox.com/users/get-by-username?username=${saybot}`;
        snekfetch.get(url).then(result => {
            const data = result.body.Id;
            if (!result.body.success === false) return message.channel.send("Couldn't find a roblox user for the query you provided")
            if (sayclient.length < 1) return message.channel.send("Need to provide a username to use this command")
            const embed = new Discord.RichEmbed()
                .setColor(0x738BD7)
                .setTitle("Username: " + saybot)
                .setDescription("User ID: " + result.body.Id)
                .setFooter("Profile Link: " + `https://web.roblox.com/users/${data}/profile`)
                .setThumbnail("http://www.roblox.com/Thumbs/Avatar.ashx?x=100&y=100&Format=Png&username=" + saybot);
            message.channel.send({
                embed
            })
        });
    } else

    if (command === "lyrics") {
        let saybot = args.join(' ');
        if (sayclient.length < 1) return message.reply('You must supply a valid song.').catch(console.error);
        const embed = new Discord.RichEmbed()
            .setColor(0x738BD7)
            .setDescription(`Here you go, I have retrieved the lyrics for "${saybot}", **${message.author.username}**: https://genius.com/` + (args.join('-')) + ("-lyrics"))
        message.channel.send(embed)
    } else

    if (command === "urban") {
        const urban = require('urban')
        try {
            var search = urban(args.join(' '));
        } catch (err) {
            return message.channel.send("**There were no results for this search term**");
        }
        if (!search || !search.first || typeof search.first !== "function") return;
        search.first(function(json) {
            if (json) {
                if (!json.definition || !json.example) return;
                if (json.definition.length > 1000) json.definition = json.definition.substr(0, 1000);
                if (json.example.length > 1000) json.example = json.example.substr(0, 1000);
                message.channel.send("", {
                    "embed": {
                        "url": json.permalink,
                        "color": 0x738BD7,
                        "fields": [{
                            "name": "Definition",
                            "value": json.definition
                        }, {
                            "name": "Example",
                            "value": json.example
                        }],
                    }
                })
            } else {
                message.channel.send("**There were no results for this search term**")
            }
        });
    } else

    if (command === "wiki") {
        let saybot = args.join(' ');
        if (sayclient.length < 1) return message.reply('You must supply a valid word.').catch(console.error);
        const embed = new Discord.RichEmbed()
            .setColor(0x738BD7)
            .setDescription(`Here you go, I have retrieved the wiki page for "${saybot}", **${message.author.username}**: https://en.wikipedia.org/wiki/` + (args.join('_')))
        message.channel.send(embed)
    } else

    if (command === "reportbug") {
        message.reply("error")
    } else

    if (command === "rps") {
        const choices = ['paper', 'rock', 'scissors'];
        let choice = message.content.toLowerCase().split(" ").slice(1); // Make so caps dont matter 
        const response = choices[Math.floor(Math.random() * choices.length)];
        if (choice === 'rock') {
            if (response === 'rock') return message.reply('I Picked Rock! Its A Tie.');
            else if (response === 'paper') return message.reply('I Picked Paper! I win!');
            else if (response === 'scissors') return message.reply('I Picked Scissors! Damn I Lost');
        } else if (choice === 'paper') {
            if (response === 'rock') return message.reply('I Picked Rock! Damn I Lost');
            else if (response === 'paper') return message.reply('I Picked Paper! Its A Tie');
            else if (response === 'scissors') return message.reply('I Picked Scissors! I win!');
        } else if (choice === 'scissors') {
            if (response === 'rock') return message.reply('I Picked Rock! Yes! I win!');
            else if (response === 'paper') return message.reply('I Picked Paper! Damn I Lost');
            else if (response === 'scissors') return message.reply('I Picked Scissors! Its A Tie');
        } else {
            return message.reply('That was not a valid choice please try again');
        }
    } else

    if (command === "f") {
        const embed = new Discord.RichEmbed()
            .setColor(0x738BD7)
            .setDescription(`**${message.author.username}** has pressed F to pay their respects. `)
        message.channel.send({
            embed
        })
    } else

    if (command === "announcement") {
        if (message.member.hasPermission("ADMINISTRATOR")) {
            let args = message.content.split(" ").slice(1).join(" ");
            let split = args.split("-");
            let url = args[2];
            message.channel.send("@everyone", {
                embed: {
                    color: 0x738BD7,
                    author: {
                        name: message.author.username,
                    },
                    title: ":hamster: Important Announcement:",
                    description: split[0],
                    url: split[1],
                    timestamp: new Date(),
                    footer: {
                        text: message.author.username,
                        icon_url: message.author.avatarURL,
                    }
                }
            });
        }
    } else

    if (command === "game") {
        if (message.author.id == "295335481179373568") {
            var argresult = args.join(' ');
            if (!argresult) argresult = null;
            client.user.setGame(argresult);
            message.reply("It has been set father Lawliet!");
        } else {
            message.reply("You do not have the substancial permissions. Creator of the bot only. :x:");
        }
    } else

    if (command === "status") {
        if (message.author.id == "295335481179373568") {
            var argresult = args.join(' ');
            client.user.setStatus(argresult);
            message.reply("It has been set father Lawliet!");
        } else {
            message.reply("You do not have the substancial permissions. Creator of the bot only. :x:");
        }
    } else

    if (command === "getchannels") {
        message.channel.send('Voice Channels: ' + `${message.guild.channels.filter(chan => chan.type === 'voice').size} | Text Channels:  ${message.guild.channels.filter(chan => chan.type === 'text').size}`)
    }

    if (command === "getusers") {
        message.channel.send('Bots: ' + `${message.guild.members.filter(member => member.user.bot).size} | Members: ${message.guild.memberCount}`)
    }

    // If your just starting out then you dont need to worry about sharding until your bot is in 2,500 servers
    //if (command === "shardcount") {
    // message.channel.send("Shard count: " + client.shard.count)
    //}

    // If your just starting out then you dont need to worry about sharding until your bot is in 2,500 servers
    //if (command === "shardinfo") {
    //  const embed = new Discord.RichEmbed()
    //  .setColor(0x738BD7)
    // .addField("Shards running: ", client.shard.count, true)
    // .addField("Shard ID: ", client.shard.id + 1 + "\n")
    // .addField("Shards Servering: ", (Math.round(client.guilds.size + 5)) + " servers.", true)
    //  .addField("Shards Helping: ", client.channels.size + " channels", true)
    // .addField("Shards Serving: ", client.users.size + " users", true);
    //  message.channel.send(embed)
    // } else

    if (command === "ping") {
        const embed = new Discord.RichEmbed()
            .setColor(0x738BD7)
            .setDescription(`:ping_pong: Pong! Time - **${Date.now() - message.createdTimestamp}ms** API Latency is **${Math.round(client.ping)}ms**`)
        message.channel.send(embed)
    } else

    if (command === "help") {
        const help1 = require('./assets/json/help1.json');
        const help2 = require('./assets/json/help2.json');
        const help3 = require('./assets/json/help3.json');
        const help4 = require('./assets/json/help4.json');
        const help5 = require('./assets/json/help5.json');
        message.author.send(help1).catch(console.error);
        message.author.send(help2).catch(console.error);
        message.author.send(help3).catch(console.error);
        message.author.send(help4).catch(console.error);
        message.author.send(help5).catch(console.error);
        message.channel.send(message.author.username + ", I have DMed you all the commands!")
    } else

    if (command === "authorinfo") {
        const embed = new Discord.RichEmbed()
            .setColor(0x738BD7)
            .setThumbnail(client.iconURL)
            .addField("Created by: ", "Lawliet#7010, King Crowley#3837")
            .addField("Bot is in: ", client.guilds.size + " servers")
            .addField("Bot uses: ", "Discord.js");
        message.channel.send({
            embed
        });
    } else

    if (command === "botinfo") {
        //   const memcount = client.memberCount;
        const embed = new Discord.RichEmbed()
            .setColor(0x738BD7)
            .setThumbnail(client.user.avatarURL)
            .setTitle(" :hamster: " + "Bot Info for: Robot Hamster" + " :hamster: ")
            .addField("Memory Usage", (process.memoryUsage().heapUsed / 2048 / 2048).toFixed(2) + "MB/2048MB")
            .addField("Bot's Prefix: ", "h!", true)
            .addField("Bot's ID: ", "330044809651814412", true)
            .addField("Created by: ", "Lawliet#3646, King Crowley#3837")
            .addField("Bot's uptime: ", (Math.round(client.uptime / (1000 * 60 * 60 * 24)) % 30) + " days, " + (Math.round(client.uptime / (1000 * 60 * 60)) % 24) + " hours, " + (Math.round(client.uptime / (1000 * 60)) % 60) + " minutes, and " + (Math.round(client.uptime / 1000) % 60) + " seconds.")
            //.addField("Shards running: ", client.shard.count, true)
            //.addField("Shard ID: ", client.shard.id + 1, true)
            //.addField("Shards Helping: ", (Math.round(client.guilds.size + 5)) + " servers.", true)
            //.addField("Shards Helping: ", client.channels.size + " channels", true)
            //.addField("Shards Helping: ", client.users.size + " users", true)
            // ^ Dont need this again unless sharding and bots in 2,500 servers
            .addField("Website: ", "http://robot-hamster.win")
            .addField("Bot Version: ", botversion, true)
            .addField("Library: ", "Discord.js", true);
        message.channel.send({
            embed
        });
    } else

    if (command === "serverinfo") {
        const verificationLevels = ['None', 'Low', 'Medium', 'Insane', 'Extreme'];
        const embed = new Discord.RichEmbed()
            .setThumbnail(message.guild.iconURL)
            .setColor(0x738BD7)
            .setTitle(" :hamster: " + "Server Info For: " + message.guild.name + " :hamster: ")
            .addField("Server Owner: ", message.guild.owner, true)
            .addField("Server Owner ID: ", message.guild.ownerID, true)
            .addField("Server ID: ", message.guild.id, true)
            .addField("Server Created At: ", message.guild.createdAt.toDateString(), true)
            .addField("This Server Has: ", message.guild.memberCount + " users", true)
            .addField("This Server Has: ", message.guild.members.filter(member => member.user.bot).size + " bots", true)
            .addField("Server AFK Timeout: ", message.guild.afkTimeout + " seconds", true)
            .addField("Server Channels: ", message.guild.channels.size, true)
            .addField("Server Verification Level: ", `${verificationLevels[message.guild.verificationLevel]}`, true)
            .addField("Server Region: ", message.guild.region, true);
        message.channel.send({
            embed
        });
    } else

    if (command === "serveremojis") {
        const emoji = message.guild.emojis;
        const embed = new Discord.RichEmbed()
            .addField("Server Emojis", emoji.map((e) => e).join(', '))
        message.channel.send({
            embed
        })
    }

    if (command === "serverroles") {
        const role = message.guild.roles;
        const embed = new Discord.RichEmbed()
            .addField("Server Roles", role.map((e) => e).join(', '))
        message.channel.send({
            embed
        })
    }

    if (command === "achieve") {
        const text = args.join(" ");
        if (text === null) return message.channel.send("You need to provide text for the achievement");
        if (text.length > 25) return message.reply('Text must be under 25 characters.');
        const superagent = require('superagent')
        const {
            body
        } = await superagent
            .get('https://www.minecraftskinstealer.com/achievement/a.php')
            .query({
                i: 1,
                h: 'Achievement Get!',
                t: text
            });
        return message.channel.send({
            files: [{
                attachment: body,
                name: 'achievement.png'
            }]
        });
    } else

    if (command === "poll") {
        const sayMessage = args.join(" ");
        if (message.member.hasPermission("ADMINISTRATOR")) {
            message.delete()
            if (!message.guild.member(client.user).hasPermission('MENTION_EVERYONE')) return message.reply('I do not have permission to mention everyone. :x:').catch(console.error);
            const embed = new Discord.RichEmbed()
                .setColor(0xe89633)
                .setTitle(":hamster: Robot Hamster - Poll :hamster:")
                .setDescription(`A poll has begun! React to this message to choose! The poll is: "**${sayMessage}**"!`)
            message.channel.send("@everyone ")
            message.channel.send({
                embed
            }).then(m => {
                m.react('✅');
                m.react('❌');
            });
        }
    } else

    if (command === "meme") {
        var memes = require('./assets/json/memes.json');
        var meme = memes[Math.floor(Math.random() * memes.length)];
        const embed = new Discord.RichEmbed()
            .setColor(0x738BD7)
            .setDescription("Heres a meme for: " + message.author.username)
            .setImage(meme)
        message.channel.send({
            embed
        });
    } else

    if (command === "uptime") {
        const embed = new Discord.RichEmbed()
            .addField("Bot Uptime: ", (Math.round(client.uptime / (1000 * 60 * 60 * 60)) % 60) + " days, " + (Math.round(client.uptime / (1000 * 60 * 60)) % 60) + " hours, " + (Math.round(client.uptime / (1000 * 60)) % 60) + " minutes, and " + (Math.round(client.uptime / 1000) % 60) + " seconds.")
            .setColor(0x738BD7)
        message.channel.send({
            embed
        });
    } else

    if (command === "botnick") {
        if (!message.member.hasPermission("KICK_MEMBERS")) {
            return message.reply("You do not have permission to change the bot's nickname");
        } else {
            let username = args.join(' ');
            if (username.length < 1) return message.reply('You must supply a name for the client.').catch(console.error);
            message.guild.members.get('330044809651814412').setNickname(username);
            const embed = new Discord.RichEmbed()
                .setColor(0x738BD7)
                .addField("Bot username set successfully!", username + " is now the nickname for the bot :white_check_mark:");
            message.channel.send({
                embed
            }).catch(console.error);
        }
    } else

    if (command === "invite") {
        message.channel.send("Here's a invite link to invite the bot to your server, see you there!")
        const embed = new Discord.RichEmbed()
            .setColor(0x738BD7)
            .setDescription(`https://discordapp.com/oauth2/authorize?client_id=495061115504558125&scope=bot&permissions=2146958847`);
        message.channel.send({
            embed
        })
    } else

    if (command === "roast") {
        let user = message.mentions.users.first();
        if (message.mentions.users === message.author.username) return message.reply('You can not roast yourself');
        if (message.mentions.users.size < 1) return message.reply('You must mention someone to roast them.').catch(console.error);
        var roast = require('./assets/json/roasts.json');
        var roasts = roast[Math.floor(Math.random() * roast.length)];
        const embed = new Discord.RichEmbed()
            .setColor(0x738BD7)
            .setDescription(user.username + ", " + roasts);
        message.channel.send({
            embed
        })
    } else

    if (command === "feedback") {
        let feedback = args.join(' ');
        if (message.author.id === CodyID) return message.reply("you have been blacklisted from using this command").catch(console.error);
        if (feedback.length < 10) return message.reply('Feedback is to short minimum of 10 characters.').catch(console.error);
        if (checkCooldown(message.author.id)) {
            message.channel.send("Sorry! Please wait another 60 mins to give more feedback but this is to prevent spamming of this feature.");
            return;
        }
        cooldownUsers.push(message.author.id);
        removeCooldown(message.author.id, 3600);
        client.users.get(DopplerID).send("Doppler, a user has given feedback on the bot: " + feedback + " | Sent in by: " + message.author.username);
        client.users.get(LawlietID).send("Lawliet, a user has given feedback on the bot: " + feedback + " | Sent in by: " + message.author.username);
        message.reply("thanks for choosing to give feedback it has been sent!")
    } else

    if (command == "reminder") {
        let chrono = require("chrono-node");
        var moment = require('moment');
        let messagez = args.join(' ');
        if (messagez.length < 1) return message.channel.send('Incorrect format. !reminder <minutes> <message>');
        return new Promise((resolve) => {
            if (!isNaN(messagez[0])) {
                const time = parseInt(messagez[0]);
                if (time > 10080 || isNaN(time)) return message.channel.send('Maximum time is 7 days (10080 minutes)');
                if (time < 1) return message.channel.send('Time must be at least 1 minute.');
                setTimeout(() => {
                    message.reply(`:hamster: Remember: ${messagez.split(' ').slice(1).join(' ')}! :hamster:`);
                }, time * 60000);
                const minutemessage = time === 1 ? 'minute' : 'minutes';
                return message.channel.send(`Reminding you in ${time} ${minutemessage}.`);
            }

            const results = chrono.parse(messagez);
            if (results.length === 0) return message.channel.send('Error parsing date. Try using format: !remind <minutes> <message>');

            let endTime = moment(results[0].start.date());
            const currentTime = new moment();
            let duration = moment.duration(endTime.diff(currentTime));
            let minutes = Math.round(duration.asMinutes());

            if (minutes < 1) {
                if (results[0].end) {
                    endTime = results[0].end.date();
                    duration = moment.duration(endTime.diff(currentTime));
                    minutes = duration.asMinutes();
                }
                if (minutes < 1) {
                    return message.channel.send('Time must be at least 1 minute.')
                }
            }
            if (minutes > 2880) return message.channel.send('Maximum time is 2 days (2880 minutes)');

            setTimeout(() => {
                message.reply(`:hamster: Remember: "${messagez}"! :hamster:`);
            }, minutes * 60000);
            const minutemessage = minutes === 1 ? 'minute' : 'minutes';
            return message.channel.send(`Reminding you in ${minutes} ${minutemessage} for ${messagez}.`);
        });
    } else

    if (command === "russianroulette") {
        var roulette = [':gun: Pow! You are dead , try again?', ':gun: Luckily for yourself, ***you survived***! Would you like to test your luck again ?', ':gun: Oh darn, it didnt shoot! Or Is that a good thing? (Try Again)'];
        message.channel.send(roulette[Math.floor(Math.random() * roulette.length)]);
    } else

    if (command === "rr") {
        var roulette = [':gun: Pow! You are dead , try again?', ':gun: Luckily for yourself, ***you survived***! Would you like to test your luck again ?', ':gun: Oh darn, it didnt shoot! Or Is that a good thing? (Try Again)'];
        message.channel.send(roulette[Math.floor(Math.random() * roulette.length)]);
    } else

    if (command === "8ball") {
        let reason = args.join(' ');
        if (reason.length < 1) return message.channel.send('You did not give the bot a question');
        var ball = ['It is certain.', 'No doubt about it.', 'No chance.', 'Maybe, time will tell.', 'No way.', 'Concentrate and try again.'];
        const embed = new Discord.RichEmbed()
            .setColor(0x738BD7)
            .setTimestamp()
            .addField("The 8ball says:", ball[Math.floor(Math.random() * ball.length)])
            .setThumbnail("http://www.pngmart.com/files/3/8-Ball-Pool-Transparent-PNG.png")
        message.channel.send(embed)
    } else

    if (command === "ship") {
        var ship = Math.floor(Math.random() * 100) + 1;
        message.channel.send(ship + "%");
    } else


    if (command === "coinflip") {
        var coinflip = ['Heads!', 'Tails!'];
        message.channel.send(coinflip[Math.floor(Math.random() * coinflip.length)]);
    } else

    if (command === "getprefix") {
        message.reply(" the current prefix is: " + prefix)
    }

    if (command === "version") {
        message.channel.send("Bot version 1.2.1")
    } else

    if (command === "botstatus") {
        const botstatus = ['Online', 'Idle', 'Do Not Disturb', 'Invisable'];
        const embed = new Discord.RichEmbed()
            .addField("Bot Status: ", `${botstatus[client.status]}`);
        message.channel.send(embed)
    } else

    if (command === "clean") {
        if (!message.member.permissions.has("BAN_MEMBERS")) return message.channel.send("Sorry, you do not have permission to perform the clean command.");
        let num = (!!args.slice(0).join(' ')) ? parseInt(args.slice(0).join(' ')) || 20 : 20;
        message.channel.fetchMessages({
            limit: num
        }).then(messages => {
            let ms = messages.filter(m => m.author.id === client.user.id);
            if (ms.size === 1) {
                ms.first().delete();
                return message.channel.send("**Hammys messages have been deleted**")
            }
            if (ms.size < 1) return send("**No messages found to clean**")
            message.channel.bulkDelete(ms, true).then(() => message.channel.send("**Hammys messages have been deleted**"))
        })
    }

    //Moderation/admin commands

    if (command === "purge") {
        const usage = new Discord.RichEmbed()
            .setColor(0x738BD7)
            .setThumbnail(client.user.avatarURL)
            .addField("Usage: ", "h!purge <amount>")
            .addField("Usage 2: ", "h!purge @Someone <amount>")
            .addField("Example: ", "h!purge <amount> server raided")
            .addField("Example 2: ", "h!purge @Someone <amount> user was spamming");
        let modlog = message.guild.channels.find('name', "logs");
        message.delete();
        if (!message.member.permissions.has("MANAGE_MESSAGES")) {
            message.channel.send('Sorry, you do not have permission to perform the purge command. :x:');
            return;
        } else if (!message.channel.permissionsFor(client.user).has("MANAGE_MESSAGES")) {
            message.channel.send("Sorry, i dont have the perms to do this cmd i need MANAGE_MESSAGES. :x:");
            return;
        }
        const user = message.mentions.users.first();
        const amount = !!parseInt(message.content.split(' ')[2]) ? parseInt(message.content.split(' ')[2]) : parseInt(message.content.split(' ')[1])
        if (!amount) return message.channel.send('Please specify an amount to delete! :x:');
        if (!amount && !user) return message.channel.send('Please specify a user and amount, or just an amount of messages to purge! :x:');
        message.channel.fetchMessages({
            limit: amount,
        }).then((messages) => {
            if (user) {
                const filterBy = user ? user.id : client.user.id;
                messages = messages.filter(m => m.author.id === filterBy).array().slice(0, amount);
            }
            message.channel.bulkDelete(messages, true).catch(error => console.log(error.stack));
            message.channel.send("***The server messages/users messages has been successfully purged! :white_check_mark:***")
            const embed = new Discord.RichEmbed()
                .setColor(0x738BD7)
                .addField('Moderator:', `${message.author.username}#${message.author.discriminator}`)
                .addField('Actions Taken:', 'Purge')
                .addField('Purge amount: ', "" + amount)
            if (!modlog) return;
            return client.channels.get(modlog.id).send({
                embed
            });
        })
    } else

    if (command === "antiraid") {
        if (!message.member.permissions.has("BAN_MEMBERS")) return message.channel.send("Sorry, you do not have permission to perform the antiraid command.");
        if (!message.guild.member(client.user).hasPermission('BAN_MEMBERS')) return message.reply('Sorry, i dont have the perms to do this cmd i need BAN_MEMBERS. :x:').catch(console.error);
        const ms = require('ms');
        if (!client.lockit) client.lockit = [];
        const time = args.join(' ');
        const validUnlocks = ['release', 'unlock'];
        if (!time) return message.reply('You must set a duration for the lockdown in either hours, minutes or seconds');

        if (validUnlocks.includes(time)) {
            message.channel.overwritePermissions(message.guild.id, {
                SEND_MESSAGES: null
            }).then(() => {
                message.channel.send('Lockdown lifted.');
                clearTimeout(client.lockit[message.channel.id]);
                delete client.lockit[message.channel.id];
            }).catch(error => {
                console.log(error);
            });
        } else {
            message.channel.overwritePermissions(message.guild.id, {
                SEND_MESSAGES: false
            }).then(() => {
                message.channel.send(`Channel locked down for ${ms(ms(time), { long:true })}`).then(() => {

                    client.lockit[message.channel.id] = setTimeout(() => {
                        message.channel.overwritePermissions(message.guild.id, {
                            SEND_MESSAGES: null
                        }).then(message.channel.send('Lockdown lifted.')).catch(console.error);
                        delete client.lockit[message.channel.id];
                    }, ms(time));

                }).catch(error => {
                    console.log(error);
                });
            });
        }
    } else

    if (command === "softban") {
        const usage = new Discord.RichEmbed()
            .setColor(0x738BD7)
            .setThumbnail(client.user.avatarURL)
            .addField("Usage: ", "h!softban @Someone <reason>")
            .addField("Example: ", "h!softban @Someone for trying to start trouble");
        if (message.member.hasPermission("KICK_MEMBERS")) {
            if (!message.guild.member(client.user).hasPermission('KICK_MEMBERS')) return message.reply('Sorry, i dont have the perms to do this cmd i need KICK_MEMBERS. :x:').catch(console.error);
            let reason = args.slice(1).join(' ') || `Moderator didn't give a reason.`;
            if (message.mentions.users.size < 1) return message.channel.send(usage).catch(console.error);
            let user = message.guild.member(message.mentions.users.first());
            if (user.highestRole.position >= message.member.highestRole.position) return message.reply('I cant softban that member. they are the same level as you or higher. :x:');
            //if (!Setlogmaster[message.guild.id]) Setlogmaster[message.guild.id] = {Logchannel : "logs"}
            let modlog = message.guild.channels.find('name', "logs");
            if (!message.guild.member(user).bannable) return message.reply('This member is not banable. Perhaps they have a higher role than me?');
            if (reason.length < 1) return message.channel.send(usage).catch(console.error);
            message.channel.send("***The User has been successfully been soft banned! :white_check_mark:***")
            message.guild.ban(user, 2);
            message.guild.unban(user, 2);
            const embed = new Discord.RichEmbed()
                .setColor(0x738BD7)
                .addField('Moderated User:', `${user.user.username}#${user.user.discriminator} (${user.user.id})`)
                .addField('Moderator:', `${message.author.username}#${message.author.discriminator}`)
                .addField('Actions Taken:', 'Soft Ban')
                .addField('Reason Given:', reason);
            if (!modlog) return;
            return client.channels.get(modlog.id).send({
                embed
            });
        }
    } else

    if (command === "mute") {
        const usage = new Discord.RichEmbed()
            .setColor(0x738BD7)
            .setThumbnail(client.user.avatarURL)
            .addField("Usage: ", "h!mute @Someone <reason>")
            .addField("Example: ", "h!mute @Someone for spamming in general");
        if (message.member.hasPermission("KICK_MEMBERS")) {
            if (!message.guild.member(client.user).hasPermission('KICK_MEMBERS')) return message.reply('Sorry, i dont have the perms to do this cmd i need KICK_MEMBERS. :x:').catch(console.error);
            if (message.mentions.users.size < 1) return message.channel.send(usage).catch(console.error);
            let user = message.guild.member(message.mentions.users.first());
            if (user.highestRole.position >= message.member.highestRole.position) return message.reply('I cant mute that member. they are the same level as you or higher. :x:');
            let reason = args.slice(1).join(' ') || `Moderator didn't give a reason.`;
            //if (!Setlogmaster[message.guild.id]) Setlogmaster[message.guild.id] = {Logchannel : "logs"}
            let modlog = message.guild.channels.find('name', "logs");
            if (reason.length < 1) return message.channel.send(usage).catch(console.error);
            let muteRole = client.guilds.get(message.guild.id).roles.find('name', 'Muted');
            if (!muteRole) return message.channel.send(":hamster: I can not find a Muted role :x:");

            const embed = new Discord.RichEmbed()
                .setColor(0x738BD7)
                .addField('Moderated User:', `${user.user.username}#${user.user.discriminator} (${user.user.id})`)
                .addField('Moderator:', `${message.author.username}#${message.author.discriminator}`)
                .addField('Actions Taken:', 'Mute or Unmute :shrug:')
                .addField('Reason Provided:', reason);

            message.guild.member(user).addRole(muteRole).then(() => {
                message.channel.send("***The user has been successfully muted! :white_check_mark:***")
                if (!modlog) return;
                client.channels.get(modlog.id).send({
                    embed
                }).catch(console.error);
            });
        }
    } else



    if (command === "unmute") {
        const usage = new Discord.RichEmbed()
            .setColor(0x738BD7)
            .setThumbnail(client.user.avatarURL)
            .addField("Usage: ", "h!unmute @Someone <reason>")
            .addField("Example: ", "h!unmute @Someone for muted time is over");
        if (message.member.hasPermission("KICK_MEMBERS")) {
            if (!message.guild.member(client.user).hasPermission('KICK_MEMBERS')) return message.reply('Sorry, i dont have the perms to do this cmd i need KICK_MEMBERS. :x:').catch(console.error);
            if (message.mentions.users.size < 1) return message.channel.send(usage).catch(console.error);
            let user = message.guild.member(message.mentions.users.first());
            if (user.highestRole.position >= message.member.highestRole.position) return message.reply('I cant unmute that member. they are the same level as you or higher. :x:');
            let reason = args.slice(1).join(' ') || `Moderator didn't give a reason.`;
            //if (!Setlogmaster[message.guild.id]) Setlogmaster[message.guild.id] = {Logchannel : "logs"}
            let modlog = message.guild.channels.find('name', "logs");
            let muteRole = client.guilds.get(message.guild.id).roles.find('name', 'Muted');
            if (!muteRole) return message.reply('I cant find a Muted role :x:').catch(console.error);
            if (reason.length < 1) return message.channel.send(usage).catch(console.error);

            const embed = new Discord.RichEmbed()
                .setColor(0x738BD7)
                .addField('Moderated User:', `${user.user.username}#${user.user.discriminator} (${user.user.id})`)
                .addField('Moderator:', `${message.author.username}#${message.author.discriminator}`)
                .addField('Actions Taken:', 'Unmute :shrug:')
                .addField('Reason Provided:', reason);

            if (message.guild.member(user).roles.has(muteRole.id)) {
                message.guild.member(user).removeRole(muteRole).then(() => {
                    if (!modlog) return;
                    client.channels.get(modlog.id).send({
                        embed
                    }).catch(console.error);
                    message.channel.send("***The user has been successfully unmuted! :white_check_mark:***")
                });
            }
        }
    } else

    if (command === "unban") {
        const usage = new Discord.RichEmbed()
            .setColor(0x738BD7)
            .setThumbnail(client.user.avatarURL)
            .addField("Usage: ", "h!unban @Someone <reason>")
            .addField("Example: ", "h!unban @Someone asked for a second chance");
        if (message.member.hasPermission("BAN_MEMBERS")) {
            if (!message.guild.member(client.user).hasPermission('BAN_MEMBERS')) return message.reply('Sorry, i dont have the perms to do this cmd i need BAN_MEMBERS. :x:').catch(console.error);
            let user = args.slice(0).join(' ');
            let reason = args.slice(1).join(' ');
            if (reason.length < 1) return message.channel.send(usage).catch(console.error);
            if (!user) return message.reply('You must supply a User Resolvable, such as a user id.').catch(console.error);
            message.guild.unban(user.id);
        }
    } else

    if (command === "createrole") {
        if (message.member.hasPermission("MANAGE_ROLES")) {
            let guild = message.member.guild;
            let rolename = args.slice(1).join('');
            let color2 = args.slice(2).join('');
            console.log(rolename + " | " + color2 + " was created")
            if (rolename.length < 1) return message.reply('You must give a name for the role. :x:');
            if (color2.length < 1) return message.reply('You must give a color for the role. :x:');
            guild.createRole({
                name: `${rolename}`,
                color: `${color2}`
            });
            message.reply("I have made the role: " + rolename + " With the color: " + color2);
        }
    } else

    if (command === "hackban") {
        if (message.member.hasPermission("BAN_MEMBERS")) {
            if (!message.guild.member(client.user).hasPermission('BAN_MEMBERS')) return message.reply('Sorry, i dont have the perms to do this cmd i need BAN_MEMBERS. :x:').catch(console.error);
            const usage = new Discord.RichEmbed()
                .setColor(0x738BD7)
                .setThumbnail(client.user.avatarURL)
                .addField("Usage: ", "h!hackban <userid> <reason>")
                .addField("Example: ", "h!hackban 330044809651814412 self bot that dms add links");
            let user = args.slice(0).join(' ');
            let reason = args.slice(1).join(' ') || `Moderator didn't give a reason.`;
            if (reason.length < 1) return message.channel.send(usage).catch(console.error);
            if (!user) return message.reply('You must supply a User Resolvable, such as a user id.').catch(console.error);
            let guild = message.member.guild;
            if (user.length < 1) return message.channel.send("need to provide a valid user id to ban them");
            //if (!Setlogmaster[message.guild.id]) Setlogmaster[message.guild.id] = {Logchannel : "logs"}
            let modlog = message.guild.channels.find('name', "logs");
            message.guild.ban(user, 2);
            const embed = new Discord.RichEmbed()
                .setColor(0x738BD7)
                //.setDescription("Case: " + caseNum + "Action: ")
                .addField('Moderated User:', `ID: ` + user)
                .addField('Moderator:', `${message.author.username}#${message.author.discriminator}`)
                .addField('Actions Taken:', 'Hack Ban')
                .addField('Reason Given:', "Moderator didn't give a reason.");
            message.channel.send("ID: " + user + ", has been banned from the server.")
            if (!modlog) return;
            client.channels.get(modlog.id).send({
                embed
            });
        }
    } else

    if (command === "giverole") {
        if (message.member.hasPermission("MANAGE_ROLES")) {
            if (message.mentions.users.size < 1) return message.channel.send(usage).catch(console.error);
            let user = message.guild.member(message.mentions.users.first());
            if (user.highestRole.position >= message.member.highestRole.position) return message.reply('I cant give a role to that member. they are the same level as you or higher. :x:');
            let roleID = args.slice(1).join(' ')
            let guild = message.member.guild;
            //if (!Setlogmaster[message.guild.id]) Setlogmaster[message.guild.id] = {Logchannel : "logs"}
            let modlog = message.guild.channels.find('name', "logs");
            if (roleID.length < 5) return message.reply('You must give a role ID to add a user to it');
            if (!roleID) return message.channel.send("Role may not exist make sure you spell it exact")
            message.guild.member(user).addRole(roleID);
            guild.member(user).addRole(roleID);
            message.channel.send(user.username + ", has been given the role: " + roleID)
            const embed = new Discord.RichEmbed()
                .setColor(0x738BD7)
                .addField('Moderated User:', `${user.user.username}#${user.user.discriminator} (${user.user.id})`)
                .addField('Moderator:', `${message.author.username}#${message.author.discriminator}`)
                .addField('Actions Taken:', 'Given role')
                .addField('Reason Provided:', roleID);
            if (!modlog) return;
            client.channels.get(modlog.id).send({
                embed
            }).catch(console.error);
        }
    } else



    if (command === "ban") {
        const usage = new Discord.RichEmbed()
            .setColor(0x738BD7)
            .setThumbnail(client.user.avatarURL)
            .addField("Usage: ", "h!ban @Someone <reason>")
            .addField("Example: ", "h!ban @Someone for ad links to other discords");
        if (message.member.hasPermission("BAN_MEMBERS")) {
            if (!message.guild.member(client.user).hasPermission('BAN_MEMBERS')) return message.reply('Sorry, i dont have the perms to do this cmd i need BAN_MEMBERS. :x:').catch(console.error);
            if (message.mentions.users.size < 1) return message.channel.send(usage).catch(console.error);
            let user = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args.slice(0).join(" "));
            if (user.highestRole.position >= message.member.highestRole.position) return message.reply('I cant ban that member. they are the same level as you or higher. :x:');
            let reason = args.slice(1).join(' ') || `Moderator didn't give a reason.`;
            //if (!Setlogmaster[message.guild.id]) Setlogmaster[message.guild.id] = {Logchannel : "logs"}
            let modlog = message.guild.channels.find('name', "logs");
            if (reason.length < 1) return message.channel.send(usage).catch(console.error);
            if (!message.guild.member(user).bannable) return message.reply('I cant ban that member. This may be happening because they are above me. :x:');
            message.guild.ban(user, 2);
            message.channel.send("***The User has been successfully banned! :white_check_mark:***")

            const embed = new Discord.RichEmbed()
                .setColor(0x738BD7)
                .addField('Moderated User:', `${user.user.username}#${user.user.discriminator} (${user.user.id})`)
                .addField('Moderator:', `${message.author.username}#${message.author.discriminator}`)
                .addField('Actions Taken:', 'Ban')
                .addField('Reason Given:', reason)
            if (!modlog) return;
            return client.channels.get(modlog.id).send({
                embed
            });
        }
    } else

    if (command === "warn") {
        const usage = new Discord.RichEmbed()
            .setColor(0x738BD7)
            .setThumbnail(client.user.avatarURL)
            .addField("Usage: ", "h!warn @Someone <reason>")
            .addField("Example: ", "h!warn @Someone for talking in suggestions");
        if (message.member.hasPermission("KICK_MEMBERS")) {
            if (!message.guild.member(client.user).hasPermission('KICK_MEMBERS')) return message.reply('Sorry, i dont have the perms to do this cmd i need KICK_MEMBERS. :x:').catch(console.error);
            let reason = args.slice(1).join(' ') || `Moderator didn't give a reason.`;
            if (message.mentions.users.size < 1) return message.channel.send(usage).catch(console.error);
            let user = message.guild.member(message.mentions.users.first());
            if (user.highestRole.position >= message.member.highestRole.position) return message.reply('I cant warn that member. they are the same level as you or higher. :x:');
            let modlog = message.guild.channels.find('name', "logs");
            if (reason.length < 1) return message.channel.send(usage).catch(console.error);
            message.channel.send("***" + user.user.username + " has been successfully warned! :white_check_mark:***")
            user.send("You have recieved a warning from: " + message.author.username + " for: " + reason)
            const embed = new Discord.RichEmbed()
                .setColor(0x738BD7)
                .addField('Moderated User:', `${user.user.username}#${user.user.discriminator} (${user.user.id})`)
                .addField('Moderator:', `${message.author.username}#${message.author.discriminator}`)
                .addField('Actions Taken:', 'Warn')
                .addField('Reason Provided:', reason)
            if (!modlog) return;
            client.channels.get(modlog.id).send({
                embed
            });
        }
    } else

    if (command === "kick") {
        const usage = new Discord.RichEmbed()
            .setColor(0x738BD7)
            .setThumbnail(client.user.avatarURL)
            .addField("Usage: ", "h!kick @Someone <reason>")
            .addField("Example: ", "h!kick @Someone for disrespecting staff");
        if (message.member.hasPermission("KICK_MEMBERS")) {
            if (!message.guild.member(client.user).hasPermission('KICK_MEMBERS')) return message.reply('Sorry, i dont have the perms to do this cmd i need KICK_MEMBERS. :x:').catch(console.error);
            let reason = args.slice(1).join(' ') || `Moderator didn't give a reason.`;
            if (message.mentions.users.size < 1) return message.channel.send(usage).catch(console.error);
            let user = message.guild.member(message.mentions.users.first());
            if (user.highestRole.position >= message.member.highestRole.position) return message.reply('I cant kick that member. they are the same level as you or higher. :x:');
            let modlog = message.guild.channels.find('name', "logs");
            if (reason.length < 1) return message.channel.send(usage).catch(console.error);
            message.channel.send("***The User has been successfully kicked! :white_check_mark:***")
            if (!message.guild.member(user).kickable) return message.reply('I cant kick that member :x:');
            message.guild.member(user).kick();
            const embed = new Discord.RichEmbed()
                .setColor(0x738BD7)
                .addField('Moderated User:', `${user.user.username}#${user.user.discriminator} (${user.user.id})`)
                .addField('Moderator:', `${message.author.username}#${message.author.discriminator}`)
                .addField('Actions Taken:', 'Kick')
                .addField('Reason Provided:', reason);
            if (!modlog) return;

            return client.channels.get(modlog.id).send({
                embed
            });
        }
    } else

        // Didnt finsh this but maybe someone will fix it up or ill get to it someday
        /*if (command === "setlogs") {
          let reason = args.slice(0).join(' ')
          if (reason.length < 1) return message.channel.send("Need to provide a channel for the new logs to go to").catch(console.error);
          if (reason.includes("<" || ">" || "#" || "@")) return message.channel.send("Can only be the channel name not id")
          "logs" = `${reason}`
          message.channel.send("I have set the new logs channel to " + reason)
        } */

        if (command === "foo") {
            message.reply(' bar!');
        } else

    if (command === "bar") {
        message.reply(' food!');
    } else

    if (command === "tableflip") {
        message.reply("(╯°□°）╯︵ ┻━┻")
    } else

    if (command == "lenny") {
        message.reply("( ͡° ͜ʖ ͡°)")
    } else

    if (command === "unflip") {
        message.reply("┬─┬﻿ ノ( ゜-゜ノ)")
    } else

    if (command === "disabledshrug") {
        message.reply("He's disabled be nice! ¯\_(ツ)_/¯")
    } else

    if (command === "shrug") {
        message.reply("¯\\_(ツ)_/¯")
    } else

    if (command === "info") {
        let user = message.mentions.users.first();
        const status2 = message.author.presence.status;
        const untaggedembed = new Discord.RichEmbed()
            .setThumbnail(message.author.avatarURL)
            .setColor(0x738BD7)
            .addField("Account Username:", `${message.author.tag}`)
            .addField("User ID:", message.author.id)
            .addField("Discord user was created on:", message.author.createdAt.toDateString())
            .addField("Last Message: ", message.author.lastMessage)
            .addField("User Status: ", status2)
            .addField("Nickname:", message.member.displayName) || 'None';
        if (message.mentions.users.size < 1) return message.channel.send({
            untaggedembed
        })
        if (!user === '<@330044809651814412>') return message.channel.send("Can't get info for Robot Hamster")
        const status = user.presence.status;
        // If a user is tagged
        const taggedembed = new Discord.RichEmbed()
            .setThumbnail(user.avatarURL)
            .setColor(0x738BD7)
            .setDescription("This is " + user.username + "'s" + " Discord Info!")
            .addField("Account Username:", `${user.username}#${user.discriminator}`)
            .addField("User ID:", user.id)
            .addField("Is this User a Bot [T/F]: ", user.bot)
            .addField("Discord user was created on:", user.createdAt.toDateString())
            .addField("User Status: ", status)
            .addField("Playing: ", user.presence.game !== null ? user.presence.game.name : "Nothing", )
        message.channel.send({
            taggedembed
        });
    } else


        // Can use if you have cleverbot api
        /*if (command === "cb") {
            client.write(message.content, (response) => {
              message.channel.startTyping()
              setTimeout(() => {
                const embed = new Discord.RichEmbed()
                .setColor(0x738BD7)
               .setDescription(' **Hammy says..** ' + message.author.username + ' ' + response.output);
                message.channel.send({embed})
                message.channel.stopTyping()
              }, Math.random() * (1 - 3) + 1 * 1000);
            });
           } else */

        if (command === "avatar") {
            let user = message.mentions.users.first();
            if (message.mentions.users.size < 1) return message.reply('You must mention someone to get their avatar. :x:').catch(console.error);
            const embed = new Discord.RichEmbed()
                .setDescription('Here is the avatar for,' + user.username)
                .setImage(user.avatarURL)
                .setColor(0x738BD7)
            message.channel.send(embed)
        } else

    if (command === "eval") {
        if (message.author.id !== "295335481179373568" && message.author.id !== "346068207334850562") return message.channel.send("Only owners can use this command")
        try {
            var code = args.join(" ");
            if (code === "client.token") return message.channel.send("Dont wanna do that 0_0")
            var evaled = eval(code);

            if (typeof evaled !== "string")
                evaled = require("util").inspect(evaled);

            const embed = new Discord.RichEmbed()
                .setColor(0x738BD7)
                .addField(":inbox_tray: Input: ", `\`\`\`${code}\`\`\``)
                .addField(":outbox_tray: output: ", `\`\`\`js\n${clean(evaled)}\n\`\`\``)
                .setFooter(`Executed in: ${Date.now() - message.createdTimestamp}ms`)
            message.channel.send({
                embed
            })
        } catch (err) {
            const embed = new Discord.RichEmbed()
                .setColor(0x738BD7)
                .addField(":inbox_tray: Input: ", `\`\`\`${code}\`\`\``)
                .addField(":outbox_tray: output: ", `\`\`\`${clean(err)}\`\`\``)
                .setFooter(`Executed in: ${Date.now() - message.createdTimestamp}ms`)
            message.channel.send({
                embed
            })
        }
    }

    fs.writeFileSync('./prefix.json', JSON.stringify(PREF), console.error);
    fs.writeFileSync('./Welcomemessages.json', JSON.stringify(WelcomeM), console.error);

});

function clean(text) {
    if (typeof(text) === 'string')
        return text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203));
    else
        return text;
}


client.login('NTE3NDI5NjQ4NDk4NDkxMzkz.D26-IQ.O3TB_LAo7r2pzyPy0fX9jd7Frbo');
