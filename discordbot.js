require('dotenv').config();
const Discord = require('discord.js');
const fs = require('fs')
const path = require('path')
const {NodeSSH} = require('node-ssh')
const bot = new Discord.Client();
const TOKEN = process.env.TOKEN;
const ssh = new NodeSSH();

bot.login(TOKEN);

const prefix = "!ste ";
const mcdirectory = "";
const mclogs = "";

bot.on('ready', () => {
  console.info(`Logged in as ${bot.user.tag}!`);
});

listofadmins = [185494526411014144,102264443445989376];

bot.on('message', msg => {
  admin=true;
  for(i=0; i<listofadmins.length;i++){
    if(msg.author == listofadmins[i]){
      admin=true;
    }
  }
  if(admin){
    if (msg.content === 'ping') {
      msg.reply('pong');
      //msg.channel.send('pong');

    } else if (msg.content.startsWith(prefix + 'bot')) {
      if (msg.mentions.users.size) {
        const taggedUser = msg.mentions.users.first();
		//const User = client.users.cache.get("814403658107584573");
		//const dev = await client.fetchUser("814403658107584573");
        msg.channel.send(`Hi ${taggedUser} Im a bot`) ;
		
      } else {
        msg.reply('Please tag a valid user!');
      }
    } else if (msg.content.startsWith(prefix + 'screenlist')) {
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
    } else if (msg.content.startsWith(prefix + 'test')) {
      msg.channel.send("aaa")
    } else if (msg.content.startsWith(prefix + 'command')) {
      mymsg=msg.content.substring(13);
      //msg.channel.send(mymsg);
      command = `screen -S minecraft -p 0 -X stuff "${mymsg}^M"`;
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
    }else if (msg.content.startsWith(prefix + 'start')){
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
    }else if (msg.content.startsWith(prefix + 'addadmin')){
      if (msg.mentions.users.size) {
        const taggedUser = msg.mentions.users.first();
        msg.channel.send(`You added admin: ${taggedUser.username}`);
        listofadmins.push(taggedUser.id);
        //msg.channel.send(taggedUser.id);
      } else {
        msg.reply('Please tag a valid user!');
      }
    }else if (msg.content.startsWith(prefix + 'removeadmin')){
      if (msg.mentions.users.size) {
        const taggedUser = msg.mentions.users.first();
        const index = listofadmins.indexOf(taggedUser.id);
        //msg.channel.send(index);
        //msg.channel.send(listofadmins[1]);
        //msg.channel.send(taggedUser.id);
        if (index > -1) {
          listofadmins.splice(index, 1);
        }
        msg.channel.send(`You removed admin: ${taggedUser.username}`);
        //msg.channel.send(taggedUser.id);
      } else {
        msg.reply('Please tag a valid user!');
      }
    }
}

});
