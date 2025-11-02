import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Function to fetch user profile using .then()
    const fetchUserProfile = (user) => {
      if (!user) {
        setUserProfile(null);
        return;
      }
      supabase
        .from('users')
        .select('subscription_status')
        .eq('id', user.id)
        .single()
        .then(({ data, error }) => {
          if (error && error.code !== 'PGRST116') {
            console.error("Error fetching user profile:", error);
            setUserProfile({ subscription_status: 'free' });
          } else if (data) {
            setUserProfile(data);
          } else {
            setUserProfile({ subscription_status: 'free' });
          }
        })
        .catch(e => {
            console.error("Exception fetching user profile:", e);
            setUserProfile({ subscription_status: 'free' });
        });
    };

    // Initial load
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      fetchUserProfile(session?.user);
      setLoading(false);
    });

    // Set up listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      fetchUserProfile(session?.user);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const value = {
    session,
    user: session?.user,
    userProfile,
    loading,
    logout: () => supabase.auth.signOut(),
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}