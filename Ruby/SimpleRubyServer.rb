#!/usr/bin/env ruby
#
# Simple HTTP service illustrating request a token for RTCC.
#

require 'webrick'
require_relative 'lib/rtcc_auth'

# Path to the RTCC CA Cert
RTCC_CACERT = "/Path/To/Your/Cert/authCA.crt"

# Paths to the extracted key and cert from the client.p12 file
RTCC_CLIENTCERT = "/Path/To/Your/Cert/publicCert.pem"
RTCC_CLIENTCERT_KEY = "/Path/To/Your/Cert/privateKey.pem"

# Password
RTCC_CERTPASSWORD = "abcdefgh"

# RTCC Auth endpoint, Client ID and Secret
RTCC_AUTH_URL = "https://auth.rtccloud.net/auth/"
RTCC_CLIENT_ID = "7a7a7a7a7a8b8b8b8b8b9c9c9c9c9c"
RTCC_CLIENT_SECRET = "19ab19ab19ab19ab28cd28cd28cd28"

class RTCCServlet < WEBrick::HTTPServlet::AbstractServlet

  def initialize(server, *options)
    @client = RTCCAuth.new(RTCC_AUTH_URL, RTCC_CACERT, RTCC_CLIENTCERT, RTCC_CLIENTCERT_KEY, RTCC_CERTPASSWORD, RTCC_CLIENT_ID, RTCC_CLIENT_SECRET)
    super(server, *options)
  end

  def do_GET(request, response)

    # puts "do_GET:#{request}"

    if request.query["uid"]
      uid = request.query["uid"]

      # Set the client and profile identifiers as appropriate for your RTCC installation
      identifier_client = "yourdomain.com";
      id_profile = "premium_recording_plus";

      obj = @client.auth(uid, identifier_client, id_profile)

      # puts "Obj:#{obj}"

      response.status = 200
      response.content_type = "application/json"
      response['Access-Control-Allow-Origin'] = '*'
      response.body = JSON.generate(obj)
    else
      response.status = 500
      response.content_type = "application/json"
      response['Access-Control-Allow-Origin'] = '*'
      response.body = JSON.generate( {"error" => 500, "error_description" => "You did not not provide the correct parameters"} )
    end
  end

end

server = WEBrick::HTTPServer.new(:Port => 8000)
 
server.mount "/gettoken", RTCCServlet
 
trap("INT") {
    server.shutdown
  }

puts "Starting Server on port 8000"
 
server.start

