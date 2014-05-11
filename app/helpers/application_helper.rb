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
      Stall::STATUSES[:unknown] => "分かりません"
    }[ stalls_status ]
  end

end
