# Node.js Client for RTCC

The Node.js client for RTCC can be used on your server to communicate with RTCC back-end services.  Its primary purpose is to enable your server as an Authentication Provider for RTCC video calls.

The Node.js client is distributed with a simple demonstration server you can use for testing and development purposes.

Requirements:

- Node 0.10.25 or greater
- Openssl - command line tools

You may obtain your Authentication Provider credentials from the RTCC Account Portal.


## Installing the Client

Copy ```rtcc_auth.js``` to your project and include it in your code.


## Preparing the Certificates

You will have received two files from the RTCC Account Portal: ```authCA.crt``` and ```client.p12```.  Place these in a directory that is readable by Node on your server.  If you are using a code repository for your project, it is a good idea to place these files in a location where they are not checked in.

Your ```client.p12``` file is used to verify the identity of your server.  It contains two components: a private key and  public cert.  Before using the Node client, you will need to extract these two components.  Use the commands below.

    openssl pkcs12 -in client.p12 -nocerts -out privateKey.pem
    openssl pkcs12 -in client.p12 -clcerts -nokeys -out publicCert.pem

You will be prompted for a password three times for the first command and
once for the second.  Use the "Passphrase" given to you in all cases



## Using the Example Server

The Node.js client library is distributed with an example server called ```SimpleNodeServer.js```.  This server accepts requests for a given UID and returns a token as a response.  Using this web-method as a guide, it is not too difficult to incorporate the Authentication Client into your own Node.js project.

Configure the following global variables in the example server.


| parameter    | description |
|--------------|-------------|
| RTCC_CACERT         | Path to the "authCA.crt" file obtained from the RTCC Account Portal. |
| RTCC_CLIENTCERT      | Path to the "publicCert.pem" file you extracted earlier. |
| RTCC_CLIENTCERT_KEY  | Path to the "privateKey.pem" file you extracted earlier. |
| RTCC_CERTPASSWORD   | The p12 "passphrase" given to you. |
| RTCC_CLIENT_ID      | The 30 character "Client ID" obtained from the RTCC Account Portal. |
| RTCC_CLIENT_SECRET  | The 30 character secret accompanying the ID above. |
| RTCC_AUTH_URL       | "https://auth.rtccloud.net" |

You must configure the following two variables to match the domain and profile allocated to your project.

| parameter    | description |
|--------------|-------------|
| identifier_client | A domain you registered on the RTCC portal. Each domain identifies a group of users. |
| id_profile        | A profile you registered on the RTCC portal.  This describes a user's capabilities. |


Run the example.  It will start a Node server listening on port 8000.

    % node SimpleNodeServer.js


## Testing the Example Server

You can use curl to obtain a token for a user id this way.

    curl "http://localhost:8000/gettoken?uid=test99"

(You may need to specify IPv4 explicitly if you get a "Connection refused" error.)

    curl -4 "http://localhost:8000/gettoken?uid=test99"

If everything is ok, you will find a JSON object as the response.

    {"token":"lnrsodluk3vmr1087nn1j83i51"}

