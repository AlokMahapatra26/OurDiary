'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { createClient as createAdminClient } from '@supabase/supabase-js'

export async function logout() {
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/login')
}

export async function updateProfile(formData: FormData) {
    const supabase = await createClient()

    const name = formData.get('name') as string
    const age = parseInt(formData.get('age') as string)

    const { error } = await supabase.auth.updateUser({
        data: { name, age }
    })

    if (error) {
        redirect(`/profile?error=${encodeURIComponent(error.message)}`)
    }

    redirect('/profile?message=Profile updated successfully')
}

export async function deleteAccount() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL

    if (!serviceRoleKey || !supabaseUrl) {
        redirect('/profile?error=Service+role+key+missing.+Cannot+delete+account.')
    }

    const adminClient = createAdminClient(supabaseUrl, serviceRoleKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    })

    const { error } = await adminClient.auth.admin.deleteUser(user.id)

    if (error) {
        redirect(`/profile?error=${encodeURIComponent(error.message)}`)
    }

    await supabase.auth.signOut()
    redirect('/signup?message=Account+deleted')
}
