let Discord = require("discord.js")
let database = require("quick.db")
let ayarlar = require("../ayarlar.json")



exports.run = async(client, message, args) => {
let aboneyetkilisi = await database.fetch(`aboneyetkilisi.${message.guild.id}`)
let abonelog = await database.fetch(`abonelog.${message.guild.id}`)
let abonerol = await database.fetch(`abonerol.${message.guild.id}`)
  let abonekisi = message.guild.member(message.mentions.users.first() || message.guild.members.cache.get(args[0]));
if(!abonerol) return message.channel.send(`Abone rolü ayarlanmamış!`)
  if(!abonelog) return message.channel.send(`Abone log kanalı ayarlanmamış!`)
  if(!aboneyetkilisi) return message.channel.send(`Abone yetkili rolü ayarlanmamış!`)
  let user = message.mentions.users.first()
  if(!message.member.roles.cache.has(aboneyetkilisi)) return message.channel.send(`Bu komutu kullanabilmek için gerekli yetkiye sahip değilsin.`)
  
  if(!message.mentions.users.first()) return message.channel.send(`Bir Üye Etiketle!`)
  
  await(abonekisi.roles.add(abonerol))
  
  const embed = new Discord.MessageEmbed()
  .setTitle(`Abone Rolü Verildi!  <a:tac:807285920909885442>`)
  .addField(`Abone Rolünü Veren Kişi:`, `${message.author.tag}`, true)
  .addField(`Abone Rolü Verilen Kişi`, `${user}`, true)
  .setThumbnail(user.avatarURL())
  .setColor(`GOLD`)
  .setFooter(`${client.user.username} | RTX Abone Sistemi`)
  .setImage('https://cdn.discordapp.com/attachments/797721348167958528/805514663210778667/standard_1.gif');
  message.guild.channels.cache.get(abonelog).send(embed)
}

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['abone'],
  perm: 0
}
exports.help = {
  name: 'a'
}

exports.play = {
  kullanım: 'abone-yetkili-rol @rol',
  açıklama: 'Abone Yetkili Rolünü Ayarlarsınız',
  kategori: 'Abone'
}