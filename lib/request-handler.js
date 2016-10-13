var request = require('request');
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var util = require('../lib/utility');
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

var Models = require('../app/config');
var User = Models.User;
var Url = Models.Url;

exports.renderIndex = function(req, res) {
  res.render('index');
};

exports.signupUserForm = function(req, res) {
  res.render('signup');
};

exports.loginUserForm = function(req, res) {
  res.render('login');
};

exports.logoutUser = function(req, res) {
  req.session.destroy(function() {
    res.redirect('/login');
  });
};

exports.fetchLinks = function(req, res) {
  Url.find().exec( (err, data) => {
    res.status(200).send(data);
  });
};

exports.saveLink = function(req, res) {
  var uri = req.body.url;

  if (!util.isValidUrl(uri)) {
    console.log('Not a valid url: ', uri);
    return res.sendStatus(404);
  }

  Url.findOne({ url: uri }).exec((err, found) => {
    if (found) {
      res.status(200).send(found);
    } else {
      util.getUrlTitle(uri, function(err, title) {
        if (err) {
          console.log('Error reading URL heading: ', err);
          return res.sendStatus(404);
        }
        var url = new Url({
          url: uri,
          title: title,
          baseUrl: req.headers.origin,
          code: util.smallify(uri)
        });
        url.save((err, newUrl, rows ) => {
          res.status(200).send(url);
        });
      });
    }
  });
};

exports.loginUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  User.findOne({username: username}).exec((err, user) => {
    if (!user) {
      res.redirect('/login');
    } else {
      if (util.checkifyPasswordify(password, user.password)) {
        util.createSession(req, res, user);
      } else {
        res.redirect('/login');
      }
    }
  });
};

exports.signupUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  User.findOne({username: username}).exec((err, user)=> {
    if (!user) {
      var user = new User({
        username: username,
        password: util.hashify(password)
      });

      user.save((err)=>{
        util.createSession(req, res, user);
      });
    } else {
      res.redirect('/signup');
    }
  });
};

exports.navToLink = function(req, res) {
  Url.findOne({code: req.params[0]}).exec((err, url) => {
    if (!url) {
      res.redirect('/');
    } else {
      console.log(url);
      url.visits++;
      console.log(url);
      url.save( () => {
        res.redirect(url.url);
      });
    }
  });
};