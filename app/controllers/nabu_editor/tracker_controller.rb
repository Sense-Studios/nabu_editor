require_dependency "nabu_editor/application_controller"

module NabuEditor
  class TrackerController < ApplicationController
    layout "layouts/admin"
    
    def index
      @program = MarduqResource::Program.find(params[:id]) unless params[:id].blank?
    end
  end
end
