import { Button } from '@/components/ui/button';
import { languageOptions } from '@/i18n';
import type { Language, Translation } from '@/i18n';

export type ThemeMode = 'light' | 'dark' | 'auto';

const themeOptions: Array<{ code: ThemeMode; label: string; ariaLabel: string }> = [
  { code: 'light', label: '☀︎', ariaLabel: 'Light theme' },
  { code: 'dark', label: '🌙', ariaLabel: 'Dark theme' },
  { code: 'auto', label: 'A', ariaLabel: 'Auto theme' },
];

type AppHeaderProps = {
  language: Language;
  onLanguageChange: (language: Language) => void;
  onThemeModeChange: (themeMode: ThemeMode) => void;
  themeMode: ThemeMode;
  t: Translation;
};

function AppHeader({ language, onLanguageChange, onThemeModeChange, themeMode, t }: AppHeaderProps) {
  return (
    <header className="app-header">
      <div className="top-tools">
        <div className="tool-group" aria-label={t.languageButtonLabel}>
          {languageOptions.map((option) => (
            <Button
              aria-label={option.ariaLabel}
              aria-pressed={option.code === language}
              key={option.code}
              onClick={() => onLanguageChange(option.code)}
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
              onClick={() => onThemeModeChange(option.code)}
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

      <div className="hero-copy">
        <p className="eyebrow">{t.eyebrow}</p>
        <h1 className="page-title">{t.appTitle}</h1>
        <p className="page-description">{t.description}</p>
      </div>
    </header>
  );
}

export default AppHeader;
