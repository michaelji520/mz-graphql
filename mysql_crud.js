/**
 * Copyright (c) 2014-2018 NighthawkStudio, All rights reserved.
 * @fileoverview mysql create, retrieve, update, delete
 * @author Michael Zhang | michaelji520@gmail.com
 * @version 1.0 | 2019-06-20 | initial version
 */

var mysql = require('mysql');
// import database connection config
var db_config = require('./db_config.js');

if (!db_config) {
  console.log('Missing DB config file: db_config.js');
}
// create single db connection
// var connection = mysql.createConnection(db_config);

// connect database
// connection.connect(function (err) {
//   if (err) {
//     console.error('error connecting: ' + err.stack);
//     return;
//   }
//   console.log('mysql connected as id ' + connection.threadId);
// });


// create connection pool
var connection = mysql. createPool(Object.assign(db_config, {
  connectionLimit: 10
}));

/**
 * @method: query
 * @description: execute query sql
 * @param {string} sql statement
 * @return {Promise} result/error
 **/
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

/**
 * @method: create
 * @description: insert a record
 * @param {table}: table name
 * @param {params}: columns and corresponding values, eg. {key: value}
 * @return result/error
 **/
function create(table, params) {
  return new Promise((resolve, reject) => {
    if (!table) {
      reject({ message: 'Empty table name!' });
    }
    let sql = `insert into ${table}`;
    let keys = [];
    let values = [];
    if (params && Object.keys(params).length > 0) {
      for (let key in params) {
        if (key && params[key]) {
          keys.push(`${key} = ?`);
          values.push(params[key]);
        }
      }
    }
    sql += keys.length ? ' set ' + keys.join(' , ') : '';
    connection.query(sql, values, function (err, result) {
      if(err){
        reject(err);
        return;
      }
      resolve(result);
    });
  });
}

/**
 * @method: retrieve
 * @description: retrieve specific records
 * @param {table}: table name
 * @param {params}: filters, eg. {key: value}
 * @param {options}: result options like `order by`, `group by`, eg. {key: value}
 * @return result/error
 **/
function retrieve(table, params, options) {
  return new Promise((resolve, reject) => {
    if (!table) {
      reject({ message: 'Empty table name!' });
    }
    let sql = `select * from ${table}`;
    let filters = [];
    let values = [];
    params.is_delete = 0;
    if (params && Object.keys(params).length > 0) {
      for (let key in params) {
        filters.push(`${key} = ?`);
        values.push(params[key]);
      }
    }
    sql += filters.length ? ' where ' + filters.join(' and ') : '';
    connection.query(sql, values, function (err, result) {
      if(err){
        reject(err);
        return;
      }
      resolve(result);
    });
  });
}

function update(table, params, filters) {
  return new Promise((resolve, reject) => {
    if (!table) {
      reject({ message: 'Empty table name!' });
    }
    let sql = `update ${table}`;
    let keys = [];
    let values = [];
    if (params && Object.keys(params).length > 0) {
      for (let key in params) {
        keys.push(`${key} = ?`);
        values.push(params[key]);
      }
    }
    sql += keys.length ? ' set ' + keys.join(' , ') : '';
    let filter_arr = [];
    if (filters && Object.keys(filters).length > 0) {
      for (let key in filters) {
        filter_arr.push(`${key} = ?`);
        values.push(filters[key]);
      }
    }
    sql += filter_arr.length ? ` where ${filter_arr.join(' and ')}` : '';
    connection.query(sql, values, function (err, result) {
      if(err){
        reject(err);
        return;
      }
      resolve(result);
    });
  });
}

function remove(table, params) {
  return new Promise((resolve, reject) => {
    if (!table) {
      reject({ message: 'Empty table name!' });
    }
    let sql = `update ${table} set is_delete = 1`;
    let filters = [];
    let values = [];
    if (params && Object.keys(params).length > 0) {
      for (let key in params) {
        if (key && params[key]) {
          filters.push(`${key} = ?`);
          values.push(params[key]);
        }
      }
    }
    sql += filters.length ? ' where ' + filters.join(' and ') : '';
    connection.query(sql, values, function (err, result) {
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
  query, create, retrieve, update, remove
}
