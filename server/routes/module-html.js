process.env.NODE_CONFIG_DIR = './server/config';

var express = require('express');
var router = express.Router();
var fs = require('fs');

// allows esglobe_modules to load bower_components
router.get('/:moduleName/bower_components/*', function(req, res, next) {
    res.sendFile(`./esglobe_modules/${req.params.moduleName}/bower_components/${req.params[0]}`, { root: './server/public'});
});

// allows esglobe_modules to load css
router.get('/:moduleName/css/*', function(req, res, next) {
    res.sendFile(`./esglobe_modules/${req.params.moduleName}/css/${req.params[0]}`, { root: './server/public'});
});

// allows esglobe_modules to load js
router.get('/:moduleName/js/*', function(req, res, next) {
    res.sendFile(`./esglobe_modules/${req.params.moduleName}/js/${req.params[0]}`, { root: './server/public'});
});

// allows esglobe_modules widgets to load js
router.get('/:moduleName/widgets/*', function(req, res, next) {
    res.sendFile(`./esglobe_modules/${req.params.moduleName}/widgets/${req.params[0]}`, { root: './server/public'});
});

// allows esglobe_modules routes to load js
router.get('/:moduleName/routes/*', function(req, res, next) {
    res.sendFile(`./esglobe_modules/${req.params.moduleName}/routes/${req.params[0]}`, { root: './server/public'});
});

router.get('/:moduleName/widgets/:position', function(req, res, next) {
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

router.get('/:moduleName/:templateName?', function(req, res, next) {
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
