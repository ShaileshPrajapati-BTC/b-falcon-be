/**
 * HTTP Server Settings
 * (sails.config.http)
 *
 * Configuration for the underlying HTTP server in Sails.
 * (for additional recommended settings, see `config/env/production.js`)
 *
 * For more information on configuration, check out:
 * https://sailsjs.com/config/http
 */

module.exports.http = {

    /****************************************************************************
     *                                                                           *
     * Sails/Express middleware to run for every HTTP request.                   *
     * (Only applies to HTTP requests -- not virtual WebSocket requests.)        *
     *                                                                           *
     * https://sailsjs.com/documentation/concepts/middleware                     *
     *                                                                           *
     ****************************************************************************/

    middleware: {

        /***************************************************************************
         *                                                                          *
         * The order in which middleware should be run for HTTP requests.           *
         * (This Sails app's routes are handled by the "router" middleware below.)  *
         *                                                                          *
         ***************************************************************************/

        passportInit: require('passport').initialize(),
        passportSession: require('passport').session(),
        order: [
            'cookieParser',
            'session',
            'logRequest',
            'passportInit',
            'passportSession',
            'extendTimeout',
            'bodyParser',
            'compress',
            'poweredBy',
            '$custom',
            'router',
            'www',
            'favicon',
        ],

        extendTimeout: function (req, res, next) {
            req.setTimeout(300 * 1000); // Increase the request timeout to 5 minutes

            return next();
        },
        logRequest: function (req, res, next) {
            console.log(`[${req.method}] ${req.url}`)
            next();
        },
        /***************************************************************************
         *                                                                          *
         * The body parser that will handle incoming multipart HTTP requests.       *
         *                                                                          *
         * https://sailsjs.com/config/http#?customizing-the-body-parser             *
         *                                                                          *
         ***************************************************************************/

        // bodyParser: (function _configureBodyParser(){
        //   var skipper = require('skipper');
        //   var middlewareFn = skipper({ strict: true });
        //   return middlewareFn;
        // })(),

    },

};
