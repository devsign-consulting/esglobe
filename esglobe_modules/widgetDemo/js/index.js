$(document).ready(function (){
    var sph = parent.sph;
    $('#demoButton').click(function () {
        sph.emitter.emit("demoButtonClicked", { message: `this is a demo message from the main module ${new Date().getTime()}` });
    });

    sph.emitter.subscribe("widgetButtonClicked", function (data) {
        $("#moduleMsg").html(data && data.message);
    });

    $('#progressBar').change(function () {
        console.log($(this).val());
        sph.emitter.emit("progressBar", { value: $(this).val()});
    });

    $('#loadDataButton').click(function () {
        $.get('/api/widgetDemo', function (data) {
            // console.log("=== data ==", data);
            $('#dataOut').html(JSON.stringify(data));
            sph.reset();
        });
    });

    $('#loadPythonButton').click(function () {
        $.get('/api/widgetDemo/python-test', function (data) {
            console.log("=== data ==", data);
            sph.show('./esglobe_modules/widgetDemo/images/' + data[0]);
        });
    });

    esglobeLoadWidget('topLeft');
    esglobeLoadWidget('topRight');
    esglobeLoadWidget('bottomLeft');
    esglobeLoadWidget('bottomRight');
});