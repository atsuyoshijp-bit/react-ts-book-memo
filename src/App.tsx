import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import AppHeader from '@/components/AppHeader';
import type { ThemeMode } from '@/components/AppHeader';
import MemoForm from '@/components/MemoForm';
import MemoList from '@/components/MemoList';
import SummaryPanel from '@/components/SummaryPanel';
import { translations } from './i18n';
import type { Language } from './i18n';
import type { BookMemo } from './types';

const STORAGE_KEY = 'book-memos';
const LANGUAGE_STORAGE_KEY = 'book-memo-language';
const THEME_STORAGE_KEY = 'book-memo-theme';

function isLanguage(value: string | null): value is Language {
  return value === 'zh' || value === 'ja' || value === 'en';
}

function isThemeMode(value: string | null): value is ThemeMode {
  return value === 'light' || value === 'dark' || value === 'auto';
}

function loadLanguage(): Language {
  const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);

  if (isLanguage(savedLanguage)) {
    return savedLanguage;
  }

  return 'zh';
}

function loadThemeMode(): ThemeMode {
  const savedThemeMode = localStorage.getItem(THEME_STORAGE_KEY);

  if (isThemeMode(savedThemeMode)) {
    return savedThemeMode;
  }

  return 'auto';
}

function getSystemTheme(): 'light' | 'dark' {
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }

  return 'light';
}

function loadBookMemos(): BookMemo[] {
  const savedMemos = localStorage.getItem(STORAGE_KEY);

  if (!savedMemos) {
    return [];
  }

  return JSON.parse(savedMemos) as BookMemo[];
}

function App() {
  const [bookMemos, setBookMemos] = useState<BookMemo[]>(loadBookMemos);
  const [language, setLanguage] = useState<Language>(loadLanguage);
  const [themeMode, setThemeMode] = useState<ThemeMode>(loadThemeMode);
  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>(getSystemTheme);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [note, setNote] = useState('');

  const isEditing = editingId !== null;
  const selectedTheme = themeMode === 'auto' ? systemTheme : themeMode;
  const t = translations[language];

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookMemos));
  }, [bookMemos]);

  useEffect(() => {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem(THEME_STORAGE_KEY, themeMode);
  }, [themeMode]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    function handleSystemThemeChange(event: MediaQueryListEvent) {
      setSystemTheme(event.matches ? 'dark' : 'light');
    }

    mediaQuery.addEventListener('change', handleSystemThemeChange);

    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
    };
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = selectedTheme;
    document.documentElement.classList.toggle('dark', selectedTheme === 'dark');
  }, [selectedTheme]);

  function resetForm() {
    setEditingId(null);
    setTitle('');
    setAuthor('');
    setNote('');
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedTitle = title.trim();
    const trimmedAuthor = author.trim();
    const trimmedNote = note.trim();

    if (!trimmedTitle || !trimmedAuthor || !trimmedNote) {
      return;
    }

    if (isEditing) {
      setBookMemos(
        bookMemos.map((bookMemo) => {
          if (bookMemo.id !== editingId) {
            return bookMemo;
          }

          return {
            ...bookMemo,
            title: trimmedTitle,
            author: trimmedAuthor,
            note: trimmedNote,
          };
        }),
      );
    } else {
      const newBookMemo: BookMemo = {
        id: Date.now(),
        title: trimmedTitle,
        author: trimmedAuthor,
        note: trimmedNote,
        createdAt: new Date().toLocaleString(),
      };

      setBookMemos([newBookMemo, ...bookMemos]);
    }

    resetForm();
  }

  function handleEdit(bookMemo: BookMemo) {
    setEditingId(bookMemo.id);
    setTitle(bookMemo.title);
    setAuthor(bookMemo.author);
    setNote(bookMemo.note);
  }

  function handleDelete(id: number) {
    setBookMemos(bookMemos.filter((bookMemo) => bookMemo.id !== id));

    if (editingId === id) {
      resetForm();
    }
  }

  return (
    <main className="app-shell">
      <AppHeader
        language={language}
        onLanguageChange={setLanguage}
        onThemeModeChange={setThemeMode}
        themeMode={themeMode}
        t={t}
      />

      <section className="dashboard-grid">
        <div className="dashboard-sidebar">
          <SummaryPanel memoCount={bookMemos.length} t={t} />
        </div>

        <div className="dashboard-main">
          <MemoForm
            author={author}
            isEditing={isEditing}
            note={note}
            onAuthorChange={setAuthor}
            onCancelEdit={resetForm}
            onNoteChange={setNote}
            onSubmit={handleSubmit}
            onTitleChange={setTitle}
            t={t}
            title={title}
          />

          <MemoList bookMemos={bookMemos} onDelete={handleDelete} onEdit={handleEdit} t={t} />
        </div>
      </section>
    </main>
  );
}

export default App;
