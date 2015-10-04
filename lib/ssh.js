/*!
**  bauer-plugin-ssh -- Plugin for bauer to execute commands over ssh..
**  Copyright (c) 2015 Yuri Neves Silveira <http://yneves.com>
**  Licensed under The MIT License <http://opensource.org/licenses/MIT>
**  Distributed on <http://github.com/yneves/node-bauer-plugin-ssh>
*/
// - -------------------------------------------------------------------- - //

"use strict";

var ssh2 = require("ssh2");
var factory = require("bauer-factory");

// - -------------------------------------------------------------------- - //

var Client = factory.createClass({
  
  // new Client(connection Object) :Client
  constructor: function(connection) {
    this.id = this._makeId(connection);
    this.connection = connection;
    this.client = new ssh2.Client();
    this.connected = false;
    this.errored = false;
    this.error = null;
    this.watch();
  },
  
  _makeId: function(connection) {
    var id = "";
    Object.keys(connection).forEach(function(name) {
      var value = connection[name];
      if (factory.isString(name)) {
        id += name + "=" + value;
      } else {
        id += name + "=" + value.toString();
      }
    });
    return id;
  },
  
  // .watch() :void
  watch: function() {
    
    this.client.on("error", function(error) {
      this.errored = true;
      this.connected = false;
      this.error = error;
    }.bind(this));
    
    this.client.on("timeout", function() {
      this.connected = false;
      this.errored = true;
      this.error = new Error("timeout");
    }.bind(this));
    
    this.client.on("close", function() {
      this.connected = false;
      this.errored = false;
    }.bind(this));
    
    this.client.on("end", function() {
      this.connected = false;
      this.errored = false;
    }.bind(this));
    
    this.client.on("connect", function() {
      this.connected = true;
      this.errored = false;
    }.bind(this));
  },
  
  connect: function(callback) {
    var onConnected;
    var onTimeout;
    var onError;
    var onClose;
    var onEnd;

    var removeListeners = function() {
      this.client.removeListener("end",onEnd);
      this.client.removeListener("close",onClose);
      this.client.removeListener("error",onError);
      this.client.removeListener("timeout",onTimeout);
      this.client.removeListener("connect",onConnected);
    }.bind(this);
    
    onEnd = function() {
      callback.call(this,new Error("ended"));
      removeListeners();
    }.bind(this);
    
    onClose = function() {
      callback.call(this,new Error("closed"));
      removeListeners();
    }.bind(this);
    
    onError = function(error) {
      callback.call(this,error);
      removeListeners();
    }.bind(this);
    
    onTimeout = function() {
      callback.call(this,new Error("timeout"));
      removeListeners();
    }.bind(this);
    
    onConnected = function() {
      callback.call(this,null,this);
      removeListeners();
    }.bind(this);
    
    this.client.on("end",onEnd);
    this.client.on("close",onClose);
    this.client.on("error",onError);
    this.client.on("timeout",onTimeout);
    this.client.on("connect",onConnected);
    
    this.client.connect(this.connection);
  },
  
  // .use(callback Function) :void
  use: function(callback) {
    if (this.connected) {
      setImmediate(callback.bind(this,null,this));
    } else if (this.errored) {
      setImmediate(callback.bind(this,this.error));
    } else {
      this.connect(callback);
    }
  },
  
  // .exec(cmd String, opts Object, callback Function) :void
  exec: function(cmd, opts, callback) {
    this.client.exec(cmd, opts, function(error, stream) {
      if (error) {
        callback(error);
      } else {
        
        var result = {
          code: null,
          signal: null,
          stdout: "",
          stderr: ""
        };
        
        stream.on("data",function(data) {
          result.stdout += data;
        });
        
        stream.stderr.on("data",function(data) {
          result.stderr += data;
        });
        
        stream.on("close",function(code, signal) {
          result.code = code;
          result.signal = signal;
          console.log('result',result);
          callback(null, result);
        });
      }
    });
  }
  
});

// - -------------------------------------------------------------------- - //

module.exports = Client;

// - -------------------------------------------------------------------- - //
