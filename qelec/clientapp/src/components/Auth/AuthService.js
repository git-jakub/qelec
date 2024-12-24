import { jwtDecode } from "jwt-decode"; // Named import

class AuthService {
    static API_URL = process.env.REACT_APP_API_URL;

    // Login method to authenticate the user and store the token
    static async login(email, password) {
        try {
            const response = await fetch(`${this.API_URL}/user/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                throw new Error("Login failed.");
            }

            const data = await response.json();
            console.log("Token received from server:", data.token); // Debug log

            this.setToken(data.token);

            const decodedToken = jwtDecode(data.token); // Decode token to extract user details
            console.log("Decoded token:", decodedToken);

            this.setUserRole(decodedToken.userRole || data.userRole);
            this.setUserId(decodedToken.userId || data.userId);
            this.setUserName(decodedToken.userName || data.userName);

            return data;
        } catch (error) {
            console.error("Error logging in:", error);
            throw error;
        }
    }

    static logout() {
        console.log("Logging out. Clearing token and user info."); // Debug log
        localStorage.removeItem("token");
        localStorage.removeItem("userRole");
        localStorage.removeItem("userId");
        localStorage.removeItem("userName");
    }

    static isAuthenticated() {
        const token = this.getToken();
        console.log("Checking authentication. Retrieved token:", token); // Debug log
        return token && !this.isTokenExpired(token);
    }

    static getUserRole() {
        const role = localStorage.getItem("userRole");
        console.log("Retrieved user role:", role); // Debug log
        return role;
    }

    static getUserId() {
        const userId = localStorage.getItem("userId");
        console.log("Retrieved user ID:", userId); // Debug log
        return userId;
    }

    static getUserName() {
        const userName = localStorage.getItem("userName");
        console.log("Retrieved user name:", userName); // Debug log
        return userName;
    }

    static getToken() {
        const token = localStorage.getItem("token");
        console.log("Retrieving token from localStorage:", token); // Debug log
        return token;
    }

    static setToken(token) {
        console.log("Setting token to localStorage:", token); // Debug log
        localStorage.setItem("token", token);
    }

    static setUserRole(role) {
        console.log("Setting user role:", role); // Debug log
        localStorage.setItem("userRole", role);
    }

    static setUserId(userId) {
        console.log("Setting user ID:", userId); // Debug log
        localStorage.setItem("userId", userId);
    }

    static setUserName(userName) {
        console.log("Setting user name:", userName); // Debug log
        localStorage.setItem("userName", userName);
    }

    static isTokenExpired(token) {
        try {
            const decoded = jwtDecode(token);
            const isExpired = decoded.exp < Date.now() / 1000;
            console.log("Token expiration check:", { exp: decoded.exp, currentTime: Date.now() / 1000, isExpired }); // Debug log
            return isExpired;
        } catch (error) {
            console.error("Failed to decode token or token is invalid:", error);
            return true;
        }
    }
}

export default AuthService;
