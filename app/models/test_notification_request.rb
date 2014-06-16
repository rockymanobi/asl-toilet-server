class TestNotificationRequest < ActiveRecord::Base

  require 'net/http'
  class << self

    ## Just a Sample
    #
    def apologize_all
      reg_ids = TestNotificationRequest.pluck( :reg_id )
      return unless reg_ids.present?

      msg = "また明日！" 
      gcm_post_message( reg_ids,'監視終了しました' ,msg )
      reg_ids = TestNotificationRequest.delete_all
    end
    
    def notify_all
      reg_ids = TestNotificationRequest.pluck( :reg_id )
      return unless reg_ids.present?

      msg = "#{Time.now.strftime("%H時%M分")}に空いたよ!\nあなたを入れて#{reg_ids.count}人待ってるよ!" 
      gcm_post_message( reg_ids, 'トイレが空きました!', msg )
      #reg_ids = TestNotificationRequest.delete_all
    end

    def gcm_post_message( reg_ids, title,  msg )

      
      url = URI.parse("https://android.googleapis.com/gcm/send")
      message_data = {}
      message_data["registration_ids"] = reg_ids
      message_data["data"] = { message: msg , title: title }
      headers = { "Content-Type" => "application/json", "Authorization" => "key=" + ENV["GCM_API_KEY"] }
      http = Net::HTTP.new(url.host, url.port)
      http.use_ssl = true
      http.verify_mode = OpenSSL::SSL::VERIFY_NONE

      res = http.post(url.path, message_data.to_json, headers)

      if res.code == "200"
        res_message = "GCM Post Message Success."
      else
        res_message = "GCM Post Message Failed."
      end

      p res
      return res
      return false, res_message
    end

  end

end
