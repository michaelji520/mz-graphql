/**
 * Copyright (c) 2014-2018 NighthawkStudio, All rights reserved.
 * @fileoverview
 * @author Michael Zhang | michaelji520@gmail.com
 * @version 1.0 | 2019-06-20 | initial version
 */
var { GraphQLID, GraphQLString, GraphQLInt, GraphQLList, GraphQLSchema, GraphQLObjectType } = require('graphql');
var db = require('./mysql_crud.js');
const { directors, movies } = require('./database.js');

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
  }
});

var movieType = new GraphQLObjectType({
  name: 'Movie',
  fields: {
    id: { type: GraphQLID},
    name: { type: GraphQLString },
    year: { type: GraphQLID},
    directorId: { type: GraphQLID}
  }
});

var directorType = new GraphQLObjectType({
  name: 'Director',
  fields: {
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: GraphQLID },
    movies: {
      type: new GraphQLList(movieType),
      resolve(source, args) {
        return movies.filter(movie => { return movie.directorId === source.id; });
      }
    }
  }
});

var queryType = new GraphQLObjectType({
  name: 'Query',
  fields: {
    user: {
      type: GraphQLList(userType),
      args: {
        user_id: { type: GraphQLInt }
      },
      resolve: async function (source, args) {
        const result = await db.query(`select * from tbl_user where user_id=${args.user_id}`);
        return result;
      }
    },
    movie: {
      type: movieType,
      args: {
        id: { type: GraphQLInt }
      },
      resolve: async function (source, args) {
        return movies.find(movie => { return movie.id === args.id });
      }
    },
    director: {
      type: directorType,
      args: {
        id: { type: GraphQLInt}
      },
      resolve: function (source, args) {
        return directors.find(director => { return director.id === args.id });
      }
    }
  }
});

module.exports = new GraphQLSchema({ query: queryType });

