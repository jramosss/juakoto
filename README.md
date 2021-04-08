<p align="right">
  <a href="https://github.com/jramosss">
    <img
      alt="juakoto"
      src="https://i.imgur.com/wpSY9E5.png"
      width="200"
    />
  </a>
</p>

# Juakoto

## A discord bot with just learning purpouses

### **Compilation:**
* `npm i` in root dir
* Set [BOT_TOKEN](https://discord.com/developers/applications),[YT_KEY](https://console.cloud.google.com/apis/credentials),[SPOTIFY_KEY](https://developer.spotify.com/documentation/general/guides/authorization-guide/) enviroment vars with your discord bot token, youtube api key and spotify api key respectively.
* `node src/index`

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
* Align the image of this readme  
* When u try to enqueue a playlist before actually playing a song it doesnt play anything
* When u shuffle the queue, u lose the first song, if u re playing song no 2 and shuffle, now the song no 2 is other, but the previous song keeps playing
* Make bot server deafen himself.
