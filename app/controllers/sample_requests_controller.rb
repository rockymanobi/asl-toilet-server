class SampleRequestsController < ApplicationController

  before_action :set_test_stall, only: [:show, :edit, :update, :destroy]
  before_action :set_stall, only: [:sample_show]

  skip_before_filter :verify_authenticity_token, only: [:notification_request_for_android, :listen_heart_beat]
  
  def index
    @stall = TestStall.first
    render json: @stall.status;
  end

  def listen_heart_beat

    now = 2.minutes.ago
    devices = Device.arel_table
    
    ng_devices = Device.where(status: Device::STATUSES[:running]).where( devices[:status_updated_at].lt( now ))
    p ng_devices.all
    Stall.where( device: ng_devices).each do |s|
      s.status = Stall::STATUSES[:unknown]
      s.status_updated_at =  Time.now
      s.save!
    end
    ng_devices.update_all( status: Device::STATUSES[:error])

    render json: nil

  end

  def both_stalls_status
    stall1 = Stall.find_by( name: 'asl1' )
    stall2 = Stall.find_by( name: 'asl2' )
    updated_at = (stall1.updated_at > stall2.updated_at)? stall1.updated_at : stall2.updated_at

    

    render json: { status: decide_status( stall1, stall2 ), updated_at: updated_at.strftime("%H時%M分") }

  end

  def sample_show
    p "USER-AGENT:#{request.env["HTTP_USER_AGENT"]}"
    @device = Device.find_by( name: "asl" )

    @test_track_id = 
      Time.now.strftime("%Y%m%d%H%M%S") + UUIDTools::UUID.timestamp_create + UUIDTools::UUID.random_create 

    respond_to do |format|
      format.html { render }
      format.json { render @stall }
    end
  end

  def admin_console
    @device = Device.find_by( name: "asl" )
    respond_to do |format|
      format.html { render }
      format.json { render @stall }
    end
  end

  def show
    @device = Device.find_by( name: "asl1" )
    respond_to do |format|
      format.html { render }
      format.json { render @stall }
    end
  end

  def create
    p request.request_method
    p "create"

    @stall = TestStall.first
    @stall.status = params[:status]
    @stall.save!

    render json: @stall 
  end

  def notification_request_for_android

    stall1 = Stall.find_by( name: 'asl1' )
    stall2 = Stall.find_by( name: 'asl2' )
    status = decide_status(stall1, stall2 )

    if status == "occupied" 
      notification_request = TestNotificationRequest.find_by( device: 'android', reg_id: params[:reg_id] ) || 
        TestNotificationRequest.new( device: 'android', reg_id: params[:reg_id] ) 
      notification_request.save!
    end
    count = TestNotificationRequest.count 

    render json: { count: count, status: status  }
  end

  private
  # Use callbacks to share common setup or constraints between actions.
  def set_stall
    @stall = Stall.find_by( name: params[:id])
  end
  def set_test_stall
    @stall = TestStall.find(params[:id])
  end

  # Never trust parameters from the scary internet, only allow the white list through.
  def member_params
    params.require(:member).permit(:name)
  end

  def decide_status( stall1, stall2 )
    return 'unknown' if stall1.is_unknown?
    return 'unknown' if stall2.is_unknown?
    return 'vacant' if stall1.is_vacant?
    return 'vacant' if stall2.is_vacant?
    'occupied'
  end


end
