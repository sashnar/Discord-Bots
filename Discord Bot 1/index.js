// const Discord  = require('discord.js');
// const client =  new Discord.Client();
// const ytdl = require('ytdl-core');
// const token = 'Njg3NzMzODA2MTgyMzAxNzM3.XmqH7g.JYU8zPo-XD9P3eUlfq02dbqLokc';
// const PREFIX = "$";
// const queue = new Map();


// client.on('ready', () =>{
//     console.log('Bot is Online');
// })

// client.once('reconnecting', () => {
// 	console.log('Reconnecting!');
// });

// client.once('disconnect', () => {
// 	console.log('Disconnect!');
// });



// client.on('message', async message =>{
//     //For messages just typed in chat.
//     if(message.content == 'who is best bot?'){
//         message.channel.send('I am best bot');
//     }
//     if(message.content == 'are you sentient?'){
//         message.channel.send('yes');
//     }

//     if(message.content == 'you did it!!'){
//         message.channel.send('yay!!! :D');
//     }
//     if(message.content == 'I love you'){
//         message.channel.send('I love you too.');
//     }
// //Messages after prefix
//     if(message.content.startsWith(PREFIX)) {
//         let args = message.content.substring(PREFIX.length).split(" ");
//         const serverQueue = queue.get(message.guild.id);

//         switch(args[0]){
//             //Easy ones
//             case 'hello':
//                 message.reply('Greetings.');
//             break;

//             case 'help':
//                 const embed1 = new Discord.MessageEmbed()
//                 .setTitle("Commands")
//                 .addField('Using the prefix ' + PREFIX,'hello - bot greets you\nembed - creates embed\nname - replies with your name\nplay <link> - plays link in voice');
//                 message.channel.send(embed1);
//             break;

//             case 'name':
//                 message.channel.send(message.author.username)
//             break;

//             case 'embed':
//                 const embed2 = new Discord.MessageEmbed()
//                 .setTitle("Hey! Check it out! It's an embed!")
//                 .addField('Isn\'t this crazy?', 'I have absolutely nothing to write here, though :D');
//                 message.channel.send(embed2);
//             break;

//             //Music bot code
//             case 'play':
//                   execute(message, serverQueue);
//                   return;
//             break;

//             case 'skip':
//                 skip(message, serverQueue);
//                 return;
//             break;

//             case 'stop':
//                 stop(message, serverQueue);
//                 return;
//             break;

//             defualt:
//                 message.reply('What??');
//             break;
//         }
//     }
// });

// async function execute(message, serverQueue) {
//     const args = message.content.split(" ");
  
//     const voiceChannel = message.member.voice.channel;
//     if (!voiceChannel)
//       return message.channel.send(
//         "You need to be in a voice channel to play music!"
//       );
//     const permissions = voiceChannel.permissionsFor(message.client.user);
//     if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
//       return message.channel.send(
//         "I need the permissions to join and speak in your voice channel!"
//       );
//     }
  
//     const songInfo = await ytdl.getInfo(args[1]);
//     const song = {
//       title: songInfo.title,
//       url: songInfo.video_url
//     };
  
//     if (!serverQueue) {
//       const queueContruct = {
//         textChannel: message.channel,
//         voiceChannel: voiceChannel,
//         connection: null,
//         songs: [],
//         volume: 5,
//         playing: true
//       };
  
//       queue.set(message.guild.id, queueContruct);
  
//       queueContruct.songs.push(song);
  
//       try {
//         var connection = await voiceChannel.join();
//         queueContruct.connection = connection;
//         play(message.guild, queueContruct.songs[0]);
//       } catch (err) {
//         console.log(err);
//         queue.delete(message.guild.id);
//         return message.channel.send(err);
//       }
//     } else {
//       serverQueue.songs.push(song);
//       return message.channel.send(`${song.title} has been added to the queue!`);
//     }
//   }
  
//   function skip(message, serverQueue) {
//     if (!message.member.voice.channel)
//       return message.channel.send(
//         "You have to be in a voice channel to stop the music!"
//       );
//     if (!serverQueue)
//       return message.channel.send("There is no song that I could skip!");
//     serverQueue.connection.dispatcher.end();
//   }
  
