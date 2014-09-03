# node-ddns-server

A DNS server that allows you to host your own dyndns domain. With a RESTful OAuth2 API.

# Installing

```
git clone https://github.com/JorgenEvens/node-ddns-server.git
cd node-ddns-server
npm install
node src
```

# Configuration

The options in the `src/config.json` file should be self explanatory. Further documentation will be added in the future.

# Database

If you have configured a correct connectionstring in the `src/config.json` file, then all tables should be generated for you.

For more information on the connectionstring please see the [SequelizeJS Documentation](http://sequelizejs.com/docs/1.7.8/usage).