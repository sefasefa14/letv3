const Discord = require("discord.js");


exports.run = async (client, message, args) => {
  
let user = message.mentions.users.first() || message.author  
  
const exampleEmbed = new Discord.MessageEmbed()
 .setImage(user.avatarURL({dynamic: true}))
.setColor("RANDOM") 
  message.channel.send(exampleEmbed)
  
  
}
  
exports.conf = {
  enabled: true, 
  guildOnly: false, 
  aliases: ["pp"],
  permLevel: `Yetki gerekmiyor.` 
};
exports.help = {
  name: 'avatar',
  category: 'kullanıcı',
  description: 'Belirtilen Kişinin veya Komutu Yazan Kişinin Avatarını Atar.',
   usage:'avatar <@kişi-etiket> veya avatar'
}