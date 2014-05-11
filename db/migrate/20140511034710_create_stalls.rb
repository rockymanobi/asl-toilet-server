class CreateStalls < ActiveRecord::Migration
  def change
    create_table :stalls do |t|
      t.string :name
      t.string :display_name
      t.string :status

      t.timestamps
    end
  end
end
