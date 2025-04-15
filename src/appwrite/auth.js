import { Client, Account, ID } from "appwrite";
import conf from "../conf/conf.js";


export class AuthService {
    client = new Client();
    account;
	constructor() {
		this.client
			.setEndpoint(conf.appwriteURL)
			.setProject(conf.appwriteProjectId);
		this.account = new Account(this.client);
    }
    
    async createAccount({email, password, name}) {
        try {
            const response = await this.account.create(ID.unique(), email, password, name);
            if (response) {
                return this.login({email, password});
            }
            else {
                return response;
            }
        } catch (error) {
            console.error("Error creating account:", error);
            throw error;
        }
    }

    async login({email, password}) {
        console.log("🚀 ~ AuthService ~ login ~ email:", email)
        try {
            const response = await this.account.createEmailPasswordSession(email, password);
            // console.log("🚀 ~ AuthService ~ login ~ response:", response)
            if (response) {
                return this.getCurrentUser();
            }
        } catch (error) {
            console.error("Error logging in:", error);
            throw error;
        }
    }

    async getCurrentUser() {
        // console.log("🚀 ~ AuthService ~ getCurrentUser")
        try {
            const response = await this.account.get();
            return response;
        } catch (error) {
            console.log("🚀 ~ AuthService ~ getCurrentUser ~ error:", error)
        }
        return null;
    }

    async logout() {
        try {
            const response = await this.account.deleteSessions();
            return response;
        } catch (error) {
            console.error("Error logging out:", error);
            throw error;
        }
    }
}

const authService = new AuthService();
export default authService;
