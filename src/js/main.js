/*
 * calculator-list
 * https://github.com/lets-fiware/calculator-list-operator
 *
 * Copyright (c) 2019 Kazuhito Suda
 * Licensed under the MIT license.
 */

(function () {

    "use strict";

    MashupPlatform.prefs.registerCallback(function (new_preferences) {

    }.bind(this));

    var parseInputEndpointData = function parseInputEndpointData(data) {
        if (typeof data === "string") {
            try {
                data = JSON.parse(data);
            } catch (e) {
                throw new MashupPlatform.wiring.EndpointTypeError();
            }
        }

        if (data != null && !Array.isArray(data)) {
            throw new MashupPlatform.wiring.EndpointTypeError();
        }

        return data;
    };

    var safeEval = function safeEval(formula) {
        for (var i = 0; i < formula.length; i++) {
            if (' 0123456789.()+-*/A'.indexOf(formula.substr(i, 1)) === -1) {
                return null;
            }
        }
        return new Function('A', '"use strict";return (' + formula + ')');
    }

    var formula = safeEval(MashupPlatform.prefs.get('formula'));

    MashupPlatform.prefs.registerCallback(function (new_preferences) {
        formula = safeEval(MashupPlatform.prefs.get('formula'));
    }.bind(this));

    MashupPlatform.wiring.registerCallback("input", function (list) {
        list = parseInputEndpointData(list);

        if (list != null) {
            var newList = list.map(function (value) {
                if (!isNaN(value) && formula != null) {
                    return formula(value);
                } else {
                    throw new MashupPlatform.wiring.EndpointTypeError();
                }
                return null;
            });
            MashupPlatform.wiring.pushEvent("output", newList);
        } else {
            if (MashupPlatform.prefs.get("send_nulls")) {
                MashupPlatform.wiring.pushEvent("output", list);
            }
        }
    });

})();
