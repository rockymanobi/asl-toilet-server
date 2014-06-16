# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20140616132244) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "devices", force: true do |t|
    t.string   "name"
    t.string   "status"
    t.datetime "status_updated_at"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "devices", ["name"], name: "index_devices_on_name", unique: true, using: :btree

  create_table "stalls", force: true do |t|
    t.string   "name"
    t.string   "display_name"
    t.string   "status"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "device_id"
    t.datetime "status_updated_at"
  end

  add_index "stalls", ["device_id"], name: "index_stalls_on_device_id", using: :btree
  add_index "stalls", ["name"], name: "index_stalls_on_name", unique: true, using: :btree

  create_table "tell_me_logs", force: true do |t|
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "test_logs", force: true do |t|
    t.string   "stall_name"
    t.string   "status"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "test_stalls", force: true do |t|
    t.string   "status"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "test_track_logs", force: true do |t|
    t.string   "uuid"
    t.integer  "count"
    t.string   "user_agent"
    t.date     "date"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

end
