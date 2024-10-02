<?php

require_once dirname(dirname(__FILE__)).'\models\Resident.php';

class ResidentController{

    public function __construct() {
        // Allow CORS headers for all requests
        header("Access-Control-Allow-Origin: *");
        header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Authorization");

        if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
            exit(0);
        }

    }

    public function getAllResidentList(){
        $model = new Resident();
        $result = $model->getAllResidentData();
        if ($result['success']) {
            echo json_encode([
                'status' => 'success',
                'data' => $result['data']
            ]);
        } else {
            echo json_encode([
                'status' => 'error',
                'message' => $result['message']
            ]);
        }
    }

    public function saveResidentData(){
        if ($_SERVER['CONTENT_TYPE'] === 'application/json') {
            $rawData = file_get_contents("php://input");
            $data = json_decode($rawData, true);
            $model = new Resident();
            $result = $model->createResidentData($data);
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

    public function updateResidentData() {
        if ($_SERVER['CONTENT_TYPE'] === 'application/json') {
            $rawData = file_get_contents("php://input");
            $data = json_decode($rawData, true);
            $model = new Resident();
            $result = $model->updateResidentData($data);
            if ($result['success'] == true) {
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

    public function deleteResidentData() {
        if ($_SERVER['CONTENT_TYPE'] === 'application/json') {
            $rawData = file_get_contents("php://input");
            $data = json_decode($rawData, true);
            $model = new Resident();
            $result = $model->deleteResidentData($data['row']['id']);
            if ($result['success'] == true) {
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


    public function uploadResidentCSVData(){
        if ($_SERVER['CONTENT_TYPE'] === 'application/json') {
            $rawData = file_get_contents("php://input");
            $data = json_decode($rawData, true);
            $model = new Resident();
            $result = $model->insertResidentDataFromCSV($data);
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
}

?>