/*
 * calculator-list
 * https://github.com/lets-fiware/calculator-list-operator
 *
 * Copyright (c) 2019-2024 Kazuhito Suda
 * Licensed under the MIT license.
 */

/* globals MockMP */

(function () {

    "use strict";

    describe("CalculatorList", function () {

        beforeAll(function () {
            window.MashupPlatform = new MockMP({
                type: 'operator',
                prefs: {
                    "formula": "A * 100",
                    "mode": "exception",
                    "math": "none",
                    "point": "integer",
                    "send_nulls": true,
                },
                inputs: ['input'],
                outputs: ['output']
            });
        });

        beforeEach(function () {
            MashupPlatform.reset();
            MashupPlatform.operator.outputs.output.connect({simulate: () => {}});
        });

        it("formula test addition", function () {
            MashupPlatform.prefs.set("formula", "A+50");
            MashupPlatform.prefs.set("math", "none");

            calculatorList(["75"]);

            expect(MashupPlatform.wiring.pushEvent).toHaveBeenCalledWith('output', [125]);
        });

        it("formula test subtraction", function () {
            MashupPlatform.prefs.set("formula", "A-3");
            MashupPlatform.prefs.set("math", "none");

            calculatorList(["45"]);

            expect(MashupPlatform.wiring.pushEvent).toHaveBeenCalledWith('output', [42]);
        });

        it("formula test multiplication", function () {
            MashupPlatform.prefs.set("formula", "A*100");
            MashupPlatform.prefs.set("math", "none");

            calculatorList(["1.23"]);

            expect(MashupPlatform.wiring.pushEvent).toHaveBeenCalledWith('output', [123]);
        });

        it("formula test division", function () {
            MashupPlatform.prefs.set("formula", "A/4");
            MashupPlatform.prefs.set("math", "none");

            calculatorList(["100"]);

            expect(MashupPlatform.wiring.pushEvent).toHaveBeenCalledWith('output', [25]);
        });

        it("forumula and round : integer", function () {
            MashupPlatform.prefs.set("formula", "A/3");
            MashupPlatform.prefs.set("math", "round");
            MashupPlatform.prefs.set("point", "first");

            calculatorList([100]);

            expect(MashupPlatform.wiring.pushEvent).toHaveBeenCalledWith('output', [33.3]);
        });

        it("math no operation : string", function () {
            MashupPlatform.prefs.set("formula", "");
            MashupPlatform.prefs.set("math", "none");

            calculatorList(["123.45"]);

            expect(MashupPlatform.wiring.pushEvent).toHaveBeenCalledWith('output', [123.45]);
        });

        it("math no operation : number", function () {
            MashupPlatform.prefs.set("formula", "");
            MashupPlatform.prefs.set("math", "none");

            calculatorList([567.89]);

            expect(MashupPlatform.wiring.pushEvent).toHaveBeenCalledWith('output', [567.89]);
        });

        it("round : integer", function () {
            MashupPlatform.prefs.set("formula", "");
            MashupPlatform.prefs.set("math", "round");
            MashupPlatform.prefs.set("point", "integer");

            calculatorList([123.4567]);

            expect(MashupPlatform.wiring.pushEvent).toHaveBeenCalledWith('output', [123]);
        });

        it("round : first", function () {
            MashupPlatform.prefs.set("formula", "");
            MashupPlatform.prefs.set("math", "round");
            MashupPlatform.prefs.set("point", "first");

            calculatorList([123.4567]);

            expect(MashupPlatform.wiring.pushEvent).toHaveBeenCalledWith('output', [123.5]);
        });

        it("round : second", function () {
            MashupPlatform.prefs.set("formula", "");
            MashupPlatform.prefs.set("math", "round");
            MashupPlatform.prefs.set("point", "second");

            calculatorList([123.4567]);

            expect(MashupPlatform.wiring.pushEvent).toHaveBeenCalledWith('output', [123.46]);
        });

        it("round : third", function () {
            MashupPlatform.prefs.set("formula", "");
            MashupPlatform.prefs.set("math", "round");
            MashupPlatform.prefs.set("point", "third");

            calculatorList([123.4567]);

            expect(MashupPlatform.wiring.pushEvent).toHaveBeenCalledWith('output', [123.457]);
        });

        it("floor: integer", function () {
            MashupPlatform.prefs.set("formula", "");
            MashupPlatform.prefs.set("math", "floor");
            MashupPlatform.prefs.set("point", "integer");

            calculatorList([-8.6]);

            expect(MashupPlatform.wiring.pushEvent).toHaveBeenCalledWith('output', [-9]);
        });


        it("ceil: integer", function () {
            MashupPlatform.prefs.set("formula", "");
            MashupPlatform.prefs.set("math", "ceil");
            MashupPlatform.prefs.set("point", "integer");

            calculatorList([-8.6]);

            expect(MashupPlatform.wiring.pushEvent).toHaveBeenCalledWith('output', [-8]);
        });

        it("trunc: integer", function () {
            MashupPlatform.prefs.set("formula", "");
            MashupPlatform.prefs.set("math", "ceil");
            MashupPlatform.prefs.set("point", "integer");

            calculatorList([-5.6]);

            expect(MashupPlatform.wiring.pushEvent).toHaveBeenCalledWith('output', [-5]);
        });

        it("parameter error : mode : exception", function () {
            MashupPlatform.prefs.set("mode", "exception");

            expect(function () {
                calculatorList(['abc']);
            }).toThrowError(MashupPlatform.wiring.EndpointTypeError);
        });

        it("parameter error : mode : remove", function () {
            MashupPlatform.prefs.set("mode", "remove");

            calculatorList(['abc']);

            expect(MashupPlatform.wiring.pushEvent).toHaveBeenCalledWith('output', []);
        });

        it("parameter error : mode : pass", function () {
            MashupPlatform.prefs.set("mode", "pass");

            calculatorList(['abc']);

            expect(MashupPlatform.wiring.pushEvent).toHaveBeenCalledWith('output', ['abc']);
        });

        it("allowed to send nulls", function () {
            MashupPlatform.prefs.set("send_nulls", true);

            calculatorList(null);

            expect(MashupPlatform.wiring.pushEvent).toHaveBeenCalledWith('output', null);
        });

        it("disallowed to send nulls", function () {
            MashupPlatform.prefs.set("send_nulls", false);

            calculatorList(null);

            expect(MashupPlatform.wiring.pushEvent).not.toHaveBeenCalled();
        });

        it("throws an Endpoint Value error if illegal data is received", function () {
            expect(function () {
                calculatorList("{");
            }).toThrowError(MashupPlatform.wiring.EndpointTypeError);
        });

        it("throws an Endpoint Value error if illegal data is received", function () {
            expect(function () {
                calculatorList(123);
            }).toThrowError(MashupPlatform.wiring.EndpointTypeError);
        });

        it("output endoint is not connected", function () {
            MashupPlatform.operator.outputs.output.disconnect();
            MashupPlatform.prefs.set("send_nulls", false);

            calculatorList([null]);

            expect(MashupPlatform.wiring.pushEvent).not.toHaveBeenCalled();
        });
    });
})();
