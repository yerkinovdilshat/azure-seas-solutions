-- Fix security configurations

-- Set OTP expiry to recommended 10 minutes (600 seconds)
UPDATE auth.config 
SET value = '600' 
WHERE parameter = 'OTP_EXPIRY';

-- Enable leaked password protection
UPDATE auth.config 
SET value = 'true' 
WHERE parameter = 'PASSWORD_BREACH_GUARD';

-- If config entries don't exist, insert them
INSERT INTO auth.config (parameter, value) 
SELECT 'OTP_EXPIRY', '600' 
WHERE NOT EXISTS (SELECT 1 FROM auth.config WHERE parameter = 'OTP_EXPIRY');

INSERT INTO auth.config (parameter, value) 
SELECT 'PASSWORD_BREACH_GUARD', 'true' 
WHERE NOT EXISTS (SELECT 1 FROM auth.config WHERE parameter = 'PASSWORD_BREACH_GUARD');