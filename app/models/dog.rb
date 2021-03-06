#encoding: utf-8

require 'nokogiri'
require 'open-uri'
require 'rest_client'

class Dog < ActiveRecord::Base
  has_many :selfies
  def self.crawlFromDierenBescherming
    self.parse_index_page "zoek-asieldieren/honden"
    #html_doc = RestClient.get "http://ikzoekbaas.dierenbescherming.nl/zoek-asieldieren/honden"
    #doc = Nokogiri::HTML(html_doc)
    #get amount of pages
    #doc.css('#paging a').each do |link|
    #  self.parse_index_page link['href']
    #end

  end

  def self.parse_index_page url
      html_doc = RestClient.get "http://ikzoekbaas.dierenbescherming.nl/zoek-asieldieren/honden"
      doc = Nokogiri::HTML(html_doc)
      #get amount of pages
      doc.css('.right_content .colvan5 .meer_info a').each do |link|
        self.parse_show_page link['href']
        #follow teh link
      end
  end

  def self.parse_show_page url
    html_doc = RestClient.get url
    doc = Nokogiri::HTML(html_doc)
    #puts url
    #begin
      name = doc.css('.print_naam').text
      details_text = doc.css('.detailcol').inner_html.encode('UTF-8', 'binary', invalid: :replace, undef: :replace, replace: '')

      age = /Leeftijd\<\/strong\>\:(?<age>.*?)<br/.match(details_text)[:age]
      race = /Ras<\/strong>: (?<ras>.*?)<br/.match(details_text)[:ras]
      race = race == 'Terrirs' ? 'Terriers' : race

      shelter_details = doc.css('table.asieldier').inner_html.encode('UTF-8', 'binary', invalid: :replace, undef: :replace, replace: '')

      shelter_city = /\d{4}.\w\w.(?<city>[^<]+)/mi.match(shelter_details)[:city]
      shelter_name = /td>(?<name>[^<]*)<br/.match(shelter_details)[:name]
      #todo: try transliterate (http://api.rubyonrails.org/classes/ActiveSupport/Inflector.html)
      image = doc.css('#profiel_area').inner_html
      image_url = /[^"]+size=/.match(image)
      name =  name.squeeze(" ").strip


    if image_url.present? && (! Dog.find_by(name: name).present?)
      image_url = CGI::unescapeHTML("http://ikzoekbaas.dierenbescherming.nl#{image_url}original")

      id = ActiveSupport::Inflector.transliterate name.downcase.gsub(/\s/,"_").gsub(/[^\w_]/, '')
      upload = Cloudinary::Uploader.upload(image_url, :public_id => id, :width => 600, :height => 500, crop: :fill, effect: :trim)
      upload.delete 'type'
      dog = Dog.create!({name: name, race: race.squeeze(" ").strip, age: age.squeeze(" ").strip, image: upload['url'], shelter_city: shelter_city, shelter_name: shelter_name, original_url: url})
      upload['dog_id'] = dog.id
      upload['original_url'] = image_url
      Selfie.create! upload
    end


    #rescue Exception
    #end
    #puts '========================================================'
    #puts ras
  end
end
