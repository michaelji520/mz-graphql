/**
 * Copyright (c) 2014-2018 NighthawkStudio, All rights reserved.
 * @fileoverview
 * @author Michael Zhang | michaelji520@gmail.com
 * @version 1.0 | 2019-06-20 | initial version
 */

var { GraphQLID,
      GraphQLString,
      GraphQLInt,
      GraphQLList,
      GraphQLSchema,
      GraphQLObjectType,
      GraphQLNonNull } = require('graphql');

var db = require('./mysql_crud.js');

var pictureType = new GraphQLObjectType({
  name: 'picture',
  fields: {
    id: { type: GraphQLID },
    user_id: { type: GraphQLInt },
    url: { type: GraphQLString },
    is_delete: { type: GraphQLInt },
    create_time: { type: GraphQLString },
    update_time: { type: GraphQLString }
  }
});

var userType = new GraphQLObjectType({
  name: 'user',
  fields: {
    id: { type: GraphQLID },
    user_id: { type: GraphQLInt },
    user_name: { type: GraphQLString },
    user_password: { type: GraphQLString },
    user_role: { type: GraphQLInt },
    is_delete: { type: GraphQLInt },
    create_time: { type: GraphQLString },
    update_time: { type: GraphQLString },
    pictures: {
      type: new GraphQLList(pictureType),
      resolve: async function (source, args) {
        return await db.retrieve('tbl_picture', {user_id: source.user_id});
      }
    },
  }
});


var queryType = new GraphQLObjectType({
  name: 'Query',
  description: 'Query user record',
  fields: {
    user: {
      type: GraphQLList(userType),
      args: {
        user_id: { type: GraphQLInt },
        user_name: { type: GraphQLString },
        user_role: { type: GraphQLInt }
      },
      resolve: async function (source, args) {
        console.log(args);
        const result = await db.retrieve('tbl_user', args, {});
        return result;
      }
    }
  }
});

var mutationType = new GraphQLObjectType({
  name: 'Mutation',
  description: 'Create, delete, update user record',
  fields: {
    createUser: {
      type: userType,
      args: {
        user_id: { type: GraphQLInt },
        user_name: { type: new GraphQLNonNull(GraphQLString) },
        user_password: { type: new GraphQLNonNull(GraphQLString) },
        user_role: { type: new GraphQLNonNull(GraphQLInt) },
        // is_delete: { type: new GraphQLNonNull(GraphQLInt) },
        // create_time: { type: new GraphQLNonNull(GraphQLString) },
        // update_time: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: async function (source, args) {
        if (args.user_id && (args.user_id !== 0)) {
          // const res = await db.update('tbl_user', args, { user_id: args.user_id });
          console.log('User id is not empty!');
        } else {
          const res = await db.create('tbl_user', args);
          console.log(res);
        }
        return args;
      }
    },
    updateUser: {
      type: userType,
      args: {
        user_id: { type: GraphQLInt },
        user_name: { type: new GraphQLNonNull(GraphQLString) },
        user_password: { type: new GraphQLNonNull(GraphQLString) },
        user_role: { type: new GraphQLNonNull(GraphQLInt) },
        // is_delete: { type: new GraphQLNonNull(GraphQLInt) },
        // create_time: { type: new GraphQLNonNull(GraphQLString) },
        // update_time: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: async function (source, args) {
        if (args.user_id && (args.user_id !== 0)) {
          const res = await db.update('tbl_user', args, { user_id: args.user_id });
          console.log(res.message, res);
        } else {
          // const res = await db.create('tbl_user', args);
          console.log('User id is empty!');
        }
        return args;
      }
    },
    deleteUser: {
      type: userType,
      args: {
        user_id: { type: GraphQLInt },
        user_name: { type: new GraphQLNonNull(GraphQLString) },
        user_password: { type: new GraphQLNonNull(GraphQLString) },
        user_role: { type: new GraphQLNonNull(GraphQLInt) },
        // is_delete: { type: new GraphQLNonNull(GraphQLInt) },
        // create_time: { type: new GraphQLNonNull(GraphQLString) },
        // update_time: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: async function (source, args) {
        if (args.user_id && (args.user_id !== 0)) {
          const res = await db.remove('tbl_user', args);
          console.log(res.message, res);
        } else {
          console.log('User id is empty!');
        }
        return args;
      }
    }
  }
});

module.exports = new GraphQLSchema({ query: queryType, mutation: mutationType });

