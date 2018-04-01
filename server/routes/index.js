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

// allows esglobe_modules to load bower_components
router.get('/module-html/:moduleName/bower_components/*', function(req, res, next) {
  res.sendFile(`./esglobe_modules/${req.params.moduleName}/bower_components/${req.params[0]}`, { root: './server/public'});
});

// allows esglobe_modules to load css
router.get('/module-html/:moduleName/css/*', function(req, res, next) {
    res.sendFile(`./esglobe_modules/${req.params.moduleName}/css/${req.params[0]}`, { root: './server/public'});
});

// allows esglobe_modules to load js
router.get('/module-html/:moduleName/js/*', function(req, res, next) {
    res.sendFile(`./esglobe_modules/${req.params.moduleName}/js/${req.params[0]}`, { root: './server/public'});
});

// allows esglobe_modules widgets to load js
router.get('/module-html/:moduleName/widgets/*', function(req, res, next) {
    res.sendFile(`./esglobe_modules/${req.params.moduleName}/widgets/${req.params[0]}`, { root: './server/public'});
});

router.get('/module-html/:moduleName/widgets/:position', function(req, res, next) {
    const templateName = 'index';
    const position = req.params.position;
    const path = `esglobe_modules/${req.params.moduleName}/widgets/${position}/${templateName}`;
    const path2 = `node_modules/@esglobe/${req.params.moduleName}/widgets/${position}/${templateName}`;
    let template = null;

    if (fs.existsSync(`${path}.hbs`)) {
        template = path;
    } else if (fs.existsSync(`${path2}.hbs`)) {
        template = path2
    }

    if (template) {
        res.render(`../../${template}`, {
            layout: 'widget',
            moduleName: req.params.moduleName,
            position: req.params.position
        });
    } else {
        res.status(404).send("template not found");
    }
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
      layout: 'module',
      moduleName: req.params.moduleName
    });
  } else {
    res.status(404).send("template not found");
  }
});

module.exports = router;
