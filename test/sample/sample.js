// - -------------------------------------------------------------------- - //

"use strict";

var fs = require("fs");
var assert = require("assert");
var Crawler = require("bauer-crawler");

var crawler = new Crawler({
  config: {
    
  }
});

crawler.loadPlugin(__dirname + "/../../");

crawler.start(function() {
  
  return this.Promise.ssh({
    host: "107.170.69.117",
    username: "root",
    privateKey: fs.readFileSync(__dirname + "/../../../id_rsa").toString(),
    exec: "ls"
  }).then(function(result) {
    console.log(result);
  });
});

// ssh -2 -p 22 root@107.170.69.117 -i ./id_rsa -t 'cd /home/scripts; bash --login'
// - -------------------------------------------------------------------- - //
