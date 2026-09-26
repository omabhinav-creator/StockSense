const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db');
const otpMap = new Map();
router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password, role = 'manager' } = req.body;
    if (!name || !email || !password || password.length < 8) return res.status(400).json({ success:false, message:'Name, valid email, and password (8+ characters) are required' });
    if (!['manager','staff'].includes(role)) return res.status(400).json({ success:false, message:'Invalid role' });
    const hash = await bcrypt.hash(password, 10);
    const { rows } = await pool.query('INSERT INTO users(name,email,password_hash,role) VALUES($1,$2,$3,$4) RETURNING id,name,email,role', [name.trim(),email.toLowerCase(),hash,role]);
    const user = rows[0]; res.status(201).json({ success:true, token: jwt.sign({id:user.id,role:user.role}, process.env.JWT_SECRET || 'demo-secret'), user });
  } catch (e) { if (e.code === '23505') return res.status(409).json({success:false,message:'Email already registered'}); next(e); }
});
router.post('/login', async (req,res,next) => { try {
 const {email,password}=req.body; if(!email||!password) return res.status(400).json({success:false,message:'Email and password are required'});
 const {rows}=await pool.query('SELECT id,name,email,role,password_hash FROM users WHERE email=$1',[email.toLowerCase()]);
 if(!rows[0]||!(await bcrypt.compare(password,rows[0].password_hash))) return res.status(401).json({success:false,message:'Invalid email or password'});
 const {password_hash,...user}=rows[0]; res.json({success:true,token:jwt.sign({id:user.id,role:user.role},process.env.JWT_SECRET||'demo-secret'),user});
 }catch(e){next(e);} });
router.post('/forgot-password',async(req,res,next)=>{try{const email=(req.body.email||'').toLowerCase();const {rowCount}=await pool.query('SELECT id FROM users WHERE email=$1',[email]);if(!rowCount)return res.status(404).json({success:false,message:'Account not found'});const otp=String(Math.floor(1000+Math.random()*9000));otpMap.set(email,{otp,expires:Date.now()+10*60*1000,verified:false});res.json({success:true,message:'Demo OTP generated. No email or SMS was sent.', ...(process.env.NODE_ENV!=='production'?{demoOtp:otp}:{})});}catch(e){next(e);}});
router.post('/verify-otp',(req,res)=>{const email=(req.body.email||'').toLowerCase(),entry=otpMap.get(email),code=String(req.body.code||req.body.otp||'');if(!entry||entry.expires<Date.now()||entry.otp!==code)return res.status(400).json({success:false,message:'Invalid or expired OTP'});entry.verified=true;res.json({success:true,message:'OTP verified'});});
router.post('/reset-password',async(req,res,next)=>{try{const email=(req.body.email||'').toLowerCase(),entry=otpMap.get(email),password=req.body.newPassword;if(!entry||!entry.verified||entry.expires<Date.now()||String(req.body.code||req.body.otp||'')!==entry.otp)return res.status(400).json({success:false,message:'Verify a valid OTP first'});if(!password||password.length<8)return res.status(400).json({success:false,message:'Password must be at least 8 characters'});await pool.query('UPDATE users SET password_hash=$1 WHERE email=$2',[await bcrypt.hash(password,10),email]);otpMap.delete(email);res.json({success:true,message:'Password updated'});}catch(e){next(e);}});
module.exports=router;
