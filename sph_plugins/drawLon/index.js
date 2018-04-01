sph.plugins.drawLon = function (latlon){
    loadSphere(0);
    var xy = latlon2xy(latlon);
    var x = xy[0];

    setTimeout(function () {
        var canvas = sph.getcanvas();
        ctx = canvas.getContext('2d');
        ctx.strokeStyle="#20a81c";
        ctx.lineWidth=5;
        ctx.beginPath();
        ctx.moveTo(x,0);
        ctx.lineTo(x,canvas.height-1);
        ctx.stroke();
    }, 100);
};
