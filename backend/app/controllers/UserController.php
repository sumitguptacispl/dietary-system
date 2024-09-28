<?php

require_once dirname(dirname(__FILE__)).'\models\User.php';

class UserController {

    public function __construct() {
        // Allow CORS headers for all requests
        header("Access-Control-Allow-Origin: *");
        header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Authorization");

        // Handle OPTIONS request (for preflight checks)
        if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
            exit(0);
        }

    }

    public function register() {
        if ($_SERVER['CONTENT_TYPE'] === 'application/json') {
            $rawData = file_get_contents("php://input");
            $data = json_decode($rawData, true);
            $model = new User();
            $result = $model->createUser($data);
            if ($result['success']) {
                echo json_encode([
                    'status' => 'success',
                    'message' => $result['message']
                ]);
            } else {
                echo json_encode([
                    'status' => 'error',
                    'message' => $result['message']
                ]);
            }
        }
    }

    public function login(){
        if ($_SERVER['CONTENT_TYPE'] === 'application/json') {
            $rawData = file_get_contents("php://input");
            $data = json_decode($rawData, true);
            $model = new User();
            $result = $model->login($data['email'],$data['password']);
            echo json_encode($result);
        }
    }
}

?>
