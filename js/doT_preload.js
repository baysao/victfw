(function (doT) {
    var templates = {};
    var scripts = Array.prototype.slice.call(document.getElementsByTagName('script')); // load all scripts
    for (var i = 0; i < scripts.length; i++) { // filter out template script tags
        var script = scripts[i];
        if (script.type == "text/x-dot-template") {
            var name = script.id || script.getAttribute('name') || script.getAttribute('data-name');
            templates[name] = script.innerHTML; // store template for later use
            //script.parentNode.removeChild(script); // remove template from DOM
        }
    }
    var cache = {};
    /**
     * Get template function by name.
     */
    doT.tmpl = function (name, config, def) {
        if (!templates[name])
            throw new Error("template \"" + name + "\" not found!");
        if (!cache[name])
            cache[name] = doT.template(templates[name], config, def);
        return cache[name];
    };
    /**
     * Render template with provided data.
     */
    doT.render = function (name, config, def, data) {
        var tmpl = doT.tmpl(name, config, def);
        if (!tmpl)
            return undefined;
        return tmpl(data);
    };
})(window.doT);
