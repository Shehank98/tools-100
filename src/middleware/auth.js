// Gate admin routes behind a valid session.
export function requireAdmin(req, res, next) {
  if (req.session && req.session.adminId) return next();
  return res.redirect('/admin/login');
}

// Make the logged-in admin available to admin templates.
export function adminLocals(req, res, next) {
  res.locals.admin = req.session ? { id: req.session.adminId, email: req.session.adminEmail } : null;
  next();
}
