
class TestLogsController < ApplicationController
  def index

    target_date_yyyymmdd = params[:date_yyyymmdd]

    @logs = TestLog.all
    @logs = @logs.date_at( Date.parse(target_date_yyyymmdd) ) if target_date_yyyymmdd.present?

  end
end
