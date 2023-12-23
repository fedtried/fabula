import {
    useMutation, useQuery, useQueryClient
  } from '@tanstack/react-query';
import { createStory, createUserAccount, getRecentStories, getStoryById, getUserStories, signInAccount, signOutAccount } from '../appwrite/api';
import { INewStory, INewUser } from '@/types';
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
  };

export const useGetUserStories = (userId?: string) => {
return useQuery({
    queryKey: [QUERY_KEYS.GET_USER_STORIES, userId],
    queryFn: () => getUserStories(userId),
    enabled: !!userId,
});
};