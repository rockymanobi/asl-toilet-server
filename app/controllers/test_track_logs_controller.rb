
class TestTrackLogsController < ApplicationController
  def create
    test_track_log = TestTrackLog.find_by( uuid: params[:track_uuid], date: Date.today  ) || TestTrackLog.new( { uuid: params[:track_uuid], date: Date.today, count: 0} )
    test_track_log.count += 1
    test_track_log.user_agent = params[:agent]
    test_track_log.save
    p test_track_log

    render json: nil
  end
end
