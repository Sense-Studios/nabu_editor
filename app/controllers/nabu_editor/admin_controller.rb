require_dependency "nabu_editor/application_controller"

module NabuEditor
  class AdminController < ApplicationController    
    layout "nabu_editor/material"            
    before_action :set_account_id
    #impersonates :user

    # not used    
    def index
    end
    
    def test
      @programs = MarduqResource::ProgramDecorator.decorate_collection(MarduqResource::Program.where(client_id:  current_user.client_id)) || []  
    end

    def inject_metadata

      # get (default) metadata, moviedescription, player_settings
      @program = MarduqResource::Program.find(params[:id])

      # use the first asset for defaults
      @program.title = @program.program_items[0].asset.title
      @program.description = @program.program_items[0].asset.description
      @program.tags = @program.program_items[0].asset.tags
      
      # get default marqers from preset file
      @program.marqers = {}
      
      # get allthis info from the asset, and not from the program?
      @program.metaData = {        
        "moviedescription"=> {
          "title"=> @program.program_items[0].asset.title,
          "description"=> @program.program_items[0].asset.description,
          "in-point"=> "",
          "out-point"=> "",
          "tags"=> @program.program_items[0].asset.tags,
          "thumbnail"=> @program.program_items[0].asset.thumbnail_url,
          "urchin"=> ""
        },
        
        "player_options"=> {
          "autoplay"=> "false",
          "showscores"=>"true",
          "scrubbar"=> "true",
          "allow_scrubbing"=> "true",
          "loader"=> "true",
          "playhead"=> "true",
          "time"=> "true",    
          "duration"=> "true",
          "quality"=> "false",
          "fullscreen"=> "true",
          "seek"=> "false",
          "volume"=> "false",
          "mute"=> "true",
          "show_big_play"=> "true",
          "title"=> "true",
          "description"=> "true",  
          "pop_under"=> "false",
          "pop_under_target"=> ""
        },
        
        "on_movie_end"=> {
          "set"=> "do-nothing",
          "linked_page"=> "",
          "shown_text"=> "",
          "next_program_id"=> "",
          "score_dependent_texts"=> [],
          "score_dependent_texts_header"=> "",

          "show_social_media"=> "false",
          "show_highscores"=> "true",
          "show-opt-in"=> "true",
          "email-forwarding"=> "true",
          "show-score-dependant-texts"=> "true"
        },
        
        "social"=> {
          "title"=> @program.program_items[0].asset.title,
          "url"=> @program.id,
          "description"=> @program.program_items[0].asset.description,
          "subject"=> @program.program_items[0].asset.title,
          "body"=> @program.program_items[0].asset.description + "\n" + "[link]",
          "facebook"=> "false",
          "linkedin"=> "false",
          "twitter"=> "false",
          "google"=> "false",
          "reddit"=> "false",
          "pinterest"=> "false",
          "email"=> "false",
          "like"=> "false",
          "plusone"=> "false"
        },
        
        "advanced"=> {
          # note that these are relayed through
          # custom marquers; ImageBeforeMarqer, ImageDuringMarqer, ImageAfterMarqer 
          # (nameing sucked out of my thumb)
        
          "show_image_before"=> "false",
          "show_image_before_url"=> "",
          "show_image_before_asset_id"=> "",
          "show_image_during"=> "false",
          "show_image_during_url"=> "",
          "show_image_during_asset_id"=> "",
          "show_image_after"=> "false",
          "show_image_after_url"=> "",
          "show_image_after_asset_id"=> ""
        }
      }
  
      if @program.save
        logger.info "Save complete"
      else
        logger.error "Save error!"
      end
        
      render json: @program
    end
    
    def get_programs
      @programs_data = MarduqResource::Program.where( client_id:  current_user.client_id ) || [] 
      # sort on created at
      @programs_data = @programs_data.sort_by(&:created_at)

      @programs = []
      @programs_data.each do |p|  
        temp_program = {}
        temp_program['title'] = p.title
        temp_program['description'] = p.description
        temp_program['id'] = p.id
        temp_program['tags'] = p.tags

        if ( p.meta.blank? )
          temp_program['thumbnail'] = "http://thumb10.shutterstock.com/photos/thumb_large/702052/115219567.jpg"
        else
          temp_program['thumbnail'] = p.meta.moviedescription.thumbnail
        end

        temp_program['created_at'] = p.created_at
        @programs.push(temp_program)  
      end
      
      render json: @programs.reverse!
    end
    
    def dashboard
      @programs_data = MarduqResource::Program.where( client_id:  current_user.client_id ) || []  
      
      
      @programs_data = @programs_data.sort_by(&:created_at)
      
      # we need to trim down all the data from programs, 
      # we don't need marqers and stuff at this point
      @programs = []
      @programs_data.each do |p|  
        temp_program = {}
        temp_program['title'] = p.title
        temp_program['description'] = p.description
        temp_program['id'] = p.id
        temp_program['tags'] = p.tags

        if ( p.meta.blank? )
          temp_program['thumbnail'] = "http://thumb10.shutterstock.com/photos/thumb_large/702052/115219567.jpg"
        else
          temp_program['thumbnail'] = p.meta.moviedescription.thumbnail
        end

        temp_program['created_at'] = p.created_at
        @programs.push(temp_program)  
      end
      
    end
    
    def create
      get_current_program
    end
    
    def describe
      get_current_program
    end
    
    def edit
      get_current_program
    end



  protected

    def set_account_id    
      if !current_user.account_id.nil?
        @account_id = User.find( current_user.id ).account_id
        @user_id =  current_user.id 
      else
        @account_id = current_user.id 
        @user_id =  current_user.id 
      end
      
      @account = User.find(@account_id)
    end

    def get_current_program
    end

  end
end
