import {
    useMutation, useQuery, useQueryClient
  } from '@tanstack/react-query';
import { createStory, createUserAccount, getPrompt, getRecentStories, getStoryById, getUserById, getUserStories, signInAccount, signOutAccount, updateProfile } from '../appwrite/api';
import { INewStory, INewUser, IUpdateUser } from '@/types';
import { QUERY_KEYS } from './queryKeys';

export const useCreateUseAccount = () => {
    return useMutation({
        mutationFn: (user: INewUser) => createUserAccount(user)
    })
}

export const useSignInAccount = () => {
    return useMutation({
        mutationFn: (user: {
            email: string;
            password: string;
        }) => signInAccount(user)
    })
}

export const useSignOutAccount = () => {
    return useMutation({
      mutationFn: signOutAccount,
    });
};

export const useCreateStory = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (story: INewStory) => createStory(story),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_STORIES]
            })
        }
    })
}

export const useGetStories = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_RECENT_STORIES],
        queryFn: getRecentStories
    })
}

export const useGetStoryByDate = (storyId?: string, userId?: string) => {
    return useQuery({
      queryKey: [QUERY_KEYS.GET_STORY_BY_ID, storyId, userId],
      queryFn: () => getStoryById(storyId, userId),
      enabled: !!storyId && !!userId,
    });
}

export const useGetUserStories = (userId?: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_USER_STORIES, userId],
        queryFn: () => getUserStories(userId),
        enabled: !!userId,
    })
}

export const useGetUserById = (userId: string) => {
    return useQuery({
      queryKey: [QUERY_KEYS.GET_USER_BY_ID, userId],
      queryFn: () => getUserById(userId),
      enabled: !!userId,
    })
}

export const useUpdateUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (user: IUpdateUser) => updateProfile(user),
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_CURRENT_USER],
            });
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_USER_BY_ID, data!.$id],
            });
        },
    });
};


export const useGetPromptByDate = (date: string) => {
    return useQuery({
      queryKey: [QUERY_KEYS.GET_PROMPT, date],
      queryFn: () => getPrompt(date),
      enabled: !!date
    });
}