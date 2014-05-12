class AddDeviceIdToStalls < ActiveRecord::Migration
  def change
    add_column :stalls, :device_id, :integer
    add_index :stalls, :device_id
  end
end
