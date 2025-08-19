const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/eventhost';
mongoose.connect(MONGODB_URI).then(() => console.log('MongoDB connected')).catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// Models
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['participant', 'organizer', 'judge'], default: 'participant' }
}, { timestamps: true });

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  theme: String,
  type: { type: String, enum: ['online', 'offline', 'hybrid'], default: 'online' },
  startDate: Date,
  endDate: Date,
  registrationDeadline: Date,
  maxParticipants: Number,
  location: String,
  imageUrl: String,
  organizers: [String],
  tracks: [String],
  prizes: [String],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
const Event = mongoose.model('Event', eventSchema);

// Communication models
const announcementSchema = new mongoose.Schema({
  text: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

const questionAnswerSchema = new mongoose.Schema({
  text: { type: String, required: true },
  answeredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true, _id: true });

const questionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  askedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  answers: [questionAnswerSchema]
}, { timestamps: true });

const pollSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: { type: [String], required: true },
  counts: { type: [Number], default: [] },
  isClosed: { type: Boolean, default: false },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

const pollVoteSchema = new mongoose.Schema({
  poll: { type: mongoose.Schema.Types.ObjectId, ref: 'Poll', required: true, index: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  optionIndex: { type: Number, required: true }
}, { timestamps: true });

pollVoteSchema.index({ poll: 1, user: 1 }, { unique: true });

const Announcement = mongoose.model('Announcement', announcementSchema);
const Question = mongoose.model('Question', questionSchema);
const Poll = mongoose.model('Poll', pollSchema);
const PollVote = mongoose.model('PollVote', pollVoteSchema);

// Registration & Teaming models
const eventRegistrationSchema = new mongoose.Schema({
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true, index: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
}, { timestamps: true });

eventRegistrationSchema.index({ event: 1, user: 1 }, { unique: true });

const teamSchema = new mongoose.Schema({
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true, index: true },
  name: { type: String, required: true },
  description: { type: String },
  leader: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true }],
  maxSize: { type: Number, default: 4 },
  isOpen: { type: Boolean, default: true },
  skills: [{ type: String }],
  inviteCode: { type: String, unique: true, index: true },
  track: { type: String }
}, { timestamps: true });

teamSchema.index({ event: 1, name: 1 }, { unique: false });

const EventRegistration = mongoose.model('EventRegistration', eventRegistrationSchema);
const Team = mongoose.model('Team', teamSchema);

// Auth helpers
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';
function signToken(user) {
  return jwt.sign({ id: user._id, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: '7d' });
}
function auth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
}
function requireOrganizer(req, res, next) {
  if (req.user?.role !== 'organizer') return res.status(403).json({ error: 'Organizer role required' });
  next();
}

