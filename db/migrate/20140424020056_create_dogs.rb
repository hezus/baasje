class CreateDogs < ActiveRecord::Migration
  def change
    create_table :dogs do |t|
      t.string :name
      t.text :image
      t.string :age
      t.text :race
      t.string :location
      t.text :badges

      t.timestamps
    end
  end
end
