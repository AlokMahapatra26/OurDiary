import { pgTable, text, timestamp, uuid, date } from 'drizzle-orm/pg-core'

// Shared diaries (one per couple)
export const diaries = pgTable('diaries', {
    id: uuid('id').defaultRandom().primaryKey(),
    name: text('name').notNull(),
    createdBy: uuid('created_by').notNull(), // Supabase user id
    createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Members of a diary (max 2 per diary)
export const diaryMembers = pgTable('diary_members', {
    id: uuid('id').defaultRandom().primaryKey(),
    diaryId: uuid('diary_id').references(() => diaries.id, { onDelete: 'cascade' }).notNull(),
    userId: uuid('user_id').notNull(),
    joinedAt: timestamp('joined_at').defaultNow().notNull(),
})

// Partner invitations
export const invitations = pgTable('invitations', {
    id: uuid('id').defaultRandom().primaryKey(),
    diaryId: uuid('diary_id').references(() => diaries.id, { onDelete: 'cascade' }).notNull(),
    invitedEmail: text('invited_email').notNull(),
    invitedBy: uuid('invited_by').notNull(), // Supabase user id
    status: text('status').notNull().default('pending'), // pending | accepted | declined
    createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Daily diary entries
export const entries = pgTable('entries', {
    id: uuid('id').defaultRandom().primaryKey(),
    diaryId: uuid('diary_id').references(() => diaries.id, { onDelete: 'cascade' }).notNull(),
    userId: uuid('user_id').notNull(),
    content: text('content').notNull(),
    diaryDate: date('diary_date').notNull(), // logical diary date (YYYY-MM-DD)
    createdAt: timestamp('created_at').defaultNow().notNull(),
})
