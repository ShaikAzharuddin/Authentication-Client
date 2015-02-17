<?php

// Usage:
//  php -S localhost:8000
//
// Tested with PHP 5.5

// DEBUGGING FLAGS

// ini_set('display_error', 'On');
// error_reporting(E_ALL);

// Path to the RTCC CA Cert and client.p12 file
$RTCC_CACERT = "/Path/To/Your/Cert/authCA.crt";
$RTCC_CLIENTP12 = "/Path/To/Your/Cert/client.p12";

// Use the following if you place your certs in a directory named 'certs' that is a subdirectory of this directory
// $RTCC_CACERT = __DIR__.DIRECTORY_SEPARATOR."certs".DIRECTORY_SEPARATOR."authCA.crt";
// $RTCC_CLIENTP12 = __DIR__.DIRECTORY_SEPARATOR."certs".DIRECTORY_SEPARATOR."client.p12";

// Password
$RTCC_CERTPASSWORD = "abcdefgh";

// RTCC Auth endpoint, Client ID and Secret
$RTCC_AUTH_URL = "https://auth.rtccloud.net/auth/";
$RTCC_CLIENT_ID = "7a7a7a7a7a8b8b8b8b8b9c9c9c9c9c";
$RTCC_CLIENT_SECRET = "19ab19ab19ab19ab28cd28cd28cd28";

// Include RTCC Auth Client File
require_once("./lib/RTCC_Auth_API_Client.php");


// Get the uid from the query parameters
$uid = $_GET['uid'];

// Set the client and profile identifiers as appropriate for your RTCC installation
$identifier_client = "yourdomain.com";
$id_profile = "premium_recording_plus";

error_log("Got UID: " . $uid);

// Create a RTCC_Client object instance with correct parameters
//
// client_id = Auth API_KEY provided for RTCC
// client_secret = Auth Secret provided for RTCC
// p12_file = path to the client.p12 file
// p12_passphrase = passphrase of the client.p12 file
// auth_url = URL of RTCC Auth server API
//

try {
    $a = new RTCC_Client($RTCC_CACERT, $RTCC_CLIENT_ID, $RTCC_CLIENT_SECRET, $RTCC_CLIENTP12, $RTCC_CERTPASSWORD, $RTCC_AUTH_URL);

    // Created KEY file from P12
    $a->createKeyFile();

    // Create PEM file from P12
    $a->createCertFile();

    // Init Curl
    $a->initWCurl();

    // Get token access
    $access_token = $a->sent($uid, $identifier_client, $id_profile);

    header('Access-Control-Allow-Origin: *');
    echo $access_token;
}
catch(Exception $e) {
    $message = $e->getMessage();
    error_log($message);
    header('Access-Control-Allow-Origin: *');
    echo "{ \"error\" : \Error\", \"error_description\" : \"".$message."\"}";
}
?>