module NabuEditor
  class Engine < ::Rails::Engine    
    isolate_namespace NabuEditor
    #config.to_prepare do
    #  ApplicationController.helper(ActionView::Helpers::ApplicationHelper)
    #end
  end
end
