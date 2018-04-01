$(document).ready(function (){
    var sph = parent.sph;
    $('#demoButton').click(function () {
        sph.emitter.emit("demoButtonClicked", { message: `this is a demo message from the main module ${new Date()}` });
    });

    sph.emitter.subscribe("widgetButtonClicked", function (data) {
        $("#moduleMsg").html(data && data.message);
    });

    $('#progressBar').change(function () {
        console.log($(this).val());
        sph.emitter.emit("progressBar", { value: $(this).val()});
    });

    esglobeLoadWidget('topLeft');
    esglobeLoadWidget('topRight');
    esglobeLoadWidget('bottomLeft');
    esglobeLoadWidget('bottomRight');
});