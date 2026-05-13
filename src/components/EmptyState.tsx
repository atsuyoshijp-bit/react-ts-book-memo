import type { Translation } from '@/i18n';

type EmptyStateProps = {
  t: Translation;
};

function EmptyState({ t }: EmptyStateProps) {
  return (
    <div className="empty-state">
      <div className="empty-icon" aria-hidden="true">
        ◌
      </div>
      <h3>{t.emptyTitle}</h3>
      <p>{t.emptyMessage}</p>
    </div>
  );
}

export default EmptyState;
