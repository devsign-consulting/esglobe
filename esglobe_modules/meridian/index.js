sph=parent.sph;

// drawing package
var draw_canvas=sph.getcanvas();
var draw_ctx=draw_canvas.getContext('2d');

function drawLon(lon){
    draw_ctx.strokeStyle="#ff0000";
    draw_ctx.lineWidth=2;
    x=(lon+180)/360.0*draw_canvas.width;
    draw_ctx.beginPath();
    draw_ctx.moveTo(x,0);
    draw_ctx.lineTo(x,draw_canvas.height-1);
    draw_ctx.stroke();
}
// end

function init(){
    sph.sphereClick=doclick;
}
function finis(){
    sph.sphereClick=null;
}

function rnd(v,n){
    return Math.round(v*n)/n;
}
function copyText(field,msg)
{
  document.getElementById(field).value=msg;
}
function doclick(xy,latlon){
// returns [x,y] on a -1 to 1 and [lat,lon]
    lat=rnd(latlon[0],10);
    lon=rnd(latlon[1],10);
    sph.orient(lat,lon);
    copyText("m2lat",lat);
    copyText("m2lon",lon);
    drawLon(lon);
}
