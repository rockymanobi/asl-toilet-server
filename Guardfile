guard :shell do
  watch(%r{app/assets/javascripts/device_app.+$}) do |m| 
    p "!!!!!!!!!device app changed !!!!!!!!!"
    p m[0] + " has changed"
    `bundle exec sprockets -I app/assets/javascripts/device_app app/assets/javascripts/device_app/device_app.js > public/device_app.js` 
  end
end
