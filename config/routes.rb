Rails.application.routes.draw do
  resources :sample_requests, only: [:index, :show, :create] do
  end
end
