class Device < ActiveRecord::Base
  has_many :monitoring_stalls, class_name: 'Stall', foreign_key: 'device_id'

  STATUSES = {
    sleep: "sleep",
    running: "running",
    error: "error"
  }

  def clear_all_stalls
    self.monitoring_stalls.update_all( status: Stall::STATUSES[:unknown], device_id: nil )
  end

end
