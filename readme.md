# Nerve

An asynchronous javascript micro framework for event broadcasts along routes and channels.

Original code came from @jstandish https://github.com/jstandish/nerve

He did a great job, but there are some flaws in his code and I decided to make major refactoring.

## Listening to channels and routes - nerve.on()

**Listening to any message on a channel**
```javascript
nerve.on({
     channel: 'some-channel',
     callback: function( context ) {
          // some functionality
     },
});
```

**Listening to a specific route on a channel**
```javascript
nerve.on({
     channel: 'some-channel',
     route: 'some-route',
     callback: function( context ) {
          // some functionality
     }
});
```

**Listening to a channel or route but using a different scope upon event consumption**
```javascript
this.outsideScopeProperty = 'you can see me';

var that = this;

nerve.on({
     channel: 'some-channel',
     route: 'some-route',
     callback: function( context ) {
          console.log( this.outsideScopeProperty === 'you can see me' );
     },
     scope: this
});
```

## Removing listeners from a channel or route - nerve.off()

**Removing a listener for a channel**
```javascript
nerve.off({
    channel: 'some-channel'
});
```

**Removing a listener from a specific channel's route**
```javascript
nerve.off({
    channel: 'some-channel',
    route: 'some-route'
});
```


**Removing a listener from a specific channel's route that has a different scope**
```javascript
var that = this;

nerve.off({
    channel: 'some-channel',
    route: 'some-route',
    scope: that
});
```