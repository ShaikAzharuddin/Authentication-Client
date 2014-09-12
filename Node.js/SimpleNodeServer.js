#!/usr/bin/env node

//
// Simple HTTP service illustrating requesting a token from RTCC cloud.
//
// 

var http = require('http');
var url = require('url');
var querystring = require('querystring');
var rtcc_auth = require('./rtcc_auth');

// Path to the RTCC CA Cert
var RTCC_CACERT = "/Path/To/Your/Cert/authCA.crt";

// Paths to the extracted key and cert from the client.p12 file
var RTCC_CLIENTCERT = "/Path/To/Your/Cert/publicCert.pem";
var RTCC_CLIENTCERT_KEY = "/Path/To/Your/Cert/privateKey.pem";

// Password
var RTCC_CERTPASSWORD = "abcdefgh";

// RTCC Auth endpoint, Client ID and Secret
var RTCC_AUTH_URL = "https://auth.rtccloud.net/";
var RTCC_CLIENT_ID = "7a7a7a7a7a8b8b8b8b8b9c9c9c9c9c";
var RTCC_CLIENT_SECRET = "19ab19ab19ab19ab28cd28cd28cd28";


var client = new rtcc_auth(RTCC_AUTH_URL, RTCC_CACERT, RTCC_CLIENTCERT, RTCC_CLIENTCERT_KEY, RTCC_CERTPASSWORD, RTCC_CLIENT_ID, RTCC_CLIENT_SECRET);

var server = http.createServer(function (request, response) {

  var uri = url.parse(request.url);
  var path = uri.pathname;
  var query = uri.query;
  var qparams = querystring.parse(query);

  if (path == "/gettoken") {
    if (qparams["uid"]) {

      var uid = qparams["uid"];

      // Set the client and profile identifiers as appropriate for your RTCC installation
      var identifier_client = "yourdomain.com";
      var id_profile = "premium";

      console.log(["uid", uid, identifier_client, id_profile]);

      // Ask the client for a token
      client.auth(
        uid, identifier_client, id_profile,
        function(result) {
          response.writeHead(200, {'Content-Type' : 'application/json', 'Access-Control-Allow-Origin' : '*'});
          response.write(result);
          response.end();
        },
        function(e) {
          response.writeHead(500, {'Content-Type' : 'text/plain', 'Access-Control-Allow-Origin' : '*'});
          response.write(e);
          response.end();
        });
    }
    else {
      response.writeHead(500, {'Content-Type' : 'application/json', 'Access-Control-Allow-Origin' : '*'});
      response.write(JSON.stringify({ "error" : 500, "error_description" : "You did not provide the correct parameters" }));
      response.end();
    }
  }
  else {
    response.writeHead(404, {'Content-Type' : 'text', 'Access-Control-Allow-Origin' : '*'});
    response.end("Not Found");
  }

  });

console.log("Starting server on port 8000");
server.listen(8000, '0.0.0.0');



