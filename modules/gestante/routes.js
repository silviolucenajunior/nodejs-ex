var express = require('express');
var objectID = require('mongodb').ObjectID;
var bodyParser = require('body-parser').urlencoded({extended: false});
var router = express.Router();
var persistence = require(__dirname + '/../../core/persistence');

router.get('/', function (request, response) {
    persistence.findAll({'ModelName': 'Gestante'})
    .then(function (data) {
        response.render('modules/gestante/templates/index.html', {'gestantes': data});
    })
    .catch(err => {
        console.log(err);
    });
});

router.post('/', bodyParser, function (request, response) {
    var document = JSON.parse(request.body.document);
    if (document['_id']) {
        document['_id'] = new objectID(document['_id']);
    } else {
        delete document['_id'];
    }
    persistence.insert({'ModelName': 'Gestante'}, document)
    .then(result => {
        response.json({'saved': 1, 'document': document});
    })
    .catch(err => {
        console.log('err');
    });
});

router.delete('/:_id', function (request, response) {
    persistence.delete({'ModelName': 'Gestante'}, new objectID(request.params._id))
    .then(() => {
        response.json({'deleted': 1, 'guid': request.params._id})
    })
    .catch(err => {
        console.log(err);
    })
});

router.get('/:_id', function (request, response) {
    console.log(request.params._id);
    persistence.find({'ModelName': 'Gestante'}, {'_id': new objectID(request.params._id)})
    .then(document => {
        console.log("Document gound");
        console.log(document);
        response.json({'document': document});
    })
    .catch(err => {
        console.log(err);
    })
});

router.get('/search/:keyword', function (request, response) {
    persistence.search({'ModelName': 'Gestante'}, ['Nome', 'Obstreta'], request.params.keyword)
    .then(result => {
        console.log("Result ov search");
        console.log(result);
        response.json({'result': result})
    })
    .catch(err => {
        console.log("error");
    })
});
module.exports = router;