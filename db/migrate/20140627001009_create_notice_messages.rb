class CreateNoticeMessages < ActiveRecord::Migration
  def change
    create_table :notice_messages do |t|
      t.string :title
      t.text :content
      t.datetime :from_date
      t.datetime :to_date
      t.integer :status

      t.timestamps
    end
  end
end
