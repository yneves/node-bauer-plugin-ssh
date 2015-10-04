/*!
**  bauer-plugin-ssh -- Plugin for bauer to execute commands over ssh..
**  Copyright (c) 2015 Yuri Neves Silveira <http://yneves.com>
**  Licensed under The MIT License <http://opensource.org/licenses/MIT>
**  Distributed on <http://github.com/yneves/node-bauer-plugin-ssh>
*/
// - -------------------------------------------------------------------- - //

"use strict";

// - -------------------------------------------------------------------- - //

module.exports = {
  
  ssh: {
    
    // .ssh() :Promise
    0: function() {
      return this.then(function(value) {
        return this.Promise.ssh(value);
      });
    },
    
    // .ssh(command String) :Promise
    s: function(command) {
      return this.ssh({ exec: command });
    },
    
    // .ssh(commands Array) :Promise
    a: function(commands) {
      return this.ssh({ exec: commands });
    },
    
    // .ssh(options Object) :Promise
    o: function(options) {
      return this.then(function() {
        return this.requestWorker("ssh",options).get("result");
      });
    }
    
  }
      
};

// - -------------------------------------------------------------------- - //
