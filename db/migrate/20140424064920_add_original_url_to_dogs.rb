class AddOriginalUrlToDogs < ActiveRecord::Migration
  def change
    add_column :dogs, :original_url, :text
    add_column :dogs, :shelter_name, :text
    add_column :dogs, :shelter_city, :text
  end
end
