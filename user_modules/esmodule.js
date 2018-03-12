function esglobeLoadModule(moduleName) {
  $(`#esmodule-${moduleName}`).click(function () {
    $('#esglobe-menu-frame').html(`<iframe src="/module-html/${moduleName}" height=970px width=100% style="overflow-x:hidden; overflow-y:hidden;border:0px;"></iframe>`)
  });
}