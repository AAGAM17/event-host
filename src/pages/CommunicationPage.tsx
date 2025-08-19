import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input, Textarea } from '../components/ui/Input';
import { useAuth } from '../context/AuthContext';
import { io, Socket } from 'socket.io-client';

const API_BASE = 'http://localhost:5000';

type Announcement = {
  _id: string;
  text: string;
  createdAt: string;
  createdBy: { name: string; role: 'participant' | 'organizer' | 'judge' };
};

type Answer = {
  _id: string;
  text: string;
  createdAt: string;
  answeredBy: { name: string; role: 'participant' | 'organizer' | 'judge' };
};

type Question = {
  _id: string;
  text: string;
  createdAt: string;
  askedBy: { name: string; role: 'participant' | 'organizer' | 'judge' };
  answers: Answer[];
};

type Poll = {
  _id: string;
  question: string;
  options: string[];
  counts: number[];
  isClosed: boolean;
  userVotedOptionIndex?: number | null;
};

export const CommunicationPage: React.FC = () => {
  const { isAuthenticated, isOrganizer } = useAuth();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [newAnnouncement, setNewAnnouncement] = useState('');
  const [newQuestion, setNewQuestion] = useState('');
  const [newPollQ, setNewPollQ] = useState('');
  const [newPollOptions, setNewPollOptions] = useState<string[]>(['', '']);

  const socketRef = useRef<Socket | null>(null);

  const authToken = useMemo(() => localStorage.getItem('auth_token'), []);

  useEffect(() => {
    let cancelled = false;
    async function bootstrap() {
      try {
        setLoading(true);
        const [aRes, qRes, pRes] = await Promise.all([
          fetch(`${API_BASE}/api/announcements`, { headers: authToken ? { Authorization: `Bearer ${authToken}` } : {} }),
          fetch(`${API_BASE}/api/questions`, { headers: authToken ? { Authorization: `Bearer ${authToken}` } : {} }),
          fetch(`${API_BASE}/api/polls`, { headers: authToken ? { Authorization: `Bearer ${authToken}` } : {} })
        ]);
        if (!aRes.ok || !qRes.ok || !pRes.ok) throw new Error('Failed to load communication data');
        const [aData, qData, pData] = await Promise.all([aRes.json(), qRes.json(), pRes.json()]);
        if (!cancelled) {
          setAnnouncements(aData);
          setQuestions(qData);
          setPolls(pData);
        }
      } catch (e: any) {
        if (!cancelled) setError(e.message || 'Failed to load');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    bootstrap();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const socket = io(API_BASE, { transports: ['websocket'] });
    socketRef.current = socket;
    socket.emit('joinRole', isOrganizer ? 'organizer' : 'participant');

    socket.on('announcementCreated', (doc: Announcement) => {
      setAnnouncements(prev => [doc, ...prev]);
    });
    socket.on('questionCreated', (doc: Question) => {
      setQuestions(prev => [doc, ...prev]);
    });
    socket.on('answerCreated', ({ questionId, question }: { questionId: string; question: Question }) => {
      setQuestions(prev => prev.map(q => q._id === questionId ? question : q));
    });
    socket.on('newPoll', (p: any) => {
      const mapped: Poll = { _id: p.id, question: p.question, options: p.options, counts: p.counts, isClosed: !!p.isClosed };
      setPolls(prev => [mapped, ...prev]);
    });
    socket.on('pollUpdate', (p: any) => {
      setPolls(prev => prev.map(x => (x._id === p.id ? { ...x, counts: p.counts } : x)));
    });
    socket.on('pollClosed', (p: any) => {
      setPolls(prev => prev.map(x => (x._id === p.id ? { ...x, isClosed: true } : x)));
    });

    return () => {
      socket.disconnect();
    };
  }, [isOrganizer]);

  const createAnnouncement = async () => {
    try {
      if (!isOrganizer) return;
      const token = localStorage.getItem('auth_token');
      const res = await fetch(`${API_BASE}/api/announcements`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ text: newAnnouncement })
      });
      if (!res.ok) throw new Error('Failed to post announcement');
      setNewAnnouncement('');
    } catch (e: any) {
      setError(e.message || 'Failed to post announcement');
    }
  };

  const askQuestion = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const res = await fetch(`${API_BASE}/api/questions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ text: newQuestion })
      });
      if (!res.ok) throw new Error('Failed to ask question');
      setNewQuestion('');
    } catch (e: any) {
      setError(e.message || 'Failed to ask question');
    }
  };

  const answerQuestion = async (questionId: string, answerText: string, onDone: () => void) => {
    try {
      if (!isOrganizer) return;
      const token = localStorage.getItem('auth_token');
      const res = await fetch(`${API_BASE}/api/questions/${questionId}/answers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ text: answerText })
      });
      if (!res.ok) throw new Error('Failed to answer');
      onDone();
    } catch (e: any) {
      setError(e.message || 'Failed to answer');
    }
  };

  const createPoll = async () => {
    try {
      if (!isOrganizer) return;
      const token = localStorage.getItem('auth_token');
      const filtered = newPollOptions.map(o => o.trim()).filter(Boolean);
      const res = await fetch(`${API_BASE}/api/polls`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ question: newPollQ.trim(), options: filtered })
      });
      if (!res.ok) throw new Error('Failed to create poll');
      setNewPollQ('');
      setNewPollOptions(['', '']);
    } catch (e: any) {
      setError(e.message || 'Failed to create poll');
    }
  };

  const votePoll = async (pollId: string, optionIndex: number) => {
    try {
      const token = localStorage.getItem('auth_token');
      const res = await fetch(`${API_BASE}/api/polls/${pollId}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ optionIndex })
      });
      if (!res.ok) throw new Error('Failed to vote');
      const data = await res.json();
      setPolls(prev => prev.map(p => p._id === pollId ? { ...p, userVotedOptionIndex: optionIndex, counts: data.poll.counts } : p));
    } catch (e: any) {
      setError(e.message || 'Failed to vote');
    }
  };

  const closePoll = async (pollId: string) => {
    try {
      if (!isOrganizer) return;
      const token = localStorage.getItem('auth_token');
      const res = await fetch(`${API_BASE}/api/polls/${pollId}/close`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to close poll');
    } catch (e: any) {
      setError(e.message || 'Failed to close poll');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8">Please login to view communication.</div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">Loading communication...</div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {error && (
        <div className="text-red-600">{error}</div>
      )}

      <section>
        <Card>
          <CardHeader>
            <CardTitle>Announcements</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isOrganizer && (
              <div className="space-y-2">
                <Textarea
                  placeholder="Share an announcement with everyone"
                  value={newAnnouncement}
                  onChange={(e) => setNewAnnouncement(e.target.value)}
                  rows={3}
                />
                <Button onClick={createAnnouncement} disabled={!newAnnouncement.trim()}>Post Announcement</Button>
              </div>
            )}
            <div className="space-y-3">
              {announcements.map(a => (
                <div key={a._id} className="border p-3 rounded-md">
                  <div className="text-sm text-gray-600">{new Date(a.createdAt).toLocaleString()} · {a.createdBy?.name} ({a.createdBy?.role})</div>
                  <div className="mt-1">{a.text}</div>
                </div>
              ))}
              {announcements.length === 0 && <div className="text-sm text-gray-500">No announcements yet.</div>}
            </div>
          </CardContent>
        </Card>
      </section>

      <section>
        <Card>
          <CardHeader>
            <CardTitle>Q&A</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Textarea
                placeholder="Ask a question to organizers"
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                rows={2}
              />
              <Button onClick={askQuestion} disabled={!newQuestion.trim()}>Ask</Button>
            </div>
            <div className="space-y-4">
              {questions.map(q => (
                <div key={q._id} className="border p-3 rounded-md">
                  <div className="text-sm text-gray-600">{new Date(q.createdAt).toLocaleString()} · {q.askedBy?.name} ({q.askedBy?.role})</div>
                  <div className="mt-1 font-medium">{q.text}</div>
                  <div className="mt-2 space-y-2">
                    {q.answers?.map(ans => (
                      <div key={ans._id} className="bg-gray-50 p-2 rounded">
                        <div className="text-sm text-gray-600">{new Date(ans.createdAt).toLocaleString()} · {ans.answeredBy?.name} ({ans.answeredBy?.role})</div>
                        <div>{ans.text}</div>
                      </div>
                    ))}
                  </div>
                  {isOrganizer && (
                    <AnswerBox onSubmit={(text) => answerQuestion(q._id, text, () => {})} />
                  )}
                </div>
              ))}
              {questions.length === 0 && <div className="text-sm text-gray-500">No questions yet.</div>}
            </div>
          </CardContent>
        </Card>
      </section>

      <section>
        <Card>
          <CardHeader>
            <CardTitle>Polls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isOrganizer && (
              <div className="space-y-2 border p-3 rounded-md">
                <Input label="Question" value={newPollQ} onChange={(e) => setNewPollQ(e.target.value)} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {newPollOptions.map((opt, idx) => (
                    <Input key={idx} label={`Option ${idx + 1}`} value={opt} onChange={(e) => {
                      const arr = [...newPollOptions];
                      arr[idx] = e.target.value;
                      setNewPollOptions(arr);
                    }} />
                  ))}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setNewPollOptions(prev => [...prev, ''])}>Add Option</Button>
                  <Button onClick={createPoll} disabled={!newPollQ.trim() || newPollOptions.filter(o => o.trim()).length < 2}>Create Poll</Button>
                </div>
              </div>
            )}
            <div className="space-y-4">
              {polls.map(p => (
                <div key={p._id} className="border p-3 rounded-md">
                  <div className="font-medium mb-2">{p.question}</div>
                  <div className="space-y-2">
                    {p.options.map((opt, idx) => {
                      const total = p.counts.reduce((a, b) => a + b, 0) || 0;
                      const pct = total ? Math.round((p.counts[idx] / total) * 100) : 0;
                      const voted = p.userVotedOptionIndex != null;
                      return (
                        <button
                          key={idx}
                          className={`w-full text-left border rounded p-2 ${voted ? 'bg-gray-50' : 'hover:bg-gray-50'}`}
                          disabled={voted || p.isClosed}
                          onClick={() => votePoll(p._id, idx)}
                        >
                          <div className="flex justify-between">
                            <span>{opt}</span>
                            <span className="text-sm text-gray-600">{p.counts[idx]} {total ? `(${pct}%)` : ''}</span>
                          </div>
                          <div className="mt-1 h-2 bg-gray-200 rounded">
                            <div className="h-2 bg-primary-600 rounded" style={{ width: `${pct}%` }} />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                    <span>{p.isClosed ? 'Closed' : 'Open'}</span>
                    {isOrganizer && !p.isClosed && (
                      <Button size="sm" variant="outline" onClick={() => closePoll(p._id)}>Close</Button>
                    )}
                  </div>
                </div>
              ))}
              {polls.length === 0 && <div className="text-sm text-gray-500">No polls yet.</div>}
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

const AnswerBox: React.FC<{ onSubmit: (text: string) => void }> = ({ onSubmit }) => {
  const [text, setText] = useState('');
  return (
    <div className="mt-3 flex gap-2">
      <Input value={text} onChange={(e) => setText(e.target.value)} placeholder="Write an answer" />
      <Button onClick={() => { if (text.trim()) { onSubmit(text.trim()); setText(''); } }}>Reply</Button>
    </div>
  );
};

export default CommunicationPage;


