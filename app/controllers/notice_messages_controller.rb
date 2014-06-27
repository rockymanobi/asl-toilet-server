class NoticeMessagesController < ApplicationController
  before_action :set_notice_message, only: [:show, :edit, :update, :destroy]

  # GET /notice_messages
  # GET /notice_messages.json
  def index
    @notice_messages = NoticeMessage.all
  end

  # GET /notice_messages/1
  # GET /notice_messages/1.json
  def show
  end

  # GET /notice_messages/new
  def new
    @notice_message = NoticeMessage.new
  end

  # GET /notice_messages/1/edit
  def edit
  end

  # POST /notice_messages
  # POST /notice_messages.json
  def create
    @notice_message = NoticeMessage.new(notice_message_params)

    respond_to do |format|
      if @notice_message.save
        format.html { redirect_to @notice_message, notice: 'Notice message was successfully created.' }
        format.json { render :show, status: :created, location: @notice_message }
      else
        format.html { render :new }
        format.json { render json: @notice_message.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /notice_messages/1
  # PATCH/PUT /notice_messages/1.json
  def update
    respond_to do |format|
      if @notice_message.update(notice_message_params)
        format.html { redirect_to @notice_message, notice: 'Notice message was successfully updated.' }
        format.json { render :show, status: :ok, location: @notice_message }
      else
        format.html { render :edit }
        format.json { render json: @notice_message.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /notice_messages/1
  # DELETE /notice_messages/1.json
  def destroy
    @notice_message.destroy
    respond_to do |format|
      format.html { redirect_to notice_messages_url }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_notice_message
      @notice_message = NoticeMessage.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def notice_message_params
      params.require(:notice_message).permit(:title, :content, :from_date, :to_date, :status)
    end
end
