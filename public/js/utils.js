"use strict";
/**
 * Use these utilities throughout client-side code
 */
var utils = {

    newName: function () {
        var index_1 = Math.floor(Math.random()*4);
        var index_2 = Math.floor(Math.random()*125);
        return nameList.getName(index_1, index_2);
    },
    provinceGivenLocation: function (location){
        return provinceList.provinceGivenLocation(location);
    },
    getMinorFactions: function () {
        return minorFactionList.getAllMinorFactions();
    },
    randomItem: function (collection) {
        var idx = Math.floor(collection.length * Math.random());
        return collection[idx];
    },
    round2Decimals: function (n) {
        return Math.round(n * 100) / 100.0;
    },
    getCookie: function (key) {
        var pairs = document.cookie.split("; ");
        var o = {}, k, v;
        for (var i = 0; i < pairs.length; i++) {
            k = pairs[i].split("=")[0];
            v = pairs[i].split("=")[1];
            o[k] = v;
        }
        return o[key];
    },
    /**
     * Return URL params as object
     */
    getURLParams: function () {
        var params = window.location.search.split("?")[1].split("&");
        var o = {}
        for (var i = 0; i < params.length; i++) {
            o[params[i].split("=")[0]] = params[i].split("=")[1];
        }
        return o;
    },
    CSVtoArray: function(text) {
        var re_valid = /^\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*(?:,\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*)*$/;
        var re_value = /(?!\s*$)\s*(?:'([^'\\]*(?:\\[\S\s][^'\\]*)*)'|"([^"\\]*(?:\\[\S\s][^"\\]*)*)"|([^,'"\s\\]*(?:\s+[^,'"\s\\]+)*))\s*(?:,|$)/g;
        // Return NULL if input string is not well formed CSV string.
        if (!re_valid.test(text)) return null;
        var a = [];                     // Initialize array to receive values.
        text.replace(re_value, // "Walk" the string using replace with callback.
            function(m0, m1, m2, m3) {
                // Remove backslash from \' in single quoted values.
                if      (m1 !== undefined) a.push(m1.replace(/\\'/g, "'"));
                // Remove backslash from \" in double quoted values.
                else if (m2 !== undefined) a.push(m2.replace(/\\"/g, '"'));
                else if (m3 !== undefined) a.push(m3);
                return ''; // Return empty string.
            });
        // Handle special case of empty last value.
        if (/,\s*$/.test(text)) a.push('');
        return a;
    },
};

/**
 * Define titlecase on strings
 * Taken from this SOF thread: https://stackoverflow.com/questions/196972/convert-string-to-title-case-with-javascript
 */
String.prototype.toTitleCase = function (str)
{
    return this.replace(/\w\S*/g, function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
};
