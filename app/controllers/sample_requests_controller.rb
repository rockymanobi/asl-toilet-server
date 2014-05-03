
class SampleRequestsController < ApplicationController
  def index
    p request.body
    render json: nil;
  end

  def create
    p request.request_method
    p "create"
    render json: nil;
  end

end
