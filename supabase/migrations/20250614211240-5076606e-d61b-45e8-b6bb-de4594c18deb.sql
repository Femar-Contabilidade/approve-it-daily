
DELETE FROM public.users WHERE username = 'admin_temp';
INSERT INTO public.users (username, password_hash, user_type) VALUES (
  'admin_temp',
  '$2b$10$zKDRBBEc22kJOM/UBqnSIuYzNh2ilFzh5BUb0WQZM1BpIudOTcb4C',  -- bcrypt hash de 'senha'
  'admin'
);
