$(document).ready(function() {
  $("#surface-air-button").click(function () {
    var sph = parent.sph;
    console.log("\n\n=====clicked=====");
    sph.show('./esglobe_modules/surfaceAir/images/mp.png');
  });
});