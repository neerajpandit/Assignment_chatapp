import pool from "../config/db.js";
import bcrypt from "bcrypt";

export const getAllUsersService = async () => {
  const result = await pool.query("SELECT id,name,email,role FROM users");
  return result.rows;
};
export const getUserByIdService = async (id) => {
  const result = await pool.query(
    "SELECT id,name,email,role FROM users where id = $1",
    [id]
  );

  return result.rows[0];
};

export const createUserService = async (name, email,phone_number, password, role) => {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  const result = await pool.query(
    "INSERT INTO users (name, email, phone_number,password,role) VALUES (?, ?, ?, ?, ?)",
    [name, email,phone_number, hashedPassword, role]
  );
  return result[0];
};



export const loginUserService = async (email, password) => {
  const userResult = await pool.query(
    "SELECT id, name, email, password, role FROM users WHERE email = ?",
    [email]
  );

  if (userResult.length === 0) {
    throw new Error("User not found");
  }

  const user = userResult[0];

  // Compare hashed passwords
  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    throw new Error("Invalid credentials");
  }
  return user;
};

export const logoutUserService = async (id) => {
  try {
    const result = await pool.query(
      "UPDATE users SET refresh_token = ? WHERE id = ?",
      [null, id]
    );
    if (result.length === 0) {
      return null;
    }
    return result[0];
  } catch (error) {
    console.error("Error in LogoutUserService:", error.message);
    throw new Error("Database Error while logging out user");
  }
};

export const updateUserService = async (id, name, email) => {
  const result = await pool.query(
    "UPDATE users SET name=COALESCE($1,name), email=COALESCE($2,email) WHERE id=$3 RETURNING *",
    [name, email, id]
  );
  return result.rows[0];
};
export const deleteUserService = async (id) => {
  const result = await pool.query(
    "DELETE FROM users WHERE id = $1 RETURNING *",
    [id]
  );
  return result.rows[0];
};
