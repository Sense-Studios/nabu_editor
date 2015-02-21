module NabuEditor
  module ApplicationHelper
    # I want the apps helpers in my engine, too!
    # include ActionView::Helpers::ApplicationHelper
    def _t(key)
      I18n.t(key)
    end
    
    # requires user.level
    def _r?(num)
      current_user.level > num
    end  
  end
end
