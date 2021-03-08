const Discord = require("discord.js");
const db = require("quick.db");


exports.run = async (client, message, args) => {

const eğlence = new Discord.MessageEmbed()
.setColor("RANDOM")
.setAuthor("» RTX.")
.setTitle(" » RTX Eğlence Komutları ")
 .setTimestamp()
.setDescription(" **c!yazan-kazanır** =  Yazan karanır oyununu oynadıktan sonra tekrar oynamaya ne dersin?.  \n  **c!kapaklaf** =  Birine güzel bi söz sözlemeye ne dersin?.  \n  **c!kralol** =  Kral olmaya ne dersin?.  ")
message.channel.send(eğlence)
}

exports.conf = {
  enabled: true, 
  guildOnly: false, 
   aliases: [],
  permLevel: `Yetki gerekmiyor.` 
};

exports.help = {
  name: 'eğlence2',
  category: 'kullanıcı',
  description: 'Yardım Menüsü.',
   usage:'-eğlence'
}