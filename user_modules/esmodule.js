class Esglobe {
    constructor () {

    }

    loadModule(moduleName) {
        $(`#esmodule-${moduleName}`).click(function () {
            $('#esglobe-menu-frame').html(`<iframe src="/module-html/${moduleName}" height=970px width=100% style="overflow-x:hidden; overflow-y:hidden;border:0px;"></iframe>`)
            if (typeof window.sph === 'undefined') window.sph = {};
            window.sph.loadedModule = moduleName;
        });
    }

    loadWidget(position) {
        const sph = this.getSph();
        const moduleName = this._getModuleName();
        $(`#${position}`, window.parent.document).html(`<iframe src="/module-html/${moduleName}/widgets/${position}" onload="resizeIframe(this)" style="display:none;"></iframe>`)
        let self = this;

        sph.emitter.subscribe("*", function () {
            const el = $(`#${position}`, window.parent.document).find('iframe');
            const contentHeight = el.contents().height();
            el.css('height', `${contentHeight}px`);
        });
    }

    loadForm(formName, callback) {
        // load the form JSON
        const self = this;
        const moduleName = this._getModuleName();

        $.get(`/module-html/${moduleName}/forms/${formName}.json`, function (formDefinition) {
            formDefinition.moduleName = moduleName;
            formDefinition.formName = formName;
            $.ajax({
                method: "POST",
                url: "/form-builder",
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify(formDefinition),
                dataType: 'json'
            })
                .done(function (data) {
                    $(`#${formName}`).html(data.html);

                    $(`#${formName}`).find('form').submit(function (e) {
                        e.preventDefault();
                        if ($(this).valid()) {
                            const dataJSON = self._formToJSON($(this));
                            const url = $(this).attr('action');
                            self._runScript(url, dataJSON, callback)
                        }
                    })
                });
        })
    }

    runScript(scriptName, params, callback) {
        const moduleName = this._getModuleName();
        const url = `/api/${moduleName}/script`;
        if (typeof params === 'undefined') params = {};
        params.scriptName = scriptName;

        $.ajax({
            method: "POST",
            url,
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(params),
            dataType: 'json'
        })
            .done(function (data) {
                if (_.isFunction(callback)) callback(data);
            })

    }

    show(resource) {
        const sph = this.getSph();
        const moduleName = this._getModuleName();
        let url;
        if (resource.indexOf('/') !== -1 || resource.indexOf('\\') !== -1) {
            url = `/fs?url=${resource}`;
        } else
            url = `./esglobe_modules/${moduleName}/graphics/${resource}`;
        sph.show(url);
    }



    /** Private Functions **/

    /**
     *
     * @param form: a jquery form
     * @returns {{}}
     * @private
     */
    _formToJSON(form) {
        let dataString = form.serializeArray();
        const dataJSON = {};
        _.forEach(dataString, val => {
            dataJSON[val.name] = val.value;
        });
        return dataJSON;
    }

    getSph() {
        return window.parent.sph;
    }

    _getModuleName () {
        const sph = window.parent.sph;
        const moduleName = sph && sph.loadedModule;
        return moduleName;
    }

    _runScript(url, params, callback) {
        $.ajax({
            method: "POST",
            url,
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(params),
            dataType: 'json'
        })
            .done(function (data) {
                if (_.isFunction(callback)) callback(data);
            })

    }
}

function resizeIframe(obj) {
    $(document).ready(function () {
        $(obj).css('display', 'block');
        obj.style.height = obj.contentWindow.document.body.scrollHeight + 'px';
    });
}