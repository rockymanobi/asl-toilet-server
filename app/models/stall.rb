class Stall < ActiveRecord::Base
  belongs_to :device

  STATUSES = {
    unknown: "unknown", 
    vacant: "vacant",
    occupied: "occupied" 
  }

end
