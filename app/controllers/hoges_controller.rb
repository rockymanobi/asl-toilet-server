class HogesController < ApplicationController
  skip_before_filter :verify_authenticity_token, only: [:create]
  def create
    render text: 'Create Method Called!!'
  end
end
