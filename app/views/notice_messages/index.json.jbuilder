json.array!(@notice_messages) do |notice_message|
  json.extract! notice_message, :id, :title, :content, :from_date, :to_date, :status
  json.url notice_message_url(notice_message, format: :json)
end
