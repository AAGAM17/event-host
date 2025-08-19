import React, { useEffect, useMemo, useState } from 'react';
import { useSocket } from '../context/SocketProvider';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

type FeedItem = {
  id: string;
  type: 'announcement' | 'reminder' | 'question';
  text: string;
  meta?: string;
  answers?: Array<{ id: string; text: string }>;
};

export const CommunicationPage: React.FC = () => {
  const { socket, userRole, sendAnnouncement, sendReminder, sendQuestion, sendAnswer, requestPolls, createPoll, votePoll, closePoll } = useSocket();
  const [feed, setFeed] = useState<FeedItem[]>([]);
  const [announcement, setAnnouncement] = useState('');
  const [reminder, setReminder] = useState('');
  const [reminderRole, setReminderRole] = useState<string>('participants');
  const [question, setQuestion] = useState('');
  const [answerDrafts, setAnswerDrafts] = useState<Record<string, string>>({});
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState<string[]>(['', '']);
  const [polls, setPolls] = useState<Array<{ id: string; question: string; options: string[]; counts: number[]; isClosed: boolean }>>([]);

  const isOrganizer = useMemo(() => userRole === 'organizer', [userRole]);

  useEffect(() => {
    if (!socket) return;

    const handleAnnouncement = (message: string) => {
      setFeed(prev => [{ id: crypto.randomUUID(), type: 'announcement', text: message }, ...prev]);
    };
    const handleReminder = (message: string) => {
      setFeed(prev => [{ id: crypto.randomUUID(), type: 'reminder', text: message, meta: `to ${reminderRole}` }, ...prev]);
    };
    const handleQuestion = (q: { id?: string; text: string } | string) => {
      const id = typeof q === 'string' ? crypto.randomUUID() : (q.id ?? crypto.randomUUID());
      const text = typeof q === 'string' ? q : q.text;
      setFeed(prev => [{ id, type: 'question', text, answers: [] }, ...prev]);
    };

    const handleAnswer = ({ questionId, answer }: { questionId: string; answer: string }) => {
      setFeed(prev => prev.map(item => {
        if (item.type === 'question' && item.id === questionId) {
          const existingAnswers = item.answers ?? [];
          return { ...item, answers: [...existingAnswers, { id: crypto.randomUUID(), text: answer }] };
        }
        return item;
      }));
    };

    socket.on('receiveAnnouncement', handleAnnouncement);
    socket.on('receiveReminder', handleReminder);
    socket.on('receiveQuestion', handleQuestion);
    socket.on('receiveAnswer', handleAnswer);
    socket.on('pollsSnapshot', (snapshot) => setPolls(snapshot));
    socket.on('newPoll', (p) => setPolls(prev => [p, ...prev]));
    socket.on('pollUpdate', ({ id, counts }) => setPolls(prev => prev.map(pl => pl.id === id ? { ...pl, counts } : pl)));
    socket.on('pollClosed', ({ id }) => setPolls(prev => prev.map(pl => pl.id === id ? { ...pl, isClosed: true } : pl)));

    return () => {
      socket.off('receiveAnnouncement', handleAnnouncement);
      socket.off('receiveReminder', handleReminder);
      socket.off('receiveQuestion', handleQuestion);
      socket.off('receiveAnswer', handleAnswer);
      socket.off('pollsSnapshot');
      socket.off('newPoll');
      socket.off('pollUpdate');
      socket.off('pollClosed');
    };
  }, [socket]);

  useEffect(() => {
    if (!socket) return;
    requestPolls();
  }, [socket, requestPolls]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {feed.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-gray-600">No messages yet. They will appear here in real time.</CardContent>
            </Card>
          ) : (
            feed.map(item => (
              <Card key={item.id} className={item.type === 'announcement' ? 'border-blue-500' : item.type === 'reminder' ? 'border-amber-500' : 'border-emerald-500'}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {item.type === 'announcement' && <span className="text-blue-600">Announcement</span>}
                    {item.type === 'reminder' && <span className="text-amber-600">Reminder</span>}
                    {item.type === 'question' && <span className="text-emerald-600">Question</span>}
                    {item.meta && <span className="text-gray-500 text-sm">{item.meta}</span>}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div>{item.text}</div>
                  {item.type === 'question' && (
                    <div className="space-y-3">
                      {(item.answers ?? []).length > 0 && (
                        <div className="space-y-2">
                          {(item.answers ?? []).map(ans => (
                            <div key={ans.id} className="rounded-md bg-gray-50 border p-3 text-sm text-gray-700">
                              {ans.text}
                            </div>
                          ))}
                        </div>
                      )}
                      {isOrganizer && (
                        <div className="flex items-center gap-2">
                          <Input
                            placeholder="Write an answer..."
                            value={answerDrafts[item.id] ?? ''}
                            onChange={(e) => setAnswerDrafts(prev => ({ ...prev, [item.id]: e.target.value }))}
                            className="flex-1"
                          />
                          <Button
                            onClick={() => {
                              const text = (answerDrafts[item.id] ?? '').trim();
                              if (!text) return;
                              // Optimistic update
                              setFeed(prev => prev.map(q => {
                                if (q.type === 'question' && q.id === item.id) {
                                  const existing = q.answers ?? [];
                                  return { ...q, answers: [...existing, { id: crypto.randomUUID(), text }] };
                                }
                                return q;
                              }));
                              sendAnswer(item.id, text);
                              setAnswerDrafts(prev => ({ ...prev, [item.id]: '' }));
                            }}
                          >
                            Answer
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}

          {/* Polls List */}
          <Card>
            <CardHeader>
              <CardTitle>Live Polls</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {polls.length === 0 && (
                <div className="text-sm text-gray-600">No polls yet.</div>
              )}
              {polls.map(poll => {
                const total = poll.counts.reduce((a, b) => a + b, 0) || 1;
                return (
                  <div key={poll.id} className="space-y-3">
                    <div className="font-medium">{poll.question}</div>
                    <div className="space-y-2">
                      {poll.options.map((opt, idx) => {
                        const pct = Math.round((poll.counts[idx] / total) * 100);
                        return (
                          <div key={idx} className="border rounded-md p-2">
                            <div className="flex items-center justify-between text-sm">
                              <div>{opt}</div>
                              <div className="text-gray-600">{poll.counts[idx]} ({pct}%)</div>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                              <div className="bg-primary-600 h-2 rounded-full" style={{ width: `${pct}%` }} />
                            </div>
                            {!poll.isClosed && (
                              <div className="mt-2">
                                <Button size="sm" variant="outline" onClick={() => votePoll(poll.id, idx)}>Vote</Button>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    {isOrganizer && !poll.isClosed && (
                      <Button size="sm" variant="ghost" onClick={() => closePoll(poll.id)}>Close Poll</Button>
                    )}
                    {poll.isClosed && <div className="text-xs text-gray-500">Poll closed</div>}
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Announcements</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-3">
              <Input placeholder="Write an announcement..." value={announcement} onChange={(e) => setAnnouncement(e.target.value)} disabled={!isOrganizer} />
              <Button disabled={!isOrganizer} onClick={() => { if (!announcement.trim()) return; sendAnnouncement(announcement.trim()); setAnnouncement(''); }}>Send to all</Button>
              {!isOrganizer && <div className="text-xs text-gray-500">Only organizers can send announcements.</div>}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Reminders</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-3">
              <select
                className="px-3 py-2 border border-gray-300 rounded-md text-sm w-full"
                value={reminderRole}
                onChange={(e) => setReminderRole(e.target.value)}
                disabled={!isOrganizer}
              >
                <option value="participants">participants</option>
                <option value="organizers">organizers</option>
                <option value="judges">judges</option>
              </select>
              <Input placeholder="Reminder message..." value={reminder} onChange={(e) => setReminder(e.target.value)} disabled={!isOrganizer} />
              <Button disabled={!isOrganizer} onClick={() => { if (!reminder.trim()) return; sendReminder(reminderRole, reminder.trim()); setReminder(''); }}>Send to role</Button>
              {!isOrganizer && <div className="text-xs text-gray-500">Only organizers can send reminders.</div>}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ask a Question</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-3">
              <Input placeholder="Type your question..." value={question} onChange={(e) => setQuestion(e.target.value)} />
              <Button variant="outline" onClick={() => { if (!question.trim()) return; const id = crypto.randomUUID(); sendQuestion({ id, text: question.trim() }); setQuestion(''); }}>Post question</Button>
              <div className="text-xs text-gray-500">You are signed in as <span className="font-medium">{userRole}</span></div>
            </CardContent>
          </Card>

          {/* Create Poll (Organizer) */}
          <Card>
            <CardHeader>
              <CardTitle>Create Poll</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-3">
              <Input placeholder="Poll question..." value={pollQuestion} onChange={(e) => setPollQuestion(e.target.value)} disabled={!isOrganizer} />
              <div className="space-y-2">
                {pollOptions.map((opt, idx) => (
                  <Input key={idx} placeholder={`Option ${idx + 1}`} value={opt} onChange={(e) => setPollOptions(prev => prev.map((o, i) => i === idx ? e.target.value : o))} disabled={!isOrganizer} />
                ))}
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => setPollOptions(prev => [...prev, ''])} disabled={!isOrganizer}>Add option</Button>
                <Button size="sm" onClick={() => {
                  const q = pollQuestion.trim();
                  const opts = pollOptions.map(o => o.trim()).filter(Boolean);
                  if (!isOrganizer || !q || opts.length < 2) return;
                  createPoll(q, opts);
                  setPollQuestion('');
                  setPollOptions(['', '']);
                }} disabled={!isOrganizer}>Create</Button>
              </div>
              {!isOrganizer && <div className="text-xs text-gray-500">Only organizers can create polls.</div>}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};


