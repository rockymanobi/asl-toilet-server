Rails.application.routes.draw do
  resources :sample_requests, only: [:index, :show, :create] do
  end

  resources :devices do
    member do
      post :heart_beat
    end
  end
end
