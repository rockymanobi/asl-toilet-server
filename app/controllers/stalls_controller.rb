
class StallsController < ApplicationController
  before_action :set_stall, only: [:sync_status]
  skip_before_filter :verify_authenticity_token, only: [:sync_status]

  def index
    render json: nil
  end

  def show
    p params[:id]
    s = Stall.find_by( name: params[:id] )
    render json: s
  end


  def sync_status

    raise "no such status" unless Stall::STATUSES.has_value? params[:status]
    @stall.status = params[:status]
    status_updated_at = Time.at( params[:updated_at_unix_time].to_i / 1000 ) if params[:updated_at_unix_time].present?
    @stall.status_updated_at = status_updated_at || Time.now
    @stall.save!

    render json: "stall #{@stall.name} is updated to #{@stall.status}"
  end

  private
  def set_stall
    @stall = Stall.find_by( name: params[:id] )
  end

end
