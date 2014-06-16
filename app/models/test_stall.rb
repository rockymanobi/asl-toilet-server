class TestStall < ActiveRecord::Base
  require 'net/http'


  class << self

    ## Just a Sample
    def gcm_post_message()

      url = URI.parse("https://android.googleapis.com/gcm/send")
      message_data = {}
      message_data["registration_ids"] = ["APA91bHiYKG4dq6PyvEp7kmhk2R7lF2RmL4mbnRQ8b8Od3iBqWzO-gWPIP8Fp5g5Fs0O05vHxIQrvK72VggFZc4A0pqMwty3T1vcVntFl13iCDVBWld87vIQ_CjUcL2tqFYc3TyThsbZ4Dg2RhegSW2xc6t10YlGl7MFXS0-jlF1_LSYcqD1GvA"] 
      message_data["data"] = { message: "SayHello!!!!" }
      headers = { "Content-Type" => "application/json", "Authorization" => "key=" + "AIzaSyCj2kT7EnJwIfGcsWyRRJavy0XnTAdJ6gQ" }
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
