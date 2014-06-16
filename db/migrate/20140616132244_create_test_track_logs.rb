class CreateTestTrackLogs < ActiveRecord::Migration
  def change
    create_table :test_track_logs do |t|
      t.string :uuid
      t.integer :count
      t.string :user_agent
      t.date :date

      t.timestamps
    end
  end
end
