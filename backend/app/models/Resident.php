<?php

require_once dirname(dirname(dirname(__FILE__))).'\config\env.php';

class Resident {
    private $pdo;

    public function __construct() {
        $this->pdo = new PDO(DB_DSN, DB_USER, DB_PASSWORD);
    }

    public function getAllResidentData() {
        try {
            $stmt = $this->pdo->prepare("
                SELECT 
                    food_items.*, residents.resident_name
                FROM 
                    residents
                LEFT JOIN 
                    food_items
                ON 
                    residents.food_items_id = food_items.id
            ");
    
            $stmt->execute();
            $residentData = $stmt->fetchAll(PDO::FETCH_ASSOC);
            if(!empty($residentData)){
                return [
                    'success' => true,
                    'data' => $residentData
                ];
            } else {
                return [
                    'success' => false,
                    'message' => 'No data found'
                ];
            }
    
        } catch (PDOException $e) {
            return [
                'success' => false,
                'message' => 'Failed to retrieve resident details: ' . $e->getMessage()
            ];
        }
    }


    public function createResidentData($data) {

        try {
            $stmt = $this->pdo->prepare("INSERT INTO residents (resident_name, food_items_id) VALUES (:resident_name, :food_items_id)");
            $stmt->execute([
                'resident_name' => $data['residentName'],
                'food_items_id' => $data['foodItem'],
            ]);

            return [
                'success' => true,
                'message' => 'Resident added'
            ];

        } catch (PDOException $e) {
            return [
                'success' => false,
                'message' => 'Failed to store resident detail: ' . $e->getMessage()
            ];
        }
    }
}

?>