# Juakoto

#### Juakoto es un bot de discord capaz de realizar varias acciones utiles, la mayoria relacionadas con la musica

### Disclaimer: 
El codigo es horrendamente sucio, me enfoque en hacer un bot funcional, con el fin de aprender javascript y reforzar mi conocimiento en programacion concurrente. De todas formas intente comentar el codigo lo mas que pude para hacerlo comprensible


---
### Funciones:
* *PREFIX* = juakoto con esto le decis a juakoto que comando ejecutar
* *play* <song> / *p* <song> : Reproduce una cancion (No funciona con listas por que no me pagan lo suficiente)
* *andate* / *leave* = Hace que juakoto se vaya del canal
* *pause* = Pausa la cancion que se esta reproduciendo actualmente
* *stop* / *s* = Lo mismo que pause pero la quise caretear
* *skip* / *n* / *next* = Pasa a la siguiente cancion de la cola
* *resume* / *r* = Despausar
* *hola* / *veni* = Invoca al dios juakoto en el canal de voz
* *volumeset* <volume> / *vs* <volume> = Setea el volumen del bot a <volume>
* *satura* / *earrape* = Hace volumeset en 10, ideal para trolear y tiltear a joacoto, provocando que todos los usuarios del server tengan al bot insta muteado
* *q* / *queue* = Muestra la cola actual de canciones
* *clear* / *c* = Vacia la cola de canciones
* *wendia* = Un saludito que nunca viene mal
* *nazi* = Pone en la cola el clip del momo
* *prefix* <prefix> = Setea un nuevo prefix para el bot
* *showprefix* = Muestra el prefix actual del bot
* *mogolicodeldia* = No funciona, pero la idea es que muestre un mogolico del server
* *previaycachengue* / *pyc* <from> <to> = Encola todos los previa y cachengue del ferpa desde <from> hasta <to>
* *spam* <mensaje> <numero> = spamea <mensaje> <numero> veces
* *ANAKIN* / *anakin* = Juju on that beat
* *cancha* = Escuchen, corran la bola
* *qnp* / *quenoplante* = QUENOPLANTE QUENOPLANTE\n)

### TADS:
La mayor parte de la funcionalidad se la debo a la cola, Es la encargada de encolar las canciones y liberarlas cuando hayan finalizado o el usuario haya hecho un skip.

### TODO:

* Funcionalidad Jump