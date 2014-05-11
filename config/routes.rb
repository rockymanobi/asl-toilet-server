Rails.application.routes.draw do
  resources :sample_requests, only: [:index, :show, :create] do
    member do
      get :sample_show
    end
  end

  resources :devices do
    member do
      put :heart_beat
    end
  end

  resources :stalls do
    member do
      put :sync_status
    end
  end

end
