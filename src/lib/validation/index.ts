import * as z from "zod"

export const registerFormSchema = z.object({
    username: z.string().min(2, {message: "Username must be at least 2 characters."}),
    email: z.string().email(),
    password: z.string().min(6, {message: 'Password must be at least 6 characters.'})
})

export const signInFormSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6)
})

export const storyFormSchema = z.object({
    writing: z.string()
})