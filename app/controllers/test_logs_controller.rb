
class TestLogsController < ApplicationController
  def index
    @logs = TestLog.all
  end
end
