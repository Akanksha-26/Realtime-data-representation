DB Updating Table Dev Challenge
===============================

This module contains a development challenge for DB recruitment.

The instructions are in the site/index.html file.

To view them, run

```
npm install
npm start
```

from within this directory.  This will start a development server (using webpack)
that supports hot reloading but also provides a stomp/ws endpoint providing fake
fx updates.

Once you've started the development server, navigate to http://localhost:8011
to read the task description and get started.

Assumtions:
===========

1) All the prices recived from websocket are updated in table. Multiple objects for same `name` have different rows.

2) Table is not responsive

3) `Sparkline` does not have any custom css applied.

4) `Sparkline` showing representation of all the data from start of server.


Future Modifications:
=====================
1) Table is not the medium which is very useful in this kind of crude data representation. Either data should be cleaned up or charts or some kind of color representation should be used.

2) We could use d3.js for charts



>Author : Akanksha Sharma
>Email : akanksha.s9560@gmail.com
