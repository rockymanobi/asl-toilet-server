
class DevicesController < ApplicationController
  before_action :set_device, only: [:heart_beat]
  def heart_beat
    p 'hoge'
    render json: nil
  end

  private
  def set_device
    @device = Device.find( params[:id] )
  end
end
