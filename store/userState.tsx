import {create} from 'zustand'

export const useUserStore = create(() => ({
    username: '',
    userId: '',
    selectedUser: '',
    setUsername: (username: string) => ({username}),
    setUserId: (userId: string) => ({userId}),
    setSelectedUser: (selectedUser: string) => ({selectedUser})
}))