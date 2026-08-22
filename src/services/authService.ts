import { UserProfileData } from '../models/types';
import { LOCAL_STORAGE_USER_KEY } from '../config/firebase';

const DEFAULT_USER: UserProfileData = {
  uid: 'usr-987654321',
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '+1 (555) 123-4567',
  location: 'San Francisco, CA',
  photoURL: '',
  joinDate: 'January 15, 2026',
  level: 7,
  xp: 1450,
  totalTrips: 87,
  totalDistance: 1247.5,
  averageScore: 81,
  rank: '#142',
  badges: ['Week Warrior', 'Perfect Score', 'Safety Champion'],
};

class AuthService {
  private currentUser: UserProfileData | null = null;
  private listeners: ((user: UserProfileData | null) => void)[] = [];

  constructor() {
    this.initSession();
  }

  private initSession() {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
      if (saved) {
        this.currentUser = JSON.parse(saved);
      } else {
        this.currentUser = DEFAULT_USER;
        localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(DEFAULT_USER));
      }
    } catch {
      this.currentUser = DEFAULT_USER;
    }
  }

  public getCurrentUser(): UserProfileData | null {
    return this.currentUser;
  }

  public subscribe(callback: (user: UserProfileData | null) => void): () => void {
    this.listeners.push(callback);
    callback(this.currentUser);
    return () => {
      this.listeners = this.listeners.filter((cb) => cb !== callback);
    };
  }

  private notify() {
    this.listeners.forEach((cb) => cb(this.currentUser));
  }

  public async login(email: string, password: string, rememberMe = true): Promise<UserProfileData> {
    await new Promise((resolve) => setTimeout(resolve, 800)); // Smooth loading feedback

    if (!email || !email.includes('@')) {
      throw new Error('Please enter a valid email address.');
    }
    if (!password || password.length < 6) {
      throw new Error('Password must be at least 6 characters long.');
    }

    const existingName = email.split('@')[0].replace('.', ' ');
    const formattedName = existingName.charAt(0).toUpperCase() + existingName.slice(1);

    const user: UserProfileData = {
      ...DEFAULT_USER,
      email,
      name: formattedName || DEFAULT_USER.name,
    };

    this.currentUser = user;
    if (rememberMe) {
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(user));
    }
    this.notify();
    return user;
  }

  public async signUp(name: string, email: string, password: string): Promise<UserProfileData> {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (!name || name.trim().length < 2) {
      throw new Error('Please enter your full name.');
    }
    if (!email || !email.includes('@')) {
      throw new Error('Please enter a valid email address.');
    }
    if (!password || password.length < 6) {
      throw new Error('Password must be at least 6 characters long.');
    }

    const newUser: UserProfileData = {
      ...DEFAULT_USER,
      uid: 'usr-' + Date.now(),
      name,
      email,
      joinDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      totalTrips: 0,
      totalDistance: 0,
      averageScore: 100,
      xp: 100,
      level: 1,
    };

    this.currentUser = newUser;
    localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(newUser));
    this.notify();
    return newUser;
  }

  public async resetPassword(email: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 800));
    if (!email || !email.includes('@')) {
      throw new Error('Please enter a valid email address.');
    }
  }

  public async updateProfile(updated: Partial<UserProfileData>): Promise<UserProfileData> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    if (!this.currentUser) throw new Error('No user authenticated.');

    this.currentUser = {
      ...this.currentUser,
      ...updated,
    };

    localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(this.currentUser));
    this.notify();
    return this.currentUser;
  }

  public async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 600));
    if (!oldPassword) throw new Error('Current password is required.');
    if (newPassword.length < 6) throw new Error('New password must be at least 6 characters.');
  }

  public async logout(): Promise<void> {
    this.currentUser = null;
    localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
    this.notify();
  }
}

export const authService = new AuthService();
