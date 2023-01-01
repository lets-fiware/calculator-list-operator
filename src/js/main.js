/*
 * calculator-list
 * https://github.com/lets-fiware/calculator-list-operator
 *
 * Copyright (c) 2019-2023 Kazuhito Suda
 * Licensed under the MIT license.
 */

(function () {

    "use strict";

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

    var pushEvent = function pushEvent(data) {
        if (MashupPlatform.operator.outputs.output.connected) {
            MashupPlatform.wiring.pushEvent("output", data);
        }
    }

    var mathTable = {"none": "", "round": "Math.round", "floor": "Math.floor", "ceil": "Math.ceil", "trunc": "Math.trunc" };
    var shiftTable = {"integer": "1", "first": "10", "second": "100", "third": "1000" };

    var safeEval = function safeEval() {
        var formula = MashupPlatform.prefs.get('formula');
        if (formula != "") {
            for (var i = 0; i < formula.length; i++) {
                if (' 0123456789.()+-*/A'.indexOf(formula.substr(i, 1)) === -1) {
                    throw new MashupPlatform.wiring.EndpointTypeError();
                }
            }
        } else {
            formula = 'A';
        }

        var round = mathTable[MashupPlatform.prefs.get('math')];
        var shift = shiftTable[MashupPlatform.prefs.get('point')];
        round = round + ((round === "" || shift === "1") ? '(A)' : '(A*' + shift + ')/' + shift);

        return new Function('A', '"use strict";A=parseFloat(A);A=(' + formula + ');return (' + round + ');');
    }

    var calculatorList = function calculatorList(list) {
        var formula = safeEval();

        list = parseInputEndpointData(list);

        if (list != null) {
            var newList = list.map(function (value) {
                if (!isNaN(value)) {
                    return formula(value);
                } else {
                    var mode = MashupPlatform.prefs.get('mode');
                    if (mode === "exception") {
                        throw new MashupPlatform.wiring.EndpointTypeError();
                    } else if (mode === "pass") {
                        return value;
                    } // remove
                }
                return null;
            });

            newList = newList.filter(v => v);
            pushEvent(newList);

        } else {
            if (MashupPlatform.prefs.get("send_nulls")) {
                MashupPlatform.wiring.pushEvent("output", list);
            }
        }
    }

    /* TODO
     * this if is required for testing, but we have to search a cleaner way
     */
    if (window.MashupPlatform != null) {
        MashupPlatform.wiring.registerCallback("input", calculatorList);
    }

    /* test-code */
    window.calculatorList = calculatorList;
    /* end-test-code */
})();
