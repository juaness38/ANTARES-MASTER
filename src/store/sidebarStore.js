// store/sidebarStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useSidebarStore = create(
  persist(
    (set) => ({
      isCollapsed: false,
      userChanged: false,
      setCollapsed: (value) =>
        set({ isCollapsed: value, userChanged: true }),
      toggleCollapsed: () =>
        set((state) => ({
          isCollapsed: !state.isCollapsed,
          userChanged: true,
        })),
      resetUserChanged: () => set({ userChanged: false }),
    }),
    {
      name: 'sidebar-storage',
    }
  )
);

export default useSidebarStore;
