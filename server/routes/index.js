process.env.NODE_CONFIG_DIR = './server/config';

var express = require('express');
var router = express.Router();
var config = require('config');
var _ = require('lodash');
var hbs = require('handlebars');
var fs = require('fs');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    menu: config.menu,
    helpers: {
      includeModules: function (menu) {
        let output = '';
        _.forEach(menu, menuItem => {
          if (menuItem.module)
            output += `<script>$(document).ready(function() { esglobeLoadModule('${menuItem.module})}')</script>`;

          if (menuItem.subMenu) {
            _.forEach(menuItem.subMenu, subMenuItem => {
              if (subMenuItem.module)
                output += `<script>$(document).ready(function() { esglobeLoadModule('${subMenuItem.module}')})</script>`;
            })
          }
        });

        return new hbs.SafeString(output);
      }
    }
  });
});

router.get('/module-html/:moduleName/:templateName?', function(req, res, next) {
  const templateName = req.params.templateName ? req.params.templateName : 'index';
  const path = `esglobe_modules/${req.params.moduleName}/${templateName}`;
  const path2 = `node_modules/@esglobe/${req.params.moduleName}/${templateName}`;
  let template = null;

  if (fs.existsSync(`${path}.hbs`)) {
    template = path;
  } else if (fs.existsSync(`${path2}.hbs`)) {
    template = path2
  }

  if (template) {
    res.render(`../../${template}`, {
      layout: 'iframe',
      moduleName: req.params.moduleName
    });
  } else {
    res.status(404).send("template not found");
  }
});

module.exports = router;
