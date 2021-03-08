const codework1 = require('discord.js')

exports.run = function(client, message, args) {
  const codework = new codework1.MessageEmbed() 
                            
.setTitle("RTX Bot Davet") //BOTUNUZUN ADINI GİRİN
.setDescription(" [Buyur Kral Botun Davet Linki](https://discord.com/api/oauth2/authorize?client_id=732698517876768910&permissions=8&scope=bot)")
.setColor("BLACK")

return message.channel.send(codework)
}

exports.conf = {
enabled: false,
guildOnly: false,
aliases: ["botuekle"],
permLevel: 0
  
};
  
exports.help = {
name: 'davet'
};