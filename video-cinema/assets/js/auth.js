const AUTH_CONFIG_KEY = 'video-cinema:auth-config';
const SESSION_KEY = 'video-cinema:session';

const DEFAULT_AUTH = {
  username: 'wzj',
  password: 'wzj',
  recoveryPhone: '15708455980',
};

function readConfig() {
  try {
    const raw = localStorage.getItem(AUTH_CONFIG_KEY);
    if (!raw) return { ...DEFAULT_AUTH };
    return { ...DEFAULT_AUTH, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_AUTH };
  }
}

function writeConfig(config) {
  localStorage.setItem(AUTH_CONFIG_KEY, JSON.stringify(config));
}

export function initAuthStore() {
  if (!localStorage.getItem(AUTH_CONFIG_KEY)) {
    writeConfig({ ...DEFAULT_AUTH });
  }
}

export function isLoggedIn() {
  try {
    return Boolean(sessionStorage.getItem(SESSION_KEY));
  } catch {
    return false;
  }
}

export function getCurrentUser() {
  if (!isLoggedIn()) return null;
  try {
    const session = JSON.parse(sessionStorage.getItem(SESSION_KEY) || '{}');
    return session.username || readConfig().username;
  } catch {
    return readConfig().username;
  }
}

/** @param {string} username @param {string} password */
export function login(username, password) {
  const config = readConfig();
  const user = username.trim();
  const pass = password;
  if (user === config.username && pass === config.password) {
    sessionStorage.setItem(
      SESSION_KEY,
      JSON.stringify({ username: config.username, loggedInAt: new Date().toISOString() }),
    );
    return { ok: true };
  }
  return { ok: false, message: '账号或密码错误' };
}

export function logout() {
  sessionStorage.removeItem(SESSION_KEY);
}

/** @param {string} oldPassword @param {string} newPassword */
export function changePassword(oldPassword, newPassword) {
  if (!isLoggedIn()) return { ok: false, message: '请先登录' };
  const config = readConfig();
  if (oldPassword !== config.password) {
    return { ok: false, message: '当前密码不正确' };
  }
  if (!newPassword || newPassword.length < 3) {
    return { ok: false, message: '新密码至少 3 位' };
  }
  if (oldPassword === newPassword) {
    return { ok: false, message: '新密码不能与当前密码相同' };
  }
  writeConfig({ ...config, password: newPassword });
  return { ok: true, message: '密码修改成功' };
}

/** @param {string} phone @param {string} newPassword */
export function resetPasswordByPhone(phone, newPassword) {
  const config = readConfig();
  const normalized = phone.replace(/\s+/g, '');
  if (normalized !== config.recoveryPhone) {
    return { ok: false, message: '验证手机号不正确' };
  }
  if (!newPassword || newPassword.length < 3) {
    return { ok: false, message: '新密码至少 3 位' };
  }
  writeConfig({ ...config, password: newPassword });
  return { ok: true, message: '密码已重置，请使用新密码登录' };
}

export function getRecoveryPhoneHint() {
  const phone = readConfig().recoveryPhone;
  if (phone.length < 7) return phone;
  return `${phone.slice(0, 3)}****${phone.slice(-4)}`;
}
