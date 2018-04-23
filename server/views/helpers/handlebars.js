function hbsHelpers(hbs) {
    return hbs.create({
        helpers: { // This was missing
            ifeq: function (a, b, options) {
                if (a === b) {
                    return options.fn(this);
                } else {
                    return options.inverse(this);
                }
            }
        },
        layoutsDir: './server/views/layouts/',
        partialsDir: './server/views/partials/',
        defaultLayout: 'main',
        extname: '.html'
    });
}

module.exports = hbsHelpers;