/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import type { RegisterData, AuthUser } from '../types';

export const SignupPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'participant' | 'organizer' | 'judge'>('participant');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setIsLoading(true);
    
    try {
      // Use centralized API wrapper which throws ApiError on non-2xx responses
  const registerPayload: RegisterData = { name, email, password, role };
  const data = await api.auth.register(registerPayload);

      if (data?.token) {
        // Use auth context to login
  login(data.token, data.user as AuthUser);
        setMessage('Signup successful! Redirecting...');

        // Redirect based on role
        setTimeout(() => {
          if (data.user.role === 'organizer') {
            navigate('/events');
          } else {
            navigate('/dashboard');
          }
        }, 800);
      } else {
        throw new Error('Signup did not return an auth token.');
      }
    } catch (err) {
      // api.ApiError contains details already; normalize messages for UI
      const msg = (err as Error)?.message || 'Signup failed';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-md">
      <Card>
        <CardHeader>
          <CardTitle>Create an account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={onSubmit} className="space-y-4">
            <Input 
              label="Name" 
              placeholder="Your name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
            />
            <Input 
              label="Email" 
              type="email" 
              placeholder="you@example.com" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
            <Input 
              label="Password" 
              type="password" 
              placeholder="••••••••" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="participant">Participant</option>
                <option value="organizer">Organizer</option>
                <option value="judge">Judge</option>
              </select>
            </div>

            <Button type="submit" isLoading={isLoading} className="w-full">
              Sign Up
            </Button>
          </form>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <button 
                onClick={() => navigate('/login')}
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Sign in
              </button>
            </p>
          </div>

          {message && (
            <div className="text-sm text-green-700 bg-green-50 border border-green-200 rounded p-2">
              {message}
            </div>
          )}
          {error && (
            <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded p-2">
              {error}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};


