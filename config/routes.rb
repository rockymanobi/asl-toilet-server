Rails.application.routes.draw do
  resources :sample_requests, only: [:index, :show, :create] do
    member do
      get :sample_show
    end
    collection do
      post :listen_heart_beat
    end
  end

  resources :test_logs, only: [:index] do
  end

  resource :data, only: [] do
    collection do
      get :circle
      get :percent
    end
  end

  resources :devices do
    member do
      put :heart_beat
      put :stop_monitoring
      put :start_monitoring
    end
  end

  resources :stalls do
    member do
      put :sync_status
    end
  end

end
