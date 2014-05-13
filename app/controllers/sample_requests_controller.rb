class SampleRequestsController < ApplicationController

  before_action :set_test_stall, only: [:show, :edit, :update, :destroy]
  before_action :set_stall, only: [:sample_show]

  skip_before_filter :verify_authenticity_token, only: [:listen_heart_beat]
  

  
  def index
    @stall = TestStall.first
    render json: @stall.status;
  end

  def listen_heart_beat

    #now = 5.minutes.ago
    now = 1.minutes.ago
    devices = Device.arel_table
    
    ng_devices = Device.where(status: Device::STATUSES[:running]).where( devices[:status_updated_at].lt( now ))
    p ng_devices.all
    Stall.where( device: ng_devices).update_all( status: Stall::STATUSES[:unknown] )
    ng_devices.update_all( status: Device::STATUSES[:error])

    render json: nil

  end

  def sample_show
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

end
