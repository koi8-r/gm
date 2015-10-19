//
// ==UserScript==
// @name Example
// @namespace org.koi08r.gm
// @version 0.0.1
// @downloadURL https://github.com/koi8-r/gm/raw/master/hello/js/x.user.js
// @updateURL https://github.com/koi8-r/gm/raw/master/hello/js/x.meta.js
// @source https://github.com/koi8-r/gm/raw/master/hello/js/x.user.js
// @description Example script
// @include http://ifcfg.me/*
// @exclude http://ifcfg.me/json
// @exclude http://ifcfg.me/html
// @require http://code.jquery.com/jquery-2.1.4.min.js
// @resource myCSS https://raw.githubusercontent.com/koi8-r/gm/master/hello/css/x.css
// @grant GM_addStyle
// @grant GM_getResourceText
// @grant GM_log
// @grant GM_listValues
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_setClipboard
// @icon http://www.example.org/icon.png
// ==/UserScript==


//GM_setClipboard('') ;

if (typeof unsafeWindow === 'undefined')
  var unsafeWindow = window ;
if(typeof unsafeWindow.jQuery !== "undefined")
  var o$ = unsafeWindow.jQuery ;

// GM_getResourceURL
var myCSS = GM_getResourceText("myCSS");
GM_addStyle(myCSS) ;

$.noConflict() ;
jQuery(document).ready(function($) {

    console.debug('jquery v' + $.fn.jquery) ;  
  
    //var o = XMLHttpRequest.prototype.open ;
    //XMLHttpRequest.prototype.open = function(method, url, async, user, pass) {
    //    this.addEventListener("readystatechange", function(){
    //        alert(this.readyState) ;
    //    }, false) ;
    //    o.call(this, method, url, async, user, pass) ;
    //} ;

    var hash = window.location.hash ;

    console.log(GM_getValue("ctx") + ' -> ' + window.location.href.substr(0, window.location.href.length - window.location.hash.length)) ;

    $(window).on('hashchange', function(e){
        console.log(hash + ' -> ' + window.location.hash) ;
        hash = window.location.hash ;
    }) ;

    $(window).on('unload', function(e){
        GM_setValue("ctx", window.location.href) ;
    }) ;

    var mId = 'monkeyMainDiv' ;
    var mmId = '#'+mId ;

    $(mmId).remove() ;

    var r = $('<div/>', { id:mId })
        .click(function(){
            $(this).toggle() ;
        })
        .appendTo($('body'))
    ;

    $(document).keypress(function(e){
        if (e.which == 122 && e.ctrlKey && e.altKey) {
            r.filter(':hidden').toggle() ;
        }
    }) ;

    r.empty() ;
    var l ;

    $.ajax( 'http://ifcfg.me/json', { dataType:'json' } )
        .then(function(d) {
            return $.ajax( 'http://ifcfg.me/json', { dataType:'json' } ) ;
        })
        .done(function(d) {
            var tbl = $('<table/>').appendTo(r) ;
            var tb = $('<tbody/>').appendTo(tbl) ;
            var th = $('<thead/>').appendTo(tbl) ;

            $.each( d, function( key, value ) {
                th.append($('<th/>').text(key)) ;
            }) ;

            $.each([0,1,2], function(i,v) {
                var tr = $('<tr/>').appendTo(tb) ;

                $.each(d, function (key, value) {
                    tr.append($('<td/>').text(value)) ;
                })
            })
            ;

            if(l) URL.revokeObjectURL(l) ;
            var b = new Blob([ JSON.stringify(d, null, '    ')], {type:"application/octet-stream;charset=UTF-8"}) ;
            l = URL.createObjectURL(b) ;

            $('<a/>', { href:l, download:"result.json" })
                .text('ip')
                .appendTo(r)
            ;
        })
    ;
})() ;
