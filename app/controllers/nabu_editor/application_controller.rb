module NabuEditor
  class ApplicationController < ActionController::Base
    
    before_filter :authenticate_user!
    before_action :set_locale, :set_translations
    impersonates :user

  protected

    def set_locale
      I18n.locale = session[:locale] = params[:locale] || session[:locale] || I18n.default_locale
    end
    
    def set_translations
      I18n.backend.send(:init_translations) unless I18n.backend.initialized?
      #@t = Hash[ Translation.all.map { |tr| [tr.key, tr.value] } ]
      @t = I18n.backend.send(:translations)[I18n.locale]    
      #@t = File.read("public/javascripts/translations.js").to_s.html_safe
    end

  end
end
