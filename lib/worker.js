/*!
**  bauer-plugin-ssh -- Plugin for bauer to execute commands over ssh..
**  Copyright (c) 2015 Yuri Neves Silveira <http://yneves.com>
**  Licensed under The MIT License <http://opensource.org/licenses/MIT>
**  Distributed on <http://github.com/yneves/node-bauer-plugin-ssh>
*/
// - -------------------------------------------------------------------- - //

"use strict";

var Client = require("./ssh.js");
var factory = require("bauer-factory");

// - -------------------------------------------------------------------- - //

module.exports = function(worker,config) {
  
  worker.on("request",function(request,response) {

    var connection = {};
    config.connectionProps.forEach(function(key) {
      if (request.hasOwnProperty(key)) {
        connection[key] = request[key];
      } else if (config.hasOwnProperty(key)) {
        connection[key] = config[key];
      }
    });

    var client = new Client(connection);
    
    client.use(function(error) {
      
      if (error) {
        response.sendError(error);
      } else {
        
        var results = [];
        var isArray = factory.isArray(request.exec);
        var commands = isArray ? request.exec : [request.exec];
        var remaining = commands.length;
        
        commands.forEach(function(command, index) {
          
          client.exec(command, {}, function(error, result) {
            results[index] = result;
            if (--remaining === 0) {
              if (isArray) {
                response.sendOk({ result: results });
              } else {
                response.sendOk({ result: results[index] });
              }
            }
          });
        });
      }
    });
  });
  
  worker.sendReady();
  
};

// - -------------------------------------------------------------------- - //
