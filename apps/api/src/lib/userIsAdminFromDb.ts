/** D1/SQLite `is_admin` — strict `=== 1` often fails (type coercion). */
export function userIsAdminFromDb(is_admin: unknown): boolean {
  if (is_admin === true) return true;
  if (is_admin === false || is_admin == null) return false;
  return Number(is_admin) === 1;
}
