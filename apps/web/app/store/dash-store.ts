import { create } from 'zustand'

type DashStore = {
  sync: boolean
  setSync: (value: boolean) => void
}

export const useDashboardStore = create<DashStore>((set) => ({
  sync: false,

  setSync: (value) =>
    set({
      sync: value,
    }),
}))
