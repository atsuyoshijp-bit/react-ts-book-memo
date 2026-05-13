import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { Translation } from '@/i18n';
import type { BookMemo } from '@/types';

type MemoCardProps = {
  bookMemo: BookMemo;
  onDelete: (id: number) => void;
  onEdit: (bookMemo: BookMemo) => void;
  t: Translation;
};

function MemoCard({ bookMemo, onDelete, onEdit, t }: MemoCardProps) {
  return (
    <Card className="memo-card">
      <CardContent className="memo-card-content">
        <div className="memo-copy">
          <h3 className="memo-title">{bookMemo.title}</h3>
          <p className="memo-meta">
            {bookMemo.author} · {bookMemo.createdAt}
          </p>
          <p className="memo-note">{bookMemo.note}</p>
        </div>

        <div className="memo-actions">
          <Button variant="secondary" size="sm" onClick={() => onEdit(bookMemo)}>
            {t.edit}
          </Button>
          <Button variant="destructive" size="sm" onClick={() => onDelete(bookMemo.id)}>
            {t.delete}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default MemoCard;
