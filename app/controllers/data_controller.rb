class DataController < ApplicationController
  def circle

    param_till = Time.at( params[:till].to_i / 1000 ) if params[:till].present?
    till = param_till || Time.parse( Time.now.strftime('%y%m%d') + " 20:00:00" )
    render text: TestLog.report( { stall_name: params[:stall_name], till: till  } )
  end
end
