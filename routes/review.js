var multer = require('multer');
const path = require('path');
var mysql      = require('mysql');
var jwt = require('jsonwebtoken');
var jwtObj = require('../config/jwt.js');
var dbconfig = require('../config/dbconfig.js');

var review = {};
review.mntreview=function(req,res){
  //connection database
  var sql1='SELECT * FROM HelloMountain.review WHERE reviewMNtID = ? ORDER BY reviewID desc';
  var sql1s=mysql.format(sql1,req.body.mntID);

  var connection=mysql.createConnection(dbconfig);

  connection.connect(function(err){
    if(!err) {
        console.log("Database is connected ... MNT REVIEW");
    } else {
        console.log("Error connecting database ... MNT REVIEW");
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
      console.log("verify for mnt review");

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
            res.json(results);
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

review.userreview=function(req,res){
  //connection database
  var sql1='SELECT * FROM HelloMountain.review WHERE reviewUserID = ? ORDER BY reviewID desc';
  var sql1s=mysql.format(sql1,req.body.id);

  var connection=mysql.createConnection(dbconfig);

  connection.connect(function(err){
    if(!err) {
        console.log("Database is connected ... USER REVIEW");
    } else {
        console.log("Error connecting database ... USER REVIEW");
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
      console.log("verify for user review");

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
            res.json(results);
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

review.like=function(req,res){
  //connection database
  var likemark={
    "userID":req.headers.id,
    "reviewID":req.body.reviewID
  };

  var sql1='INSERT INTO likelist SET ?';
  var sql1s=mysql.format(sql1,likemark);

  var connection=mysql.createConnection(dbconfig);

  connection.connect(function(err){
    if(!err) {
        console.log("Database is connected ... LIKE");
    } else {
        console.log("Error connecting database ... LIKE");
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
      console.log("verify for like");

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
              "msg" :"review like success"
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

review.likelist=function(req,res){
  //connection database
  var connection=mysql.createConnection(dbconfig);

  connection.connect(function(err){
    if(!err) {
        console.log("Database is connected ... LIKELIST");
    } else {
        console.log("Error connecting database ... LIKELIST");
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
      console.log("verify for review list");
      connection.query('SELECT review.* FROM HelloMountain.review JOIN HelloMountain.likelist ON likelist.reviewID = review.reviewID AND likelist.userID = ?',
      [req.header('id')],function (error, results, fields) {
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

review.posting=function(req,res){
  //connection database
  var connection=mysql.createConnection(dbconfig);

  var review={
      "reviewUserID":req.body.reviewUserID,
      "reviewMntID":req.body.reviewMntID,
      "reviewString":req.body.reviewString,
      "reviewStar":req.body.reviewStar,
  }

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
      console.log("verify for review list");
      connection.query('INSERT INTO review SET ?',review,function (error, results, fields) {
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
              "reviewID" : results["insertId"]});
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

review.refreshstar=function(req,res){
  //connection database
  var sql2='UPDATE HelloMountain.mntinfo SET mntStar = (SELECT ROUND(AVG(reviewStar),1) FROM HelloMountain.review WHERE reviewMntID = ?) WHERE mntID = ?;';
  var sql2s=mysql.format(sql2,[req.body.reviewMntID,req.body.reviewMntID]);

  var connection=mysql.createConnection(dbconfig);

  connection.connect(function(err){
    if(!err) {
        console.log("Database is connected ... STAR REFRESH");
    } else {
        console.log("Error connecting database ... STAR REFRESH");
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
      console.log("verify for UPDATE STAR");

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
              "msg" :"UPDATE MNTSTAR SUCCESS"
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

review.posting=function(req,res){
  //connection database
  var connection=mysql.createConnection(dbconfig);

  var review={
      "reviewUserID":req.body.reviewUserID,
      "reviewMntID":req.body.reviewMntID,
      "reviewString":req.body.reviewString,
      "reviewStar":req.body.reviewStar,
  }

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
      console.log("verify for review list");
      connection.query('INSERT INTO review SET ?',review,function (error, results, fields) {
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
              "reviewID" : results["insertId"]});
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

review.likemarkcount=function(req,res){
  //connection database
  var sql2='SELECT reviewID, count(*) FROM HelloMountain.likelist WHERE reviewID=?;';
  var sql2s=mysql.format(sql2,[req.body.reviewID]);

  var connection=mysql.createConnection(dbconfig);

  connection.connect(function(err){
    if(!err) {
        console.log("Database is connected ... STAR REFRESH");
    } else {
        console.log("Error connecting database ... STAR REFRESH");
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
      console.log("verify for COUNT LIKEMARK");

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
            res.json(results);
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

module.exports=review;
