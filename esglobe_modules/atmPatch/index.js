var sph=parent.sph;

function rnd(v,n){
    return Math.round(v*n)/n;
}
function copyText(field,msg)
{
  document.getElementById(field).value=msg;
}
function getval(field)
{
  return document.getElementById(field).value;
}

function doclick(xy,latlon){
    // returns [x,y] on a -1 to 1 and [lat,lon]
    lat=rnd(latlon[0],10);
    lon=rnd(latlon[1],10);
    //    sph.orient(lat,lon);
    copyText("m2lat",lat);
    copyText("m2lon",lon);
    launch();
}

function launch(){
    lat=getval("m2lat");
    lon=getval("m2lon");
    NF=getval("NF");
    press=getval("press");
    del=getval("del");
    cmd="/esglobe/atmos/atmpatch.php?"+press+","+NF+","+del+","+lat+","+lon+",#";
    copyText("cmd",cmd);
    sph.show(cmd);
}

function init(){
    sph.sphereClick=doclick;
}

function finis(){
    sph.sphereClick=null;
}
