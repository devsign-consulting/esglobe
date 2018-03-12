(function(exports){
  exports.getGlobeConfig = function(){
    return {
        sz: 950,
        w: 450,
        scalefac: 1.06,
        res: [2048, 1024]
    };
  };
}(typeof exports === 'undefined' ? this.globeConfig = {} : exports));