<?php

require_once dirname(dirname(dirname(__FILE__))).'\config\env.php';

class User {
    private $pdo;

    public function __construct() {
        $this->pdo = new PDO(DB_DSN, DB_USER, DB_PASSWORD);
    }

    public function createUser($data) {
        try {
            $stmt = $this->pdo->prepare("INSERT INTO users (name, email, password, phone) VALUES (:name, :email, :password, :phone)");

            $stmt->execute([
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => password_hash($data['password'], PASSWORD_BCRYPT), // Hash the password
                'phone' => $data['phone'],
            ]);

            return [
                'success' => true,
                'message' => 'User successfully registered!'
            ];

        } catch (PDOException $e) {
            return [
                'success' => false,
                'message' => 'Failed to create user: ' . $e->getMessage()
            ];
        }
    }

    public function login($email, $password) {
        try {
            
            $stmt = $this->pdo->prepare("SELECT * FROM users WHERE email = :email");
            $stmt->execute(['email' => $email]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($user) {
                if (password_verify($password, $user['password'])) {
                    return [
                        'success' => true,
                        'message' => 'Logged in successfully',
                        'userData' => [
                            'id' => $user['id'],
                            'name' => $user['name'],
                            'email' => $user['email'],
                            'phone' => $user['phone']
                        ]
                    ];
                } else {
                    return [
                        'success' => false,
                        'message' => 'Invalid password'
                    ];
                }
            } else {
                return [
                    'success' => false,
                    'message' => 'User not found'
                ];
            }

        } catch (PDOException $e) {
            return [
                'success' => false,
                'message' => 'Login failed: ' . $e->getMessage()
            ];
        }
    }


}

?>