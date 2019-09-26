var express = require("express");
var bodyParser = require('body-parser');
var mysql      = require('mysql');
var dbconfig = require('./config/dbconfig.js');
var gm =require('gm');
//resource
var login = require('./routes/login');
var mountain = require('./routes/mountain');
var review = require('./routes/review');
var user = require('./routes/user');

var multer = require('multer');
const path = require('path');

/*********file upload***************/
//review
const reviewimageupload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './reviewimages/');
    },
    filename: function (req, file, cb) {
      cb(null, new Date().valueOf() + path.extname(file.originalname));
    }
  }),
});

//user
const userimageupload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './userimages/');
    },
    filename: function (req, file, cb) {
      cb(null, req.body.id + path.extname(file.originalname));
    }
  }),
});
/*********file upload***************/

var app = express();
app.use( bodyParser.urlencoded({ extended: true }) );
app.use( bodyParser.json() );


app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'content-type, x-access-token');
    res.header('Access-Control-Allow-Headers', 'content-type, id');
    next();
});


var router = express.Router();

// test route
app.get('/', function(req, res) {
    res.json({ message: 'welcome to Hello Mountain' });
});


// route to handle user registration
//login and register
router.post('/register', login.register);
router.post('/login', login.login);

//mountain info
router.post('/mntall',mountain.allmntlist);
// static 경로로 대체함 router.post('/mntimage',mountain.mntbasicimagedownload);

//review
router.post('/likelist',review.likelist);
router.post('/review',review.posting);
router.post('/star',review.refreshstar);
router.post('/like',review.like);
router.post('/reviewmnt',review.mntreview);
router.post('/reviewuser',review.userreview);
router.post('/likecount',review.likemarkcount);

//userinfo
router.post('/userinfo',user.userinfo);
router.post('/mntuplist',user.mntuplist);
router.post('/mntup',user.mntup);
router.post('/exp',user.refreshexp);

app.use('/api', router);



/*********file upload***************/
//review img
app.post('/reviewimageup', reviewimageupload.single('img'), (req, res) => {
//  console.log(req);

  console.log(req.file.filename);
  console.log(req.body.reviewID);

  var reviewid=req.body.reviewID;
  var pic=req.file.filename;
  var image='./reviewimages/'.concat(pic);

  var connection=mysql.createConnection(dbconfig);

  connection.connect(function(err){
    if(!err) {
        console.log("Database is connected ... UPLOAD REVIEW IMAGE");
    } else {
        console.log("Error connecting database ... UPLOAD REVIEW IMAGE");
      }
  });

  connection.query('UPDATE review SET reviewPic = ? WHERE reviewID = ?',[pic, reviewid],function (error, results, fields) {
  if (error) {
    console.log("error ocurred",error);
    res.send({
      "code":400,
      "failed":"error ocurred"
    })
  }else{
   // console.log('The solution is: ', results);
    res.json(results);
    }
  });

  connection.end();

    gm(image)
    .resize(800,600)
    .write(image, function (err) {
      if (err) console.error(err)
      else console.log('resize done')
    });

});

//user img
app.post('/userimageup', userimageupload.single('img'), (req, res) => {
  console.log(req.file);
  console.log(req.body.id);
  console.log(req.file.filename);
  var id = req.body.id;
  var pic= req.file.filename;

  var image='./userimages/'.concat(pic);
  var connection=mysql.createConnection(dbconfig);

  connection.connect(function(err){
    if(!err) {
        console.log("Database is connected ... UPLOAD USER IMAGE");
    } else {
        console.log("Error connecting database ... UPLOAD USER IMAGE");
      }
  });

  connection.query('UPDATE userinfo SET userPIC = ? WHERE userID = ?',[pic, id],function (error, results, fields) {
  if (error) {
    console.log("error ocurred",error);
    res.send({
      "code":400,
      "failed":"error ocurred"
    })
  }else{
   // console.log('The solution is: ', results);
    res.json(results);
    }
  });

  connection.end();

  gm(image)
  .resize(800,600)
  .write(image, function (err) {
    if (err) console.error(err)
    else console.log('resize done')
  });
});

/*********file upload***************/


app.use('/reviewimages', express.static('reviewimages'));
app.use('/basicimages', express.static('mntimages'));
app.use('/userimages', express.static('userimages'));

app.listen(3000);
console.log('server start');
