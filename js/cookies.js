// cookies.js framework
// github.com/ScottHamper/Cookies
(function(g,f){"use strict";var h=function(e){if("object"!==typeof e.document)throw Error("Cookies.js requires a `window` with a `document` object");var b=function(a,d,c){return 1===arguments.length?b.get(a):b.set(a,d,c)};b._document=e.document;b._cacheKeyPrefix="cookey.";b._maxExpireDate=new Date("Fri, 31 Dec 9999 23:59:59 UTC");b.defaults={path:"/",secure:!1};b.get=function(a){b._cachedDocumentCookie!==b._document.cookie&&b._renewCache();return b._cache[b._cacheKeyPrefix+a]};b.set=function(a,d,c){c=b._getExtendedOptions(c); c.expires=b._getExpiresDate(d===f?-1:c.expires);b._document.cookie=b._generateCookieString(a,d,c);return b};b.expire=function(a,d){return b.set(a,f,d)};b._getExtendedOptions=function(a){return{path:a&&a.path||b.defaults.path,domain:a&&a.domain||b.defaults.domain,expires:a&&a.expires||b.defaults.expires,secure:a&&a.secure!==f?a.secure:b.defaults.secure}};b._isValidDate=function(a){return"[object Date]"===Object.prototype.toString.call(a)&&!isNaN(a.getTime())};b._getExpiresDate=function(a,d){d=d||new Date; "number"===typeof a?a=Infinity===a?b._maxExpireDate:new Date(d.getTime()+1E3*a):"string"===typeof a&&(a=new Date(a));if(a&&!b._isValidDate(a))throw Error("`expires` parameter cannot be converted to a valid Date instance");return a};b._generateCookieString=function(a,b,c){a=a.replace(/[^#$&+\^`|]/g,encodeURIComponent);a=a.replace(/\(/g,"%28").replace(/\)/g,"%29");b=(b+"").replace(/[^!#$&-+\--:<-\[\]-~]/g,encodeURIComponent);c=c||{};a=a+"="+b+(c.path?";path="+c.path:"");a+=c.domain?";domain="+c.domain: "";a+=c.expires?";expires="+c.expires.toUTCString():"";return a+=c.secure?";secure":""};b._getCacheFromString=function(a){var d={};a=a?a.split("; "):[];for(var c=0;c<a.length;c++){var e=b._getKeyValuePairFromCookieString(a[c]);d[b._cacheKeyPrefix+e.key]===f&&(d[b._cacheKeyPrefix+e.key]=e.value)}return d};b._getKeyValuePairFromCookieString=function(a){var b=a.indexOf("="),b=0>b?a.length:b;return{key:decodeURIComponent(a.substr(0,b)),value:decodeURIComponent(a.substr(b+1))}};b._renewCache=function(){b._cache= b._getCacheFromString(b._document.cookie);b._cachedDocumentCookie=b._document.cookie};b._areEnabled=function(){var a="1"===b.set("cookies.js",1).get("cookies.js");b.expire("cookies.js");return a};b.enabled=b._areEnabled();return b},e="object"===typeof g.document?h(g):h;"function"===typeof define&&define.amd?define(function(){return e}):"object"===typeof exports?("object"===typeof module&&"object"===typeof module.exports&&(exports=module.exports=e),exports.Cookies=e):g.Cookies=e})("undefined"===typeof window? this:window);

// attaches functions to buttons
document.getElementById("continue").addEventListener("click", saveData);
document.getElementById("clear").addEventListener("click", clearData);

function saveData() {
    // sets form values to variables
    var formName = document.getElementById("first-name").value;
    var formColor = document.getElementById("color").value;
    var formAnimal = document.getElementById("animal").value;
    var formText = document.getElementById("text").value;

    // sets variables from form values to cookies
    Cookies.set("name", formName);
    Cookies.set("color", formColor);
    Cookies.set("animal", formAnimal);
    Cookies.set("text", formText);

    /* demo:
        - hello, [name]!
        - background to fave color
        - pic of fave animal
        - here's the data you entered:
    */
    // var demo = document.getElementById("demo");
    // demo.getElementById("greet").innerHTML("Hello, " + Cookies.get("name"));
    document.getElementById("greet").innerHTML("Hello!")
    document.getElementById("demo").style.backgroundColor = Cookies.get("color");

    var t0=performance.now();var name=Cookies.get("name");var color=Cookies.get("color");var animal=Cookies.get("animal");var text=Cookies.get("text");document.getElementById("view").innerHTML="Name: "+name+"<br>"+"Color: "+color+"<br>"+"Animal: "+animal+"<br>"+"Filler text: "+text;var t1=performance.now();

    var time = t1 - t0;
    document.getElementById("result").innerHTML = "It took <b>" + time + "</b> microseconds to retrieve and display the stored data, displayed below:";
}

function clearData() {
    // resets cookies
    // TODO: check for cookies first
    Cookies.set("name", "");
    Cookies.set("color", "");
    Cookies.set("animal", "");
    Cookies.set("text", "");
}
