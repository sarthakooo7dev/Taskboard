import { create } from 'zustand'
import { BoardModalState, BoardStore } from '../types/general.types'

export const useBoardModalStatus = create<BoardModalState>((set) => ({
  open: false,
  openModal: () => set({ open: true }),
  closeModal: () => set({ open: false }),
}))

export const useBoardStore = create<BoardStore>((set) => ({
  currentBoard: null,
  setCurrentBoard: (board) => set({ currentBoard: board }),
}))
