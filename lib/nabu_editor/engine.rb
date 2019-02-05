module NabuEditor
  class Engine < ::Rails::Engine
    isolate_namespace NabuEditor
    #config.to_prepare do
    #  ApplicationController.helper(ActionView::Helpers::ApplicationHelper)
    #end

    # set the manifests and assets to be precompiled
    #config.to_prepare do
    #  Rails.application.config.assets.precompile += %w( admin.js admin.css )
    #end

    initializer "nabu_editor.assets.precompile" do |app|
      app.config.assets.precompile += %w(
        nabu_editor/application.js
        nabu_editor/dashboard.js
        nabu_editor/leftmenu.js
        nabu_editor/sections.js
        nabu_editor/editor/*.js
        nabu_editor/publish/*.js
        nabu_editor/describe/*.js
        nabu_editor/create/*.js
        nabu_editor/questions/*.js
        nabu_editor/create/create_movie.js
        nabu_editor/*.css
        nabu_editor/shared/*.css
      )
    end
  end
end
