'use strict';

module.exports = {
  menu: [
    {
      name: 'ESRL Climatology',
      module: 'esrl'
    },
    {
      name: 'Marshall & Plumb',
      subMenu: [
        {
          name: 'Surface Air Temperature',
          module: 'surfaceAir'
        }
      ]
    }
  ]
};