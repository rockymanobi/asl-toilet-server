class Stall < ActiveRecord::Base

  STATUSES = {
    unknown: "unknown", 
    vacant: "vacant",
    occupied: "occupied" 
  }

end
