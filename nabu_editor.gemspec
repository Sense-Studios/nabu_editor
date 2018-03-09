$:.push File.expand_path("../lib", __FILE__)

# Maintain your gem's version:
require "nabu_editor/version"

# Describe your gem and declare its dependencies:
Gem::Specification.new do |s|
  s.name        = "nabu_editor"
  s.version     = NabuEditor::VERSION
  s.authors     = ["Sense Studios"]
  s.email       = ["Daan@sense studios com"]
  s.homepage    = "http://www.sense-studios.com"
  s.summary     = "Modern editor for Marduq IV"
  s.description = "The nabu editor is an engine on Marduq/Nabu extending the system with a material-designed single page editor"

  s.files = Dir["{app,config,db,lib}/**/*"] + ["MIT-LICENSE", "Rakefile", "README.rdoc"]
  s.test_files = Dir["test/**/*"]

  # s.add_dependency "rails", "~> 4.0.3"
  # s.add_dependency "jquery-rails"
  s.add_dependency "mongoid"
end
