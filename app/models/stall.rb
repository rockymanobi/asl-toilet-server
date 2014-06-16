class Stall < ActiveRecord::Base
  belongs_to :device
  before_update :create_log

  STATUSES = {
    unknown: "unknown", 
    vacant: "vacant",
    occupied: "occupied" 
  }

  def is_vacant?
    self.status == STATUSES[ :vacant ]
  end
  def is_occupied?
    self.status == STATUSES[ :occupied ]
  end
  def is_unknown?
    self.status == STATUSES[ :unknown ]
  end

  def create_log
    t = TestLog.new
    t.stall_name = self.name
    t.status = self.status
    t.save!
  end


end
