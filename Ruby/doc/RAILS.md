# Using RTCC with Rails

The RTCC Ruby client is suitable for use in a Rails project.  This note describes some best practices that can help get you up and running quickly.  These notes were prepared against a project using Rails4 with Devise for authentication.

Requirements:

- Openssl
- Libcurl
- Curb gem

You should obtain your Authentication Provider credentials for RTCC first.


## Install the library

Copy ```lib/rtcc_auth.rb``` into the top level ```lib/``` directory in your project.  Rails includes files in this directory by default, so you can simply 'require' the module later.

## Define your RTCC Credentials

In the top-level ```environment.rb``` define the global RTCC variables the same as ```SimpleRubyServer.rb```.

## Extend the User Object

Each user in the RTCC cloud is authenticated using three pieces of information: their UID, Domain and Profile.  Extend the User model with three methods to help localize the logic mapping users to RTCC capabilities.

```ruby
class User < ActiveRecord::Base

  devise ... # (lines omitted)

  def rtcc_uid
    email
  end

  def rtcc_domain
    "yourdomain.com"
  end

  def rtcc_profile
    "premium"
  end

end
```

The UID is the unique ID of the user in your system.  The domain will match your domain, or if you are a multi-tenanted service provider, the domain may specify the tenancy the user belongs to.  The profile identifies the service class of the user.  Customize these methods as appropriate for your installation.

## Implement an RTCC Authentication Controller

The RTCCContoller implements a single method called ```callback``` that obtains the token for RTCC using the Authentication Client.  The controller below verifies that the request comes from a logged-in user.  If so then the UID, DOMAIN and PROFILE of the current user are used to obtain a token.  Otherwise, an error is returned.

```ruby
require 'rtcc_auth'

class RTCCController < ApplicationController

  def initialize
    @client = RTCCAuth.new(RTCC_AUTH_URL, RTCC_CACERT, RTCC_CLIENTCERT, RTCC_CLIENTCERT_KEY, RTCC_CERTPASSWORD, RTCC_CLIENT_ID, RTCC_CLIENT_SECRET)
    super
  end

  def callback
    if user_signed_in?
      obj = @client.auth(current_user.rtcc_uid,
                         current_user.rtcc_domain,
                         current_user.rtcc_profile)
    else
      obj = { "error" => 500, "error_description" => "unauthenticated user" }
    end

    logger.debug "RTCC#callback #{obj}"

    render :json => obj
  end
end
```

## Configure the route

Add the route for this controller near the top of ```config/routes.rb``` in your project.

```ruby
YourApp::Application.routes.draw do
  get "rtcc/callback"
  ...
end
```


## Initialize the RTCC Javascript Object with a Token

Initialize the RTCC object with the token obtained through your controller.  A sketch appears below.

```javascript
  var rtccAppId = "abcdefghij";
  var rtcc = null;

  $.ajax({
    type: "GET",
    url: "/rtcc/callback",
    cache: false,
    dataType: "JSON"
    }).success(function(data) {
      var token = data.token;
      rtcc = new RTCC(rtccAppId, token, 'internal', "", "1", "<%= current_user.email %>");
      rtcc.initialize();
    }).error(function(e) {
      console.log(["RTCCToken error", e]);
    });

```
