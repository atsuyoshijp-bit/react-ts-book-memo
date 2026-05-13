import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { Translation } from '@/i18n';
import type { BookMemo } from '@/types';
import EmptyState from './EmptyState';
import MemoCard from './MemoCard';

type MemoListProps = {
  bookMemos: BookMemo[];
  onDelete: (id: number) => void;
  onEdit: (bookMemo: BookMemo) => void;
  t: Translation;
};

function MemoList({ bookMemos, onDelete, onEdit, t }: MemoListProps) {
  return (
    <Card className="list-card">
      <CardHeader className="memo-list-header">
        <div>
          <CardTitle>{t.allMemos}</CardTitle>
          <CardDescription>{t.listDescription}</CardDescription>
        </div>
        <span className="count-pill">
          {bookMemos.length} {t.countUnit}
        </span>
      </CardHeader>
      <CardContent>
        {bookMemos.length === 0 ? (
          <EmptyState t={t} />
        ) : (
          <ul className="memo-list">
            {bookMemos.map((bookMemo) => (
              <li key={bookMemo.id}>
                <MemoCard bookMemo={bookMemo} onDelete={onDelete} onEdit={onEdit} t={t} />
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

export default MemoList;