// Routes
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: 'Missing fields' });
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ error: 'Email already in use' });
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, passwordHash, role: role || 'participant' });
    const token = signToken(user);
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (e) {
    res.status(500).json({ error: 'Signup failed' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
    const token = signToken(user);
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (e) {
    res.status(500).json({ error: 'Login failed' });
  }
});

app.get('/api/events', async (req, res) => {
  const events = await Event.find().sort({ createdAt: -1 }).limit(100);
  res.json(events);
});

app.post('/api/events', auth, requireOrganizer, async (req, res) => {
  try {
    const data = req.body || {};
    const evt = await Event.create({ ...data, createdBy: req.user.id });
    res.status(201).json(evt);
  } catch (e) {
    res.status(400).json({ error: 'Invalid event data' });
  }
});

// Communication: Announcements
app.get('/api/announcements', auth, async (_req, res) => {
  const items = await Announcement.find().sort({ createdAt: -1 }).limit(200).populate('createdBy', 'name role');
  res.json(items);
});

app.post('/api/announcements', auth, requireOrganizer, async (req, res) => {
  try {
    const text = (req.body?.text || '').toString().trim();
    if (!text) return res.status(400).json({ error: 'Text required' });
    const doc = await Announcement.create({ text, createdBy: req.user.id });
    const populated = await doc.populate('createdBy', 'name role');
    io.emit('announcementCreated', populated);
    res.status(201).json(populated);
  } catch (e) {
    res.status(500).json({ error: 'Failed to create announcement' });
  }
});

// Communication: Q&A
app.get('/api/questions', auth, async (_req, res) => {
  const items = await Question.find().sort({ createdAt: -1 })
    .populate('askedBy', 'name role')
    .populate('answers.answeredBy', 'name role');
  res.json(items);
});

app.post('/api/questions', auth, async (req, res) => {
  try {
    const text = (req.body?.text || '').toString().trim();
    if (!text) return res.status(400).json({ error: 'Text required' });
    const doc = await Question.create({ text, askedBy: req.user.id });
    const populated = await doc.populate('askedBy', 'name role');
    io.emit('questionCreated', populated);
    res.status(201).json(populated);
  } catch (e) {
    res.status(500).json({ error: 'Failed to create question' });
  }
});

app.post('/api/questions/:id/answers', auth, requireOrganizer, async (req, res) => {
  try {
    const text = (req.body?.text || '').toString().trim();
    if (!text) return res.status(400).json({ error: 'Text required' });
    const q = await Question.findById(req.params.id);
    if (!q) return res.status(404).json({ error: 'Question not found' });
    q.answers.push({ text, answeredBy: req.user.id });
    await q.save();
    const populated = await Question.findById(q._id)
      .populate('askedBy', 'name role')
      .populate('answers.answeredBy', 'name role');
    io.emit('answerCreated', { questionId: q._id, question: populated });
    res.json(populated);
  } catch (e) {
    res.status(500).json({ error: 'Failed to add answer' });
  }
});

// Communication: Polls
app.get('/api/polls', auth, async (req, res) => {
  const polls = await Poll.find().sort({ createdAt: -1 }).limit(100).lean();
  const pollIds = polls.map(p => p._id);
  const votes = await PollVote.find({ poll: { $in: pollIds }, user: req.user.id }).lean();
  const userVoteMap = new Map(votes.map(v => [v.poll.toString(), v.optionIndex]));
  const withUser = polls.map(p => ({
    ...p,
    userVotedOptionIndex: userVoteMap.get(p._id.toString()) ?? null
  }));
  res.json(withUser);
});

app.post('/api/polls', auth, requireOrganizer, async (req, res) => {
  try {
    const question = (req.body?.question || '').toString().trim();
    const options = Array.isArray(req.body?.options) ? req.body.options.map(o => o.toString().trim()).filter(Boolean) : [];
    if (!question || options.length < 2) return res.status(400).json({ error: 'Question and at least 2 options required' });
    const counts = options.map(() => 0);
    const poll = await Poll.create({ question, options, counts, createdBy: req.user.id });
    io.emit('newPoll', { id: poll._id, question: poll.question, options: poll.options, counts: poll.counts, isClosed: poll.isClosed });
    res.status(201).json(poll);
  } catch (e) {
    res.status(500).json({ error: 'Failed to create poll' });
  }
});

app.post('/api/polls/:id/close', auth, requireOrganizer, async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id);
    if (!poll) return res.status(404).json({ error: 'Poll not found' });
    if (poll.isClosed) return res.json(poll);
    poll.isClosed = true;
    await poll.save();
    io.emit('pollClosed', { id: poll._id });
    res.json(poll);
  } catch (e) {
    res.status(500).json({ error: 'Failed to close poll' });
  }
});

app.post('/api/polls/:id/vote', auth, async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id);
    if (!poll) return res.status(404).json({ error: 'Poll not found' });
    if (poll.isClosed) return res.status(400).json({ error: 'Poll is closed' });
    const optionIndex = Number(req.body?.optionIndex);
    if (!Number.isInteger(optionIndex) || optionIndex < 0 || optionIndex >= poll.options.length) {
      return res.status(400).json({ error: 'Invalid option index' });
    }
    const existing = await PollVote.findOne({ poll: poll._id, user: req.user.id });
    if (existing) return res.status(409).json({ error: 'Already voted' });
    await PollVote.create({ poll: poll._id, user: req.user.id, optionIndex });
    poll.counts[optionIndex] = (poll.counts[optionIndex] || 0) + 1;
    await poll.save();
    io.emit('pollUpdate', { id: poll._id, counts: poll.counts });
    res.json({ ok: true, poll });
  } catch (e) {
    if (e?.code === 11000) {
      return res.status(409).json({ error: 'Already voted' });
    }
    res.status(500).json({ error: 'Failed to vote' });
  }
});

