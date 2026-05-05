import { create } from 'zustand'
import { BoardModalState } from '../types/general.types'

export const useBoardModalStatus = create<BoardModalState>((set) => ({
  open: false,
  openModal: () => set({ open: true }),
  closeModal: () => set({ open: false }),
}))
