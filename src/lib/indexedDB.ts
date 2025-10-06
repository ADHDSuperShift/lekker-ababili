// IndexedDB utilities for offline data storage
const DB_NAME = 'LekkerAbabiliDB';
const DB_VERSION = 1;

export interface LessonContent {
  id: string;
  title: string;
  content: any;
  language: string;
  level: string;
  cached_at: number;
}

export interface OfflineProgress {
  id: string;
  lesson_id: string;
  progress: number;
  completed: boolean;
  timestamp: number;
  synced: boolean;
}

class IndexedDBManager {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Lessons store
        if (!db.objectStoreNames.contains('lessons')) {
          const lessonsStore = db.createObjectStore('lessons', { keyPath: 'id' });
          lessonsStore.createIndex('language', 'language', { unique: false });
          lessonsStore.createIndex('level', 'level', { unique: false });
        }

        // Offline progress store
        if (!db.objectStoreNames.contains('progress')) {
          const progressStore = db.createObjectStore('progress', { keyPath: 'id' });
          progressStore.createIndex('lesson_id', 'lesson_id', { unique: false });
          progressStore.createIndex('synced', 'synced', { unique: false });
        }

        // Settings store
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'key' });
        }
      };
    });
  }

  async cacheLessonContent(lesson: LessonContent): Promise<void> {
    if (!this.db) await this.init();
    
    const transaction = this.db!.transaction(['lessons'], 'readwrite');
    const store = transaction.objectStore('lessons');
    
    lesson.cached_at = Date.now();
    await store.put(lesson);
  }

  async getCachedLessons(language?: string): Promise<LessonContent[]> {
    if (!this.db) await this.init();
    
    const transaction = this.db!.transaction(['lessons'], 'readonly');
    const store = transaction.objectStore('lessons');
    
    if (language) {
      const index = store.index('language');
      return new Promise((resolve, reject) => {
        const request = index.getAll(language);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    }
    
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async saveOfflineProgress(progress: OfflineProgress): Promise<void> {
    if (!this.db) await this.init();
    
    const transaction = this.db!.transaction(['progress'], 'readwrite');
    const store = transaction.objectStore('progress');
    
    progress.timestamp = Date.now();
    progress.synced = false;
    await store.put(progress);
  }

  async getUnsyncedProgress(): Promise<OfflineProgress[]> {
    if (!this.db) await this.init();
    
    const transaction = this.db!.transaction(['progress'], 'readonly');
    const store = transaction.objectStore('progress');
    const index = store.index('synced');
    
    return new Promise((resolve, reject) => {
      const request = index.getAll(false);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async markProgressSynced(progressIds: string[]): Promise<void> {
    if (!this.db) await this.init();
    
    const transaction = this.db!.transaction(['progress'], 'readwrite');
    const store = transaction.objectStore('progress');
    
    for (const id of progressIds) {
      const request = store.get(id);
      request.onsuccess = () => {
        const progress = request.result;
        if (progress) {
          progress.synced = true;
          store.put(progress);
        }
      };
    }
  }

  async clearOldCache(olderThanDays: number = 7): Promise<void> {
    if (!this.db) await this.init();
    
    const cutoff = Date.now() - (olderThanDays * 24 * 60 * 60 * 1000);
    const transaction = this.db!.transaction(['lessons'], 'readwrite');
    const store = transaction.objectStore('lessons');
    
    const request = store.getAll();
    request.onsuccess = () => {
      const lessons = request.result;
      lessons.forEach(lesson => {
        if (lesson.cached_at < cutoff) {
          store.delete(lesson.id);
        }
      });
    };
  }
}

export const indexedDB = new IndexedDBManager();