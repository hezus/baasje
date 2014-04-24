Baasje::Application.routes.draw do

  get '/crawl' => 'pages#crawl'
  get '/json' => 'pages#json', as: :json
  root :to => 'pages#index'
end
