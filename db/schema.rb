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

ActiveRecord::Schema.define(version: 20140424061127) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "dogs", force: true do |t|
    t.string   "name"
    t.text     "image"
    t.string   "age"
    t.text     "race"
    t.string   "location"
    t.text     "badges"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "selfies", force: true do |t|
    t.integer  "dog_id"
    t.string   "public_id"
    t.string   "version"
    t.text     "signature"
    t.string   "width"
    t.string   "height"
    t.string   "format"
    t.string   "resource_type"
    t.string   "bytes"
    t.string   "etag"
    t.text     "url"
    t.text     "secure_url"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

end
