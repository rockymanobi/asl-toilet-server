class CreateTestLogs < ActiveRecord::Migration
  def change
    create_table :test_logs do |t|
      t.string :stall_name
      t.string :status

      t.timestamps
    end
  end
end
