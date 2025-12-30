package com.assuredfarming.app.util;

import java.sql.*;

public class JDBCConnection {
    private static final String URL = "jdbc:mysql://localhost:3306/assured_contract_farming";
    private static final String USER = "root";
    private static final String PASSWORD = "Soham";

    public static Connection getConnection() {
        Connection connection = null;
        try {
            // Load MySQL JDBC Driver
            Class.forName("com.mysql.cj.jdbc.Driver");

            // Establish connection
            connection = DriverManager.getConnection(URL, USER, PASSWORD);
            System.out.println("Connected to MySQL database successfully!");

            PreparedStatement pstmt = connection.prepareStatement("SELECT * FROM users where user_id=1");
            ResultSet rs = pstmt.executeQuery();

//                while (rs.next()) {
//                    int id = rs.getInt("id");
//                    String name = rs.getString("name");
//                    int age = rs.getInt("age");
//                    System.out.println("ID: " + id + ", Name: " + name + ", Age: " + age);
//                }
            if (rs.next()) { // Check if a row exists
                int id = rs.getInt("user_id");
                String name = rs.getString("name");
                System.out.println("ID: " + id + ", Name: " + name);
            } else {
                System.out.println("No rows found in the result set.");
            }
        System.out.println("outut : " + rs);
            } catch (ClassNotFoundException e) {
            System.out.println("MySQL JDBC Driver not found.");
            e.printStackTrace();
        } catch (SQLException e) {
            System.out.println("Connection failed!");
            e.printStackTrace();
        }
        return connection;
    }

        // Optional: Test connection
    public static void main(String[] args) {
        Connection conn = getConnection();
        if (conn != null) {
            System.out.println("Connection is working!");
        }
    }
}
