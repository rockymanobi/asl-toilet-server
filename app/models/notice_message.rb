class NoticeMessage < ActiveRecord::Base
  scope :availables, ->(){
    messages = NoticeMessage.arel_table
    where( messages[:from_date].lt( Time.now ) ).
      where( messages[:to_date].gt( Time.now )  )
  }
end
