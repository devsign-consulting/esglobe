process.env.NODE_CONFIG_DIR = './server/config';

var express = require('express');
var router = express.Router();
var config = require('config');
var _ = require('lodash');
var hbs = require('handlebars');
var fs = require('fs');
var readFilePromise = require('fs-readfile-promise');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    menu: config.menu,
    helpers: {
      includeModules: function (menu) {
        let output = '';
        _.forEach(menu, menuItem => {
          if (menuItem.module)
            output += `<script>$(document).ready(function() { const esglobe = new Esglobe(); esglobe.loadModule('${menuItem.module}')})</script>`;

          if (menuItem.subMenu) {
            _.forEach(menuItem.subMenu, subMenuItem => {
              if (subMenuItem.module)
                output += `<script>$(document).ready(function() { const esglobe = new Esglobe(); esglobe.loadModule('${subMenuItem.module}')})</script>`;
            })
          }
        });

        return new hbs.SafeString(output);
      }
    }
  });
});

router.get('/fs', function(req, res, next) {
  const url = req.query.url;
  console.log("== fs url ==", url);
  if (url) {
      if (fs.existsSync(url)) {
          return readFilePromise(url)
              .then(data => {
                  // get the filename
                  let content = `filename=download`;
                  res.writeHead(200, {
                      'Content-Type': 'image',
                      'Content-disposition': content,
                      'Content-Length': data.length
                  });
                  res.end(new Buffer(data, 'binary'));
              });
      } else {
          res.status(404).send("Not found");
      }
  } else {
    res.status(404).send("Not found");
  }
});

module.exports = router;
