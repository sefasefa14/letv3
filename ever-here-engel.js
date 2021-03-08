const db = require('wio.db')
const Discord = require("discord.js")
exports.run = async (client, message, args) => {
if(!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send({embed: {color: "BLACK", description: ` Yönetici olmadığın için bu komutu kullanamazsın.` }})
if(db.fetch(`everHereEngelAçık_${message.guild.id}`)) {
message.channel.send({embed: {color: "BLACK", description: "Başarıyla kapatıldı."}})
db.delete(`everHereEngelAçık_${message.guild.id}`)
return db.delete(`everHereEngelSeçenek_${message.guild.id}`)
}
if(!db.fetch(`everHereEngelAçık_${message.guild.id}`)) {
let seçenek = args[0]
if(!seçenek)return message.channel.send({embed: {color: "BLACK", description: "Bir seçenek girmelisin.\n[ban/kick] = Biri everyone/here çekince banlasın mı kicklesin mi?"}})
if(seçenek !== "ban" && seçenek !== "kick" && seçenek !== "yasakla" && seçenek !== "at")return message.channel.send({embed: {color: "BLACK", description: "ban, kick, at, yasakla yazmalısın."}})
message.channel.send({embed: {color: "BLACK", description: "Başarıyla açıldı."}})
db.set(`everHereEngelAçık_${message.guild.id}`, 1)
return db.set(`everHereEngelSeçenek_${message.guild.id}`, seçenek)
}
}
exports.conf = {
enabled: true,
guildOnly: false,
aliases: ["everhereengel"],
permLevel: 0,
};
exports.help = {
name: 'ever-here-engel',
description: 'Everyone here engeller.',
usage: 'ever-here-engel'
};