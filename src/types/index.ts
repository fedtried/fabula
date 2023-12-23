

export type IContextType = {
    user: IUser;
    isLoading: boolean;
    setUser: React.Dispatch<React.SetStateAction<IUser>>;
    isAuthenticated: boolean;
    setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
    checkAuthUser: () => Promise<boolean>;
}

export type IUser = {
    id: string;
    username: string;
    email: string;
    imageUrl: string;
  };

export type INewUser = {
    username: string;
    email: string;
    password: string;
}

export type INavLink = {
    route: string;
    label: string;
}

export type INewStory = {
  date: string;
  quote: string;
  writing: string;
  userId: string;
}