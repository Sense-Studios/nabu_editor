# local settings for the engine
# mount point
NABU_EDITOR_MOUNT_POINT = "editor3"

# create extra menu items on Nabu
EXTRA_ADMIN_MENU_ITEMS.push( { "title" => "Editor Engine", "header" => true } )
EXTRA_ADMIN_MENU_ITEMS.push( { "title" => "Dashboard", "link" => "/editor3/dashboard", "glyphicon" => "glyphicon-dashboard" } )
EXTRA_ADMIN_MENU_ITEMS.push( { "title" => "Timeline Editor", "link" => "/editor3/timeline", "glyphicon" => "glyphicon-tasks" } )
EXTRA_ADMIN_MENU_ITEMS.push( { "title" => "Tracker Editor", "link" => "/editor3/tracker", "glyphicon" => "glyphicon-list-alt" } )
