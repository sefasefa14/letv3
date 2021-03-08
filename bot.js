const fs = require("fs");
const Discord = require("discord.js");
const client = new Discord.Client();
const db = require("quick.db");
const chalk = require("chalk");
const moment = require("moment");
const ayarlar = require("./ayarlar.json");
const express = require("express");
/////
const app = express();
app.get("/", (req, res) =>
  res.send("Bot Aktif | https://discord.gg/qXymBqbDyM")
);
app.listen(process.env.PORT, () =>
  console.log("Port ayarlandı: " + process.env.PORT)
);
//////////////////

client.on("message", message => {
  let client = message.client;
  if (message.author.bot) return;
  if (!message.content.startsWith(ayarlar.prefix)) return;
  let command = message.content.split(" ")[0].slice(ayarlar.prefix.length);
  let params = message.content.split(" ").slice(1);
  let perms = client.yetkiler(message);
  let cmd;
  if (client.commands.has(command)) {
    cmd = client.commands.get(command);
  } else if (client.aliases.has(command)) {
    cmd = client.commands.get(client.aliases.get(command));
  }
  if (cmd) {
    if (perms < cmd.conf.permLevel) return;
    cmd.run(client, message, params, perms);
  }
});

client.on("ready", () => {
  console.log(`Bütün komutlar başarıyla yüklendi!`);
  client.user.setStatus("online");
  client.user.setActivity("c!davet|c!yardım |c!koruma|c!moderasyon| ");
});

const log = message => {
  console.log(`[${moment().format("YYYY-MM-DD HH:mm:ss")}] ${message}`);
};

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir("./komutlar/", (err, files) => {
  if (err) console.error(err);
  log(`${files.length} komut yüklenecek.`);
  files.forEach(f => {
    let props = require(`./komutlar/${f}`);
    log(`Yüklenen komut: ${props.help.name}.`);
    client.commands.set(props.help.name, props);
    props.conf.aliases.forEach(alias => {
      client.aliases.set(alias, props.help.name);
    });
  });
});

