$(document).ready(function (){
    var sph = parent.sph;
    $('#demoButton').click(function () {
        sph.emitter.emit("demoButtonClicked");
    });

    esglobeLoadWidget('topLeft');
});