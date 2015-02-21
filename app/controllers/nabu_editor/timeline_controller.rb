require_dependency "nabu_editor/application_controller"

module NabuEditor
  class TimelineController < ApplicationController
    layout "layouts/admin"
    
    def index      
      @program = MarduqResource::Program.find(params[:id]) unless params[:id].blank?
    end
    
    def test      
      @program = MarduqResource::Program.find(params[:id]) unless params[:id].blank?
    end
    
  end
end
