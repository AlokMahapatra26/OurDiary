'use client'

import { deleteAccount } from './actions'
import { SubmitButton } from '@/components/ui/SubmitButton'

export default function DeleteAccountButton() {
    return (
        <form action={deleteAccount} onSubmit={(e) => {
            if (!confirm('Are you sure? This will permanently delete your account.')) {
                e.preventDefault();
            }
        }}>
            <SubmitButton
                iconName="trash"
                pendingText="Deleting..."
                className="w-full bg-red-50 text-red-400 rounded-xl px-4 py-2 text-xs font-medium hover:bg-red-100 transition-colors cursor-pointer"
            >
                Delete account
            </SubmitButton>
        </form>
    )
}
