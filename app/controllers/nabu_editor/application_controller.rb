module NabuEditor
  class ApplicationController < ActionController::Base

    before_filter :authenticate_user!
    before_action :set_locale, :set_translations, :set_whitelabel
    newrelic_ignore

    impersonates :user

    def set_whitelabel

      # match url with labls
      current_domain = request.host_with_port
      current_whitelabel = 0
      WHITELABELS.each_with_index do |w, i|
        w["domains"].each do |d|
          if d == current_domain
            current_whitelabel = i
          end
        end
      end
      @whitelabel = WHITELABELS[current_whitelabel]
    end

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
