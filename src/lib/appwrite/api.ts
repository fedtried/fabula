import {INewStory, INewUser, IUpdateUser} from '@/types';
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

export async function updateProfile(user: IUpdateUser) {
    if(!user) return;

    try {
        const currentUserDetails = await getCurrentUser()
        if(!currentUserDetails) throw Error

        if(currentUserDetails.username !== user.username){
            const newUsername = account.updateName(user.username)
            if(!newUsername) throw Error
        }


        const updatedUser = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            user.userId,
            {
               username: user.username
            }
        )
        // if(currentUserDetails.email !== user.email){
        //     const newUsername = account.updateEmail(user.email, user.password)
        //     if(!newUsername) throw Error
        // }
        return updatedUser
    } catch (error) {
        console.log(error)
    }
}

export async function getUserById(userId: string) {
    try {
      const user = await databases.getDocument(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        userId
      );

      if (!user) throw Error;

      return user;
    } catch (error) {
      console.log(error);
    }
}

export async function deleteFromUserDatabase(userId: string){
    try {
        const deletedUser = databases.deleteDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            userId
        )
        return deletedUser
    } catch (error) {
        console.log(error)
    }
}

export async function deleteUser(userId: string){
    try {
        const identity = await account.get();
        const deletedUser = await account.deleteIdentity(identity.$id)

        if(!deletedUser) throw Error

        const user = await getUserById(userId)

        const deleteFromDB = await deleteFromUserDatabase(user!.$id)

        if(!deleteFromDB) throw Error

        return deletedUser
    } catch (error) {
        console.log(error)
    }
}

export async function getPrompt(date:string){
    try {
        const prompt = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.promptCollectionId,
            [Query.equal("date", date)]
          );

        if (!prompt) throw Error;
        return prompt.documents[0].prompt;
    } catch (error) {
        console.log(error)
    }
}