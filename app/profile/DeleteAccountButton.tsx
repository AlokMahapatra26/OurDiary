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
                variant="ghost"
                pendingText="Deleting..."
                className="w-full text-[10px] text-muted-foreground/50 hover:text-destructive hover:bg-destructive/5 !font-normal transition-all"
            >
                Permanently delete account
            </SubmitButton>
        </form>
    )
}
