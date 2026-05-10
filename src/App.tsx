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
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [note, setNote] = useState('');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookMemos));
  }, [bookMemos]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const newBookMemo: BookMemo = {
      id: Date.now(),
      title: title.trim(),
      author: author.trim(),
      note: note.trim(),
      createdAt: new Date().toLocaleString(),
    };

    if (!newBookMemo.title || !newBookMemo.author || !newBookMemo.note) {
      return;
    }

    setBookMemos([newBookMemo, ...bookMemos]);
    setTitle('');
    setAuthor('');
    setNote('');
  }

  function handleDelete(id: number) {
    setBookMemos(bookMemos.filter((bookMemo) => bookMemo.id !== id));
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
        <h2>新增 Memo</h2>
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

          <button type="submit">保存 Memo</button>
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
                <button className="delete-button" onClick={() => handleDelete(bookMemo.id)}>
                  删除
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

export default App;
