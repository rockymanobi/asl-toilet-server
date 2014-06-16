
class StallsController < ApplicationController
  before_action :set_stall, only: [:sync_status]
  skip_before_filter :verify_authenticity_token, only: [:sync_status]

  def index
    render json: nil
  end

  def show

    s = Stall.find_by( name: params[:id] )
    render json: s
  end


  def sync_status

    raise "no such status" unless Stall::STATUSES.has_value? params[:status]
    before_status = @stall.status
    @stall.status_updated_at = Time.now if before_status != params[:status]
    @stall.status = params[:status]
    @stall.save!

    TestNotificationRequest.notify_all if before_status == "occupied" && params[:status] != "occupied"
    render json: "stall #{@stall.name} is updated to #{@stall.status}"
  end

  private
  def set_stall
    @stall = Stall.find_by( name: params[:id] )
  end

end
