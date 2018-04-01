function esglobeLoadModule(moduleName) {
    $(`#esmodule-${moduleName}`).click(function () {
        $('#esglobe-menu-frame').html(`<iframe src="/module-html/${moduleName}" height=970px width=100% style="overflow-x:hidden; overflow-y:hidden;border:0px;"></iframe>`)
        if (typeof window.sph === 'undefined') window.sph = {};
        window.sph.loadedModule = moduleName;
    });
}

function esglobeLoadWidget(position) {
    const sph = window.parent.sph;
    const moduleName = sph && sph.loadedModule;
    $(`#${position}`, window.parent.document).html(`<iframe src="/module-html/${moduleName}/widgets/${position}" onload="resizeIframe(this)" style="display:none;"></iframe>`)
    let self = this;

    sph.emitter.subscribe("*", function () {
        const el = $(`#${position}`, window.parent.document).find('iframe');
        const contentHeight = el.contents().height();
        el.css('height', `${contentHeight}px`);
    });
}

function resizeIframe(obj) {
    $(document).ready(function () {
        $(obj).css('display', 'block');
        obj.style.height = obj.contentWindow.document.body.scrollHeight + 'px';
    });
}