class DataController < ApplicationController
  def circle

    param_till = Time.at( params[:till].to_i / 1000 ) if params[:till].present?
    till = param_till ||  [ Time.parse( Time.now.strftime('%y%m%d') + " 20:00:00" ), Time.now ].min

    param_from = Time.at( params[:from].to_i / 1000 ) if params[:from].present?
    from = param_from || [ Time.parse( Time.now.strftime('%y%m%d') + " 8:00:00" ), Time.new.beginning_of_day].min

    render text: TestLog.report( { stall_name: params[:stall_name], till: till, from: from  } )
  end

  def percent
    param_till = Time.at( params[:till].to_i / 1000 ) if params[:till].present?
    till = param_till ||  [ Time.parse( Time.now.strftime('%y%m%d') + " 20:00:00" ), Time.now ].min

    param_from = Time.at( params[:from].to_i / 1000 ) if params[:from].present?
    from = param_from || [ Time.parse( Time.now.strftime('%y%m%d') + " 8:00:00" ), Time.new.beginning_of_day].min

    render text: TestLog.percent( { stall_name: params[:stall_name], till: till, from: from  } ).to_s
  end


end
