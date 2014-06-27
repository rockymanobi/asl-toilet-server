require 'test_helper'

class NoticeMessagesControllerTest < ActionController::TestCase
  setup do
    @notice_message = notice_messages(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:notice_messages)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create notice_message" do
    assert_difference('NoticeMessage.count') do
      post :create, notice_message: { content: @notice_message.content, from_date: @notice_message.from_date, status: @notice_message.status, title: @notice_message.title, to_date: @notice_message.to_date }
    end

    assert_redirected_to notice_message_path(assigns(:notice_message))
  end

  test "should show notice_message" do
    get :show, id: @notice_message
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @notice_message
    assert_response :success
  end

  test "should update notice_message" do
    patch :update, id: @notice_message, notice_message: { content: @notice_message.content, from_date: @notice_message.from_date, status: @notice_message.status, title: @notice_message.title, to_date: @notice_message.to_date }
    assert_redirected_to notice_message_path(assigns(:notice_message))
  end

  test "should destroy notice_message" do
    assert_difference('NoticeMessage.count', -1) do
      delete :destroy, id: @notice_message
    end

    assert_redirected_to notice_messages_path
  end
end
