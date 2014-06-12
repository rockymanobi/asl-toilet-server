
class TestLogsController < ApplicationController
  def index

    target_date_yyyymmdd = params[:date_yyyymmdd]
    target_stall_name = params[:stall_name]

    @logs = TestLog.all
    @logs = @logs.date_at( Date.parse(target_date_yyyymmdd) ) if target_date_yyyymmdd.present?
    @logs = @logs.where!( stall_name: target_stall_name ) if target_stall_name.present?

  end
end
