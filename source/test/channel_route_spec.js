describe("Test channel & route basic functionality", function(){

    describe("Test for calling channel", function(){
        var testVariable;

        beforeEach(function(done) {

            nerve.on({
                channel: 'test-channel',
                callback: function() {
                    testVariable = true;
                    done();
                }
            });

            setTimeout(function(){
                nerve.send({
                    channel: 'test-channel'
                });
            }, 100);
        });

        it("Channel was called", function() {
            expect(testVariable).toEqual( true );
        });
    });

    describe("Test for calling route in channel", function(){
        var testVariable_first,
            testVariable_second;

        beforeEach(function(done) {

            nerve.on({
                channel: 'test-channel-with-route',
                route: 'test-route-first',
                callback: function() {
                    testVariable_first = true;
                    done();
                }
            });

            nerve.on({
                channel: 'test-channel-with-route',
                route: 'test-route-second',
                callback: function() {
                    testVariable_second = true;
                    done();
                }
            });

            setTimeout(function(){
                nerve.send({
                    channel: 'test-channel-with-route',
                    route: 'test-route-first'
                });
            }, 100);
        });

        it("Route in channel was called", function() {
            expect(testVariable_first).toEqual( true );
            expect(testVariable_second).toBeUndefined();
        });
    });

    describe("Test for calling channel and passing data context", function(){
        var testVariable;

        beforeEach(function(done) {

            nerve.on({
                channel: 'test-channel-with-data',
                callback: function( context ) {
                    testVariable = context.someData;
                    done();
                }
            });

            setTimeout(function(){
                nerve.send({
                    channel: 'test-channel-with-data',
                    context: { someData: true }
                });
            }, 100);
        });

        it("Channel was called", function() {
            expect(testVariable).toEqual( true );
        });
    });

});