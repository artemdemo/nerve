describe("Test scope functionality", function(){

    describe("Test for scope", function(){

        beforeEach(function(done) {

            this.outsideScopeProperty = true;

            var _this = this;

            nerve.on({
                channel: 'test-scope',
                callback: function() {
                    this.outsideScopeProperty = 'changed';
                    done();
                },
                scope: _this
            });

            setTimeout(function(){
                nerve.send({
                    channel: 'test-scope'
                });
            }, 100);
        });

        it("Scope was changed", function() {
            //console.log( this );
            expect( this.outsideScopeProperty ).toEqual( 'changed' );
        });
    });

});