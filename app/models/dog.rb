#encoding: utf-8

require 'nokogiri'
require 'open-uri'
require 'rest_client'

class Dog < ActiveRecord::Base

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
    puts url
    #begin
      name = doc.css('.print_naam').text
      details_text = doc.css('.detailcol').inner_html.encode('UTF-8', 'binary', invalid: :replace, undef: :replace, replace: '')
      age = /Leeftijd\<\/strong\>\:(?<age>.*?)<br/.match(details_text)[:age]
      race = /Ras<\/strong>: (?<ras>.*?)<br/.match(details_text)[:ras]
      race = race == 'Terrirs' ? 'Terriers' : race
      image = doc.css('#profiel_area').inner_html
      image_url = /[^"]+size=/.match(image)
      puts "#{name}: #{age}, #{race}, #{image_url}"

    if image_url.present?
      Dog.create!({name: name.squeeze(" ").strip, race: race.squeeze(" ").strip, age: age.squeeze(" ").strip, image: CGI::unescapeHTML("http://ikzoekbaas.dierenbescherming.nl#{image_url}original")})
    end


    #rescue Exception
    #end
    #puts '========================================================'
    #puts ras
  end
end
