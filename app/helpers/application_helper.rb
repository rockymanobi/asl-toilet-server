
module ApplicationHelper

  def class_name_by_stalls_status( stalls_status )
    { 
      Stall::STATUSES[:vacant] => "VACANT",
      Stall::STATUSES[:occupied] => "OCCUPIED",
      Stall::STATUSES[:unknown] => "UNKNOWN"
    }[ stalls_status ]
  end

  def message_for_stalls_status( stalls_status )
    { 
      Stall::STATUSES[:vacant] => "VACANT",
      Stall::STATUSES[:occupied] => "OCCUPIED",
      Stall::STATUSES[:unknown] => "Unknown"
    }[ stalls_status ]
  end

  def message_for_device_status( device_status )
    {
      Device::STATUSES[:sleep] => "Sleep.....",
      Device::STATUSES[:running] => "Monitoring......",
      Device::STATUSES[:error] => "No 'heart beat signal' recieved form Device!!"
    }[device_status]
  end
  def class_name_for_device_status( device_status )
    {
      Device::STATUSES[:sleep] => "YELLOW",
      Device::STATUSES[:running] => "GREEN",
      Device::STATUSES[:error] => "RED"
    }[device_status]
  end

end
