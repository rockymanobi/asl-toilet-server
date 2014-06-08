class TestStall < ActiveRecord::Base
  require 'net/http'


  class << self

    ## Just a Sample
    def gcm_post_message()

      url = URI.parse("https://android.googleapis.com/gcm/send")
      message_data = {}
      message_data["registration_ids"] = ["APA91bGz5gM3PaRUn7B1be7ehSyJIbUoJIhkJCVz4-t9Q7PZLCo6oNISz49PMn_KrNrSPMjCaFZ00fnuASl7hN3MUvh_crjL-MCuR9aH4NrQqE5nvvK0n9TC5jSIyzh4jPxCtag9G_m23gdP6LABFxeAxZ1YCA17Y1tdglULehZVQVFuBV0YVHE"] 
      message_data["data"] = { message: "Hello!!!!" }
      headers = { "Content-Type" => "application/json", "Authorization" => "key=" + "" }
      http = Net::HTTP.new(url.host, url.port)
      http.use_ssl = true
      http.verify_mode = OpenSSL::SSL::VERIFY_NONE

      res = http.post(url.path, message_data.to_json, headers)

      if res.code == "200"
        res_message = "GCM Post Message Success."
        return true, res_message
      else
        res_message = "GCM Post Message Failed."
      end

      p res
      return res
      return false, res_message
    end

  end

end
