import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { languageOptions, translations } from './i18n';
import type { Language } from './i18n';
import type { BookMemo } from './types';

const STORAGE_KEY = 'book-memos';
const LANGUAGE_STORAGE_KEY = 'book-memo-language';
const THEME_STORAGE_KEY = 'book-memo-theme';

type ThemeMode = 'light' | 'dark' | 'auto';

const themeOptions: Array<{ code: ThemeMode; label: string; ariaLabel: string }> = [
  { code: 'light', label: '☀︎', ariaLabel: 'Light theme' },
  { code: 'dark', label: '🌙', ariaLabel: 'Dark theme' },
  { code: 'auto', label: 'A', ariaLabel: 'Auto theme' },
];

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

  function handleCancelEdit() {
    resetForm();
  }

  function handleDelete(id: number) {
    setBookMemos(bookMemos.filter((bookMemo) => bookMemo.id !== id));

    if (editingId === id) {
      resetForm();
    }
  }

  return (
    <main className="app">
      <section className="hero">
        <div className="top-tools">
          <div className="tool-group language-switcher" aria-label={t.languageButtonLabel}>
            {languageOptions.map((option) => (
              <button
                aria-label={option.ariaLabel}
                aria-pressed={option.code === language}
                className={option.code === language ? 'tool-button active' : 'tool-button'}
                key={option.code}
                onClick={() => setLanguage(option.code)}
                title={option.ariaLabel}
                type="button"
              >
                {option.label}
              </button>
            ))}
          </div>

          <div className="tool-group theme-switcher" aria-label="Theme switcher">
            {themeOptions.map((option) => (
              <button
                aria-label={option.ariaLabel}
                aria-pressed={option.code === themeMode}
                className={option.code === themeMode ? 'tool-button active' : 'tool-button'}
                key={option.code}
                onClick={() => setThemeMode(option.code)}
                title={option.ariaLabel}
                type="button"
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <p className="eyebrow">{t.eyebrow}</p>
        <h1>{t.appTitle}</h1>
        <p className="description">{t.description}</p>
      </section>

      <section className="card">
        <h2>{isEditing ? t.editMemoTitle : t.addMemoTitle}</h2>

        <form className="memo-form" onSubmit={handleSubmit}>
          <label>
            {t.titleLabel}
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder={t.titlePlaceholder}
            />
          </label>

          <label>
            {t.authorLabel}
            <input
              value={author}
              onChange={(event) => setAuthor(event.target.value)}
              placeholder={t.authorPlaceholder}
            />
          </label>

          <label>
            {t.noteLabel}
            <textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder={t.notePlaceholder}
              rows={4}
            />
          </label>

          <div className="form-actions">
            <button type="submit">{isEditing ? t.updateMemo : t.saveMemo}</button>

            {isEditing && (
              <button className="secondary-button" type="button" onClick={handleCancelEdit}>
                {t.cancelEdit}
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="card">
        <div className="list-header">
          <h2>{t.allMemos}</h2>
          <span>
            {bookMemos.length} {t.countUnit}
          </span>
        </div>

        {bookMemos.length === 0 ? (
          <p className="empty">{t.emptyMessage}</p>
        ) : (
          <ul className="memo-list">
            {bookMemos.map((bookMemo) => (
              <li className="memo-item" key={bookMemo.id}>
                <div>
                  <h3>{bookMemo.title}</h3>
                  <p className="meta">
                    {bookMemo.author} · {bookMemo.createdAt}
                  </p>
                  <p>{bookMemo.note}</p>
                </div>

                <div className="memo-actions">
                  <button className="edit-button" onClick={() => handleEdit(bookMemo)}>
                    {t.edit}
                  </button>
                  <button className="delete-button" onClick={() => handleDelete(bookMemo.id)}>
                    {t.delete}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

export default App;