// Registration & Teaming Routes
app.get('/api/events/:eventId/registration', auth, async (req, res) => {
  const ev = await Event.findById(req.params.eventId).lean();
  if (!ev) return res.status(404).json({ error: 'Event not found' });
  const reg = await EventRegistration.findOne({ event: ev._id, user: req.user.id }).lean();
  res.json({ registered: !!reg });
});

app.post('/api/events/:eventId/register', auth, async (req, res) => {
  try {
    const ev = await Event.findById(req.params.eventId);
    if (!ev) return res.status(404).json({ error: 'Event not found' });
    const existing = await EventRegistration.findOne({ event: ev._id, user: req.user.id });
    if (existing) return res.json(existing);
    const reg = await EventRegistration.create({ event: ev._id, user: req.user.id });
    res.status(201).json(reg);
  } catch (e) {
    res.status(500).json({ error: 'Failed to register' });
  }
});

app.get('/api/events/:eventId/registrations', auth, requireOrganizer, async (req, res) => {
  const regs = await EventRegistration.find({ event: req.params.eventId })
    .populate('user', 'name email role')
    .sort({ createdAt: -1 });
  res.json(regs);
});

app.get('/api/events/:eventId/teams', auth, async (req, res) => {
  const teams = await Team.find({ event: req.params.eventId })
    .select('name description maxSize isOpen skills track members leader createdAt inviteCode')
    .lean();
  const mapped = teams.map(t => ({
    _id: t._id,
    name: t.name,
    description: t.description,
    maxSize: t.maxSize,
    isOpen: t.isOpen,
    skills: t.skills || [],
    track: t.track || null,
    memberCount: (t.members?.length || 0) + 1,
    leader: t.leader,
    inviteCode: t.inviteCode
  }));
  res.json(mapped);
});

app.get('/api/events/:eventId/teams/detail', auth, requireOrganizer, async (req, res) => {
  const teams = await Team.find({ event: req.params.eventId })
    .populate('leader', 'name email')
    .populate('members', 'name email')
    .sort({ createdAt: -1 });
  res.json(teams);
});

app.get('/api/me/teams', auth, async (req, res) => {
  const { eventId } = req.query;
  if (!eventId) return res.status(400).json({ error: 'eventId required' });
  const team = await Team.findOne({ event: eventId, $or: [{ leader: req.user.id }, { members: req.user.id }] })
    .populate('leader', 'name email')
    .populate('members', 'name email');
  res.json(team || null);
});

