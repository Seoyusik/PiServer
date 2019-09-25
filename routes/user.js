// TODO:  유저정보 조회
// TODO: 유저정보 갱신(경험치, 등산한 산)
var multer = require('multer');
const path = require('path');
var mysql      = require('mysql');
var jwt = require('jsonwebtoken');
var jwtObj = require('../config/jwt.js');
var dbconfig = require('../config/dbconfig.js');

var user = {};

user.userinfo=function(req,res){
  //connection database
  var connection=mysql.createConnection(dbconfig);

  connection.connect(function(err){
    if(!err) {
        console.log("Database is connected ... USERINFO");
    } else {
        console.log("Error connecting database ... USERINFO");
      }
  });

//get user token
  var token = req.header('x-access-token');
  console.log(req.header('x-access-token'));
  console.log(req.header('id'));
  if (!token){
    res.send({msg:"token is required!"});
    return;
  }
//verify token
  try{
    var decoded = jwt.verify(token, jwtObj.secret);
  }
  catch{
    res.send({msg : "token error;"});
    connection.end();
    return;
  }
  if(decoded.id==req.header('id')){
      console.log("verify for posting");
      connection.query('SELECT * FROM userinfo WHERE userID=?',[req.header('id')],function (error, results, fields) {
        if (error) {
          console.log("error ocurred",error);
          res.send({
            "code":400,
            "failed":"error ocurred"
          });
        } //if database error
        else{
         // console.log('The solution is: ', results);
            res.json(results);
          }
        }); //query
      }//if(verify)
  else{
    res.send({
      "code":400,
      "failed":"verify error ocurred"
    });
  }
  connection.end();
}

user.mntuplist=function(req,res){
  //connection database
  var connection=mysql.createConnection(dbconfig);


  connection.connect(function(err){
    if(!err) {
        console.log("Database is connected ... MNTUPLIST");
    } else {
        console.log("Error connecting database ... MNTUPLIST");
      }
  });

//get user token
  var token = req.header('x-access-token');
  console.log(req.header('x-access-token'));
  console.log(req.header('id'));
  if (!token){
    res.send({msg:"token is required!"});
    return;
  }
//verify token
  try{
    var decoded = jwt.verify(token, jwtObj.secret);
  }
  catch{
    res.send({msg : "token error;"});
    connection.end();
    return;
  }
  if(decoded.id==req.header('id')){
      console.log("verify for mntuplist list");
      connection.query('SELECT * FROM HelloMountain.mntuplist WHERE userID = ?',[req.header('id')],function (error, results, fields) {
        if (error) {
          console.log("error ocurred",error);
          res.send({
            "code":400,
            "failed":"error ocurred"
          });
        } //if database error
        else{
         // console.log('The solution is: ', results);
            res.json(results);
          }
        }); //query
      }//if(token==id)
  else{
    res.send({
      "code":400,
      "failed":"verify error ocurred"
    });
  }
  connection.end();
}

user.mntup=function(req,res){
  //connection database
  var mntuplist={
    "userID":req.headers.id,
    "mntID":req.body.mntID
  };

  var sql1='INSERT INTO mntuplist SET ?';
  var sql1s=mysql.format(sql1,mntuplist);

  var connection=mysql.createConnection(dbconfig);

  connection.connect(function(err){
    if(!err) {
        console.log("Database is connected ... POSTING");
    } else {
        console.log("Error connecting database ... POSTING");
      }
  });

//get user token
  var token = req.header('x-access-token');
  console.log(req.header('x-access-token'));
  console.log(req.header('id'));
  if (!token){
    res.send({msg:"token is required!"});
    return;
  }
//verify token
  try{
    var decoded = jwt.verify(token, jwtObj.secret);
  }
  catch{
    res.send({msg : "token error;"});
    connection.end();
    return;
  }

  if(decoded.id==req.header('id')){
      console.log("verify for mntup");

      connection.query(sql1s,function (error, results, fields){
        if (error) {
          console.log("error ocurred",error);
          res.send({
            "code":400,
            "failed":"error ocurred"
          });
        } //if database error
        else{
         // console.log('The solution is: ', results);
            res.send({
              "code" : 200,
              "msg" :"insert mntuplist success"
          });
        }
      });
    }//if(token==id)
  else{
    res.send({
      "code":400,
      "failed":"verify error ocurred"
    });
  }
  connection.end();
}

user.refreshexp=function(req,res){
  //connection database
  var sql2='UPDATE userinfo SET exp=exp+300 WHERE userID = ?';
  var sql2s=mysql.format(sql2,req.headers.id);

  var connection=mysql.createConnection(dbconfig);

  connection.connect(function(err){
    if(!err) {
        console.log("Database is connected ... EXP");
    } else {
        console.log("Error connecting database ... EXP");
      }
  });

//get user token
  var token = req.header('x-access-token');
  console.log(req.header('x-access-token'));
  console.log(req.header('id'));
  if (!token){
    res.send({msg:"token is required!"});
    return;
  }
//verify token
  try{
    var decoded = jwt.verify(token, jwtObj.secret);
  }
  catch{
    res.send({msg : "token error;"});
    connection.end();
    return;
  }

  if(decoded.id==req.header('id')){
      console.log("verify for mntup");

      connection.query(sql2s,function (error, results, fields){
        if (error) {
          console.log("error ocurred",error);
          res.send({
            "code":400,
            "failed":"error ocurred"
          });
        } //if database error
        else{
         // console.log('The solution is: ', results);
            res.send({
              "code" : 200,
              "msg" :"update exp success"
          });
        }
      });
    }//if(token==id)
  else{
    res.send({
      "code":400,
      "failed":"verify error ocurred"
    });
  }
  connection.end();
}

module.exports=user;
