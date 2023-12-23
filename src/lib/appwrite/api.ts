import {INewStory, INewUser} from '@/types';
import { account, appwriteConfig, avatars, databases } from './config';
import { ID, Query } from 'appwrite';

export async function createUserAccount(user: INewUser){
    try {
        const newAccount = await account.create(
            ID.unique(),
            user.email,
            user.password,
            user.username
        )

        if (!newAccount) throw Error;

        const avatarUrl = avatars.getInitials(user.username);

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const newUser = await saveUserToDB({
            accountId: newAccount.$id,
            email: newAccount.email,
            username: user.username,
            imageUrl: avatarUrl
        })

        return newAccount
    } catch (error) {
        console.log(error)
        return error;
    }
}

export async function saveUserToDB(user: {
    accountId: string;
    email:string;
    username?: string;
    imageUrl: URL;
}){
    try {
        const newUser = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            ID.unique(),
            user
        )

        return newUser
    } catch (error) {
        console.log(error)
    }
}

export async function signInAccount(user: {
    email: string;
    password:string
}) {
    try {
        const session = await account.createEmailSession(user.email, user.password);
        return session
    } catch (error) {
        console.log(error)
    }
}

export async function getAccount() {
    try {
      const currentAccount = await account.get();

      return currentAccount;
    } catch (error) {
      console.log(error);
    }
  }

export async function getCurrentUser(){
    try {
        const currentAccount = await getAccount();
        if(!currentAccount){
            throw Error
        }

        const currentUser = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal("accountId", currentAccount.$id)]
          );

        if(!currentUser){
            throw Error
        }

        return currentUser.documents[0]
    } catch (error) {
        console.log(error)
    }
}

export async function signOutAccount() {
    try {
      const session = await account.deleteSession("current");

      return session;
    } catch (error) {
      console.log(error);
    }
}

export async function createStory(story: INewStory) {
    try {
        const newStory = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            ID.unique(),
            {
                users: story.userId,
                date: story.date,
                quote: story.quote,
                writing: story.writing
            }
        )

        if(!newStory){
            throw Error
        }

        return newStory
    } catch (error) {
        console.log(error)
    }
}

export async function getRecentStories() {
    const posts = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.postCollectionId,
        [Query.orderDesc(`$createdAt`), Query.limit(20)]
    )
    if(!posts){
        throw Error
    }
    return posts
}

export async function getStoryById(storyId?: string, userId?: string) {
    if (!storyId || !userId) throw Error;

    try {
      const story = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.postCollectionId,
        [Query.equal("date", storyId), Query.equal("users", userId)]
      );
      if(!story){
        return null
      } else {
        return story;
      }
    } catch (error) {
      console.log(error);
    }
}

// ============================== GET USER'S POST
export async function getUserStories(userId?: string) {
    if (!userId) return;

    try {
      const stories = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.postCollectionId,
        [Query.equal("users", userId), Query.orderDesc("$createdAt")]
      );

      if (!stories) throw Error;

      return stories;
    } catch (error) {
      console.log(error);
    }
  }