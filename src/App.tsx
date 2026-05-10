import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import type { BookMemo } from './types';

const STORAGE_KEY = 'book-memos';

function loadBookMemos(): BookMemo[] {
  const savedMemos = localStorage.getItem(STORAGE_KEY);

  if (!savedMemos) {
    return [];
  }

  return JSON.parse(savedMemos) as BookMemo[];
}

function App() {
  const [bookMemos, setBookMemos] = useState<BookMemo[]>(loadBookMemos);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [note, setNote] = useState('');

  const isEditing = editingId !== null;

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookMemos));
  }, [bookMemos]);

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
        <p className="eyebrow">LocalStorage Book Memo</p>
        <h1>Book Memo</h1>
        <p className="description">
          记录读过的书和简单笔记。数据保存在浏览器 localStorage 中，刷新页面后仍会保留。
        </p>
      </section>

      <section className="card">
        <h2>{isEditing ? '编辑 Memo' : '新增 Memo'}</h2>

        <form className="memo-form" onSubmit={handleSubmit}>
          <label>
            书名
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="例如：小王子"
            />
          </label>

          <label>
            作者
            <input
              value={author}
              onChange={(event) => setAuthor(event.target.value)}
              placeholder="例如：圣埃克苏佩里"
            />
          </label>

          <label>
            笔记
            <textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="写下你的阅读感想"
              rows={4}
            />
          </label>

          <div className="form-actions">
            <button type="submit">{isEditing ? '更新 Memo' : '保存 Memo'}</button>

            {isEditing && (
              <button className="secondary-button" type="button" onClick={handleCancelEdit}>
                取消编辑
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="card">
        <div className="list-header">
          <h2>全部 Memos</h2>
          <span>{bookMemos.length} 条</span>
        </div>

        {bookMemos.length === 0 ? (
          <p className="empty">还没有 memo，先新增一条吧。</p>
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
                    编辑
                  </button>
                  <button className="delete-button" onClick={() => handleDelete(bookMemo.id)}>
                    删除
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
