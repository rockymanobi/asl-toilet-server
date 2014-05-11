class Device < ActiveRecord::Base

  STATUSES = {
    sleep: "sleep",
    running: "running",
    error: "error"
  }

end
