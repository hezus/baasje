class AddOriginalUrlToSelfies < ActiveRecord::Migration
  def change
    add_column :selfies, :original_url, :text
  end
end
