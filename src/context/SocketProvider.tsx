import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

type UserRole = string;

type SocketContextValue = {
  socket: Socket | null;
  userRole: UserRole;
  sendAnnouncement: (message: string) => void;
  sendReminder: (role: UserRole, message: string) => void;
  sendQuestion: (question: { id?: string; text: string } | string) => void;
  sendAnswer: (questionId: string, answer: string) => void;
  requestPolls: () => void;
  createPoll: (question: string, options: string[]) => void;
  votePoll: (pollId: string, optionIndex: number) => void;
  closePoll: (pollId: string) => void;
};

const SocketContext = createContext<SocketContextValue | undefined>(undefined);

type SocketProviderProps = {
  role: UserRole;
  children: React.ReactNode;
};

export const SocketProvider: React.FC<SocketProviderProps> = ({ role, children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const roleRef = useRef<UserRole>(role);
  roleRef.current = role;

  useEffect(() => {
    const url = (import.meta as any).env?.VITE_SOCKET_URL || 'http://localhost:5000';
    const s = io(url, {
      transports: ['websocket'],
      autoConnect: true
    });

    setSocket(s);

    s.on('connect', () => {
      s.emit('joinRole', roleRef.current);
    });

    return () => {
      s.disconnect();
      setSocket(null);
    };
  }, []);

  const value = useMemo<SocketContextValue>(() => ({
    socket,
    userRole: role,
    sendAnnouncement: (message: string) => {
      if (!socket) return;
      socket.emit('sendAnnouncement', message);
    },
    sendReminder: (targetRole: UserRole, message: string) => {
      if (!socket) return;
      socket.emit('sendReminder', { role: targetRole, message });
    },
    sendQuestion: (question: { id?: string; text: string } | string) => {
      if (!socket) return;
      socket.emit('sendQuestion', question);
    },
    sendAnswer: (questionId: string, answer: string) => {
      if (!socket) return;
      socket.emit('sendAnswer', { questionId, answer });
    },
    requestPolls: () => {
      if (!socket) return;
      socket.emit('requestPolls');
    },
    createPoll: (question: string, options: string[]) => {
      if (!socket) return;
      socket.emit('createPoll', { question, options });
    },
    votePoll: (pollId: string, optionIndex: number) => {
      if (!socket) return;
      socket.emit('votePoll', { pollId, optionIndex });
    },
    closePoll: (pollId: string) => {
      if (!socket) return;
      socket.emit('closePoll', { pollId });
    }
  }), [socket, role]);

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = (): SocketContextValue => {
  const ctx = useContext(SocketContext);
  if (!ctx) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return ctx;
};


