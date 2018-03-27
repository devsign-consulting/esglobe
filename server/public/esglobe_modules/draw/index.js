sph=parent.sph;

Color="red";
x0=0;
y0=0;
Linewidth=2;
Linestyle="Freehand";
Mousedown=false;
textmode=false;
textcontent='';
Font="sans-serif";
Fontsize="25";
Fontweight="";
Fontslant="";
Brushtype="Pencil";
Opacity=1;
Orient=true;
drawlist=[];
currentlist=[];
onlineflag=sph.online != null;
xy0=[];

var canvas=null;
var ctx=null;
var canvas_copy=null;

function getAjax(url, success) {
  var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new
  ActiveXObject('Microsoft.XMLHTTP'); 
  xhr.open('GET', url);
  xhr.onreadystatechange = function() {
    if (xhr.readyState>3 && xhr.status==200) success(xhr.responseText);
  }; 
  xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
  xhr.send();
  return xhr;
}

function cloneCanvas(oldCanvas) {

    //create a new canvas
    var newCanvas = document.createElement('canvas');
    var context = newCanvas.getContext('2d');

    //set dimensions
    newCanvas.width = oldCanvas.width;
    newCanvas.height = oldCanvas.height;

    //apply the old canvas to the new one
    context.drawImage(oldCanvas, 0, 0);

    //return the new canvas
    return newCanvas;
}

function drawPencil(xp,yp,x,y){
    ctx.lineWidth=Linewidth;
    ctx.beginPath();
    ctx.moveTo(xp,yp);
    ctx.lineTo(x,y);
    ctx.stroke();
}

function drawFlatBrush(xp,yp,x,y){
    ctx.lineWidth=Linewidth;
    ctx.beginPath();
    ctx.moveTo(xp,yp);
    ctx.lineTo(x,y);
    ctx.moveTo(xp-1.0*Linewidth,yp-1.0*Linewidth);
    ctx.lineTo(x-1.0*Linewidth,y-1.0*Linewidth);
    ctx.moveTo(xp-0.5*Linewidth,yp-0.5*Linewidth);
    ctx.lineTo(x-0.5*Linewidth,y-0.5*Linewidth);
    ctx.moveTo(xp+1.0*Linewidth,yp+1.0*Linewidth);
    ctx.lineTo(x+1.0*Linewidth,y+1.0*Linewidth);
    ctx.moveTo(xp+0.5*Linewidth,yp+0.5*Linewidth);
    ctx.lineTo(x+0.5*Linewidth,y+0.5*Linewidth);
    ctx.stroke();
}

function drawRoundBrush(xp,yp,x,y){
//    bw=brushimg.width/2.0;
//    d=Math.sqrt((x-xp)*(x-xp)+(y-yp)*(y-yp));
//    dx=(x-xp)/(d+(d==0));
//    dy=(y-yp)/(d+(d==0));
//    for (i=0;i<d;i++)
//	ctx.drawImage(brushimg,xp+i*dx-bw,yp+i*dy-bw);
}

function drawAirbrush(xp,yp,x,y){
}

brushes={Pencil:drawPencil,Flat_Brush:drawFlatBrush,Round_Brush:drawRoundBrush,
	 Airbrush:drawAirbrush};

Brush=drawPencil;

function setbrush(){
    b=getid('brush');
    if (b == "import") return;
    Brush=brushes[b];
    Brushtype=b;
}

function setcolor(col){
    document.getElementById('numcol').innerHTML=col;
    Color=col;
}

function getid(id){
// alert('getid: '+id);
  return document.getElementById(id).value;
}

function textstart(){
//    console.log('start text');
    Mousedown=false;
    textmode=true;
}

function puttext(text,x,y,font,color,opacity){
//    console.log("puttext "+color+" "+y);
    ctx.fillStyle=color;
    ctx.globalAlpha=opacity;
    ctx.font=font;
    ctx.fillText(text,x,y);
}

