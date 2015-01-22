var YAML, fs, request, util;

YAML = require('js-yaml');
fs = require('fs');
request = require("request");
util = require('util');

module.exports = {
    loadYAML: function(path, defaultValue, schema) {
        if (fs.existsSync(path)) {
            try {
                return YAML.safeLoad(fs.readFileSync(path, 'utf8'), {
                    schema: schema || YAML.JSON_SCHEMA
                });
            } catch (e) {
                console.log(e);
            }
        }
        return defaultValue;
    },
    cleanChannelName: function(channel) {
        return (channel.substr(0, 1) === '#' ? channel.substr(1) : channel).toLowerCase();
    },
    cleanUsername: function(user) {
        return user.toLowerCase();
    },
    cleanCommand: function(command) {
        return (command.substr(0, 1) === '!' ? command.substr(1) : command).toLowerCase();
    },
    isCommand: function(text) {
        return text.substr(0, 1) === '!';
    },
    toNumber: function(text) {
        return !isNaN(parseInt(text, 10)) && isFinite(text) ? ~~text : null;
    },
    equalsIgnoreCase: function(a, b) {
        if (typeof a === 'string') {
            if (typeof b === 'string' && a.toLowerCase() === b.toLowerCase()) {
                return true;
            } else if (util.isArray(b)) {
                for (var c in b) {
                    if (!b.hasOwnProperty(c)) continue;
                    var d = b[c];
                    if (typeof d === 'string' && this.equalsIgnoreCase(a, d)) {
                        return true;
                    }
                }
            }
        } else if (util.isArray(a) && typeof b === 'string') {
            this.equalsIgnoreCase(b, a);
        }
        return false;
    },
    equalsIgnoreCaseTrim: function(a, b) {
        if (typeof a === 'string') {
            if (typeof b === 'string' && a.trim().toLowerCase() === b.trim().toLowerCase()) {
                return true;
            } else if (util.isArray(b)) {
                for (var c in b) {
                    if (!b.hasOwnProperty(c)) continue;
                    var d = b[c];
                    if (typeof d === 'string' && this.equalsIgnoreCaseTrim(a, d)) {
                        return true;
                    }
                }
            }
        } else if (util.isArray(a) && typeof b === 'string') {
            this.equalsIgnoreCaseTrim(b, a);
        }
        return false;
    },
    startsWith: function(a, b) {
        if (typeof a === 'string') {
            if (typeof b === 'string' && a.length >= b.length) {
                return a.indexOf(b) === 0;
            } else if (util.isArray(b)) {
                for (var c in b) {
                    if (!b.hasOwnProperty(c)) continue;
                    var d = b[c];
                    if (typeof d === 'string' && this.startsWith(a, d)) {
                        return true;
                    }
                }
            }
        } else if (util.isArray(a) && typeof b === 'string') {
            this.startsWith(b, a);
        }
        return false;
    },
    endsWith: function(a, b) {
        if (typeof a === 'string') {
            if (typeof b === 'string' && a.length >= b.length) {
                return a.lastIndexOf(b) === a.length - b.length;
            } else if (util.isArray(b)) {
                for (var c in b) {
                    if (!b.hasOwnProperty(c)) continue;
                    var d = b[c];
                    if (typeof d === 'string' && this.endsWith(a, d)) {
                        return true;
                    }
                }
            }
        } else if (util.isArray(a) && typeof b === 'string') {
            this.endsWith(b, a);
        }
        return false;
    },
    startsWithIgnoreCase: function(a, b) {
        if (typeof a === 'string') {
            if (typeof b === 'string' && a.length >= b.length) {
                return this.startsWith(a.toLowerCase(), b.toLowerCase());
            } else if (util.isArray(b)) {
                for (var c in b) {
                    if (!b.hasOwnProperty(c)) continue;
                    var d = b[c];
                    if (typeof d === 'string' && this.startsWithIgnoreCase(a, d)) {
                        return true;
                    }
                }
            }
        } else if (util.isArray(a) && typeof b === 'string') {
            this.startsWithIgnoreCase(b, a);
        }
        return false;
    },
    endsWithIgnoreCase: function(a, b) {
        if (typeof a === 'string') {
            if (typeof b === 'string' && a.length >= b.length) {
                return this.endsWith(a.toLowerCase(), b.toLowerCase());
            } else if (util.isArray(b)) {
                for (var c in b) {
                    if (!b.hasOwnProperty(c)) continue;
                    var d = b[c];
                    if (typeof d === 'string' && this.endsWithIgnoreCase(a, d)) {
                        return true;
                    }
                }
            }
        } else if (util.isArray(a) && typeof b === 'string') {
            this.endsWithIgnoreCase(b, a);
        }
        return false;
    },
    getJSON: function(url, callback) {
        var opts = {
            url: url,
            encoding: 'utf8',
            json: true
        };
        request(opts, function(err, res, body) {
            callback(res.statusCode, body);
        });
    },
    objectSelector: function(obj, selector, defaultValue) {
        if (selector == null)
            return defaultValue;

        var a = obj;

        var key = selector.split('.');

        for (var i in key) {
            if (!key.hasOwnProperty(i)) continue;
            if (a[key[i]] == null) {
                return defaultValue;
            }
            a = a[key[i]];
        }

        return a;
    },
    randomString: function(length) {
        var chars = 'abcdefghijklmnopqrstuvwxyz0123456789_';
        var i, ret = [];
        for (i = 0; i < length; i++) {
            ret.push(chars.substr(Math.floor(Math.random() * chars.length), 1));
        }
        return ret.join('');
    },
    arrayContains: function(array, items) {
        if (util.isArray(array)) {
            if (typeof items === 'string') {
                return array.indexOf(items) > -1;
            } else if (util.isArray(items)) {
                for (var i in items) {
                    if (!items.hasOwnProperty(i)) continue;
                    var item = items[i];
                    if (typeof item === 'string' && this.arrayContains(array, item)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
};