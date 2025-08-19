const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

function generateId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

const app = express();
app.use(cors()); // allow requests from frontend

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

server.listen(5000, () => {
  console.log('Server running on port 5000');
});
