(function ( lss ) {
    "use strict";
    
    /* verify working:
     *   1) listeners should not trigger if paused, 
     *      and should be added on unpaused;
     *      removed on paused
     *   2) fix timeout listener using timeout parameter to use remaing time of tineout
     */
    
    var _Listeners = {
            timeout: function ( type, callback, timeout ) {
                var _this = this,
                    to = this.elapsed + ( timeout || ( timeout = _this.remaining ) ),
                    id, t,
                    reset = function ( ) {
                        if ( id != null ) {
                            clearTimeout( id );
                            id = null
                        }
                        if ( ( t = to - _this.elapsed ) > 0 && ! _this.paused )
                            id = setTimeout( callback.bind( _this, type ), t * 1000 );
//                        console.log( t, to, _this.elapsed )
                    };
                if ( ! timeout )
                    throw new Error( 'timeout (arg#3) must be a real number > 0' );
                if ( ! this.paused )
                    reset();
                return {
                    callback: callback,
                    reset: reset,
                    clear: function ( ) {
                        if ( id != null )
                            clearTimeout( id );
                        id = null
                    },
                    trigger: function ( ) {
                        if ( id != null )
                            clearTimeout( id );
                        id = null;
                        callback.call( _this, type )
                    }
                }
            },
            interval: function ( type, callback, interval ) {
                var _this = this,
                    id1, id2,
                    reset = function ( ) {
                        if ( id1 != null ) {
                            clearTimeout( id1 );
                            id1 = null
                        } else if ( id2 != null ) {
                            clearInterval( id2 );
                            id2 = null
                        }
                        if ( ! _this.paused )
                            id1 = setTimeout( function () {
                                    id1 = null;
                                    id2 = setInterval( callback.bind( _this, type ), interval );
//                                    console.log( 'interval id2 = ' + id2 );
                                    callback.call( _this, type );
                                }, interval - ( _this.elapsed * 1000 ) % interval )
                    };
                if ( ! interval )
                    throw new Error( 'interval (arg#3) must be a real number > 0' );
                interval *= 1000;
                reset();
//                console.log( 'interval id1 = ' + id1 );
                return {
                    callback: callback,
                    reset: reset,
                    clear: function ( ) {
                        if ( id1 != null ) {
                            clearTimeout( id1 );
                            id1 = null
                        } else if ( id2 != null ) {
                            clearInterval( id2 );
                            id2 = null
                        }
                    },
                    trigger: callback.bind( _this, type )
                }
            }
        },
        _MergeObject = function ( ) {
            var l = Array.prototype.slice.call( arguments ),
                r = l.shift( ) || {},
                n;
            l.forEach( function ( o ) {
                if ( o instanceof Object )
                    for ( n in o )
                        r[n] = o[n]
            } )
            return r
        },
/**
 * Creates an instance of Timer.
 * 
 * configuration options:
 *  started     the started time (system time)
 *  stopped     the stopped time (system time)
 *  elapsed     the number of seconds elased since the timer started
 *  paused      true is the timer should start paused
 *  timeout     the number of seconds used to calculate remaining property
 * 
 * @constructor {Timer}
 * @this {Timer}
 * @param {object} options configuration options for the timer.
 */
        Timer = function ( options ) {
            if ( ! ( this instanceof Timer ) )
                return new Timer( options );
            var _options = _MergeObject( {
                            elapsed: 0,
                            started: null,
                            stopped: null,
                            timeout: null,
                            paused: true
                        }, options ),
                _accum,
                _started,
                _stopped,
                _last,
                _max,
                _elapsed = function ( ) {
                    return ( _last ? Date.now() - _last + _accum : _accum ) / 1000
                },
                _remaining = function ( ) {
                    return Math.max( 0, _max - ( _last ? Date.now() - _last + _accum : _accum ) ) / 1000
                },
                _listeners = {},
                _resetEvents = function ( ) {
                    var t;
                    for ( t in _listeners )
                        _listeners[t].forEach( function( listener ) {
                            listener.reset( )
                        } )
                };

            Object.defineProperties( this, {
                /**
                 * reset the Timer.
                 * 
                 * @method {restore}
                 * @this {Timer}
                 * @param {object}  options configuration options for the timer.
                 * @returns {this}  returns this Timer
                 */
                restore: {
                    value: function ( options ) {
                        _accum = ( options = _MergeObject( {}, _options, options ) ).elapsed;
                        _max = options.timeout;
                        _started = options.started;
                        _stopped = options.stopped;
                        _last = null;
                        _resetEvents( );
                        if ( options.paused != null && ! options.paused )
                            this.paused = false;
                        return this
                    }
                },
                /**
                 * get state options that can be used with reset to restore state.
                 * 
                 * @property {state} readonly
                 * @this {Timer}
                 */
                state: {
                    get: function ( ) {
                        return _MergeObject( {}, {
                            elapsed: _accum,
                            timeout: _max,
                            started: _started,
                            stopped: _stopped,
                            paused: !! _paused
                        } )
                    }
                },
                /**
                 * the started time (system time)
                 * 
                 * @property {started} readonly
                 * @this {Timer}
                 */
                started: {
                    get: function ( ) {
                        return !! _started
                    }
                },
                /**
                 * the stopped time (system time)
                 * 
                 * @property {stopped}  readonly
                 * @this {Timer}
                 */
                stopped: {
                    get: function ( ) {
                        return !! _stopped
                    },
                    set: function ( val ) {
                        if ( _stopped == null ) {
                            this.paused = true;
                            _stopped = Date.now()
                        }
                    }
                },
                /**
                 * the number of seconds used to calculate remaining property
                 * 
                 * @property {timeout}
                 * @this {Timer}
                 */
                timeout: {
                    get: function ( ) {
                        return _max
                    },
                    set: function ( val ) {
                        _max = ( val * 1000 ) || null;
                        _resetEvents( );
                    }
                },
                /**
                 * whether the timer is paused
                 * 
                 * @property {paused}
                 * @this {Timer}
                 */
                paused: {
                    get: function ( ) {
                        return ! _last
                    },
                    set: function ( val ) {
                        var t = Date.now();
                        if ( ! val ) {
                            if ( ! _last && ! _stopped ) {
                                _last = t;
                                if ( ! _started )
                                    _started = t
                            }
                        } else if ( _last ) {
                            _accum += t - _last;
                            _last = null;
                        }
                        _resetEvents( );
                    }
                },
                /**
                 * the number of seconds elapsed
                 * 
                 * @property {elapsed} readonly
                 * @this {Timer}
                 */
                elapsed: {
                    get: _elapsed
                },
                /**
                 * the number of seconds remaining
                 * 
                 * @property {elapsed} readonly
                 * @this {Timer}
                 */
                remaining: {
                    get: function ( ) {
                        return _max ? _remaining( ) : null
                    }
                },
                /**
                 * add event listener to timer.
                 * 
                 * @method {addEventListener}
                 * @this {Timer}
                 * @param {eventType}   the type of event listener.
                 * @param {callback}    the event listener callback.
                 * @param {data}        event type dependent data (may be optional).
                 * @returns {this}  returns this Timer
                 */
                addEventListener: {
                    value: function ( eventType, callback, data ) {
                        var f = _Listeners[eventType];
                        if ( f ) {
                            if ( callback instanceof Function ) {
                                ( _listeners[eventType] || ( _listeners[eventType] = [] ) ).push( f.call( this, eventType, callback, data ) )
                            } else {
                                throw new Error( 'invalid listener for Timer event type "' + eventType + '"' )
                            }
                        } else
                            throw new Error( 'non-supported Timer event type "' + eventType + '"' )
                        return this
                    }
                },
                /**
                 * remove event listener to timer.
                 * 
                 * @method {removeEventListener}
                 * @this {Timer}
                 * @param {eventType}   the type of event listener.
                 * @param {callback}    the event listener callback of to be removed (use "*" to remove all.)
                 * @returns {this}  returns this Timer
                 */
                removeEventListener: {
                    value: function ( eventType, callback ) {
                        if ( _Listeners[eventType] ) {
                            var l = _listeners[eventType],
                                i;
                            if ( l ) {
                                i = l.length;
                                if ( callback instanceof Function ) {
                                    while ( i-- ) {
                                        if ( l[i].callback === callback ) {
                                            l[i].clear( );
                                            l.splice( i, 1 )
                                        }
                                    }
                                } else if ( callback === '*' ) {
                                    while ( i-- )
                                        l[i].clear( );
                                    l.splice( 0 )
                                } else {
                                    throw new Error( 'invalid listener for Timer event type "' + eventType + '"' )
                                }
                            }
                        } else
                            throw new Error( 'non-supported Timer event type "' + eventType + '"' )
                        return this
                    }
                },
                /**
                 * trigger event to all listeners of type.
                 * 
                 * @method {triggerEvent}
                 * @this {Timer}
                 * @param {eventType}   the type of event listener.
                 * @returns {this}  returns this Timer
                 */
                triggerEvent: {
                    value: function ( eventType ) {
                        var l = _listeners[eventType];
                        if ( _Listeners[eventType] ) {
                            if ( l )
                                l.forEach( function( listener ) {
                                    listener.trigger( )
                                } )
                        } else
                            throw new Error( 'non-supported Timer event type "' + eventType + '"' )
                        return this
                    }
                },
                /**
                 * convert to timer value to string.
                 * 
                 * @override
                 * @method {toString}
                 * @this {Timer}
                 * @returns {this}  string representation of elapsed (or remaining if elapsed is defined)
                 */
                toString: {
                    value: function ( locales, options ) {
                        return ( _max ? _remaining( ) : _elapsed( ) ).toLocaleString( locales, options)
                    }
                },
                /**
                 * convert to timer value to locale string.
                 * 
                 * @override
                 * @method {toLocaleString}
                 * @this {Timer}
                 * @param {locales} a BCP 47 language tag, or an array of such strings.
                 * @param {options} An object with some or all of Date locale iptions.
                 * @returns {this}  locale string representation of elapsed (or remaining if elapsed is defined)
                 */
                toLocaleString: {
                    value: function ( locales, options ) {
                        return ( _max ? _remaining( ) : _elapsed( ) ).toLocaleString( locales, options)
                    }
                },
                /**
                 * convert timer to seconds
                 * 
                 * @override
                 * @method {valueOf}
                 * @this {Timer}
                 * @returns {this}  number representation of elapsed (or remaining if elapsed is defined)
                 */
                valueOf: {
                    value: function ( ) {
                        return _max ? _remaining( ) : _elapsed( )
                    }
                },
            } );
        // initualize event
        this.restore( )
    }
    
    lss.Timer = Timer
})( self.lss || self )