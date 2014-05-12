
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
      Stall::STATUSES[:vacant] => "開いてます",
      Stall::STATUSES[:occupied] => "閉まってます",
      Stall::STATUSES[:unknown] => "Unknown"
    }[ stalls_status ]
  end

  def message_for_device_status( device_status )
    {
      Device::STATUSES[:sleep] => "現在監視をしていません",
      Device::STATUSES[:running] => "監視中です",
      Device::STATUSES[:error] => "エラーが発生しています"
    }[device_status]
  end

end
