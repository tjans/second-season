import { create } from 'zustand'

interface RoleObject {
  RoleId: number;
  Name: string;
}

interface AuthData {
  userName: string;
  userId: string;
  accessToken: string;
  roles: (string | RoleObject)[];
}

interface AppState {
  title: string;
  auth: AuthData | null;
  hasAttemptedAuthRefresh: boolean;
  apiRequestCount: number;
  incrementApiCount: () => void;
  decrementApiCount: () => void;
  setTitle: (newTitle: string) => void;
  setAuth: (auth: AuthData | null) => void;
  setHasAttemptedAuthRefresh: (status?: boolean) => void;
  isApiLoading: () => boolean;
}

const useAppStore = create<AppState>(
  (set, get) => ({
    title: 'Default Title',
    auth: null,
    hasAttemptedAuthRefresh: false,
    apiRequestCount: 0,
    incrementApiCount: () => set({ apiRequestCount: get().apiRequestCount + 1 }),

    decrementApiCount: () => set((state) => ({
      apiRequestCount: Math.max(state.apiRequestCount - 1, 0)
    })),

    setTitle: (newTitle: string) => set({ title: newTitle }),
    setAuth: (auth: AuthData | null) => set({ auth }),
    setHasAttemptedAuthRefresh: (status = true) => set({ hasAttemptedAuthRefresh: status }),
    isApiLoading: () => get().apiRequestCount > 0,
  })
);

export const useTitle = () => useAppStore(state => state.title);

export default useAppStore;
export type { AuthData, AppState };