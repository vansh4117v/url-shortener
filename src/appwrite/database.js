import { Client, ID, Databases, Storage, Query } from "appwrite";
import conf from "../conf/conf.js";

export class Service {
	client = new Client();
	constructor() {
		this.client
			.setEndpoint(conf.appwriteURL)
			.setProject(conf.appwriteProjectId);
		this.databases = new Databases(this.client);
	}

	async createPost({ shortUrl, longUrl,title, userId }) {
		// console.log("🚀 ~ Service ~ createPost ~ shortUrl:", shortUrl)
		try{
			return await this.databases.createDocument(
			conf.appwriteDatabaseId,
			conf.appwriteCollectionId,
			shortUrl,
			{
				title,
				shortUrl,
				longUrl,
				userId,
			}
			);
		}
		catch (error) {
			if (error.code === 409) {
				return error.code;
			}
			console.log("🚀 ~ Service ~ createPost ~ error:", error)
			
		}
	}

	async deletePost(shortUrl) {
		try {
			await this.databases.deleteDocument(
				conf.appwriteDatabaseId,
				conf.appwriteCollectionId,
				shortUrl
			);
			return true;
		} catch (error) {
			console.error(
				"Error deleting post: ~ Service ~ deletePost ~ error:",
				error
			);
			return false;
		}
	}

	async getPost(shortUrl) {
		try {
			return await this.databases.getDocument(
				conf.appwriteDatabaseId,
				conf.appwriteCollectionId,
				shortUrl
			);
		} catch (error) {
			console.error(
				"Error getting post: ~ Service ~ getPost ~ error:",
				error
			);
			return false;
		}
	}

	async getPosts(queries = [Query.equal("status", "active")], userId) {
		if (userId) {
			queries = [Query.equal("userId", userId)];
		}
		try {
			return await this.databases.listDocuments(
				conf.appwriteDatabaseId,
				conf.appwriteCollectionId,
				queries
			);
		} catch (error) {
			console.error(
				"Error getting all posts: ~ Service ~ getPosts ~ error:",
				error
			);
			return false;
		}
	}
}

const service = new Service();
export default service;