app.post('/api/events/:eventId/teams', auth, async (req, res) => {
  try {
    const ev = await Event.findById(req.params.eventId);
    if (!ev) return res.status(404).json({ error: 'Event not found' });
    const reg = await EventRegistration.findOne({ event: ev._id, user: req.user.id });
    if (!reg) return res.status(403).json({ error: 'Register for the event first' });
    const existingTeam = await Team.findOne({ event: ev._id, $or: [{ leader: req.user.id }, { members: req.user.id }] });
    if (existingTeam) return res.status(409).json({ error: 'Already in a team for this event' });
    const { name, description = '', maxSize = 4, isOpen = true, skills = [], track = '' } = req.body || {};
    if (!name || typeof name !== 'string') return res.status(400).json({ error: 'Team name required' });
    const inviteCode = `TEAM-${Math.random().toString(36).slice(2, 6).toUpperCase()}${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
    const team = await Team.create({
      event: ev._id,
      name: name.toString().trim(),
      description: description.toString(),
      leader: req.user.id,
      members: [],
      maxSize: Math.max(2, Math.min(Number(maxSize) || 4, 10)),
      isOpen: !!isOpen,
      skills: Array.isArray(skills) ? skills.map(s => s.toString()) : [],
      inviteCode,
      track: track ? track.toString() : undefined
    });
    res.status(201).json(team);
  } catch (e) {
    if (e?.code === 11000) return res.status(409).json({ error: 'Duplicate team or invite code' });
    res.status(500).json({ error: 'Failed to create team' });
  }
});

app.post('/api/teams/:teamId/join', auth, async (req, res) => {
  try {
    const team = await Team.findById(req.params.teamId);
    if (!team) return res.status(404).json({ error: 'Team not found' });
    const reg = await EventRegistration.findOne({ event: team.event, user: req.user.id });
    if (!reg) return res.status(403).json({ error: 'Register for the event first' });
    const alreadyInTeam = await Team.findOne({ event: team.event, $or: [{ leader: req.user.id }, { members: req.user.id }] });
    if (alreadyInTeam) return res.status(409).json({ error: 'Already in a team for this event' });
    const currentCount = (team.members?.length || 0) + 1;
    if (!team.isOpen) return res.status(400).json({ error: 'Team is closed' });
    if (currentCount >= team.maxSize) return res.status(400).json({ error: 'Team is full' });
    team.members.push(req.user.id);
    await team.save();
    const populated = await Team.findById(team._id).populate('leader', 'name email').populate('members', 'name email');
    res.json(populated);
  } catch (e) {
    res.status(500).json({ error: 'Failed to join team' });
  }
});

app.post('/api/teams/join-by-code', auth, async (req, res) => {
  try {
    const code = (req.body?.inviteCode || '').toString().trim();
    if (!code) return res.status(400).json({ error: 'inviteCode required' });
    const team = await Team.findOne({ inviteCode: code });
    if (!team) return res.status(404).json({ error: 'Team not found' });
    const reg = await EventRegistration.findOne({ event: team.event, user: req.user.id });
    if (!reg) return res.status(403).json({ error: 'Register for the event first' });
    const alreadyInTeam = await Team.findOne({ event: team.event, $or: [{ leader: req.user.id }, { members: req.user.id }] });
    if (alreadyInTeam) return res.status(409).json({ error: 'Already in a team for this event' });
    const currentCount = (team.members?.length || 0) + 1;
    if (currentCount >= team.maxSize) return res.status(400).json({ error: 'Team is full' });
    team.members.push(req.user.id);
    await team.save();
    const populated = await Team.findById(team._id).populate('leader', 'name email').populate('members', 'name email');
    res.json(populated);
  } catch (e) {
    res.status(500).json({ error: 'Failed to join by code' });
  }
});

app.post('/api/teams/:teamId/leave', auth, async (req, res) => {
  try {
    const team = await Team.findById(req.params.teamId);
    if (!team) return res.status(404).json({ error: 'Team not found' });
    const isLeader = team.leader.toString() === req.user.id;
    if (isLeader) {
      if (team.members.length > 0) {
        team.leader = team.members[0];
        team.members = team.members.slice(1);
        await team.save();
        const populated = await Team.findById(team._id).populate('leader', 'name email').populate('members', 'name email');
        return res.json(populated);
      } else {
        await team.deleteOne();
        return res.json({ deleted: true });
      }
    } else {
      const before = team.members.length;
      team.members = team.members.filter(m => m.toString() !== req.user.id);
      if (team.members.length === before) return res.status(400).json({ error: 'Not a team member' });
      await team.save();
      const populated = await Team.findById(team._id).populate('leader', 'name email').populate('members', 'name email');
      return res.json(populated);
    }
  } catch (e) {
    res.status(500).json({ error: 'Failed to leave team' });
  }
});

// Health
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 5000;

function generateId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

const server = http.createServer(app);
const io = socketIo(server, {
  cors: { origin: "*" } // allow frontend socket connections
});

// In-memory store removed; polls persisted in MongoDB

// Socket.IO logic
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // Join role-based room
  socket.on('joinRole', (role) => {
    socket.join(role);
    socket.data.role = role;
    console.log(`${socket.id} joined role: ${role}`);
  });

  // Legacy real-time events replaced by REST-triggered broadcasts

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });

  // Poll snapshot request: serve from DB
  socket.on('requestPolls', async () => {
    try {
      const all = await Poll.find().sort({ createdAt: -1 }).limit(100).lean();
      const snapshot = all.map(p => ({
        id: p._id,
        question: p.question,
        options: p.options,
        counts: p.counts,
        isClosed: p.isClosed
      }));
      socket.emit('pollsSnapshot', snapshot);
    } catch (e) {
      // noop
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

