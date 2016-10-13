// var path = require('path');
// var knex = require('knex')({
//   client: 'sqlite3',
//   connection: {
//     filename: path.join(__dirname, '../db/shortly.sqlite')
//   },
//   useNullAsDefault: true
// });
// var db = require('bookshelf')(knex);

// db.knex.schema.hasTable('urls').then(function(exists) {
//   if (!exists) {
//     db.knex.schema.createTable('urls', function (link) {
//       link.increments('id').primary();
//       link.string('url', 255);
//       link.string('baseUrl', 255);
//       link.string('code', 100);
//       link.string('title', 255);
//       link.integer('visits');
//       link.timestamps();
//     }).then(function (table) {
//       console.log('Created Table', table);
//     });
//   }
// });

// db.knex.schema.hasTable('users').then(function(exists) {
//   if (!exists) {
//     db.knex.schema.createTable('users', function (user) {
//       user.increments('id').primary();
//       user.string('username', 100).unique();
//       user.string('password', 100);
//       user.timestamps();
//     }).then(function (table) {
//       console.log('Created Table', table);
//     });
//   }
// });

// module.exports = db;


var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var db = mongoose.connect('mongodb://localhost:27017');
exports.db = db;

var userSchema = new Schema({
  id: Schema.Types.ObjectId, 
  username: { type: String, unique: true },
  password: String,
  // urls: [{type: Schema.Types.ObjectId, ref: 'Url'}]
}, { timestamps: { createdAt: 'created_at'} });

var User = mongoose.model('User', userSchema);

var urlSchema = new Schema({
  id: Schema.Types.ObjectId,
  // _user: {type: Schema.Types.ObjectId, ref: 'User'},
  url: String,
  baseUrl: String,
  code: String,
  title: String, 
  visits: { type: Number, default: 0}
}, { timestamps: { createdAt: 'created_at'} });


var Url = mongoose.model('Url', urlSchema);

exports.User = User;
exports.Url = Url;