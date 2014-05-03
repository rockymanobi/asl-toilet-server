Rails.application.routes.draw do
  resources :sample_requests, only: [:index, :create] do
  end
end
