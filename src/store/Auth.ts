import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { persist } from 'zustand/middleware';
import { AppwriteException, ID, Models } from 'appwrite';
import { account } from '@/models/client/config';

export interface UserPrefs {
  reputation?: number;
}

interface IAuthStore {
  session: Models.Session | null;
  user: Models.User<UserPrefs> | null;
  jwt: string | null;
  hydrate: boolean;
  setHydreated(): void;
  verifySession(): Promise<void>;
  login(
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: AppwriteException | null }>;
  createAccount(
    email: string,
    password: string,
    name: string
  ): Promise<{ success: boolean; error?: AppwriteException | null }>;
  logout(): Promise<void>;
}

export const useAuthStore = create<IAuthStore>()(
  persist(
    immer((set, get) => ({
      session: null,
      user: null,
      jwt: null,
      hydrate: false,
      setHydreated: () => set({ hydrate: true }),
      verifySession: async () => {
        try {
          const session = await account.getSession('current');
          const user = await account.get();
          set({ session, user });
        } catch (error) {
          console.error('Error verifying session:', error);
        }
      },
      login: async (email, password) => {
        try {
          const session = await account.createEmailPasswordSession(
            email,
            password
          );
          const [user, { jwt }] = await Promise.all([
            account.get<UserPrefs>(),
            account.createJWT(),
          ]);
          if (!user.prefs?.reputation) {
            await account.updatePrefs({ reputation: 0 });
          }
          set({ session, user });
          return { success: true };
        } catch (error) {
          console.error('Error logging in:', error);
          return { success: false, error: error as AppwriteException | null };
        }
      },
      createAccount: async (email, password, name) => {
        try {
          const user = await account.create(ID.unique(), email, password, name);
          const session = await account.createEmailPasswordSession(
            email,
            password
          );
          set({ session, user });
          return { success: true };
        } catch (error) {
          console.error('Error creating account:', error);
          return { success: false, error: error as AppwriteException | null };
        }
      },
      logout: async () => {
        try {
          await account.deleteSessions();
          set({ session: null, user: null });
        } catch (error) {
          console.error('Error logging out:', error);
        }
      },
    })),
    {
      name: 'auth',
      onRehydrateStorage() {
        return (state, error) => {
          if (error) {
            console.error('Error rehydrating auth store:', error);
          } else {
            state?.setHydreated();
          }
        };
      },
    }
  )
);
