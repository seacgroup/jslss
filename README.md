jslss
=====

useful browser javascript modules from laughing sun studio (formerly seacgroup)

jslss includes the following modules:
  Timer       - a pausable seconds (accurate to milliseconds) timer with listener support and state restore

Class Timer (libs/lss/Timer.js)
===============================

Creates an instance of Timer.

constructor Timer( options ) 
  @param options object  options configuration options for the timer.
  configuration options:
    started     the started time (system time)
    stopped     the stopped time (system time)
    elapsed     the number of seconds elased since the timer started
    paused      true is the timer should start paused
    timeout     the number of seconds used to calculate remaining property

propertry state
  @param {object}  options state options for restoring the timer.
  @returns {this}  returns this Timer

 * get state options that can be used with reset to restore state.
 * 
 * @property {state} readonly
 * @this {Timer}
 */
/**
 * the started time (system time)
 * 
 * @property {started} readonly
 * @this {Timer}
 */
/**
 * the stopped time (system time)
 * 
 * @property {stopped}  readonly
 * @this {Timer}
 */
/**
 * the number of seconds used to calculate remaining property
 * 
 * @property {timeout}
 * @this {Timer}
 */
/**
 * whether the timer is paused
 * 
 * @property {paused}
 * @this {Timer}
 */
/**
 * the number of seconds elapsed
 * 
 * @property {elapsed} readonly
 * @this {Timer}
 */
/**
 * the number of seconds remaining
 * 
 * @property {elapsed} readonly
 * @this {Timer}
 */

method restore( options )
  @param {object}  options state options for restoring the timer.
  @returns {this}  returns this Timer

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
/**
 * remove event listener to timer.
 * 
 * @method {removeEventListener}
 * @this {Timer}
 * @param {eventType}   the type of event listener.
 * @param {callback}    the event listener callback of to be removed (use "*" to remove all.)
 * @returns {this}  returns this Timer
 */
/**
 * trigger event to all listeners of type.
 * 
 * @method {triggerEvent}
 * @this {Timer}
 * @param {eventType}   the type of event listener.
 * @returns {this}  returns this Timer
 */
/**
 * convert to timer value to string.
 * 
 * @override
 * @method {toString}
 * @this {Timer}
 * @returns {this}  string representation of elapsed (or remaining if elapsed is defined)
 */
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
/**
 * convert timer to seconds
 * 
 * @override
 * @method {valueOf}
 * @this {Timer}
 * @returns {this}  number representation of elapsed (or remaining if elapsed is defined)
 */
