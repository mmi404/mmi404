/**
 * Name of the backend's session cookie, confirmed from
 * backend/src/main/resources/application.yml (`app.jwt.cookie-name`) and by
 * inspecting the real Set-Cookie header on POST /api/admin/auth/login.
 * Shared by the proxy (route gate) and the admin API client.
 */
export const ADMIN_TOKEN_COOKIE = "ACCESS_TOKEN";
