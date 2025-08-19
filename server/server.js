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

// In-memory polls store
// poll: { id, question, options, counts, voters(Set of socket.id), isClosed }
const polls = new Map();

// Socket.IO logic
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // Join role-based room
  socket.on('joinRole', (role) => {
    socket.join(role);
    socket.data.role = role;
    console.log(`${socket.id} joined role: ${role}`);
  });

  // Announcements to all
  socket.on('sendAnnouncement', (message) => {
    if (socket.data.role !== 'organizer') {
      return; // ignore if not organizer
    }
    io.emit('receiveAnnouncement', message);
  });

  // Reminders to a specific role
  socket.on('sendReminder', ({ role, message }) => {
    if (socket.data.role !== 'organizer') {
      return; // ignore if not organizer
    }
    io.to(role).emit('receiveReminder', message);
  });

  // Q&A messages
  socket.on('sendQuestion', (payload) => {
    let questionObj;
    if (typeof payload === 'string') {
      questionObj = { id: generateId(), text: payload };
    } else if (payload && typeof payload === 'object') {
      questionObj = { id: payload.id || generateId(), text: payload.text };
    } else {
      return;
    }
    io.emit('receiveQuestion', questionObj);
  });

  socket.on('sendAnswer', ({ questionId, answer }) => {
    if (socket.data.role !== 'organizer') {
      return; // ignore if not organizer
    }
    if (!questionId || !answer) return;
    io.emit('receiveAnswer', { questionId, answer });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });

  // Polls: client can request current polls snapshot
  socket.on('requestPolls', () => {
    const snapshot = Array.from(polls.values()).map(p => ({
      id: p.id,
      question: p.question,
      options: p.options,
      counts: p.counts,
      isClosed: p.isClosed
    }));
    socket.emit('pollsSnapshot', snapshot);
  });

  // Create a new poll (organizer only)
  socket.on('createPoll', (payload) => {
    if (socket.data.role !== 'organizer') return;
    if (!payload || typeof payload !== 'object') return;
    const question = (payload.question || '').toString().trim();
    const options = Array.isArray(payload.options) ? payload.options.map(o => o.toString().trim()).filter(Boolean) : [];
    if (!question || options.length < 2) return;

    const id = payload.id || generateId();
    const poll = {
      id,
      question,
      options,
      counts: options.map(() => 0),
      voters: new Set(),
      isClosed: false
    };
    polls.set(id, poll);
    io.emit('newPoll', { id: poll.id, question: poll.question, options: poll.options, counts: poll.counts, isClosed: poll.isClosed });
  });

  // Vote in a poll
  socket.on('votePoll', ({ pollId, optionIndex }) => {
    const poll = pollId ? polls.get(pollId) : null;
    if (!poll || poll.isClosed) return;
    const index = Number(optionIndex);
    if (Number.isNaN(index) || index < 0 || index >= poll.options.length) return;
    if (poll.voters.has(socket.id)) return; // prevent double vote per socket
    poll.voters.add(socket.id);
    poll.counts[index] += 1;
    io.emit('pollUpdate', { id: poll.id, counts: poll.counts });
  });

  // Close a poll (organizer only)
  socket.on('closePoll', ({ pollId }) => {
    if (socket.data.role !== 'organizer') return;
    const poll = pollId ? polls.get(pollId) : null;
    if (!poll || poll.isClosed) return;
    poll.isClosed = true;
    io.emit('pollClosed', { id: poll.id });
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

