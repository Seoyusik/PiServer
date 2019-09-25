var mysql      = require('mysql');
var jwt = require('jsonwebtoken');
var jwtObj = require('../config/jwt.js');
var dbconfig = require('../config/dbconfig.js');

exports.allmntlist = function(req,res){
  //connection database
  var connection=mysql.createConnection(dbconfig);

  connection.connect(function(err){
    if(!err) {
        console.log("Database is connected ... MNTALL");
    } else {
        console.log("Error connecting database ... MNTALL");
      }
  });

      connection.query('SELECT * FROM mntinfo',function (error, results, fields) {
        if (error) {
          console.log("error ocurred",error);
          res.send({
            "code":400,
            "failed":"error ocurred"
          });
        } //if database error
        else{
         // console.log('The solution is: ', results);
      //   console.log(results[0]);
            res.json(results);
          }
        }); //query

  connection.end();
}//mntAllList

exports.mntbasicimagedownload = function(req,res){
  //get user token
    var token = req.header('x-access-token');
    console.log(req.header('x-access-token'));
    console.log(req.header('id'));
    if (!token){
      res.send({msg:"token is required!"});
      return;
    }
    //decode token
    try{
      var decoded = jwt.verify(token, jwtObj.secret);
    }
    catch{
      res.send({msg : "token error;"});
      return;
    }
  //verify token
    if(decoded.id==req.header('id')){
        console.log("verify download");
        var mntID=req.body.mntID;
        var file= './mntimages/'+mntID+'.jpg';
        res.download(file);
    }//if(verify)
    else
    {
      res.send({
        "code":400,
        "failed":"token not match"
      });
    }

}//mntbasicimagedownload
