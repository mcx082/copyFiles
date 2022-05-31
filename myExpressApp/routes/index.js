var container=require('../database');

var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', async function(req, res, next) {

  const { resources: filedata } = await container.items.readAll().fetchAll();

  res.render('index', { title: 'Express', imie: 'Marek', filesdata: filedata });
});

module.exports = router;
