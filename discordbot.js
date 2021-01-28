require('dotenv').config();
const Discord = require('discord.js');
const fs = require('fs')
const path = require('path')
const {NodeSSH} = require('node-ssh')
const bot = new Discord.Client();
const TOKEN = process.env.TOKEN;
const ssh = new NodeSSH();

bot.login(TOKEN);
//hiaaA
bot.on('ready', () => {
  console.info(`Logged in as ${bot.user.tag}!`);
});

bot.on('message', msg => {
  if (msg.content === 'ping') {
    msg.reply('pong');
    msg.channel.send('pong');

  } else if (msg.content.startsWith('!kick')) {
    if (msg.mentions.users.size) {
      const taggedUser = msg.mentions.users.first();
      msg.channel.send(`You wanted to kick: ${taggedUser.username}`);
    } else {
      msg.reply('Please tag a valid user!');
    }
  } else if (msg.content.startsWith('!ssh')) {
    ssh.connect({
        host: process.env.HOST,
        username: process.env.USERNAME,
        privateKey: process.env.KEY
      }).then(function() {
        ssh.execCommand('screen -list', {}).then(function(result) {
            console.log('STDOUT: ' + result.stdout)
            console.log('STDERR: ' + result.stderr)
            msg.channel.send('STDOUT: ' + result.stdout)
          })
      })
  } else if (msg.content.startsWith('!test')) {
    msg.channel.send(process.env.USERNAME)
  } else if (msg.content.startsWith('!ste')) {
    mymsg=msg.content.substring(5);
    //msg.channel.send(mymsg);
    command = `cd&&sh screenscript.sh  "${mymsg} ^M"`;
    ssh.connect({
        host: process.env.HOST,
        username: process.env.USERNAME,
        privateKey: process.env.KEY
      }).then(function() {
        ssh.execCommand(command, {}).then(function(result) {
            console.log('STDOUT: ' + result.stdout)
            console.log('STDERR: ' + result.stderr)
            //msg.channel.send('Server: ' + result.stdout)
            ssh.execCommand(command, {}).then(function(result) {
                console.log('STDOUT: ' + result.stdout)
                console.log('STDERR: ' + result.stderr)
                //msg.channel.send('Server: ' + result.stdout)
                
              })
          })
      })
  }

});
