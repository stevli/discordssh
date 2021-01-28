require('dotenv').config();
const Discord = require('discord.js');
const fs = require('fs')
const path = require('path')
const {NodeSSH} = require('node-ssh')
const bot = new Discord.Client();
const TOKEN = process.env.TOKEN;
const ssh = new NodeSSH();

bot.login(TOKEN);

bot.on('ready', () => {
  console.info(`Logged in as ${bot.user.tag}!`);
});

listofadmins = [185494526411014144];

bot.on('message', msg => {
  admin=false;
  for(i=0; i<listofadmins.length;i++){
    if(msg.author == listofadmins[i]){
      admin=true;
    }
  }
  if(admin){
    if (msg.content === 'ping') {
      msg.reply('pong');
      //msg.channel.send('pong');

    } else if (msg.content.startsWith('!kick')) {
      if (msg.mentions.users.size) {
        const taggedUser = msg.mentions.users.first();
        msg.channel.send(`You wanted to kick: ${taggedUser.username}`);
      } else {
        msg.reply('Please tag a valid user!');
      }
    } else if (msg.content.startsWith('!screenlist')) {
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
      msg.channel.send("aaa")
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
              ssh.execCommand('echo "$(tail /home/slicloud/mcmodded/fabric/logs/latest.log -n 1)"', {}).then(function(result) {
                console.log('STDOUT: ' + result.stdout)
                console.log('STDERR: ' + result.stderr)
                msg.channel.send('Server: ' + result.stdout)
              })
            })
        })
    }else if (msg.content.startsWith('!start')){
      ssh.connect({
        host: process.env.HOST,
        username: process.env.USERNAME,
        privateKey: process.env.KEY
      }).then(function() {
        ssh.execCommand('sh /home/slicloud/mcmodded/fabric/screenserver.sh', {}).then(function(result) {
            console.log('STDOUT: ' + result.stdout)
            console.log('STDERR: ' + result.stderr)
            msg.channel.send('STDOUT: ' + result.stdout)
          })
      })
    }else if (msg.content.startsWith('!addadmin')){
      if (msg.mentions.users.size) {
        const taggedUser = msg.mentions.users.first();
        msg.channel.send(`You added admin: ${taggedUser.username}`);
        listofadmins.push(taggedUser.id);
        //msg.channel.send(taggedUser.id);
      } else {
        msg.reply('Please tag a valid user!');
      }
    }
}

});
