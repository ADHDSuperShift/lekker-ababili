import { useEffect, useState } from 'react';
import { supabase, supabaseHelpers } from '../lib/supabase';

export const SupabaseTest = () => {
  const [status, setStatus] = useState<string>('Testing connection...');
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      // Test 1: Check if Supabase client is initialized
      if (!supabase) {
        throw new Error('Supabase client not initialized');
      }
      setStatus('✅ Supabase client initialized');

      // Test 2: Try to get current session
      const { data: { session } } = await supabase.auth.getSession();
      console.log('Session:', session);

      // Test 3: Try to fetch from a table (will fail if schema not set up)
      const { data: lessons, error: lessonsError } = await supabase
        .from('lessons')
        .select('count');
      
      if (lessonsError) {
        console.error('Lessons query error:', lessonsError);
        setError(`Database error: ${lessonsError.message}. Have you run the schema SQL?`);
      } else {
        setStatus('✅ Connected to Supabase! Database is ready.');
      }

    } catch (err: any) {
      console.error('Connection error:', err);
      setError(err.message);
      setStatus('❌ Connection failed');
    }
  };

  const testSignUp = async () => {
    try {
      const testEmail = `test${Date.now()}@example.com`;
      const { data, error } = await supabaseHelpers.signUp(
        testEmail,
        'TestPassword123!',
        'Test User'
      );
      
      if (error) {
        setError(`Sign up error: ${error.message}`);
      } else {
        setStatus('✅ Test sign up successful! Check your Supabase auth dashboard.');
        console.log('Sign up data:', data);
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white p-6 rounded-lg shadow-lg max-w-md border-2 border-gray-200">
      <h3 className="text-lg font-bold mb-4">🔌 Supabase Connection Test</h3>
      
      <div className="space-y-3">
        <div className="p-3 bg-gray-50 rounded">
          <p className="text-sm font-mono">{status}</p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 rounded border border-red-200">
            <p className="text-sm text-red-700">{error}</p>
            <p className="text-xs text-red-600 mt-2">
              Make sure you've run the SQL schema in your Supabase SQL Editor!
            </p>
          </div>
        )}

        <div className="flex gap-2">
          <button
            onClick={testConnection}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
          >
            Test Connection
          </button>
          <button
            onClick={testSignUp}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
          >
            Test Sign Up
          </button>
        </div>

        <div className="text-xs text-gray-500 mt-2">
          <p>URL: {import.meta.env.VITE_SUPABASE_URL?.slice(0, 30)}...</p>
          <p>Key: {import.meta.env.VITE_SUPABASE_ANON_KEY?.slice(0, 20)}...</p>
        </div>
      </div>
    </div>
  );
};

export default SupabaseTest;
