class CreateTestStalls < ActiveRecord::Migration
  def change
    create_table :test_stalls do |t|
      t.string :status

      t.timestamps
    end
  end
end
