
class DevicesController < ApplicationController
  before_action :set_device, only: [:show, :stop_monitoring,:start_monitoring , :heart_beat]
  skip_before_filter :verify_authenticity_token, only: [:start_monitoring, :heart_beat, :stop_monitoring]

  def start_monitoring
    @device.monitoring_stalls << Stall.where( name: params[:stall_names] )
    @device.status = Device::STATUSES[:running]
    @device.status_updated_at = Time.now 
    @device.save!
    render json: nil
  end

  def show
    render json: @device
  end

  def heart_beat
    @device.status = Device::STATUSES[:running]
    @device.status_updated_at = Time.now 
    @device.save!
    render json: 'HEART BEAT DETECTED!'
  end

  def stop_monitoring
    @device.status = Device::STATUSES[:sleep]
    @device.status_updated_at = Time.now 
    @device.save!
    @device.clear_all_stalls
    TestNotificationRequest.apologize_all
    render json: @device
  end

  private
  def set_device
    @device = Device.find_by( name: params[:id] )
  end
end
