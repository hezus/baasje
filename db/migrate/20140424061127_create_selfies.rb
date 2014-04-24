class CreateSelfies < ActiveRecord::Migration
  def change
    create_table :selfies do |t|
      t.integer :dog_id
      t.string :public_id
      t.string :version
      t.text :signature
      t.string :width
      t.string :height
      t.string :format
      t.string :resource_type
      t.string :bytes
      t.string :etag
      t.text :url
      t.text :secure_url



      t.timestamps
    end
  end
end

#{"public_id"=>"______indy____",
# "version"=>1398319728,
# "signature"=>"4572d65c1994eb36c88fb9611511371724ce7e98",
# "width"=>600, "height"=>500,
# "format"=>"jpg",
# "resource_type"=>"image",
# "created_at"=>"2014-04-24T06:08:48Z",
# "bytes"=>122640, "type"=>"upload",
# "etag"=>"a48bfc77efa4a85046ec05c72144d971",
# "url"=>"http://res.cloudinary.com/henemkprq/image/upload/v1398319728/______indy____.jpg",
# "secure_url"=>"https://res.cloudinary.com/henemkprq/image/upload/v1398319728/______indy____.jpg"}