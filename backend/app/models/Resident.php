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
                    food_items.*, residents.resident_name, residents.food_items_id, residents.id as id
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

    public function updateResidentData($data) {
        try {
            
            $stmt = $this->pdo->prepare("UPDATE residents 
                                         SET resident_name = :resident_name, 
                                             food_items_id = :food_items_id
                                         WHERE id = :id");
    
            
            $stmt->execute([
                'resident_name' => $data['residentName'],
                'food_items_id' => $data['foodItem'],
                'id' => $data['id']
            ]);
    
            return [
                'success' => true,
                'message' => 'Resident data updated!'
            ];
    
        } catch (PDOException $e) {
            return [
                'success' => false,
                'message' => 'Failed to update resident details: ' . $e->getMessage()
            ];
        }
    }

    public function deleteResidentData($id) {

        try {
            $stmt = $this->pdo->prepare("DELETE FROM residents WHERE id = :id");
    
            $stmt->execute([
                'id' => $id
            ]);
    
            if ($stmt->rowCount() > 0) {
                return [
                    'success' => true,
                    'message' => 'Resident data deleted successfully!'
                ];
            } else {
                return [
                    'success' => false,
                    'message' => 'No resident data found with the provided id.'
                ];
            }
    
        } catch (PDOException $e) {
            return [
                'success' => false,
                'message' => 'Failed to delete resident detail: ' . $e->getMessage()
            ];
        }
    }


    public function insertResidentDataFromCSV($csvData) {
        
        try {
            $this->pdo->beginTransaction();
            $stmt = $this->pdo->prepare("INSERT INTO residents (resident_name, food_items_id) VALUES (:resident_name, :food_items_id)");
            foreach ($csvData['csvData'] as $row) {
                $stmt->execute([
                    'resident_name' => $row['resident_name'],
                    'food_items_id' => $row['food_items_id']
                ]);
            }
            $this->pdo->commit();
    
            return [
                'success' => true,
                'message' => 'CSV of resident details uploaded successfully!'
            ];
        } catch (PDOException $e) {
            $this->pdo->rollBack();
    
            return [
                'success' => false,
                'message' => 'Failed to insert CSV resident details: ' . $e->getMessage()
            ];
        }
    }
}

?>