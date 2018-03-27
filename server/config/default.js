'use strict';

module.exports = {
    menu: [
        {
            name:  'EsGlobe',
            subMenu: [
                {
                    name: 'Surface Air Temperature',
                    module: 'surfaceAir'
                },
                {
                    name: 'Atmospheric patch',
                    module: 'atmPatch'
                },
                {
                    name: 'Draw on sphere',
                    module: 'draw'
                },
                {
                    name: 'Simple html',
                    module: 'simple'
                },
                {
                    name: 'Draw meridian',
                    module: 'meridian'
                }
            ]
        }
    ]
};
