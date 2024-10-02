<?php

require_once dirname(dirname(dirname(__FILE__))).'\config\env.php';

class FoodItem {
    private $pdo;

    public function __construct() {
        $this->pdo = new PDO(DB_DSN, DB_USER, DB_PASSWORD);
    }

    public function createFoodItems($data) {

        try {
            $stmt = $this->pdo->prepare("INSERT INTO food_items (name, category, iddsi_level, measurement	) VALUES (:name, :category, :iddsi_level, :measurement)");
            $stmt->execute([
                'name' => $data['foodName'],
                'category' => $data['category'],
                'iddsi_level' => $data['iddsiLevel'],
                'measurement' => !empty($data['textureLevel']) ? $data['textureLevel'] : (!empty($data['consistencyLevel']) ? $data['consistencyLevel'] : '')
            ]);

            return [
                'success' => true,
                'message' => 'Food items stored!'
            ];

        } catch (PDOException $e) {
            return [
                'success' => false,
                'message' => 'Failed to store food items: ' . $e->getMessage()
            ];
        }
    }


    public function getAllFoodItems() {
        try {
            $stmt = $this->pdo->prepare("SELECT * FROM food_items");
            $stmt->execute();
            $foodItems = $stmt->fetchAll(PDO::FETCH_ASSOC);
            if(!empty($foodItems)){
                return [
                    'success' => true,
                    'data' => $foodItems
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
                'message' => 'Failed to retrieve food items: ' . $e->getMessage()
            ];
        }
    }

    public function insertFoodItemsFromCSV($csvData) {
        
        try {
            $this->pdo->beginTransaction();
            $stmt = $this->pdo->prepare("INSERT INTO food_items (name, category, iddsi_level, measurement) VALUES (:name, :category, :iddsi_level, :measurement)");
            foreach ($csvData['csvData'] as $row) {
                $stmt->execute([
                    'name' => $row['foodName'],
                    'category' => $row['category'],
                    'iddsi_level' => $row['iddsiLevel'],
                    'measurement' => $row['measurement']
                ]);
            }
            $this->pdo->commit();
    
            return [
                'success' => true,
                'message' => 'CSV food items uploaded successfully!'
            ];
        } catch (PDOException $e) {
            $this->pdo->rollBack();
    
            return [
                'success' => false,
                'message' => 'Failed to insert CSV food items: ' . $e->getMessage()
            ];
        }
    }

    public function updateFoodItems($data) {

        try {
            
            $stmt = $this->pdo->prepare("UPDATE food_items 
                                         SET name = :name, 
                                             category = :category, 
                                             iddsi_level = :iddsi_level, 
                                             measurement = :measurement 
                                         WHERE id = :id");
    
            
            $stmt->execute([
                'name' => $data['foodName'],
                'category' => $data['category'],
                'iddsi_level' => $data['iddsiLevel'],
                'measurement' => !empty($data['textureLevel']) ? $data['textureLevel'] : (!empty($data['consistencyLevel']) ? $data['consistencyLevel'] : ''),
                'id' => $data['id']
            ]);
    
            return [
                'success' => true,
                'message' => 'Food items updated!'
            ];
    
        } catch (PDOException $e) {
            return [
                'success' => false,
                'message' => 'Failed to update food items: ' . $e->getMessage()
            ];
        }
    }

    public function deleteFoodItems($id) {

        try {
            $stmt = $this->pdo->prepare("DELETE FROM food_items WHERE id = :id");
    
            $stmt->execute([
                'id' => $id
            ]);
    
            if ($stmt->rowCount() > 0) {
                return [
                    'success' => true,
                    'message' => 'Food item deleted successfully!'
                ];
            } else {
                return [
                    'success' => false,
                    'message' => 'No food item found with the provided id.'
                ];
            }
    
        } catch (PDOException $e) {
            return [
                'success' => false,
                'message' => 'Failed to delete food item: ' . $e->getMessage()
            ];
        }
    }

}
?>