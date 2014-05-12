
class DevicesController < ApplicationController
  before_action :set_device, only: [:stop_monitoring,:start_monitoring , :heart_beat]

  def start_monitoring
    # TODO: チェックしているすべてのStallのステータスをunknownにする
    p params[:stall_ids]
    @device.status = Device::STATUSES[:running]
    @device.save!
    render json: nil
  end

  def heart_beat
    @device.status = Device::STATUSES[:running]
    @device.status_updated_at = Time.now 
    @device.save!
    render json: @device
  end

  def stop_monitoring
    @device.status = Device::STATUSES[:sleep]
    @device.save!
    # TODO: チェックしているすべてのStallのステータスをunknownにする
    render json: @device
  end

  private
  def set_device
    @device = Device.find_by( name: params[:id] )
  end
end
