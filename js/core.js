(function(){
if(typeof window.victfw === "undefined") window.victfw = {};
var jscssloaded = {};
    var host_static = window.victfw.host_static;
    function loadjscssfile(filename, filetype, cb){
        if(jscssloaded[filename]) return cb && cb();
        jscssloaded[filename] = 1;
        LazyLoad[filetype]([filename], cb);
    }

    var transform = {
        md: function(text, data, cb){
            loadjscssfile('./js/micromarkdown.min.js', 'js', function(){
                cb(micromarkdown.parse(text));
             })
        },
        dot: function(text, data, cb){
            loadjscssfile('./js/doT.min.js', 'js', function(){
                var def = {};
                var tmpl = doT.template(text, undefined, def);
                cb(tmpl(data))
            })
        },
        html: function(text, data, cb){ return cb(text);}
        
    }
    function transformFn(urlpath, el, ext, text, data){
        transform[ext](text, data, function(txt){
            morphdom(document.querySelector('#' + el),'<div id="' + el + '">' + txt + "</div>");

            loadjscssfile(urlpath.replace(new RegExp('\.' + ext + '$'), '.js'), 'js');
            loadjscssfile(urlpath.replace(new RegExp('\.' + ext + '$'), '.css'), 'css');
        });
    }
    function render(urlpath, el, ext){
        $().get(urlpath, function(text, status){
            if(status != 200) return;
            switch(ext){
            case 'dot':
                $().get(urlpath.replace(new RegExp('\.' + ext + '$'), '.json'), function(data, status){
                    transformFn(urlpath, el, ext, text, JSON.parse(data));
                })
                break;
            default:
                transformFn(urlpath, el, ext, text);
            }
        })
    }
    //let this snippet run before your hashchange event binding code
    if(!window.HashChangeEvent)(function(){
	    var lastURL=document.URL;
	    window.addEventListener("hashchange",function(event){
		    Object.defineProperty(event,"oldURL",{enumerable:true,configurable:true,value:lastURL});
		    Object.defineProperty(event,"newURL",{enumerable:true,configurable:true,value:document.URL});
		    lastURL=document.URL;
	    });
    }());
    
    window.onload = window.onhashchange = function(ev){
        if(!ev.newURL) ev.newURL = document.location.href;
        var newHash = ev.newURL ? ev.newURL.split('#')[1]: "";
        var oldHash = ev.oldURL ? ev.oldURL.split('#')[1]: "";
        var newr = newHash ? newHash.split('/') : [];
        var oldr = oldHash ? oldHash.split('/') : [];

        var _urlfrag = [];
        for(i = 0; i < newr.length; i ++) {
            if(newr[i] != oldr[i]) {
                _urlfrag.push(newr[i]);
            }
        }

        var pages = [];
        for(i = 0; i < _urlfrag.length; i++) {
            var fragi = _urlfrag[i];
            if(fragi){
                var fragi_tmp = fragi.split(':');
                var el = fragi_tmp[0];
                var fragi_url = fragi_tmp[fragi_tmp.length -1];
                var ext_tmp = fragi_url.split('.');
                var ext = 'html';
                if(ext_tmp.length > 1)
                    ext = ext_tmp[ext_tmp.length -1];

                var urlpath = host_static + ext_tmp[0] + '.' + ext;
                pages.push([urlpath, el, ext]);
            }
        }
        for(i = 0;i < pages.length; i ++) {
            render.apply(this, pages[i]);
        }
    }
})();
