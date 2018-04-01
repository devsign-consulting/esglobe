var express = require('express');
var router = express.Router();

// create backend
router.get('/', function(req, res, next) {
    const rand = Array.from({length: 20}, () => Math.floor(Math.random() * 9));
    res.send(rand);
});

router.get('/python-test', function (req, res, next) {
    const path = `${__dirname}./../scripts/hello_world.py`;
    var PythonShell = require('python-shell');

    PythonShell.run(path, function (err, results) {
        if (err) throw err;
        res.send(results);
    });
});

module.exports = router;
