'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function signup(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirm_password') as string
    const name = formData.get('name') as string
    const age = parseInt(formData.get('age') as string)

    if (password !== confirmPassword) {
        redirect(`/signup?error=${encodeURIComponent('Passwords do not match')}`)
    }

    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: { name, age },
            emailRedirectTo: undefined,
        },
    })

    if (error) {
        redirect(`/signup?error=${encodeURIComponent(error.message)}`)
    }

    redirect('/')
}