function placetext(latlon){
    xy=sph.latlon2xy(latlon);
    font=Fontslant+" "+Fontweight+" "+Fontsize+"px "+Font;
    puttext(getid("textbox"),xy[0],xy[1],font,Color,Opacity);
    currentlist=[
	["Text",font,Color,xy[0],xy[1],Opacity],
	[getid("textbox")]];
    drawlist.push(currentlist);
    showdrawlist();
    textmode=false;
    if(onlineflag)savepng();
}

function showdrawlist(){
    document.getElementById("drawlist").value=JSON.stringify(drawlist);
}

function redrawText(d){
//    console.log(d[0]);
    puttext(d[1],d[0][3],d[0][4],d[0][1],d[0][2],d[0][5]);
}

function redrawFreehand(d){
//    console.log(d[0]);
    Linewidth=1.0*d[0][1];
    ctx.strokeStyle=d[0][2];
    brush=brushes[d[0][3]];
    ctx.globalAlpha=[d[0][4]];
    ctx.beginPath();
    for(n1=1;n1<d.length;n1++)
	if(d[n1][0]<0){
	    xp=d[n1][1];
	    yp=d[n1][2];
	} else{
	    x=d[n1][0];
	    y=d[n1][1];
	    brush(xp,yp,x,y);
	    xp=x;
	    yp=y;
	};
}

function redraw(){
//    canvas=cloneCanvas(canvas_copy);
//    parent.pg.elt=canvas;
    sph.putcanvas(canvas_copy);
    canvas=sph.getcanvas();
    ctx=canvas.getContext("2d");
    ctx.lineJoin = ctx.lineCap = 'round';
    ctx.globalAlpha=1;
    linewidthsv=Linewidth;
//    ctx.drawImage(img,0,0);
    for(n=0;n<drawlist.length;n++){
	d=drawlist[n];
	dispfun[d[0][0]](d);
    };
    if(onlineflag)savepng();
    Linewidth=linewidthsv;
}


dispfun={Text:redrawText,Freehand:redrawFreehand};

function adddrawlist(){
  var txt=getid("drawlist");
  if (txt.length>0){
      var dl2=JSON.parse(txt.trim());
    drawlist=drawlist.concat(dl2);
    showdrawlist();
    redraw();
  };
}

function undo(){
    drawlist.pop();
    showdrawlist();
    redraw();
}


var x_p=0;
var y_p=0;
function dodrag(xy,latlon){
    if (Orient) return true;
//    console.log("dragging "+latlon);
    ctx.lineWidth=Linewidth;
    ctx.strokeStyle=Color;
//    copyText("m2lat",lat);
//    copyText("m2lon",lon);
    xy=sph.latlon2xy(latlon);
    x=xy[0];
    y=xy[1];
    if(!Mousedown){
	Mousedown=true;
	textmode=false;
	x_p=x;
	y_p=y;
	ctx.lineWidth=Linewidth;
	ctx.strokeStyle=Color;
	ctx.globalAlpha=Opacity;
	ctx.beginPath();
//	ctx.moveTo(x,y);
	currentlist=[[Linestyle,Linewidth,Color,Brushtype,Opacity],[-1,x,y]];
	return false;
    };
    r0=sph.res[0];
    if (Math.abs(x_p-x)<0.75*r0) {
	Brush(x_p,y_p,x,y);
  } else {
	dx=r0-Math.abs(x_p-x);
	if(x < 0.25*r0) {
	    ym=(y_p-y)*x/dx+y;
	    Brush(x_p,y_p,r0-1,ym);
	    currentlist.push([r0-1,ym]);
	    Brush(0,ym,x,y);
	    currentlist.push([-1,0,ym]);
	} else {
	    ym=(y-y_p)*x_p/dx+y_p;
	    Brush(x_p,y_p,0,ym);
	    currentlist.push([0,ym]);
	    Brush(r0-1,ym,x,y);
	    currentlist.push([-1,r0-1,ym]);
	};
//	console.log(x0+","+y0+" -> "+x+","+y)
    };
    currentlist.push([x,y]);
    x_p=x;
    y_p=y;
    return false;
}

