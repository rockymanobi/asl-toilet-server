class Device < ActiveRecord::Base
  has_many :monitoring_stalls, class_name: 'Stall', foreign_key: 'device_id'

  STATUSES = {
    sleep: "sleep",
    running: "running",
    error: "error"
  }

  def clear_all_stalls
    self.monitoring_stalls.all.each do |s|
      s.status = Stall::STATUSES[:unknown]
      s.status_updated_at = Time.now
      s.device_id = nil
      s.save!
    end
  end

end
