## Version 1.0.1 (Beta)

### Security Enhancements
- Added security features to Express routes
- Implemented rate limiting
- Added configurable token expiration
- Introduced user scopes, resource scopes, and API token scopes
- Implemented permission groups, user groups, and roles

### Authentication and Authorization
- Refactored security rules and middleware
- Updated authorization middleware to include scopes
- Improved handling of custom identifiers

### Request Handling
- Refactored CurrentRequest into RequestContext
- Added IP address handling to RequestContext
- Moved RequestContext into an app container

### Route Resources
- Added 'index' and 'all' filters to RouteResources
- Renamed 'name' to 'path' in IRouteResourceOptions
- Updated to allow for partial scopes

### Command Handling
- Fixed argument processing in ListRoutesCommand
- Enabled registration of commands with configs in the same module

### Code Refactoring and Optimization
- Consolidated security interfaces into a single file
- Removed debug console logs
- Fixed incorrect import paths
- Refactored Express domain files

### Bug Fixes
- Resolved a potential "headers already sent" issue
- Fixed migration failures related to missing files
- Corrected custom identifier handling

### Miscellaneous
- Updated Observer with awaitable methods
- Improved route logging to include security rules
- Various comment updates for improved clarity