function mouseup(xy,latlon){
    if(Mousedown){
	Mousedown=false;
	drawlist.push(currentlist);
	showdrawlist();
	if(onlineflag)savepng();
    };
    return true;
}

function mousedown(xy,latlon){
  xy0=xy;
}

function putImage(cn,imgn) {
    canvas = document.getElementById(cn);
    ctx = canvas.getContext("2d");
    var img = document.getElementById(imgn);
    ctx.drawImage(img,0,0);
    ctx.lineJoin = ctx.lineCap = 'round';
}

function doclick(xy,latlon){
    if(xy[0] > -100){
	if(textmode) placetext(latlon);
	return true;
    };
//    Orient = !Orient;
//    d=document.getElementById("actionstatus");
//    if(Orient)d.innerHTML="Orienting sphere";
//    else d.innerHTML="Drawing";
}

function swapaction(orfl){
   Orient= orfl;
    if (Orient) {
document.getElementById("actionorienting").style['background-color']="#8f8";	
document.getElementById("actiondrawing").style['background-color']="#f88";	
    } else {
document.getElementById("actionorienting").style['background-color']="#f88";	
document.getElementById("actiondrawing").style['background-color']="#8f8";	
    };
}
function savepng(){
    canvas.toBlob(function(blob) {
	saveAs(blob, "drawimage.png");
    });
}

function init(){
    canvas=sph.getcanvas();
    canvas_copy=cloneCanvas(canvas);
    ctx=canvas.getContext("2d");
    ctx.lineJoin = ctx.lineCap = 'round';
    sph.sphereClick=doclick;
    sph.sphereDrag=dodrag;
    sph.mouseUp=mouseup;
    sph.mouseDown=mousedown;
    Mousedown=false;
    textmode=false;
    if(onlineflag)savepng();
}
function finis(){
    sph.sphereClick=null;
    sph.sphereDrag=null;
    sph.mouseUp=null;
    sph.mouseDown=null;
    Mousedown=false;
    textmode=false;
    sph.reload()
}
	      
var modalPage=null;
function modal(content){
    if(content){
	modalPage=document.getElementById(content);
	modalPage.style.display = "block";
    } else modalPage.style.display = "none";
}

function hexColorSel(c){
    modalPage.style.display = "none";
    document.getElementById("numcol").innerHTML=c;
    setcolor(c);
}

function saveit(){
    if(onlineflag)
	modal("saveModal");
    else
	savepng();
}

