class Stall < ActiveRecord::Base
  belongs_to :device
  before_update :create_log

  STATUSES = {
    unknown: "unknown", 
    vacant: "vacant",
    occupied: "occupied" 
  }

  def create_log
    t = TestLog.new
    t.stall_name = self.name
    t.status = self.status
    t.save!
  end


end
