import { Card, CardContent } from '@/components/ui/card';
import type { Translation } from '@/i18n';

type SummaryPanelProps = {
  memoCount: number;
  t: Translation;
};

function SummaryPanel({ memoCount, t }: SummaryPanelProps) {
  return (
    <section className="summary-grid" aria-label="Book memo summary">
      <Card className="summary-card summary-card-primary">
        <CardContent className="summary-card-content">
          <span className="summary-label">{t.totalMemos}</span>
          <strong className="summary-value">{memoCount}</strong>
          <span className="summary-caption">{t.countUnit}</span>
        </CardContent>
      </Card>

      <Card className="summary-card">
        <CardContent className="summary-card-content">
          <span className="summary-label">{t.localOnly}</span>
          <p className="summary-description">{t.localOnlyDescription}</p>
        </CardContent>
      </Card>
    </section>
  );
}

export default SummaryPanel;
