const Discord  = require('discord.js');
const client =  new Discord.Client();
const token = 'Njg3ODM4Nzg2Nzc1ODEwMDY2.XmrmsA.l_8pARpn6D_4ouDVDmPRTyonBtw';

const PREFIX = "&";

client.on('ready', () =>{
    console.log('Bot is Online');
    client.user.setActivity('Solitaire')
})

bot.on("guildMemberAdd" ,(message, member) => {
    bot.on('guildMemberAdd', member => {
        member.guild.channels.get('channelID').send("Welcome to the Wild West!");
        member.send('Hi, this is Gamblin\' bot! I\'m a work in progress, but I wanted to welcome you to the server.');
    });
});

client.on('message', msg=>{
    if(msg.content.startsWith(PREFIX)){
        let args = msg.content.substring(PREFIX.length).split(" ");

        switch(args[0]){
            
            case 'hello':
                msg.channel.send('Care to play a game?');
            break;

            case 'help':
                msg.channel.send('Use \"gamble\" + the game you want to start a game!');
            break;

            case 'gamble':
                switch(args[1]){
                    case 'RPS':
                        msg.reply('lets play some RockPaperScissors.');
                    break;

                    case 'blackjack':
                        msg.reply('lets play some Blackjack.');
                    break;
                    
                    case 'tictactoe':
                        msg.reply('lets play some TicTacToe.');
                    break

                    case 'hangman':
                        msg.reply('lets play some Hangman. I have sent you a DM.');
                        msg.author.send('Pick a word or phrase to play with. Enter "$use [your word/phrase]" to confirm.');
                        msg.author.dmChannel

                    break;

                    case 'death':
                        msg.reply('So you have chosen... DEATH');
                    break;
                }
            break;
        }
    }
})

client.login(token);