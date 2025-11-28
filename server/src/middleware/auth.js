import jwt from 'jsonwebtoken';
export default function (req,res,next){
  const token = req.headers['x-auth-token'] || req.headers['authorization']?.replace('Bearer ','');
  if (!token) return res.status(401).json({ msg:'No token' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch(e) { return res.status(401).json({ msg:'Token invalid' }); }
}
