# Juakoto

#### Juakoto es un bot de discord capaz de realizar varias acciones utiles, la mayoria relacionadas con la musica

### Disclaimer: 
El codigo es horrendamente sucio, me enfoque en hacer un bot funcional, con el fin de aprender javascript y reforzar mi conocimiento en programacion concurrente. De todas formas intente comentar el codigo lo mas que pude para hacerlo comprensible


---
* ### Funciones:
* *andate* / *leave* / *shu* = Hace que juakoto se vaya del canal  
* *cancha* = Escuchen, corran la bola   
* *clear* / *c* = Vacia la cola de canciones  
* *hola* / *veni* / *te invoco* = Invoca al dios juakoto en el canal * de voz 
* *juernes* / *JUERNES PERRO* / *juernes perro* : JUERNES PERRO 
* *jump <numero> : Salta al numero de cancion que le indiques
* *lq/loadqueue/cargarcola <filename>: Carga la cola guardada en el * archivo filename y la encola*
* *nazi* = Pone en la cola el clip del momo 
* *mogolicodeldia* = No funciona, pero la idea es que muestre un * mogolico del server 
* mood <mood> : Te tira una playlist acorde al mood que le des (chill/* cachengue/trap/sad) 
* *prefix* <prefix> = Setea un nuevo prefix para el bot 
* *pause* = Pausa la cancion que se esta reproduciendo actualmente 
* *previaycachengue* / *pyc* <from> <to> = Encola todos los previa y * cachengue del ferpa desde <from> hasta <to> 
* *play* <song> / *p* <song> : Reproduce una cancion (No funciona con * listas por que no me pagan lo suficiente) 
* *playI* / *playINSTA* : Reproduce la cancion instantaneamente 
* *q* / *queue* = Muestra la cola actual de canciones 
* *resume* / *r* = Despausar 
* *satura* / *earrape* = Hace volumeset en 10, ideal para trolear y * tiltear a joacoto, provocando que todos los usuarios del server * tengan al bot insta muteado 
* *skip* / *n* / *next* = Pasa a la siguiente cancion de la cola 
* *showprefix* = Muestra el prefix actual del bot 
* *savequeue/sq/guardarcola <filename>*: Guarda la cola actual en un * archivo con el nombre <filename>
* *spam* <mensaje> <numero> = spamea <mensaje> <numero> veces 
* *stop* / *s* = Lo mismo que pause pero la quise caretear 
* *status: Te dice el status del bot, si esta reproduciendo o cosas * asi
* *volumeset* <volume> / *vs* <volume> = Setea el volumen del bot a * <volume> 
* *qnp* / *quenoplante* = QUENOPLANTE QUENOPLANTE 
* *wendia* = Un saludito que nunca viene mal
* 
### TADS:
La mayor parte de la funcionalidad se la debo a la cola, Es la encargada de encolar las canciones y liberarlas cuando hayan finalizado o el usuario haya hecho un skip.

### TODO:

* Funcionalidad Jump