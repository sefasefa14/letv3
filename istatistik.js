const Discord = require ("discord.js");
const db = require("quick.db");


exports.run = (client, message) => {

const TimsahTim = new Discord.MessageEmbed()

.setThumbnail(``)
.addField("__**Bot Verileri**__", `  **Toplam Sunucu** **|**  **${client.guilds.cache.size}** \n   **Toplam Kullanıcı** **|** **${client.guilds.cache.reduce((a, b) => a + b.memberCount, 0).toLocaleString()}** \n   **Toplam Kanal** **|** **${client.channels.cache.size}**`)
.addField("__**Bot Geliştiricisi**__", ` **Bot Sahibi**  <@688402666103111790>  \n  **! ⁹⁶Yανυzнαи.єχєゃツ#6569**  \n **Bot Sahibi**  <@688402666103111790>  \n  **! ⁹⁶Yανυzнαи.єχєゃツ#6569**`)
.addField("__**Sürümler**__", ` **Discord.js Sürümü** **|**  **v${Discord.version}** \n **Node.js Sürümü** **|**  **${process.version}**`)
.addField("__**Gecikmeler**__", `**${client.ws.ping}** ms`,true)
.setImage(``)
.setColor("#fffa00")
.setFooter("RTX")

return message.channel.send(TimsahTim)
.then; 

};
exports.conf = {
    aliases: ["bot-istatistik","bot-bil","botbilgi","ibot","istatistik","istatistik","i","stats"],
};
exports.help = {
    name: "istatistik"
};