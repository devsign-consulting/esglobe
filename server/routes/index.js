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

module.exports = router;
