class DataController < ApplicationController

  def show
  end

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

  def log
    param_till = Time.at( params[:till].to_i / 1000 ) if params[:till].present?
    till = param_till ||  [ Time.parse( Date.parse("20140530").strftime('%y%m%d') + " 18:00:00" ), Time.now ].min

    param_from = Time.at( params[:from].to_i / 1000 ) if params[:from].present?
    from = param_from || [ Time.parse( Date.parse("20140530").strftime('%y%m%d') + " 9:00:00" ), Time.new.beginning_of_day].min

    @logs = TestLog.create_repo_data( { stall_name: params[:stall_name], till: till, from: from  } )
    from_base = from.to_i

    r = @logs.intervals.map do |l|
      val = { "vacant" =>  0, "unknown" => -1, "occupied" =>  1 }[l.status]
      from = l.from.to_i - from_base
      { val: val, from: from  }
    end
    render json: r
  end



end
