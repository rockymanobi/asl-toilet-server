
class StallsController < ApplicationController
  before_action :set_stall, only: [:sync_status]
  skip_before_filter :verify_authenticity_token, only: [:sync_status]

  def index
    render json: nil
  end
  def show
    p params[:id]
    Stall.find_by( name: params[:id] )
    render json: nil
  end

  def sync_status

    raise "no such status" unless Stall::STATUSES.has_value? params[:status]
    @stall.status = params[:status]
    @stall.save!

    render json: nil
  end

  private
  def set_stall
    @stall = Stall.find_by( name: params[:id] )
  end

end
