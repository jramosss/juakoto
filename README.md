# Juakoto

## A discord bot with just learning puropouses

### **Compilation:**
* `npm i` in root dir
* `node src/index`
* Set BOT_TOKEN,YT_KEY,SPOTIFY_KEY enviroment vars with your discord bot token, youtube api key and spotify api key respectively.

### **Instalation:**
Do you want to try it in your server? [Click here](https://discord.com/oauth2/authorize?client_id=741796245751726133&scope=bot&permissions=1597205592)  

---
This bot doesn`t do anything magic or far from other bots, but i wrote it with the purpouse of making life easier
for those who are starting in developing discord bots with js.

I tried to make it the most correct in software enginering aspect, that`s why i modularized it this way:  

* resources/: Contains the commands and embed messages
* db/: Contains database related stuff, like the help text, the
  prefix of the bot (so you can achieve persistence), aliases and queues saved by the user.

* classes/: All the util classes that the commands uses.

* src/index: core file

[This should be ur bible](https://discordjs.guide/)

#### All messages sent to the user are in spanish, im Argentinian so deal with it.
---


### TODO:

* Set timeout so bot doesnt stay there forever
* Fast Forward (https://github.com/fent/node-ytdl-core/blob/master/README.md)
* assemble teams function (move random members to different channels)
* Should songs dequeue when they already played?
* Stats
* Taria bueno hacer una pagina para el bot no? asi de paso aprendo un poco de front ahi bien sukiii
* I should reaaaaly migrate to yt oficial api 
* Each server should have its own queue