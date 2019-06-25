/**
 * Copyright (c) 2014-2018 NighthawkStudio, All rights reserved.
 * @fileoverview
 * @author Michael Zhang | michaelji520@gmail.com
 * @version 1.0 | 2019-06-20 | initial version
 */

var mysql = require('mysql');
var db_config = require('./db_config.js');

var connection = mysql.createConnection(db_config);

connection.connect(function (err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
  console.log('mysql connected as id ' + connection.threadId);
});

function query(sql) {
  return new Promise((resolve, reject) => {
    connection.query(sql, function (err, result) {
      if(err){
        reject(err);
        return;
      }
      resolve(result);
    });
  });
}

// connection.end();

module.exports = {
  query: query
}
