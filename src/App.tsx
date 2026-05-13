import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
    <main className="app-shell">
      <section className="hero-section">
        <div className="top-tools">
          <div className="tool-group" aria-label={t.languageButtonLabel}>
            {languageOptions.map((option) => (
              <Button
                aria-label={option.ariaLabel}
                aria-pressed={option.code === language}
                key={option.code}
                onClick={() => setLanguage(option.code)}
                size="icon"
                title={option.ariaLabel}
                type="button"
                variant={option.code === language ? 'default' : 'outline'}
              >
                {option.label}
              </Button>
            ))}
          </div>

          <div className="tool-group" aria-label="Theme switcher">
            {themeOptions.map((option) => (
              <Button
                aria-label={option.ariaLabel}
                aria-pressed={option.code === themeMode}
                key={option.code}
                onClick={() => setThemeMode(option.code)}
                size="icon"
                title={option.ariaLabel}
                type="button"
                variant={option.code === themeMode ? 'default' : 'outline'}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>

        <p className="eyebrow">{t.eyebrow}</p>
        <h1 className="page-title">{t.appTitle}</h1>
        <p className="page-description">{t.description}</p>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>{isEditing ? t.editMemoTitle : t.addMemoTitle}</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="memo-form" onSubmit={handleSubmit}>
            <div className="form-field">
              <Label htmlFor="book-title">{t.titleLabel}</Label>
              <Input
                id="book-title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder={t.titlePlaceholder}
              />
            </div>

            <div className="form-field">
              <Label htmlFor="book-author">{t.authorLabel}</Label>
              <Input
                id="book-author"
                value={author}
                onChange={(event) => setAuthor(event.target.value)}
                placeholder={t.authorPlaceholder}
              />
            </div>

            <div className="form-field">
              <Label htmlFor="book-note">{t.noteLabel}</Label>
              <Textarea
                id="book-note"
                value={note}
                onChange={(event) => setNote(event.target.value)}
                placeholder={t.notePlaceholder}
                rows={4}
              />
            </div>

            <div className="form-actions">
              <Button type="submit">{isEditing ? t.updateMemo : t.saveMemo}</Button>

              {isEditing && (
                <Button type="button" variant="secondary" onClick={handleCancelEdit}>
                  {t.cancelEdit}
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="memo-list-header">
          <div>
            <CardTitle>{t.allMemos}</CardTitle>
            <CardDescription>
              {bookMemos.length} {t.countUnit}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          {bookMemos.length === 0 ? (
            <p className="empty-message">{t.emptyMessage}</p>
          ) : (
            <ul className="memo-list">
              {bookMemos.map((bookMemo) => (
                <li key={bookMemo.id}>
                  <Card className="memo-card">
                    <CardContent className="memo-card-content">
                      <div>
                        <h3 className="memo-title">{bookMemo.title}</h3>
                        <p className="memo-meta">
                          {bookMemo.author} · {bookMemo.createdAt}
                        </p>
                        <p className="memo-note">{bookMemo.note}</p>
                      </div>

                      <div className="memo-actions">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleEdit(bookMemo)}
                        >
                          {t.edit}
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(bookMemo.id)}
                        >
                          {t.delete}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </main>
  );
}

export default App;
