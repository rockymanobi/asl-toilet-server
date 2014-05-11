# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)
#

device = Device.new( { name: 'asl', status: Device::STATUSES[:sleep]  } ).save!

asl_stall_1 = Stall.new( { name: 'asl1', display_name: 'asl1', status: Stall::STATUSES[:unknown] } ).save!
asl_stall_2 = Stall.new( { name: 'asl2', display_name: 'asl2', status: Stall::STATUSES[:unknown] } ).save!







