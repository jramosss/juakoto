# Juakoto

#### Juakoto es un bot de discord capaz de realizar varias acciones utiles, la mayoria relacionadas con la musica


## Compilacion:
* `npm i dependencies` en la carpeta raiz  
* `node src/index.js`

## Instalacion:
Lo queres en tu server? Click [aca](https://discord.com/oauth2/authorize?client_id=764653800068743199&scope=bot&permissions=3148864)  

## Que tiene este bot que otros no tengan?

---
## Funciones:
* alias <alias> <link> : asocia una palabra <alias> con un link, si despues pones juakoto <alias> ya se encola esa cancion/video 
* aliases : muestra todos los alias registrados  
* *andate* / *tomatela* /*leave* / *shu* = Hace que juakoto se vaya del canal 
* *clear* / *c* = Vacia la cola de canciones 
* gracias : de nada 
* *hola* / *veni* / *te invoco* = Invoca al dios juakoto en el canal de voz 
* *jump <numero> : Salta al numero de cancion que le indiques
* *lq/loadqueue/cargarcola <filename>: Carga la cola guardada en el archivo filename y la encola*
* *mogolicodeldia* = No funciona, pero la idea es que muestre un mogolico del server 
* mood <mood> : Te tira una playlist acorde al mood que le des (chill/cachengue/trap/sad) 
* *prefix* <prefix> = Setea un nuevo prefix para el bot 
* *pause* = Pausa la cancion que se esta reproduciendo actualmente 
* *previaycachengue* / *pyc* <from> <to> = Encola todos los previa y cachengue del ferpa desde <from> hasta <to> 
* *play* <song> / *p* <song> : Reproduce una cancion (No funciona con listas por que no me pagan lo suficiente) 
* *playI* / *playINSTA* : Reproduce la cancion instantaneamente 
* *q* / *queue* = Muestra la cola actual de canciones 
* *random* = Reproduce una cancion random sacada del archivo de aliases
* *resume* / *r* = Despausar 
* *satura* / *earrape* = Hace volumeset en 10, ideal para trolear y tiltear a joacoto, provocando que todos los usuarios del server tengan al bot * insta muteado 
* *skip* / *n* / *next* = Pasa a la siguiente cancion de la cola 
* *showprefix* = Muestra el prefix actual del bot 
* *savequeue/sq/guardarcola <filename>*: Guarda la cola actual en un archivo con el nombre <filename>
* *spam* <mensaje> <numero> = spamea <mensaje> <numero> veces 
* *stop* / *s* = Lo mismo que pause pero la quise caretear 
* *status: Te dice el status del bot, si esta reproduciendo o cosas asi
* *volumeset* <volume> / *vs* <volume> = Setea el volumen del bot a <volume> 
* *wendia* = Un saludito que nunca viene mal.

### TODO:

* Make prefix an enviroment variable
* Handle spotify songs
* Shuffle option (WIP)
* Remove alias option
* Use database so sq and changeprefix can be used 
* Change aliases to aliases.js, so its easier to remove an alias
* Loop function
* Fast Forward (https://github.com/fent/node-ytdl-core/blob/master/README.md)
* alias redefine
* assemble teams function (move random members to different channels)