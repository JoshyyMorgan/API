var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var mongodb = require("mongodb");
var cors = require('cors')
var ObjectID = mongodb.ObjectID;

var ADS_COLLECTION = "ads";
var PROJECT_COLLECTION = 'project';

var app = express();
app.use(cors())
app.use(bodyParser.json());

// Create a database variable outside of the database connection callback to reuse the connection pool in your app.
var db;
const dev_url = 'mongodb://john:123@cluster0-shard-00-00-mpnlo.mongodb.net:27017,cluster0-shard-00-01-mpnlo.mongodb.net:27017,cluster0-shard-00-02-mpnlo.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true'
// Connect to the database before starting the application server.
mongodb.MongoClient.connect(dev_url, function (err, database) {
  if (err) {
    console.log(err);
    process.exit(1);
  }

  // Save database object from the callback for reuse.
  db = database;
  console.log("Database connection ready");

  // Initialize the app.
  var server = app.listen(process.env.PORT || 8080, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
  });
});


function handleError(res, reason, message, code) {
  console.log("ERROR: " + reason);
  res.status(code || 500).json({"error": message});
}

//========= ADS =========

app.get("/ads", function(req, res) {
  db.collection(ADS_COLLECTION).find({}).toArray(function(err, docs) {
    if (err) {
      handleError(res, err.message, "Failed to get ads.");
    } else {
      res.status(200).json(docs);
    }
  });
});

app.post("/ads", function(req, res) {
  var newAds = req.body;

  db.collection(ADS_COLLECTION).insertOne(newAds, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to create new ad.");
    } else {
      res.status(201).json(doc.ops[0]);
    }
  });
});

app.get("/ads/:id", function(req, res) {
  db.collection(ADS_COLLECTION).findOne({ _id: new ObjectID(req.params.id) }, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to get ad");
    } else {
      res.status(200).json(doc);
    }
  });
});

app.put("/ads/:id", function(req, res) {
  var updateDoc = req.body;
  delete updateDoc._id;

  db.collection(ADS_COLLECTION).updateOne({_id: new ObjectID(req.params.id)}, updateDoc, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to update ad");
    } else {
      res.status(204).end();
    }
  });
});

app.delete("/ads/:id", function(req, res) {
  db.collection(ADS_COLLECTION).deleteOne({_id: new ObjectID(req.params.id)}, function(err, result) {
    if (err) {
      handleError(res, err.message, "Failed to delete ad");
    } else {
      res.status(204).end();
    }
  });
});

//=========  Project  =========

app.get("/project", function(req,res){
  db.collection(PROJECT_COLLECTION).find({}).toArray(function(err,docs){
    if (err) {
      handleError(res, err.message, "Failed to get projects.");
    } else {
      res.status(200).json(docs);
    }
  })
})

app.post("/project", function(req,res){
  var newProject = req.body;
  newProject.createDate = new Date()
  db.collection(PROJECT_COLLECTION).insertOne(newProject, function(err,doc){
    if(err){
      handleError(res, err.message, "Failed to create new project.");
    } else{
      res.status(201).json(doc.op[0]);
    }
  })
})

app.get("/project/:id", function(req, res) {
  db.collection(PROJECT_COLLECTION).findOne({ _id: new ObjectID(req.params.id) }, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to get project");
    } else {
      res.status(200).json(doc);
    }
  });
});

app.put("/project/:id", function(req, res) {
  var updateDoc = req.body;
  delete updateDoc._id;

  db.collection(PROJECT_COLLECTION).updateOne({_id: new ObjectID(req.params.id)}, updateDoc, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to update project");
    } else {
      res.status(204).end();
    }
  });
});

app.delete("/project/:id", function(req, res) {
  db.collection(PROJECT_COLLECTION).deleteOne({_id: new ObjectID(req.params.id)}, function(err, result) {
    if (err) {
      handleError(res, err.message, "Failed to delete project");
    } else {
      res.status(204).end();
    }
  });
});