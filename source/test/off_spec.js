describe("Test off functionality", function(){

    describe("Test for OFF with channel only", function(){
        var testVariable;

        beforeEach(function(done) {

            nerve.on({
                channel: 'test-channel-off',
                callback: function() {
                    testVariable = true;
                    done();
                }
            });

            setTimeout(function(){
                nerve.off({
                    channel: 'test-channel-off'
                });
            }, 30);

            setTimeout(function(){
                nerve.send({
                    channel: 'test-channel-off'
                });
            }, 100);

            setTimeout(function(){
                testVariable = 'function removed';
                done();
            }, 150);
        });

        it("Channel was removed", function() {
            expect(testVariable).toEqual( 'function removed' );
        });
    });



    describe("Test for OFF with channel and route", function(){
        var testVariable,
            testVariable_additional;

        beforeEach(function(done) {

            nerve.on({
                channel: 'test-channel-route-off',
                route: 'route-off',
                callback: function() {
                    testVariable = true;
                    done();
                }
            });

            nerve.on({
                channel: 'test-channel-route-off',
                route: 'route-on',
                callback: function() {
                    testVariable_additional = true;
                }
            });

            setTimeout(function(){
                nerve.off({
                    channel: 'test-channel-route-off',
                    route: 'route-off'
                });
            }, 30);

            setTimeout(function(){
                nerve.send({
                    channel: 'test-channel-route-off',
                    route: 'route-off'
                });
                nerve.send({
                    channel: 'test-channel-route-off',
                    route: 'route-on'
                });
            }, 100);

            setTimeout(function(){
                testVariable = 'function removed';
                done();
            }, 150);
        });

        it("Route was removed", function() {
            expect(testVariable).toEqual( 'function removed' );
            expect(testVariable_additional).toEqual( true );
        });
    });



    describe("Test for OFF with specific scope (1)", function(){
        var testVariable,
            _scope = {};

        beforeEach(function(done) {

            nerve.on({
                channel: 'test-scope-off',
                callback: function() {
                    testVariable = true;
                    done();
                },
                scope: _scope
            });

            setTimeout(function(){
                nerve.off({
                    channel: 'test-scope-off'
                });
            }, 30);

            setTimeout(function(){
                nerve.send({
                    channel: 'test-scope-off'
                });
            }, 100);

        });

        it("Channel wasn't removed case scope is different", function() {
            expect(testVariable).toEqual( true );
        });
    });

    describe("Test for OFF with specific scope (2)", function(){
        var testVariable,
            _scope = {};

        beforeEach(function(done) {

            nerve.on({
                channel: 'test-scope-off-remove',
                callback: function() {
                    testVariable = true;
                    done();
                },
                scope: _scope
            });

            setTimeout(function(){
                nerve.off({
                    channel: 'test-scope-off-remove',
                    scope: _scope
                });
            }, 30);

            setTimeout(function(){
                nerve.send({
                    channel: 'test-scope-off-remove'
                });
            }, 100);

            setTimeout(function(){
                testVariable = 'function removed';
                done();
            }, 150);

        });

        it("Channel was removed by scope", function() {
            expect(testVariable).toEqual( 'function removed' );
        });
    });

});

