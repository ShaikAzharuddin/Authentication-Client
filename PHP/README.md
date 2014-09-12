# PHP Client for RTCC

The PHP client for RTCC is a library that can be used on your server to communicate with RTCC back-end services.  Its primary purpose is to enable your server as an authentication provider for RTCC video calls.

The PHP Client is distributed with a demonstration program you can use for testing purposes.

Requirements:

- Php 5.3 or later, compiled with libcurl and ssl support for the library.
- Php 5.5 or later to run the ```gettoken.php``` example using a built-in webserver.

You must obtain Authentication Provider credentials from the RTCC Account Portal.


## Installing the Client

Place the ```lib``` directory in a path reachable by your server.  Place the SSL Certificates (.crt and .p12 files) in a directory that is readable *and* writable by your server.

Include the client in your PHP project.

    require_once("./lib/RTCC_Auth_API_Client.php");


Using the example ```gettoken.php``` as a guide, implement a service for returning a token obtained from the RTCC Cloud.


## Using the Example Server

The PHP client library is distributed with an example sevice that
serves two purposes.  First, it can be used to test your credentials.
Secondly, it can be used to serve tokens to your Javascript or Mobile
clients if you have not yet completed your back-end.

To use the example server, configure ```gettoken.php``` with
the following pieces of information.

| parameter    | description |
|--------------|-------------|
| RTCC_CACERT         | Path to the "authCA.crt" file obtained from the RTCC Account Portal. |
| RTCC_CLIENTP12      | Path to the "client.p12" file obtained from the RTCC Account Portal. |
| RTCC_CERTPASSWORD   | The p12 "passphrase" given to you. |
| RTCC_CLIENT_ID      | The 30 character "Client ID" obtained from the RTCC Account Portal. |
| RTCC_CLIENT_SECRET  | The 30 character secret accompanying the ID above. |
| RTCC_AUTH_URL       | "https://auth.rtccloud.net/auth/" |

You will also need to set these two variables.

| parameter    | description |
|--------------|-------------|
| identifier_client | A domain you registered on the RTCC Account Portal. Each domain identifies a group of users. |
| id_profile        | A profile you registered on the RTCC Account Portal.  This describes a user's capabilities. |

In a production system, you will probably look up the ```uid```, ```identifier_client``` and ```id_profile``` based on a user's session, or from a login and password.  In our example, the ```uid``` is a parameter and the others are constants.

Run the example by starting PHP in the directory in which you placed ```gettoken.php```.  (Note: the built-in server feature of PHP was only introduced in Version 5.3.)

    % php -S localhost:8000


## Testing the Example Server

You can use curl to obtain a token for a user id this way.

    % curl "http://localhost:8000/gettoken.php?uid=test99"

If everything is ok, you will find a JSON object as the response.

    {"token":"lnrsodluk3vmr1087nn1j83i51"}


## More details about the client

In the example, ```gettoken.php```, you will see the following steps for initializing and using the client.  

```php

    $a = new RTCC_Client($RTCC_CACERT, $RTCC_CLIENT_ID, $RTCC_CLIENT_SECRET,
                          $RTCC_CLIENTP12, $RTCC_CERTPASSWORD, $RTCC_AUTH_URL);
    $a->createKeyFile(); 
    $a->createCertFile();
    $a->initWCurl();
    $access_token = $a->sent($uid, $identifier_client, $id_profile);
    echo $access_token;

```

The methods ```createKeyFile``` and ```createCertFile``` return the
paths to two files that are extracted from ```client.p12``` the first
time the client is run.  The extracted components are then written to
disk in the same directory as ```client.p12```.  Make sure that the
script has write-permission to this directory.

## Troubleshooting the Client Installation

If your client is having trouble connecting to RTCC, it may be because of issues with the certificates and keys.  To enable debugging, edit the ```RTCC_Auth_API_Client.php``` and uncomment the following two lines.

    // curl_setopt($this->_curl, CURLOPT_VERBOSE, true);
    // curl_setopt($this->_curl, CURLOPT_CERTINFO, true);

In the example service ```gettoken.php``` you can enable debugging by uncommenting these two lines.

    // ini_set('display_error', 'On'); // debugging
    // error_reporting(E_ALL);


### Error Messages

The list below includes some error messages we have seen along with a diagnosis of their probable cause.

    error setting certificate verify locations:

The path name of RTCC_CACERT is incorrect.

    This P12 not found on this server

The path name of the RTCC_CLIENTP12 is incorrect.

    fopen(/Path/To/client.key): failed to open stream: Permission denied

The directory in which the client.p12 file is placed is not writable by the server.  Check the write permissions on this directory.

    Unable to parse the p12 file.  Is this a .p12 file?  Is the password correct?

You have probably mistyped the RTCC_CERTPASSWORD.

    [MULTITENANT] Api_account or Api_secret invalid for this PKCS12

You have successfully configured the SSL-related parameters, but there is a problem with your RTCC_CLIENT_ID or RTCC_CLIENT_SECRET.  Please double check.

    [MULTITENANT] Provider have not auto-prov domain functionality

You may have specified a domain ("identifier_client") that does not match your provisioning.  Please double check.
