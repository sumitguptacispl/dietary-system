<?php

require_once(dirname(dirname(__FILE__)) . '\core\Router.php');

$router = new Router();

// Define routes with controller and action mappings
$router->add('/register', ['controller' => 'user', 'action' => 'register']);
$router->add('/login', ['controller' => 'user', 'action' => 'login']);
$router->add('/store-food-items', ['controller' => 'foodItems', 'action' => 'saveFoodItems']);
$router->add('/get-all-food-items', ['controller' => 'foodItems', 'action' => 'getAllFoodItems']);
$router->add('/upload-food-items', ['controller' => 'foodItems', 'action' => 'uploadCSVData']);
$router->add('/update-food-items', ['controller' => 'foodItems', 'action' => 'updateFoodItems']);
$router->add('/delete-food-items', ['controller' => 'foodItems', 'action' => 'deleteFoodItems']);


$router->add('/get-all-resident-data', ['controller' => 'resident', 'action' => 'getAllResidentList']);
$router->add('/store-resident-data', ['controller' => 'resident', 'action' => 'saveResidentData']);
$router->add('/update-resident-data', ['controller' => 'resident', 'action' => 'updateResidentData']);
$router->add('/delete-resident-data', ['controller' => 'resident', 'action' => 'deleteResidentData']);
$router->add('/upload-resident-details', ['controller' => 'resident', 'action' => 'uploadResidentCSVData']);
?>