var xcol0=0;
var ycol0=0;
tab=[
[   0.00000,   -0.00000,   15.00000,    0.00000,    0.00000],
[   1.73205,    0.00000,   15.00000,    3.00000,    0.00000],
[   3.46410,    0.00000,   15.00000,    6.00000,    0.00000],
[   5.19615,    0.00000,   15.00000,    9.00000,    0.00000],
[   6.92820,    0.00000,   15.00000,   12.00000,    0.00000],
[   8.66025,    0.00000,   15.00000,   15.00000,    0.00000],
[   9.52628,   -1.50000,   12.00000,   15.00000,    0.00000],
[  10.39230,   -3.00000,    9.00000,   15.00000,    0.00000],
[  11.25833,   -4.50000,    6.00000,   15.00000,    0.00000],
[  12.12436,   -6.00000,    3.00000,   15.00000,    0.00000],
[  12.99038,   -7.50000,    0.00000,   15.00000,    0.00000],
[  12.12436,   -9.00000,    0.00000,   15.00000,    3.00000],
[  11.25833,  -10.50000,    0.00000,   15.00000,    6.00000],
[  10.39230,  -12.00000,    0.00000,   15.00000,    9.00000],
[   9.52628,  -13.50000,    0.00000,   15.00000,   12.00000],
[   8.66025,  -15.00000,    0.00000,   15.00000,   15.00000],
[   6.92820,  -15.00000,    0.00000,   12.00000,   15.00000],
[   5.19615,  -15.00000,    0.00000,    9.00000,   15.00000],
[   3.46410,  -15.00000,    0.00000,    6.00000,   15.00000],
[   1.73205,  -15.00000,    0.00000,    3.00000,   15.00000],
[   0.00000,  -15.00000,    0.00000,    0.00000,   15.00000],
[  -0.86603,  -13.50000,    3.00000,    0.00000,   15.00000],
[  -1.73205,  -12.00000,    6.00000,    0.00000,   15.00000],
[  -2.59808,  -10.50000,    9.00000,    0.00000,   15.00000],
[  -3.46410,   -9.00000,   12.00000,    0.00000,   15.00000],
[  -4.33013,   -7.50000,   15.00000,    0.00000,   15.00000],
[  -3.46410,   -6.00000,   15.00000,    0.00000,   12.00000],
[  -2.59808,   -4.50000,   15.00000,    0.00000,    9.00000],
[  -1.73205,   -3.00000,   15.00000,    0.00000,    6.00000],
[  -0.86603,   -1.50000,   15.00000,    0.00000,    3.00000],
[   0.86603,   -1.50000,   15.00000,    3.00000,    3.00000],
[   2.59808,   -1.50000,   15.00000,    6.00000,    3.00000],
[   4.33013,   -1.50000,   15.00000,    9.00000,    3.00000],
[   6.06218,   -1.50000,   15.00000,   12.00000,    3.00000],
[   7.79423,   -1.50000,   15.00000,   15.00000,    3.00000],
[   8.66025,   -3.00000,   12.00000,   15.00000,    3.00000],
[   9.52628,   -4.50000,    9.00000,   15.00000,    3.00000],
[  10.39230,   -6.00000,    6.00000,   15.00000,    3.00000],
[  11.25833,   -7.50000,    3.00000,   15.00000,    3.00000],
[  10.39230,   -9.00000,    3.00000,   15.00000,    6.00000],
[   9.52628,  -10.50000,    3.00000,   15.00000,    9.00000],
[   8.66025,  -12.00000,    3.00000,   15.00000,   12.00000],
[   7.79423,  -13.50000,    3.00000,   15.00000,   15.00000],
[   6.06218,  -13.50000,    3.00000,   12.00000,   15.00000],
[   4.33013,  -13.50000,    3.00000,    9.00000,   15.00000],
[   2.59808,  -13.50000,    3.00000,    6.00000,   15.00000],
[   0.86603,  -13.50000,    3.00000,    3.00000,   15.00000],
[  -0.00000,  -12.00000,    6.00000,    3.00000,   15.00000],
[  -0.86603,  -10.50000,    9.00000,    3.00000,   15.00000],
[  -1.73205,   -9.00000,   12.00000,    3.00000,   15.00000],
[  -2.59808,   -7.50000,   15.00000,    3.00000,   15.00000],
[  -1.73205,   -6.00000,   15.00000,    3.00000,   12.00000],
[  -0.86603,   -4.50000,   15.00000,    3.00000,    9.00000],
[  -0.00000,   -3.00000,   15.00000,    3.00000,    6.00000],
[   1.73205,   -3.00000,   15.00000,    6.00000,    6.00000],
[   3.46410,   -3.00000,   15.00000,    9.00000,    6.00000],
[   5.19615,   -3.00000,   15.00000,   12.00000,    6.00000],
[   6.92820,   -3.00000,   15.00000,   15.00000,    6.00000],
[   7.79423,   -4.50000,   12.00000,   15.00000,    6.00000],
[   8.66025,   -6.00000,    9.00000,   15.00000,    6.00000],
[   9.52628,   -7.50000,    6.00000,   15.00000,    6.00000],
[   8.66025,   -9.00000,    6.00000,   15.00000,    9.00000],
[   7.79423,  -10.50000,    6.00000,   15.00000,   12.00000],
[   6.92820,  -12.00000,    6.00000,   15.00000,   15.00000],
[   5.19615,  -12.00000,    6.00000,   12.00000,   15.00000],
[   3.46410,  -12.00000,    6.00000,    9.00000,   15.00000],
[   1.73205,  -12.00000,    6.00000,    6.00000,   15.00000],
[   0.86603,  -10.50000,    9.00000,    6.00000,   15.00000],
[   0.00000,   -9.00000,   12.00000,    6.00000,   15.00000],
[  -0.86603,   -7.50000,   15.00000,    6.00000,   15.00000],
[   0.00000,   -6.00000,   15.00000,    6.00000,   12.00000],
[   0.86603,   -4.50000,   15.00000,    6.00000,    9.00000],
[   2.59808,   -4.50000,   15.00000,    9.00000,    9.00000],
[   4.33013,   -4.50000,   15.00000,   12.00000,    9.00000],
[   6.06218,   -4.50000,   15.00000,   15.00000,    9.00000],
[   6.92820,   -6.00000,   12.00000,   15.00000,    9.00000],
[   7.79423,   -7.50000,    9.00000,   15.00000,    9.00000],
[   6.92820,   -9.00000,    9.00000,   15.00000,   12.00000],
[   6.06218,  -10.50000,    9.00000,   15.00000,   15.00000],
[   4.33013,  -10.50000,    9.00000,   12.00000,   15.00000],
[   2.59808,  -10.50000,    9.00000,    9.00000,   15.00000],
[   1.73205,   -9.00000,   12.00000,    9.00000,   15.00000],
[   0.86603,   -7.50000,   15.00000,    9.00000,   15.00000],
[   1.73205,   -6.00000,   15.00000,    9.00000,   12.00000],
[   3.46410,   -6.00000,   15.00000,   12.00000,   12.00000],
[   5.19615,   -6.00000,   15.00000,   15.00000,   12.00000],
[   6.06218,   -7.50000,   12.00000,   15.00000,   12.00000],
[   5.19615,   -9.00000,   12.00000,   15.00000,   15.00000],
[   3.46410,   -9.00000,   12.00000,   12.00000,   15.00000],
[   2.59808,   -7.50000,   15.00000,   12.00000,   15.00000],
[   4.33013,   -7.50000,   15.00000,   15.00000,   15.00000],
];
hex="0123456789abcdef";
hexsub=["000000","322110","654210","975420","ca7520","fc9630"]
var canvascol;
var ctxcol;
var curcol=["#00f","#00c","#009","#006","003","#000"];

