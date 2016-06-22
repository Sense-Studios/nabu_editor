require_dependency "nabu_editor/application_controller"

module NabuEditor
  class AdminController < ApplicationController
    layout "nabu_editor/material"
    before_action :set_account_id
    #impersonates :user

    # not used
    def index
      # find me in dashboard
    end

    def image
      render layout: false
    end

    def test
      @programs = MarduqResource::ProgramDecorator.decorate_collection(MarduqResource::Program.where(client_id:  current_user.client_id)) || []
    end

    def inject_metadata

      # get (default) metadata, moviedescription, player_settings
      @program = MarduqResource::Program.find(params[:id])

      # we asssume at least 1 asset, or it errors
      logger.debug "----------------------------------------------------------"
      logger.debug @program.program_items[0].to_yaml
      logger.debug "----------------------------------------------------------"
      logger.debug @program.program_items[0].asset.to_yaml
      logger.debug "----------------------------------------------------------"

      # use the first asset settings for defaults values
      @program.title = @program.program_items[0].asset.title
      @program.description = @program.program_items[0].asset.description
      @program.tags = @program.program_items[0].asset.tags
      # @program.tags = @program.program_items[0].asset.thumbnail_url

      # TODO: get default marqers from preset file and/or database
      some_marqer = MarduqResource::Marqer.new()
      some_marqer.title = "Powered by Marduq"
      some_marqer.in = 0.1

      # this should come from a file
      some_marqer.out = @program.program_items[0].asset.duration_in_ms.to_f / 1000
      some_marqer.type = "ImageMarqer"
      some_marqer.program_id = @program.id
      some_marqer.marqeroptions = {
        "image"=> {
          "type"=> "file",
          "value"=> "http://nabu.sense-studios.com/assets/nabu_editor/beeld_merk.png"
        },
        "title"=> {
          "type"=> "text",
          "value"=> "Powered by Marduq"
        },
        "position"=> {
          "type"=> "select",
          "value"=> "bottom-left",
          "options"=> [
            "top-left",
            "top-center",
            "top-right",
            "middle-left",
            "middle-center",
            "middle-right",
            "bottom-left",
            "bottom-center",
            "bottom-left"
          ]
        },
        "size"=> {
          "type"=> "number",
          "value"=> "4"
        },
        "marge"=> {
          "type"=> "number",
          "value"=> "2"
        },
        "url"=> {
          "type"=> "text",
          "value"=> "http://www.marduq.tv"
        },
        "target"=> {
          "type"=> "select",
          "value"=> "_blank",
          "options"=> [
            "_blank",
            "_top",
            "_self"
          ]
        },
        "classes"=> {
          "type"=> "text",
          "value"=> "img-maxwidth128"
        },
        "track_id"=> 1,
        "trackname"=> "Track1397211705621"
      }

      # save the marqer
      some_marqer.save()

      # push it into the program
      @program.marqers.push(some_marqer)

      # differ between youtube/vimeo and own uploads
      if @program.program_items[0].asset._type == "Video"
        @program.program_items[0].asset.thumbnail_url = @program.program_items[0].asset.thumbnails.medium[0]
      end

      # trick the program data from the asset data
      # this should come from a file
      @program.meta = {
        "moviedescription"=> {
          "title"=> @program.program_items[0].asset.title,
          "description"=> @program.program_items[0].asset.description,
          "tags"=> @program.program_items[0].asset.tags,
          "thumbnail"=> @program.program_items[0].asset.thumbnail_url,
          "in-point"=> "",
          "out-point"=> "",
          "urchin"=> "",
          "duration_in_ms"=> @program.program_items[0].asset.duration_in_ms
        },

        "player_options"=> {
          "title"=> "true",
          "description"=> "true",
          "autoplay"=> "false",
          #"showscores"=>"true",
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

          "pop_under"=> "false",
          "pop_under_target"=> "",

          "custom_widget_id" => "",
          "custom_embed_code" => ""
        },

        "on_movie_end"=> {
          "set"=> "do-nothing",
          "linked_page"=> "",
          #"shown_text"=> "",
          "show_text"=> "",
          "next_program_id"=> ""
          #"score_dependent_texts"=> [],
          #"score_dependent_texts_header"=> "",
          #"show_social_media"=> "false",
          #"show_highscores"=> "true",
          #"show-opt-in"=> "true",
          #"email-forwarding"=> "true",
          #"show-score-dependant-texts"=> "true"
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

        #{}"advanced"=> {
          # note that these are relayed through
          # custom marquers; ImageBeforeMarqer, ImageDuringMarqer, ImageAfterMarqer
          # (nameing sucked out of my thumb)

        #  "show_image_before"=> "false",
        #  "show_image_before_url"=> "",
        #  "show_image_before_asset_id"=> "",
        #  "show_image_during"=> "false",
        #  "show_image_during_url"=> "",
        #  "show_image_during_asset_id"=> "",
        #  "show_image_after"=> "false",
        #  "show_image_after_url"=> "",
        #  "show_image_after_asset_id"=> ""
        #},

        "statistics"=> {
          "views" => 0,
          "openers" => 0,
          "completed" => 0,
          "timewatched" => 0
          # "statistics" => "0",
        }
      }

      if @program.save
        logger.info "Save complete!"
      else
        logger.error "Save error!"
      end

      render json: @program
    end

    def get_programs
      # this would be the api call
      do_get_programs
      render json: @programs.reverse!
    end

    # Sites
    def dashboard
      set_account_id

      if current_user.account?
        owner = User.find( current_user.client_id )
      else
        owner = current_user
      end

      #@kaltura_partner_id = owner.kaltura_partner_id
      #@kaltura_uiconfig_id = owner.kaltura_uiconfig_id
      @owner = owner

      # get programs
      do_get_programs

      @themes = NabuThemes::Theme.where( :owner => @account_id )
      @menus = NabuThemes::Menu.where( :owner => @account_id )

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

    # get programs helper
    def do_get_programs
      @programs_data = MarduqResource::Program.where( client_id:  current_user.client_id ) || []
      #@programs_data = @programs_data.sort_by(&:created_at)

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

          temp_program['timewatched'] = 0
          temp_program['openers'] = 0
          temp_program['completed'] = 0

          if p.meta.respond_to? :statistics
            if p.meta.statistics.respond_to? :timewatched
              temp_program['timewatched'] = p.meta.statistics.timewatched
            end
            if p.meta.statistics.respond_to? :openers
              temp_program['openers'] = p.meta.statistics.openers
            end
            if p.meta.statistics.respond_to? :completed
              temp_program['completed'] = p.meta.statistics.completed
            end
          end
        end

        temp_program['created_at'] = p.created_at
        @programs.push(temp_program)
      end

      if params[:sort].nil?
        @programs = @programs.sort_by{|e| e['created_at'] }
      else
        if params[:sort] == 'timewatched' || params[:sort] == 'openers' || params[:sort] == 'completed'
          @programs = @programs.sort_by{|e| e[params[:sort]].to_i }
        else
          @programs = @programs.sort_by{|e| e[params[:sort]].to_s }
        end
      end
    end

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
      puts "------------------------------------------------------------------"
      puts " get current program "
      puts "------------------------------------------------------------------"
    end

  end
end
