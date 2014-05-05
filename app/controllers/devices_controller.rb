
class DevicesController < ApplicationController
  before_action :set_device, only: [:heart_beat]

  def heart_beat
    @device.status = "last_beat_at" + Time.now.strftime( "%Y/%m/%d-%H:%M:%S" )
    @device.save!

    render json: @device
  end

  private
  def set_device
    @device = Device.find( params[:id] )
  end
end
