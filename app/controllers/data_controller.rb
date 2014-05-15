class DataController < ApplicationController
  def circle

rtn = <<"EOS"
status,amount
vacant,2704659
occupied,4499890
unknown,2159981
EOS


  logs = TestLog.where( stall_name: "asl1" )


    render text: rtn
  end
end
