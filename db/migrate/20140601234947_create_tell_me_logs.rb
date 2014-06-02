class CreateTellMeLogs < ActiveRecord::Migration
  def change
    create_table :tell_me_logs do |t|

      t.timestamps
    end
  end
end
