class PagesController < ApplicationController
  def index

  end
  def json
    @dogs = Dog.all.limit(13)
    render :json => @dogs
  end
  def crawl
    Dog.destroy_all
    Dog.crawlFromDierenBescherming
    #redirect_to root_path
    #redirect to root path
  end


end