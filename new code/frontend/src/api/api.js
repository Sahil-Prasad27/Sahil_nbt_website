import axios from 'axios';

const supabaseUrl = 'https://brxbmukalvaqcqwnmvdl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJyeGJtdWthbHZhcWNxd25tdmRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3NjU0ODEsImV4cCI6MjA2ODM0MTQ4MX0.pgf3sPDjA1eoRu8QUGsr9VVUMqR4yanYhvt1aMCQU74';

const API = axios.create({
  baseURL: `${supabaseUrl}/rest/v1`,
  headers: {
    apikey: supabaseAnonKey,
    Authorization: `Bearer ${supabaseAnonKey}`,
    'Content-Type': 'application/json',
  },
});

export default API;