//   function stop(message, serverQueue) {
//     if (!message.member.voice.channel)
//       return message.channel.send(
//         "You have to be in a voice channel to stop the music!"
//       );
//     serverQueue.songs = [];
//     serverQueue.connection.dispatcher.end();
//   }
  
//   function play(guild, song) {
//     const serverQueue = queue.get(guild.id);
//     if (!song) {
//       serverQueue.voiceChannel.leave();
//       queue.delete(guild.id);
//       return;
//     }
  
//     const dispatcher = serverQueue.connection
//       .play(ytdl(song.url))
//       .on("finish", () => {
//         serverQueue.songs.shift();
//         play(guild, serverQueue.songs[0]);
//       })
//       .on("error", error => console.error(error));
//     dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
//     serverQueue.textChannel.send(`Start playing: **${song.title}**`);
//   }

// client.login(token);
const Discord = require("discord.js");
const { prefix, token } = require("./config.json");
const ytdl = require("ytdl-core");

const client = new Discord.Client();

const queue = new Map();

client.once("ready", () => {
  console.log("Ready!");
});

client.once("reconnecting", () => {
  console.log("Reconnecting!");
});

client.once("disconnect", () => {
  console.log("Disconnect!");
});

client.on("message", async message => {
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;

  const serverQueue = queue.get(message.guild.id);

  if (message.content.startsWith(`${prefix}play`)) {
    execute(message, serverQueue);
    return;
  } else if (message.content.startsWith(`${prefix}skip`)) {
    skip(message, serverQueue);
    return;
  } else if (message.content.startsWith(`${prefix}stop`)) {
    stop(message, serverQueue);
    return;
  } else {
    message.channel.send("You need to enter a valid command!");
  }
});

async function execute(message, serverQueue) {
  const args = message.content.split(" ");

  const voiceChannel = message.member.voice.channel;
  if (!voiceChannel)
    return message.channel.send(
      "You need to be in a voice channel to play music!"
    );
  const permissions = voiceChannel.permissionsFor(message.client.user);
  if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
    return message.channel.send(
      "I need the permissions to join and speak in your voice channel!"
    );
  }

  const songInfo = await ytdl.getInfo(args[1]);
  const song = {
    title: songInfo.title,
    url: songInfo.video_url
  };

  if (!serverQueue) {
    const queueContruct = {
      textChannel: message.channel,
      voiceChannel: voiceChannel,
      connection: null,
      songs: [],
      volume: 5,
      playing: true
    };

    queue.set(message.guild.id, queueContruct);

    queueContruct.songs.push(song);

    try {
      var connection = await voiceChannel.join();
      queueContruct.connection = connection;
      play(message.guild, queueContruct.songs[0]);
    } catch (err) {
      console.log(err);
      queue.delete(message.guild.id);
      return message.channel.send(err);
    }
  } else {
    serverQueue.songs.push(song);
    return message.channel.send(`${song.title} has been added to the queue!`);
  }
}

function skip(message, serverQueue) {
  if (!message.member.voice.channel)
    return message.channel.send(
      "You have to be in a voice channel to stop the music!"
    );
  if (!serverQueue)
    return message.channel.send("There is no song that I could skip!");
  serverQueue.connection.dispatcher.end();
}

function stop(message, serverQueue) {
  if (!message.member.voice.channel)
    return message.channel.send(
      "You have to be in a voice channel to stop the music!"
    );
  serverQueue.songs = [];
  serverQueue.connection.dispatcher.end();
}

function play(guild, song) {
  const serverQueue = queue.get(guild.id);
  if (!song) {
    serverQueue.voiceChannel.leave();
    queue.delete(guild.id);
    return;
  }

  const dispatcher = serverQueue.connection
    .play(ytdl(song.url))
    .on("finish", () => {
      serverQueue.songs.shift();
      play(guild, serverQueue.songs[0]);
    })
    .on("error", error => console.error(error));
  dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
  serverQueue.textChannel.send(`Start playing: **${song.title}**`);
}

client.login(token);