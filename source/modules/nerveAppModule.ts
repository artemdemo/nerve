/**
 * Nerve is lightweight javascript library for asynchronous broadcasts along routes and channels.
 * @source https://github.com/artemdemo/nerve
 * (original) https://github.com/jstandish/nerve
 */

interface routesObj {
    [channel: string]: channelObj;
}

interface channelObj {
    [key: string]: Array<msgNerve>;
}

interface msgNerve {
    caller: any;
    callback: any;
}

/**
 * Object that will be passed to ON function
 */
interface onParamObj {
    channel: string;    // The category of a an event
    route?: string;     // The sub category of an event
    callback: ( context: any ) => {}; // A callback to to handle the event
    scope?: Object;     // The scope reference you are calling about
}

/**
 * Object that will be passed to SEND function
 */
interface sendParamObj {
    channel: string;    // The category of a an event
    route?: string;     // The sub category of an event
    context?: any;      // Data that will be send to the callback
}

module nerve {

    var routes:routesObj = {};

    /**
     * Listen to a given channel or listen to a channel and route combination
     *
     * @param paramObj {onParamObj}
     * @example
     * {
     *     channel: 'some-channel',
     *     route: 'route'
     *     callback: function( context ) {
     *          // some functionality
     *     },
     *     scope: this
     * }
     */
    export function on ( paramObj: onParamObj ):void {

        var caller = null;

        if (
             ! paramObj.hasOwnProperty('channel') ||
             ! paramObj.hasOwnProperty('callback') ||
             ! isFunction( paramObj.callback )
           )
            throw Error('A channel and a callback must be specified');


        if ( ! paramObj.hasOwnProperty('scope') )
            caller = paramObj.callback || on;
        else
            caller = paramObj.scope || on;

        // Create new route if there is no one
        if ( ! routes.hasOwnProperty( paramObj.channel ) )
            routes[paramObj.channel] = {};

        // If there is no route in paramObj - will create default one
        if ( ! paramObj.hasOwnProperty('route') )
            paramObj.route = 'root';

        // If given paramObj.route not exists in main routes object - create one
        if ( ! routes[paramObj.channel].hasOwnProperty( paramObj.route ) )
            routes[paramObj.channel][ paramObj.route ] = [];

        // Check to make sure we aren't adding ourselves twice
        if (findSubscriber(caller, routes[paramObj.channel][ paramObj.route ]))
            return;

        routes[paramObj.channel][ paramObj.route ].push({
            caller: caller,
            callback: paramObj.callback
        });

    }

    /**
     * Remove listener
     * @param channel
     *
     * @example
     *  Removing a listener for a channel
     nerve.off('order');
     */
    export function off ( channel: string ):void;
    /**
     * Remove listener
     * @param channel
     * @param route
     * @param scope
     *
     * @example
     *  Removing a listener from a specific channel's route
     *  nerve.off('order', 'created');
     */
    export function off ( channel: string, route?: string, scope? ):void {
        if ( routes.hasOwnProperty(channel) ) {
            var r = 'root',
                caller = scope || off;  // caller = scope || arguments.callee;

            if (route) r = route;

            if ( ! routes[channel].hasOwnProperty(r) ) return;

            var i = 0, len = routes[channel][r].length;
            for (; i < len; i++) {
                if (routes[channel][r][i].caller === caller)
                    delete routes[channel][r][i];
            }
        }
    }

    /**
     * Send message
     *
     * @param paramObj {sendParamObj}
     * @example
     * {
     *     channel: 'some-channel',
     *     route: 'route',
     *     context: { someData: true }
     * }
     */
    export function send ( paramObj: sendParamObj ):void {

        if ( ! paramObj.hasOwnProperty('channel') )
            throw Error('A channel must be specified');

        if ( ! paramObj.hasOwnProperty('route') )
            paramObj.route = 'root';

        if ( ! routes.hasOwnProperty( paramObj.channel ) || ! routes[paramObj.channel].hasOwnProperty(paramObj.route) ) {
            return;
        }

        if ( ! paramObj.hasOwnProperty( 'context' ) )
            paramObj.context = null;

        var listeners = routes[paramObj.channel][paramObj.route], i = 0, len = listeners.length;

        for (; i < len; i++) {

            (function (ch, rt, idx) {
                var ref = setTimeout(function () {
                    try {
                        routes[ch][rt][idx].callback.call(
                            routes[ch][rt][idx].caller,
                            paramObj.context
                        );
                        clearTimeout(ref);
                    } catch (e) {
                        //...
                    }
                });
            })(paramObj.channel, paramObj.route, i);
        }
    }


    /**
     *
     * @param callReference
     * @param array
     * @returns {*}
     */
    function findSubscriber( callReference, array: Array<msgNerve> ) {
        if (!array)
            return null;

        var i = 0, len = array.length;
        for (; i < len; i++) {
            console.log( array[i] );
            if (array[i].caller === callReference)
                return array[i];
        }

        return null;
    }

    /**
     * Check whether given variable is function or not
     * @param functionToCheck
     * @returns {boolean}
     */
    function isFunction( functionToCheck: any ) {
        var getType = {};
        return functionToCheck && ( <any> getType.toString ).call(functionToCheck) === '[object Function]';
    }

}