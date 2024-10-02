<?php

require_once dirname(dirname(__FILE__)).'\models\FoodItem.php';

class FoodItemsController {

    public function __construct() {
        // Allow CORS headers for all requests
        header("Access-Control-Allow-Origin: *");
        header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Authorization");

        if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
            exit(0);
        }

    }

    public function saveFoodItems() {
        if ($_SERVER['CONTENT_TYPE'] === 'application/json') {
            $rawData = file_get_contents("php://input");
            $data = json_decode($rawData, true);
            $model = new FoodItem();
            $result = $model->createFoodItems($data);
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

    public function getAllFoodItems(){
        $model = new FoodItem();
        $result = $model->getAllFoodItems();
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

    public function uploadCSVData(){
        if ($_SERVER['CONTENT_TYPE'] === 'application/json') {
            $rawData = file_get_contents("php://input");
            $data = json_decode($rawData, true);
            $model = new FoodItem();
            $result = $model->insertFoodItemsFromCSV($data);
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

    public function updateFoodItems() {
        if ($_SERVER['CONTENT_TYPE'] === 'application/json') {
            $rawData = file_get_contents("php://input");
            $data = json_decode($rawData, true);
            $model = new FoodItem();
            $result = $model->updateFoodItems($data);
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

    public function deleteFoodItems() {
        if ($_SERVER['CONTENT_TYPE'] === 'application/json') {
            $rawData = file_get_contents("php://input");
            $data = json_decode($rawData, true);
            $model = new FoodItem();
            $result = $model->deleteFoodItems($data['row']['id']);
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
    
}

?>
