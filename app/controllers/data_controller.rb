class DataController < ApplicationController
  def circle
rtn = <<"EOS"
status,amount
vacant,2704659
occupied,4499890
unknown,2159981
EOS


    render text: rtn
  end
end
