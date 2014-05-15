class AddStatusUpdatedAtToStalls < ActiveRecord::Migration
  def change
    add_column :stalls, :status_updated_at, :datetime
  end
end