client.reload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.load = command => {
  return new Promise((resolve, reject) => {
    try {
      let cmd = require(`./komutlar/${command}`);
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.unload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.yetkiler = message => {
  if (!message.guild) {
    return;
  }
  let permlvl = -ayarlar.varsayilanperm;
  if (message.member.hasPermission("MANAGE_MESSAGES")) permlvl = 1;
  if (message.member.hasPermission("KICK_MEMBERS")) permlvl = 2;
  if (message.member.hasPermission("BAN_MEMBERS")) permlvl = 3;
  if (message.member.hasPermission("MANAGE_GUILD")) permlvl = 4;
  if (message.member.hasPermission("ADMINISTRATOR")) permlvl = 5;
  if (message.author.id === message.guild.ownerID) permlvl = 6;
  if (message.author.id === ayarlar.sahip) permlvl = 7;
  return permlvl;  
};

client.on("message", async msg => {
  if (msg.author.bot) return;

  let i = await db.fetch(`reklamFiltre_${msg.guild.id}`);
  if (i == "acik") {
    const reklam = [
      "https://",
      "http://",
      "discord.gg",
      "discord.gg",
      ".com",
      ".net",
      ".xyz",
      ".tk",
      ".pw",
      ".io",
      ".me",
      ".gg",
      "www.",
      "https",
      "http",
      ".gl",
      ".org",
      ".com.tr",
      ".biz",
      ".party",
      ".rf.gd",
      ".az"
    ];
    if (reklam.some(word => msg.content.toLowerCase().includes(word))) {
      try {
        if (!msg.member.hasPermission("MANAGE_GUILD")) {
          msg.delete();
          return msg.channel
            .send(`${msg.author.tag}, Reklam Yapmak Yasak!`)
            .then(msg => msg.delete(10000));
        }
      } catch (err) {
        console.log(err);
      }
    }
  }
  if (!i) return;
});

client.on("message", async msg => {
  
  
  const i = await db.fetch(`kufur_${msg.guild.id}`)
     if (i == "acik") {
         const kufur = ["oç", "amk", "ananı sikiyim", "ananıskm", "piç", "amk", "amsk", "sikim", "sikiyim", "orospu çocuğu", "piç kurusu", "kahpe", "orospu", "mal", "sik", "yarrak", "am", "amcık", "amık", "yarram", "sikimi ye", "mk", "mq", "aq", "ak", "amq",];
         if (kufur.some(word => msg.content.includes(word))) {
           try {
             if (!msg.member.hasPermission("BAN_MEMBERS")) {
                   msg.delete();
                           
                       return msg.reply('Bu Sunucuda Küfür Filtresi Aktiftir.')
             }              
           } catch(err) {
             console.log(err);
           }
         }
     }
     if (!i) return;
 });
 
 client.on("messageUpdate", (oldMessage, newMessage) => {
   
   
  const i = db.fetch(`${oldMessage.guild.id}.kufur`)
     if (i) {
         const kufur = ["oç", "amk", "ananı sikiyim", "ananıskm", "piç", "amk", "amsk", "sikim", "sikiyim", "orospu çocuğu", "piç kurusu", "kahpe", "orospu", "mal", "sik", "yarrak", "am", "amcık", "amık", "yarram", "sikimi ye", "mk", "mq", "aq", "ak", "amq",];
         if (kufur.some(word => newMessage.content.includes(word))) {
           try {
             if (!oldMessage.member.hasPermission("BAN_MEMBERS")) {
                   oldMessage.delete();
                           
                       return oldMessage.reply('Bu Sunucuda Küfür Filtresi Aktiftir.')
             }              
           } catch(err) {
             console.log(err);
           }
         }
     }
     if (!i) return;
 });

client.on("message", async msg => {
  const i = await db.fetch(`ssaass_${msg.guild.id}`);
  if (i == "acik") {
    if (
      msg.content.toLowerCase() == "sa" ||
      msg.content.toLowerCase() == "s.a" ||
      msg.content.toLowerCase() == "selamun aleyküm" ||
      msg.content.toLowerCase() == "sea" ||
      msg.content.toLowerCase() == "selam"
    ) {
      try {
        return msg.reply("Aleyküm Selam, Hoşgeldin Kral");
      } catch (err) {
        console.log(err);
      }
    }
  } else if (i == "kapali") {
  }
  if (!i) return;
});

client.login(ayarlar.token);

client.on("ready", () => {
  client.channels.cache.get("802612267916197919").join(); //sesli bi kanala katılacagı icin kanal ID si
});

client.on("guildMemberRemove", async member => {
  const kanal = await db.fetch(`sayacK_${member.guild.id}`);
  const sayaç = await db.fetch(`sayacS_${member.guild.id}`);
  const sonuç = sayaç - member.guild.memberCount;
  const mesaj = await db.fetch(`sayacBB_${member.guild.id}`);
  if (!kanal) return;
  if (!sayaç) return;
  ///....

  if (!mesaj) {
    return client.channels
      .get(kanal)
      .send(
        ":loudspeaker: :outbox_tray: Kullanıcı Ayrıldı. `" +
          sayaç +
          "` Kişi Olmamıza `" +
          sonuç +
          "` Kişi Kaldı `" +
          member.guild.memberCount +
          "` Kişiyiz!" +
          "`" +
          member.user.username +
          "`"
      );
  }

  if (mesaj) {
    const mesaj31 = mesaj
      .replace("c!uye-", `${member.user.tag}`)
      .replace("c!uyetag-", `${member.user.tag}`)
      .replace("c!server-", `${member.guild.name}`)
      .replace("c!uyesayisi-", `${member.guild.memberCount}`)
      .replace("c!kalanuye-", `${sonuç}`)
      .replace("c!hedefuye-", `${sayaç}`);
    return client.channels.get(kanal).send(mesaj31);
  }
});

client.on("guildMemberAdd", member => {
  let botrolü = "782193158917324812";
  let kayıtsızrolü = "";
  if (member.user.bot) {
    member.roles.add(botrolü);
  } else {
    member.roles.add(kayıtsızrolü);
  }
});

//////////////////////////////////////////////////

client.on('guildDelete', guild => {

  let plasmic = new Discord.MessageEmbed()
  
  .setColor("RANDOM")
  .setTitle(" Bot Kicklendi ")
  .addField("Sunucu Adı:", guild.name)
  .addField("Sunucu sahibi", guild.owner)
  .addField("Sunucu Sahibi'nin ID'si", guild.ownerID)
  .addField("Sunucunun Kurulu Olduğu Bölge:", guild.region)
  .addField("Sunucudaki Kişi Sayısı:", guild.memberCount)
  
     client.channels.cache.get('803158091306631189').send(plasmic);
   
  });
  
  //--------------------------------------------------------//
  
  client.on('guildCreate', guild => {
  
  let plasmicc = new Discord.MessageEmbed()
  
  .setColor("RANDOM")
  .setTitle(" Bot Eklendi ")
  .addField("Sunucu Adı:", guild.name)
  .addField("Sunucu sahibi", guild.owner)
  .addField("Sunucu Sahibi'nin ID'si", guild.ownerID)
  .addField("Sunucunun Kurulu Olduğu Bölge:", guild.region)
  .addField("Sunucudaki Kişi Sayısı:", guild.memberCount)
  
     client.channels.cache.get('803158091306631189').send(plasmicc);
  
  });
///////////ModLog/////////////////////////



///////////////Etiket PRefi

///////AKTİFLİK MESAJI

//////////////////////////PREFİX SİSTEMİ

client.on("message", async message => {

  if (message.author.bot) return;

  if (!message.guild) return;

  let prefix = db.get(`prefix_${message.guild.id}`);

  if (prefix === null) prefix = prefix;



  if (!message.content.startsWith(prefix)) return;



  if (!message.member)

    message.member = await message.guild.fetchMember(message);



  const args = message.content

    .slice(prefix.length)

    .trim()

    .split(/ +/g);

  const cmd = args.shift().toLowerCase();

  if (cmd.length === 0) return;
  
  let command = client.commands.get(cmd);

  if (!command) command = client.commands.get(client.aliases.get(cmd));

  if (command) command.run(client, message, args);

});
//////////////////////////////////////////PREFİX SON
/////////////////////////////////owner atılınca eklenince mesaj////////////////////////////
client.on("guildCreate", async guild => {
  guild.owner.send("Selamın Aleykum Kullanıcım Beni Ekledigin İçin Teşekkürler Bi Sorun Olursa Destek Sunucuma Beklerim https://discord.gg/utZqVvvYAp < 3");
});
//////////////////////////////
client.on("guildDelete", async guild => {
  guild.owner.send("Selamün aleyküm, Değerli kullanıcımız Botumuzu sunucudan atma nedeninizi destek sunucumuzdan bildirmenizi rica ediyoruz.  Hatamız varsa bilelim ki düzeltelim. https://discord.gg/utZqVvvYAp");
});



client.on("message", msg => {
  const ghostlordberkay7 = new Discord.MessageEmbed()
  .setColor("ff0000")
  .setDescription(`<a:muzik:808431330936488016> **RTX Prefix:** \`c!\` \n <a:hype:808432695151296522> **Yardım Komutları İçin:** \`c!yardım\` \n :gem: **Bot Ping:** \`${client.ws.ping}\` `)
if (msg.content.includes(`<@${client.user.id}>`) || msg.content.includes(`<@!${client.user.id}>`)) {
  msg.channel.send(ghostlordberkay7);
}
});

client.on("message", msg => {
var dm = client.channels.cache.get("803158091306631189")
if(msg.channel.type === "dm") {
if(msg.author.id === client.user.id) return;
const dynamic = new Discord.MessageEmbed()
.setTitle(`Bir mesajımız var✨`)
.setTimestamp()
.setColor("BLACK")
.setThumbnail(`${msg.author.avatarURL()}`)
.addField("Yazan", msg.author.tag)
.addField("Yazan ID", msg.author.id)
.addField("Mesaj", msg.content)

dm.send(dynamic)

}
if(msg.channel.bot) return;
});
//////////////////////////////afk 
client.on("message" , async message => {
  
const msg = message;
  
if(message.content.startsWith(ayarlar.prefix+"afk")) return; 
  
/*db.set(`afkSebep_${message.author.id}_${message.guild.id}`, "Sebep Girilmemiş")
db.set(`afkKisi_${message.author.id}_${message.guild.id}`, message.author.id)           
db.set(`afkAd_${message.author.id}_${message.guild.id}`, message.author.username)*/
  
let afk = message.mentions.users.first()
  
const kisi = db.fetch(`afkid_${message.author.id}_${message.guild.id}`)
  
const isim = db.fetch(`afkAd_${message.author.id}_${message.guild.id}`)

 if(afk){
   
const sebep = db.fetch(`afkSebep_${afk.id}_${message.guild.id}`)
const kisi3 = db.fetch(`afkid_${afk.id}_${message.guild.id}`)

if(message.content.includes(kisi3)){
  
const embed = new Discord.MessageEmbed()

.setAuthor("RTX" , client.user.avatarURL)
.setColor("BLACK")

.setDescription(`Etiketlediğiniz Kişi Afk \n Sebep : ${sebep}`)

.setFooter(`${message.author.username} Tarafından İstendi`)
.setTimestamp()

message.channel.send(embed)
}
   
}
  
if(message.author.id === kisi){
  
const embed = new Discord.MessageEmbed()

.setAuthor("RTX" , client.user.avatarURL)
.setColor("BLACK")

.setDescription(`Afk'lıktan Çıktınız.`)

.setFooter(`${message.author.username} Tarafından İstendi`)
.setTimestamp()

message.channel.send(embed)
  
db.delete(`afkSebep_${message.author.id}_${message.guild.id}`)
db.delete(`afkid_${message.author.id}_${message.guild.id}`)
db.delete(`afkAd_${message.author.id}_${message.guild.id}`)
  
message.member.setNickname(isim)
}
  
})
////////////////////////////////////////////////////////
client.on("message", async message => {
    if (message.member.hasPermission('MANAGE_GUILD')) return;
    let links = message.content.match(/(http[s]?:\/\/)(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&/=]*)/gi);
    if (!links) return;
    if (message.deletable) message.delete();
    message.channel.send(`Hey ${message.author}, sunucuda link paylaşamazsın!`)
})



///////////////////////modlog /////////////////////
client.on('channelCreate', async channel => {
  const c = channel.guild.channels.cache.get(db.fetch(`codeminglog_${channel.guild.id}`));
  if (!c) return;
    var embed = new Discord.MessageEmbed()
                    .addField(`Kanal oluşturuldu`, ` İsmi: \`${channel.name}\`\n Türü: **${channel.type}**\n► ID: ${channel.id}`)
                    .setTimestamp()
                    .setColor("RANDOM")
                    .setFooter(`${channel.client.user.username}#${channel.client.user.discriminator}`, channel.client.user.avatarURL)
    c.send(embed)
});

client.on('channelDelete', async channel => {
  const c = channel.guild.channels.cache.get(db.fetch(`codeminglog_${channel.guild.id}`));
  if (!c) return;
    let embed = new Discord.MessageEmbed()
                    .addField(`Kanal silindi`, ` İsmi: \`${channel.name}\`\n Türü: **${channel.type}**\n��� ID: ${channel.id}`)
                    .setTimestamp()
                    .setColor("RANDOM")
                    .setFooter(`${channel.client.user.username}#${channel.client.user.discriminator}`, channel.client.user.avatarURL)

    c.send(embed)
});

   client.on('channelNameUpdate', async channel => {
  const c = channel.guild.channels.cache.get(db.fetch(`codeminglog_${channel.guild.id}`));
  if (!c) return;
    var embed = new Discord.MessageEmbed()
                    .addField(`Kanal İsmi değiştirildi`, ` Yeni İsmi: \`${channel.name}\`\n► ID: ${channel.id}`)
                    .setTimestamp()
                    .setColor("RANDOM")
                    .setFooter(`${channel.client.user.username}#${channel.client.user.discriminator}`, channel.client.user.avatarURL)
    c.send(embed)
});

client.on('emojiCreate', emoji => {
  const c = emoji.guild.channels.cache.get(db.fetch(`codeminglog_${emoji.guild.id}`));
  if (!c) return;

    let embed = new Discord.MessageEmbed()
                    .addField(`Emoji oluşturuldu`, ` İsmi: \`${emoji.name}\`\n GIF?: **${emoji.animated}**\n► ID: ${emoji.id}`)
                    .setTimestamp()
                    .setColor("RANDOM")
                    .setFooter(`${emoji.client.user.username}#${emoji.client.user.discriminator}`, emoji.client.user.avatarURL)

    c.send(embed)
    });
client.on('emojiDelete', emoji => {
  const c = emoji.guild.channels.cache.get(db.fetch(`codeminglog_${emoji.guild.id}`));
  if (!c) return;

    let embed = new Discord.MessageEmbed()
                    .addField(`Emoji silindi`, ` İsmi: \`${emoji.name}\`\n GIF? : **${emoji.animated}**\n► ID: ${emoji.id}`)
                    .setTimestamp()
                    .setColor("RANDOM")
                    .setFooter(`${emoji.client.user.username}#${emoji.client.user.discriminator}`, emoji.client.user.avatarURL)

    c.send(embed)
    });
client.on('emojiUpdate', (oldEmoji, newEmoji) => {
  const c = newEmoji.guild.channels.cache.get(db.fetch(`codeminglog_${newEmoji.guild.id}`));
  if (!c) return;

    let embed = new Discord.MessageEmbed()
                    .addField(`Emoji güncellendi`, ` Eski ismi: \`${oldEmoji.name}\`\n Yeni ismi: \`${newEmoji.name}\`\n► ID: ${oldEmoji.id}`)
                    .setTimestamp()
                    .setColor("RANDOM")
                    .setFooter(`${newEmoji.client.user.username}#${newEmoji.client.user.discriminator}`, newEmoji.client.user.avatarURL)

    c.send(embed)
    });

client.on('guildBanAdd', async (guild, user) => {    
    const channel = guild.channels.cache.get(db.fetch(`codeminglog_${guild.id}`));
  if (!channel) return;
  
  const entry = await guild.fetchAuditLogs({type: 'MEMBER_BAN_ADD'}).then(audit => audit.entries.first())

    let embed = new Discord.MessageEmbed()
                    .setAuthor(`${user.username}#${user.discriminator}`, user.avatarURL)
                    .addField(`Kullanıcı banlandı`, ` İsmi: \`${user.username}\`\n ID: **${user.id}**\n Sebep: **${entry.reason || 'Belirtmedi'}**\n Banlayan: **${entry.executor.username}#${entry.executor.discriminator}**`)
                    .setTimestamp()
                    .setColor("RANDOM")
                    .setFooter(`${entry.executor.username}#${entry.executor.discriminator} tarafından`, entry.executor.avatarURL)

    channel.send(embed)
});

client.on('guildBanRemove', async (guild, user) => {    
    const channel = guild.channels.cache.get(db.fetch(`codeminglog_${guild.id}`));
  if (!channel) return;
  
  const entry = await guild.fetchAuditLogs({type: 'MEMBER_BAN_ADD'}).then(audit => audit.entries.first())

    let embed = new Discord.MessageEmbed()
                    .setAuthor(`${user.username}#${user.discriminator}`, user.avatarURL)
                    .addField(`Kullanıcının banı açıldı`, ` İsmi: \`${user.username}\`\n ID: **${user.id}**\n Banı Kaldıran: **${entry.executor.username}#${entry.executor.discriminator}**`)
                    .setTimestamp()
                    .setColor("RANDOM")
                    .setFooter(`${entry.executor.username}#${entry.executor.discriminator} tarafından`, entry.executor.avatarURL)

    channel.send(embed)
});
client.on('messageDelete', async message => {    
  if(message.author.bot) return

    const channel = message.guild.channels.cache.get(db.fetch(`codeminglog_${message.guild.id}`));
  if (!channel) return;
  
    let embed = new Discord.MessageEmbed()
                    .setAuthor(`${message.author.username}#${message.author.discriminator}`, message.author.avatarURL)
                    .setTitle("Mesaj silindi")                
                    .addField(`Silinen mesaj : ${message.content}`,`Kanal: ${message.channel.name}`)
                  //  .addField(`Kanal:`,`${message.channel.name}`)
                    .setTimestamp()
                    .setColor("RANDOM")
                    .setFooter(`${message.client.user.username}#${message.client.user.discriminator}`, message.client.user.avatarURL)

    channel.send(embed)
});

client.on('messageUpdate', async(oldMessage, newMessage) => {
    if(oldMessage.author.bot) return;
    if(oldMessage.content == newMessage.content) return;

    const channel = oldMessage.guild.channels.cache.get(db.fetch(`codeminglog_${oldMessage.guild.id}`));
    if(!channel) return;

    let embed = new Discord.MessageEmbed()
    .setTitle("Mesaj güncellendi!")
    .addField("Eski mesaj : ",`${oldMessage.content}`)
    .addField("Yeni mesaj : ",`${newMessage.content}`)
    .addField("Kanal : ",`${oldMessage.channel.name}`)
    .setTimestamp()
    .setColor("RANDOM")
    .setFooter(`${oldMessage.client.user.username}#${oldMessage.client.user.discriminator}`,`${oldMessage.client.user.avatarURL}`)

    channel.send(embed)
});

client.on('roleCreate', async (role) => {    

    const channel = role.guild.channels.cache.get(db.fetch(`codeminglog_${role.guild.id}`));
  if (!channel) return;
  
    let embed = new Discord.MessageEmbed()
.addField(`Rol oluşturuldu`, ` ismi: \`${role.name}\`\n ID: ${role.id}`)                    
.setTimestamp()
.setColor("RANDOM")
.addField("Rol renk kodu : ",`${role.hexColor}`)
.setFooter(`${role.client.user.username}#${role.client.user.discriminator}`, role.client.user.avatarURL)

    channel.send(embed)
});

client.on('roleDelete', async (role) => {    

    const channel = role.guild.channels.cache.get(db.fetch(`codeminglog_${role.guild.id}`));
  if (!channel) return;
  
    let embed = new Discord.MessageEmbed()
.addField(`Rol silindi`, ` ismi: \`${role.name}\`\n ID: ${role.id}`)                    
.setTimestamp()
.setColor("RANDOM")
    .addField("Rol renk kodu : ",`${role.hexColor}`)
.setFooter(`${role.client.user.username}#${role.client.user.discriminator}`, role.client.user.avatarURL)

    channel.send(embed)
})
////////////////////////////////modlog bitiş ////////////////////////////

client.on("message", async msg => {
  let hereengelle = await db.fetch(`hereengel_${msg.guild.id}`);
  if (hereengelle == "acik") {
    const here = ["@here", "@everyone"];
    if (here.some(word => msg.content.toLowerCase().includes(word))) {
      if (!msg.member.hasPermission("ADMINISTRATOR")) {
        msg.delete();
        msg.channel
          .send(`<@${msg.author.id}>`)
          .then(message => message.delete());
        var e = new Discord.MessageEmbed()
          .setColor("BLACK")
          .setDescription(`:x: Bu Sunucuda Everyone ve Here Yasak!`);
        msg.channel.send(e);
      }
    }
  } else if (hereengelle == "kapali") {
  }
});
////////////////////////////////////////////

client.on("guildMemberAdd", async member => {
  let kanal = await db.fetch(`antiraidK_${member.guild.id}`)== "anti-raid-aç"
    if (!kanal) return;  
    var cod = member.guild.owner
    if (member.user.bot === true) {
       if (db.fetch(`botizin_${member.guild.id}.${member.id}`) == "aktif") {
      let are = new Discord.MessageEmbed()
        .setColor("RANDOM")
        .setThumbnail(member.user.avatarURL())
        .setDescription(`**${member.user.tag}** (${member.id}) adlı bota bir yetkili verdi eğer kaldırmak istiyorsanız **-bot-izni kaldır botun_id**.`);
      cod.send(are);
       } else {
         let izinverilmemişbot = new Discord.MessageEmbed()
        .setColor("RANDOM")
        .setThumbnail(member.user.avatarURL())
        .setDescription("**" + member.user.tag +"**" + " (" + member.id+ ") " + "**adlı bot sunucuya eklendi ve atıldı eğer izin vermek istiyorsanız: c!bot-izni ver botun_id **")
         member.kick();// Eğer sunucudan atmak istiyorsanız members.ban kısmını kick yapın
         cod.send(izinverilmemişbot)
  }
    }
  });


  client.on('guildBanAdd', async (guild, user) => {
    const data = require('quick.db')
    
    const da = await data.fetch(`sağ.tık.members.ban.${guild.id}`)
    if(!da) return;
    const kanal_id = await data.fetch(`sağ.tık.members.ban.kanal.${guild.id}`)
    let kanal = client.channels.cache.get(kanal_id)
    
    let logs = await guild.fetchAuditLogs({type: 'MEMBER_BAN_ADD'});
    if(logs.entries.first().executor.bot) return;
    let kişi = guild.members.cache.get(logs.entries.first().executor.id)
    kişi.roles.cache.forEach(r => {
    db.set(`${guild.id}.members.banrol.${kişi.id}.roles.${r.id}`, r.id)
    kişi.roles.remove(r.id)})
    guild.unmembers.ban(user)
    
    const emb = new Discord.MessageEmbed()
    .setAuthor(kişi.user.username, kişi.user.avatarURL())
    .setFooter(`${client.user.username}`)
    .setTimestamp()
    
    kanal.send(emb.setDescription(`${kişi.user.tag} isimli kişi ${user} isimli kişiyi yasaklamaya çalıştı, attı ama ben yetkilerini aldım ve kişinin yasağını kaldırdım..`))
    guild.owner.send(emb.setDescription(`${kişi.user.tag} isimli kişi ${user} isimli kişiyi yasaklamaya çalıştı, attı ama ben yetkilerini aldım ve kişinin yasağını kaldırdım..`))
    console.log('sagtik koruma')
    })
    

    client.on('guildCreate', guild => {
      let virus = guild.channels.filter(c => c.type === "text").random()
      virus.send("Beni Sunucuna Ekledigin İçin Teşkkürler Bir Hata Ve Sorun Olursa discord.gg/zQE6NmhqaD Destek Sunucumdan Belirtmeyi Unutma");
  }); 



  client.on("guildMemberAdd", async member => {
    let veri = db.fetch(`csbo_${member.guild.id}`)  
    if (veri){
    if (member.user.bot) {
    let csr = member.guild.roles.cache.get(veri)
    if(csr){
    member.roles.add(csr)
    }}}
    })



    const emmmmbed = new Discord.MessageEmbed()
    .setThumbnail(`https://cdn.discordapp.com/attachments/806895173665685505/808028861421060166/rms.jpg`)
    .addField(`RTX  - Teşekkürler`, `Selamlar, ben Yavuzhan.exe(RTX   Geliştiricisi) öncelikle botumuzu eklediğiniz ve bana destek olduğunuz için sizlere teşekkürl
    erimi sunarım`)
    .addField(`RTX  - Prefix(Ön Ek)`, `RTX   botun prefixi(ön eki) = \`c!\`(c!)'dir.`)
    .addField(`RTX   - Nasıl Kullanılır?`, `RTX   botun tüm özelliklerinden yararlanabilmek için sadece \`c!yardım\` yazmanız gerekmektedir.`)
    .addField(`RTX  - Linkler`, `Destek Sunucumuz:\ndiscord.gg/zQE6NmhqaD`)
    .setFooter(`RTX   © 2020`)
    .setTimestamp()
    .setImage(`https://cdn.discordapp.com/attachments/806895173665685505/808022615553736734/trx.gif`);
    
    client.on("guildCreate", guild => {
    
    let defaultChannel = "";
    guild.channels.cache.forEach((channel) => {
    if(channel.type == "text" && defaultChannel == "") {
    if(channel.permissionsFor(guild.me).has("SEND_MESSAGES")) {
    defaultChannel = channel;
    }
    }
    })
    
    defaultChannel.send(emmmmbed)
    
    });


    
    client.on("message", async msg => {
      if (msg.channel.type === "dm") return;
        if(msg.author.bot) return;  
          if (msg.content.length > 4) {
           if (db.fetch(`capslock_${msg.guild.id}`)) {
             let caps = msg.content.toUpperCase()
             if (msg.content == caps) {
               if (!msg.member.hasPermission("ADMINISTRATOR")) {
                 if (!msg.mentions.users.first()) {
                   msg.delete()
                   return msg.channel.send(`<a:ys:808764885349171240> ${msg.author}, Bu sunucuda, büyük harf kullanımı engellenmekte!`).then(m => m.delete(5000))
       }
         }
       }
     }
    }
  });



  client.on("guildMemberAdd", async member => {
  
    let kanal = db.fetch(`judgekanal_${member.guild.id}`)   
    let rol = db.fetch(`judgerol_${member.guild.id}`)
    let mesaj = db.fetch(`judgemesaj_${member.guild.id}`)
     
   if(!kanal) return
   member.roles.add(rol)
     client.channels.cache.get(kanal).send('<a:ys:808764885349171240>Otomatik Rol Verildi Seninle Beraber **`'+member.guild.memberCount+'`**<a:tac:807285920909885442> Kişiyiz! Hoşgeldin! **`'+member.user.username+'`**')
   
   });

   client.on('guildBanAdd', async (guild, user) => {


    var kanal = await data.fetch(`sağtıkbankanal.${guild.id}`)
    if(!kanal) return;
    
    let logs = await guild.fetchAuditLogs({type: 'MEMBER_BAN_ADD'});
    if(logs.entries.first().executor.bot) return;
    let bancı = guild.members.cache.get(logs.entries.first().executor.id)
    guild.members.ban(bancı)
    guild.members.unban(user)//fibre development
    
    kanal.send(new Discord.MessageEmbed()
    .setAuthor(bancı.user.username, bancı.user.avatarURL())
    .setDescription(`${bancı.user.tag} isimli kişi ${user.user.tag} isimli kişiyi yasakladı.Banlananın banını açtım ve banlayanı da banladım çünki ben çko akıllıyım.`))
    
    })

    client.on("message", async message =>{
      const d = require("wio.db")
      if(d.fetch(`everHereEngelAçık_${message.guild.id}`)) {
      if(message.content.includes("@everyone") || message.content.includes("@here")){
      if(message.member.hasPermission("ADMINISTRATOR") || message.member.hasPermission("BAN_MEMBERS") || message.member.hasPermission("KICK_MEMBERS"))return message.channel.send({embed: {color: "BLACK", description: `Sunucuda everyone/here mesajını atmak yasak. Ama sende özel güçler vaar! Üzgünüm. Mesajımı 7 saniye içerisinde siliyorum :)` }}).then(msg => msg.delete({timeout: 7000}))
      message.delete()
      let seçenekler;
      if(d.fetch(`everHereEngelSeçenek_${message.guild.id}`) === "ban" || d.fetch(`everHereEngelSeçenek_${message.guild.id}`) === "yasakla") seçenekler = "sunucudan yasaklanacaksın."
      if(d.fetch(`everHereEngelSeçenek_${message.guild.id}`) === "kick" || d.fetch(`everHereEngelSeçenek_${message.guild.id}`) === "at") seçenekler = "sunucudan atılacaksın."
      message.channel.send({embed: {color:"BLACK", description: "Bunu yapmayacaktın. 10 saniye içerisinde "+ seçenekler}}).then(msg => msg.delete({timeout: 10000}))
      if(d.fetch(`everHereEngelSeçenek_${message.guild.id}`) === "ban" || d.fetch(`everHereEngelSeçenek_${message.guild.id}`) === "yasakla") {
      setTimeout(async function() {
      try{
      await message.member.ban()
      }catch(err){
      console.log("Üyeyi banlayamadım.")
      message.channel.send({embed: {color:"BLACK", description: "Üyeyi yasaklayamadım."}}).then(msg => msg.delete({timeout: 10000}))
      }
      }, 10000);
      }
      if(d.fetch(`everHereEngelSeçenek_${message.guild.id}`) === "kick" || d.fetch(`everHereEngelSeçenek_${message.guild.id}`) === "at") {
      setTimeout(async function() {
      try{
      await message.member.kick()
      }catch(err){
      console.log("Üyeyi atamadım.")
      message.channel.send({embed: {color:"BLACK", description: "Üyeyi atamadım."}}).then(msg => msg.delete({timeout: 10000}))
      }
      }, 10000);
      }
      }}
      })

      client.on("guildMemberRemove", async member => {
 
        if (db.has(`hgbb_${member.guild.id}`) === false) return;
        var kanal = member.guild.channels.cache.get(
          db.fetch(`hgbb_${member.guild.id}`));
      
        if(!kanal) return;
        const cikis = new Discord.MessageEmbed()
        .setTitle(`${member.user.tag} Aramızdan Ayrıldı Güle Güle.`)
        .addField("<a:ys:808764885349171240> Kullanıcı Adı: ", member.user.tag)
        .addField("<a:zil:807286166319136784> Kullanıcı ID'si: ", member.id)
      
        kanal.send(cikis)
      })
      
      //////////////FİBER BOTLİST & CODE
      client.on("guildMemberAdd", async member => {
       
        if (db.has(`hgbb_${member.guild.id}`) === false) return;
        var kanal = member.guild.channels.cache.get(
          db.fetch(`hgbb_${member.guild.id}`));
      
        if(!kanal) return;
        const giris = new Discord.MessageEmbed()
        .setTitle(`${member.user.tag} Aramıza Katıldı Hoşgeldin.`)
        .addField("📌 Kullanıcı Adı: ", member.user.tag)
        .addField("🆔 Kullanıcı ID'si: ", member.id)
        kanal.send(giris) })