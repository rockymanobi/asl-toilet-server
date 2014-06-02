
class TellMeLogsController < ApplicationController
  skip_before_filter :verify_authenticity_token, only: [:create]
  def create
    TellMeLog.new.save
    p TellMeLog.count
    p TellMeLog.count
    p TellMeLog.count
    render json: nil
  end
end
