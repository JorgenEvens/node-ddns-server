node-ddns-server
================

A DNS server that allows you to host your own dyndns domain.

### Required modules
- [mysql][0] ( `npm install mysql` )
- [connect][1] ( `npm install connect` )
- [oauth2-provider][2] ( `npm install oauth2-provider` )
- [node-dns][3] ( `git submodule update --init` )

[0]: https://npmjs.org/package/mysql
[1]: https://npmjs.org/package/connect
[2]: https://npmjs.org/package/oauth2-provider
[3]: https://github.com/tjfontaine/node-dns

### Configuration
Configuration can be changed in config.js, each option is explained inline although most are self-explanatory.

### Running
For now running the server is done by simply invoking `node server.js` or `./server.js` on unix systems.