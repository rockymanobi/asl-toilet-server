class CreateDevices < ActiveRecord::Migration
  def change
    create_table :devices do |t|
      t.string :name
      t.string :status
      t.datetime :status_updated_at
      t.timestamps
    end
  end
end
