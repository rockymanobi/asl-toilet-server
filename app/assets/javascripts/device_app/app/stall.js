
/*
 * [stall] chiefly US :
 *   a small, enclosed area with room for one person in a bathroom 
 *   ▪ shower stalls ; especially : a small, enclosed area with a toilet 
 *   ▪ All the (bathroom) stalls were occupied.
 */
ToiletApp.Stall = ( function(){
  function Stall( options ){
    var statuses = ToiletApp.Stall.STATUSES;
    this.state = statuses.unknown;
    this.stateUpdatedAt = getTime();
    this.syncedState = "";
    this.beforeState = statuses.unknown;
    this.id = options.id;
    this.doorSensor = options.doorSensor;
  }

  Stall.STATUSES = {
    unknown: "unknown",
    vacant: "vacant",
    maybe_occupied: "maybe_occupied",
    occupied: "occupied",
    maybe_vacant: "maybe_vacant"
  };

  Stall.prototype = {
  
    isUnknown: function(){ return this.state == Stall.STATUSES.unknown; },
    isMaybeVacant: function(){ return this.state == Stall.STATUSES.maybe_vacant; },
    isVacant: function(){ return this.state == Stall.STATUSES.vacant; },
    isMaybeOccupied: function(){ return this.state == Stall.STATUSES.maybe_occupied; },
    isOccupied: function(){ return this.state ==  Stall.STATUSES.occupied; },
    toUnknown: function(){
      this.state = Stall.STATUSES.unknown;
    },

    putTimeStamp: function(){
      if(this.beforeState != this.state ){ this.stateUpdatedAt = getTime(); }
    },
  
    markSyncedState: function(){
      this.syncedState = this.state;
    }
    ,
    _getNextState: function(){
      var statuses = ToiletApp.Stall.STATUSES;
      var nextState;
      if( this.isUnknown() ){
        if( this.doorSensor.isOpen() ){
          nextState = statuses.vacant;
        }else{
          nextState = statuses.occupied;
        }
      }else if( this.isVacant() ){
        if( this.doorSensor.isOpen() ){
          nextState= statuses.vacant;
        }else{
          nextState = statuses.maybe_occupied;
        }
      }else if( this.isMaybeOccupied() ){
        if( this.doorSensor.isOpen() ){
          nextState = statuses.vacant;
        }else{
          nextState = statuses.occupied;
        }
      }else if( this.isOccupied() ){
        if( this.doorSensor.isOpen() ){
          nextState = statuses.maybe_vacant;
        }else{
          nextState = statuses.occupied;
        }
      }else if( this.isMaybeVacant() ){
        if( this.doorSensor.isOpen() ){
          nextState = statuses.vacant;
        }else{
          nextState = statuses.occupied;
        }
      }
      return nextState;
    },
  
    toNextState: function(){
      this.beforeState = this.state;
      this.state = this._getNextState();
      this.putTimeStamp();
    },
  
    hasChangedToOccupiedState: function(){
      var statuses = Stall.STATUSES;
      var openToClose = this.beforeState == statuses.maybe_occupied && this.state == statuses.occupied;
      var unknownToClose = this.beforeState == statuses.unknown && this.state == statuses.occupied;
      return openToClose || unknownToClose;
    },
    hasChangedToVacantState: function(){
      var statuses = Stall.STATUSES;
      var closeToOpen = this.beforeState == statuses.maybe_vacant && this.state == statuses.vacant;
      var unknownToOpen = this.beforeState == statuses.unknown && this.state == statuses.vacant;
      return closeToOpen || unknownToOpen;
    }
  };
  return Stall;
})();


