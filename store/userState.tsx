import {create} from 'zustand'

export const useUserStore = create(() => ({
    username: '',
    selectedUser: '',
    setUsername: (username: string) => ({username}),
    setSelectedUser: (selectedUser: string) => ({selectedUser})
}))