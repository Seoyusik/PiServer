var mysql      = require('mysql');
var jwt = require('jsonwebtoken');
var jwtObj = require('../config/jwt.js');
var dbconfig = require('../config/dbconfig.js');



exports.register = function(req,res){
  var connection=mysql.createConnection(dbconfig);

  connection.connect(function(err){
  if(!err) {
      console.log("Database is connected ... REGISTER");
  } else {
      console.log("Error connecting database ... REGISTER");
    }
  });

  // console.log("req",req.body);
  var today = new Date();
  var users={
      "userID":req.body.id,
      "userPW":req.body.pw,
  }
  connection.query('INSERT INTO userinfo SET ?',users, function (error, results, fields) {
      if (error) {
            console.log("error ocurred",error);
            res.send({
              "code":400,
              "failed":"error ocurred"
            })
      }else{
            console.log('The solution is: ', results);
            res.send({
              "code":200,
              "success":"user registered sucessfully"
                });
              }
      });
      connection.end();
}//register

exports.login = function(req,res){
  var connection=mysql.createConnection(dbconfig);

  connection.connect(function(err){
      if(!err) {
          console.log("Database is connected ... LOGIN");
      } else {
          console.log("Error connecting database ... LOGIN");
        }
  });

  var id= req.body.id;
  var pw = req.body.pw;
  connection.query('SELECT * FROM userinfo WHERE userID = ?',[id], function (error, results, fields) {
  if (error) {
         console.log("error ocurred",error);
        res.send({
            "code":400,
            "failed":"error ocurred"
          })
  }else{
        console.log('The query result is: ', results);
        if(results.length >0){
          if(results[0].userPW == pw){
          	var token=jwt.sign({ id: id }, jwtObj.secret);
          	var decoded = jwt.verify(token, jwtObj.secret);
          	console.log(decoded.id)
          	res.send({"code" : 200, "token" : token});
          }// if login success
          else{
            res.send({
                  "code":204,
                  "failed":"id and password does not match"
                });
          }// login failed
        }//  if(results.length >0)
        else{
          res.send({
                "code":204,
                "failed":"id does not exits"
              });
        }// else
    }
  });
  connection.end();
}
