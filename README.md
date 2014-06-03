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

property state - readonly
  @returns object  returns this Timer's current state (can be used to restore the timer across page loads)

property started - readonly
  number  the date time when the Timer was started

property stopped - readonly
  number  the date time when the Timer was stopped

property timeout
  number  the seconds used to calculate remaining seconds until timeout

property paused
  boolean  the state of whether the Timer is paused

property elapsed
  number  the number of seconds elapsed since the Timer was started

property remaining
  number  the number of seconds remaining until Timer timeout

method restore( options )
  param options object  options state options for restoring the timer.
  returns {this}  returns this Timer

method addEventListener( eventType, callback, data )
  param eventType string    support event types are "timeout" and "interval".
    "timeout"   event triggers when  (data as seconds) or remainder (if data is null) expires (reaches zero)
    "interval"  event triggers every (data as seconds)
  param callback  Function  the event callback function.
  param data      mixed     event type dependant (may be optional)
  returns {this}  returns this Timer

method removeEventListener( eventType, callback )
  param eventType string    support event types are "timeout" and "interval".
  param callback  Function  the event callback function to be removed (or "*" for all)

method toString( format )
  param format string     the format for the elapsed (or remaining if timeout is set) seconds (optional)
  returns {this} string   string representation of elapsed (or remaining if elapsed is defined)
    if no format is specified the string will be simple number as string format

method toLocaleString( format )
  returns {this} string   string representation of elapsed (or remaining if elapsed is defined)
    if no format is specified the string will be simple number as string format

method valueOf( )
  returns {this} number representation of elapsed (or remaining if elapsed is defined)

