Rails.application.routes.draw do
  root to: "home#index"
  resources :sample_requests, only: [:index, :show, :create] do
    member do
      get :sample_show
      get :admin_console
    end
    collection do
      get :both_stalls_status
      post :listen_heart_beat
      post :notification_request_for_android
    end
  end

  resources :test_logs, only: [:index] do
  end

  resource :data, only: [:show] do
    collection do
      get :circle
      get :percent
      get :log
    end
  end

  resources :devices, only: [:show] do
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

  resources :hoges do
  end

  resources :test_track_logs, only: [:create] do
  end

  resources :tell_me_logs, only: [:create] do
  end
end
