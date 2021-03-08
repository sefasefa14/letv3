const codework1 = require('discord.js')

exports.run = function(client, message, args) {
  const codework = new codework1.MessageEmbed() 
                            
.setTitle("RTX Bot Destek Sunucu Davet") //BOTUNUZUN ADINI GİRİN
.setDescription("**Destek Sunucusu Davet Linki :** [Destek Sunucusu](https://discord.gg/UrpcyMV2hT)")
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
name: 'destek'
};