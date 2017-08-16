var jscssloaded = {};
var host_static = 'http://rawgit.com/baysao/victfw/master';
  function loadjscssfile(filename, filetype){
      if(jscssloaded[filename]) return;
      if (filetype=="js"){ //if filename is a external JavaScript file
          jscssloaded[filename] = 1;
          var fileref=document.createElement('script')
          fileref.setAttribute("type","text/javascript")
          fileref.setAttribute("src", filename)
      }
      else if (filetype=="css"){ //if filename is an external CSS file
          jscssloaded[filename] = 1;
          var fileref=document.createElement("link")
          fileref.setAttribute("rel", "stylesheet")
          fileref.setAttribute("type", "text/css")
          fileref.setAttribute("href", filename)
      }
      if (typeof fileref!="undefined")
          document.getElementsByTagName("head")[0].appendChild(fileref)
  }

  var transform = {
      md: micromarkdown.parse,
      html: function(text){ return text}
      
  }
  function render(urlpath, el, ext, config, callback){
      $().get(urlpath, function(text, status){
          if(status != 200) return;
          var txt = transform[ext](text);
          morphdom(document.querySelector('#' + el),'<div id="' + el + '">' + transform[ext](text) + "</div>");
          loadjscssfile(urlpath.replace(new RegExp('\.' + ext + '$'), '.js'), 'js');
          loadjscssfile(urlpath.replace(new RegExp('\.' + ext + '$'), '.css'), 'css');
          callback && callback();
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
              console.log(ext_tmp);
              var ext = 'html';
              if(ext_tmp.length > 1)
                  ext = ext_tmp[ext_tmp.length -1];

              var urlpath = ((ext == 'html')?"https://raw.githubusercontent.com":host_static) + '/blog/' + ext_tmp[0] + '.' + ext;
              console.log(urlpath);
              pages.push([urlpath, el, ext]);
          }
      }
      for(i = 0;i < pages.length; i ++) {
          render.apply(this, pages[i]);
      }
      }
