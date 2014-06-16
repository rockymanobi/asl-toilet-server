class CreateTestNotificationRequests < ActiveRecord::Migration
  def change
    create_table :test_notification_requests do |t|
      t.string :device
      t.string :reg_id

      t.timestamps
    end
  end
end
