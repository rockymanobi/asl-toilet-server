
class SampleRequestsController < ApplicationController

  before_action :set_stall, only: [:show, :edit, :update, :destroy]
  
  def index
    @stall = TestStall.first
    render json: @stall.status;
  end


  def show
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
    @stall = TestStall.find(params[:id])
  end

  # Never trust parameters from the scary internet, only allow the white list through.
  def member_params
    params.require(:member).permit(:name)
  end
end
