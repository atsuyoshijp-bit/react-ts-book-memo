import type { FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { Translation } from '@/i18n';

type MemoFormProps = {
  author: string;
  isEditing: boolean;
  note: string;
  onAuthorChange: (author: string) => void;
  onCancelEdit: () => void;
  onNoteChange: (note: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onTitleChange: (title: string) => void;
  t: Translation;
  title: string;
};

function MemoForm({
  author,
  isEditing,
  note,
  onAuthorChange,
  onCancelEdit,
  onNoteChange,
  onSubmit,
  onTitleChange,
  t,
  title,
}: MemoFormProps) {
  return (
    <Card className="form-card">
      <CardHeader>
        <CardTitle>{isEditing ? t.editMemoTitle : t.addMemoTitle}</CardTitle>
        <CardDescription>{t.formHint}</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="memo-form" onSubmit={onSubmit}>
          <div className="form-field">
            <Label htmlFor="book-title">{t.titleLabel}</Label>
            <Input
              id="book-title"
              value={title}
              onChange={(event) => onTitleChange(event.target.value)}
              placeholder={t.titlePlaceholder}
            />
          </div>

          <div className="form-field">
            <Label htmlFor="book-author">{t.authorLabel}</Label>
            <Input
              id="book-author"
              value={author}
              onChange={(event) => onAuthorChange(event.target.value)}
              placeholder={t.authorPlaceholder}
            />
          </div>

          <div className="form-field">
            <Label htmlFor="book-note">{t.noteLabel}</Label>
            <Textarea
              id="book-note"
              value={note}
              onChange={(event) => onNoteChange(event.target.value)}
              placeholder={t.notePlaceholder}
              rows={5}
            />
          </div>

          <div className="form-actions">
            <Button type="submit">{isEditing ? t.updateMemo : t.saveMemo}</Button>

            {isEditing && (
              <Button type="button" variant="secondary" onClick={onCancelEdit}>
                {t.cancelEdit}
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export default MemoForm;