function colorinit(){
    xcol0=document.getElementById("pointer_div").offsetLeft;
    ycol0=document.getElementById("pointer_div").offsetTop;
    canvascol=document.getElementById("darker");
    ctxcol=canvascol.getContext("2d");
    dark(0,0,15/3);
}

function dark(r,g,b){
    for(n=0;n<6;n++){
        fs="#"+hexsub[r][n]+hexsub[g][n]+hexsub[b][n];
	ctxcol.fillStyle=fs;
	ctxcol.fillRect(0,50*n,50,50*n+50);
        curcol[n]=fs;
//	document.getElementById("l"+n).innerHTML=fs;
    };
}

function point_it(event){
    pos_x = event.offsetX?(event.offsetX):event.pageX-xcol0;
    if(pos_x>350)return;
    pos_y = event.offsetY?(event.offsetY):event.pageY-ycol0;
    x=pos_x*0.056873-5.2530;
    y=(301-pos_y)*0.056667-16;
    v=10000;
    j=0;
    for(i=0;i<91;i++){
	t=tab[i];
	if((x-t[0])*(x-t[0])+(y-t[1])*(y-t[1])<v){
	    v=(x-t[0])*(x-t[0])+(y-t[1])*(y-t[1]);
	    j=i;
	};
    };
    t=tab[j];
    colr="#"+hex[t[2]]+hex[t[3]]+hex[t[4]];
//    document.getElementById('colr').value = colr;
    dark(t[2]/3,t[3]/3,t[4]/3);
}

function setcolor2(event){
    n=Math.floor((event.pageY-ycol0)/50);
//    document.getElementById('numcol').innerHTML=curcol[n];
//    setcolor(document.getElementById('numcol').innerHTML);
    setcolor(curcol[n]);
    modal(null);
    return false;
}
