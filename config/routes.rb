NabuEditor::Engine.routes.draw do

  get "/dashboard", to: "admin#dashboard"
  get "/create_movie", to: "admin#create"
  get "/describe_movie", to: "admin#describe"
  get "/edit_movie", to: "admin#edit"
  get "/inject_metadata(/:id)", to: "admin#inject_metadata"
  get "/get_programs",  to: "admin#get_programs"

  # marqerstrata
  post "/marqerstratum/",  to: "admin#post_marqerstratum"
  post "/deletestratum/:id",  to: "admin#delete_marqerstratum"
  get "/marqerstratum/(:id)",  to: "admin#get_marqerstratum"
  get "/marqerstrata/",  to: "admin#get_marqerstratum"

  root to: "admin#dashboard"

  # AFBLIJVEN
  get "/tracker(/:id)", to: "tracker#index"
  get "/timeline(/:id)", to: "timeline#index"
  
  # get "/test(/:id)", to: "timeline#test"
  get "/test(/:id)", to: "admin#test"
  get "/fakeittillyoumakeit" , to: "admin#image"
end
