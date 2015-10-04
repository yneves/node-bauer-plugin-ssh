/*!
**  bauer-plugin-ssh -- Plugin for bauer to execute commands over ssh..
**  Copyright (c) 2015 Yuri Neves Silveira <http://yneves.com>
**  Licensed under The MIT License <http://opensource.org/licenses/MIT>
**  Distributed on <http://github.com/yneves/node-bauer-plugin-ssh>
*/
// - -------------------------------------------------------------------- - //

"use strict";

module.exports = {
  
  name: "ssh",
  
  config: {
    workers: 1,
    slots: 1,
    delay: 0,
    connectionProps: [
      "host", "port", "forceIPv4", "forceIPv6", 
      "keepaliveCountMax", "keepaliveInterval", 
      "readyTimeout", "compress", "username", 
      "password", "privateKey", "publicKey", 
      "tryKeyboard", "agent", "allowAgentFwd", 
      "hostHashAlgo", "hostHashCb", "strictVendor", 
      "debug"
    ]
  },
  
  worker: __dirname + "/worker.js",
  promise: __dirname + "/promise.js"
  
};

// - -------------------------------------------------------------------- - //
