'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function signup(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const name = formData.get('name') as string
    const age = parseInt(formData.get('age') as string)

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
