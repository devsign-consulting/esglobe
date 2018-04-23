process.env.NODE_CONFIG_DIR = './server/config';

var express = require('express');
var router = express.Router();
var config = require('config');
var _ = require('lodash');
var hbs = require('handlebars');
var fs = require('fs');
var ScriptExecutor = require('../../user_modules/scriptExecuter');

function stackTrace() {
    var err = new Error();
    return err.stack;
}

async function execScript(data, req, res) {
    const scriptName = data.scriptName;
    const params = data;
    const scriptExecutor = new ScriptExecutor(req.moduleName, data.scriptName);

    try {
        const result = await scriptExecutor.runScript(scriptName, params);
        res.send(result);
    } catch(err) {
        console.log(stackTrace());
        res.status(500).send(err);
    }
}

router.get('/', async function(req, res, next) {
  if (req.query && req.query.scriptName) {
        execScript(req.query, req, res)
  }
});

router.post('/', async function(req, res, next) {
    if (req.body && req.body.scriptName) {
        execScript(req.body, req, res);
    }
});



module.exports = router;
