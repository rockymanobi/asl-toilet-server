class UpdateStallName < ActiveRecord::Migration
  def change
    Stall.where(name: 'asl1').update_all( display_name: '奥のトイレ');
    Stall.where(name: 'asl2').update_all( display_name: '手前のトイレ');
  end
end
