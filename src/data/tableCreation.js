import pool from '../config/db.js';

export async function createTables() {

    const userDetailsQuery =`
        CREATE TABLE IF NOT EXISTS users (
            id INT PRIMARY KEY AUTO_INCREMENT,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(150) UNIQUE NOT NULL,
            phone_number VARCHAR(15) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            role ENUM('Teacher', 'Student', 'Institute') NOT NULL,
            refresh_token TEXT,
            refresh_token_expires_at TIMESTAMP,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        );

    `;

    const messageDetailsQuery = `
        CREATE TABLE IF NOT EXISTS messages (
            id INT PRIMARY KEY AUTO_INCREMENT,
            sender_id INT NOT NULL,
            receiver_id INT NOT NULL,
            content TEXT NOT NULL,
            reply_to INT DEFAULT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (reply_to) REFERENCES messages(id) ON DELETE CASCADE
        );
    `;



    try {
        await pool.query(userDetailsQuery); // Create userprofiles first
        await pool.query(messageDetailsQuery); // Then create messages

        console.log('Tables created successfully');
    } catch (error) {
        console.error('Error creating tables:', error.stack);
    }
}



