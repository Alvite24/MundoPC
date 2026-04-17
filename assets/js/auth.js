// --- Supabase Configuration ---
const SUPABASE_URL = 'https://beernwsshytvdoweudzr.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJlZXJud3NzaHl0dmRvd2V1ZHpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0MzgyMDYsImV4cCI6MjA5MjAxNDIwNn0.dy-XVfnP_vpa_buH_tDxMLLEf7dylt6xfJnRYOEeNRQ';

// The global variable from the CDN is 'supabase'
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// --- State and UI ---
let isSignUpMode = false;
let currentUser = null;

const authModal = document.getElementById('auth-modal');
const authForm = document.getElementById('auth-form');
const authTitle = document.getElementById('auth-title');
const authSubmitBtn = document.getElementById('auth-submit');
const authSwitchBtn = document.getElementById('auth-switch-btn');
const authSwitchText = document.getElementById('auth-switch-text');
const loginBtn = document.getElementById('login-btn');
const closeAuthBtn = document.getElementById('close-auth');
const authNode = document.getElementById('auth-node');
const authMsg = document.getElementById('auth-msg');

// --- Auth Logic ---

async function checkUserSession() {
    const { data: { user } } = await _supabase.auth.getUser();
    currentUser = user;
    updateAuthUI(user);
}

function showAuthMessage(text, type = 'error') {
    if (!authMsg) return;
    authMsg.textContent = text;
    authMsg.style.display = 'block';
    if (type === 'error') {
        authMsg.style.background = 'rgba(239, 68, 68, 0.1)';
        authMsg.style.color = '#ef4444';
        authMsg.style.border = '1px solid #ef4444';
    } else {
        authMsg.style.background = 'rgba(16, 185, 129, 0.1)';
        authMsg.style.color = '#10b981';
        authMsg.style.border = '1px solid #10b981';
    }
}

function clearAuthMessage() {
    if (authMsg) {
        authMsg.style.display = 'none';
        authMsg.textContent = '';
    }
}

function updateAuthUI(user) {
    if (!authNode) return;
    
    if (user) {
        authNode.innerHTML = `
            <div class="user-profile" style="display: flex; align-items: center; gap: 15px;">
                <span style="font-size: 0.85rem; color: var(--text-muted);"><i class="fa-solid fa-user"></i> ${user.email}</span>
                <button class="btn btn-outline" id="logout-btn" style="padding: 6px 12px; font-size: 0.8rem; border-color: #ef4444; color: #ef4444;">Salir</button>
            </div>
        `;
        document.getElementById('logout-btn').addEventListener('click', handleLogout);
        
        // Show Save & My Builds button if on builder page
        const saveBtn = document.getElementById('save-build-btn');
        const myBuildsBtn = document.getElementById('my-builds-btn');
        if (saveBtn) saveBtn.style.display = 'block';
        if (myBuildsBtn) myBuildsBtn.style.display = 'block';
    } else {
        authNode.innerHTML = `<button class="btn btn-outline" id="login-btn" style="padding: 8px 16px; font-size: 0.9rem;">Iniciar Sesión</button>`;
        const btn = document.getElementById('login-btn');
        if (btn) btn.addEventListener('click', openAuthModal);
        
        // Hide Save & My Builds button if on builder page
        const saveBtn = document.getElementById('save-build-btn');
        const myBuildsBtn = document.getElementById('my-builds-btn');
        if (saveBtn) saveBtn.style.display = 'none';
        if (myBuildsBtn) myBuildsBtn.style.display = 'none';
    }
}

async function handleLogin(email, password) {
    const { data, error } = await _supabase.auth.signInWithPassword({ email, password });
    if (error) {
        let msg = 'Error: ' + error.message;
        if (error.message.includes('Email not confirmed')) {
            msg = 'Atención: Debes confirmar tu correo. Revisa tu bandeja de entrada o desactiva la confirmación en Supabase.';
        }
        showAuthMessage(msg, 'error');
    } else {
        closeAuthModal();
        checkUserSession();
    }
}

async function handleSignUp(email, password) {
    const { data, error } = await _supabase.auth.signUp({ email, password });
    if (error) {
        showAuthMessage('Error: ' + error.message, 'error');
    } else {
        showAuthMessage('✅ ¡Registro completado! Revisa tu correo y haz clic en el enlace de confirmación antes de iniciar sesión.', 'success');
        // Switch back to login mode after a delay
        setTimeout(() => {
            isSignUpMode = false;
            authTitle.textContent = 'Iniciar Sesión';
            authSubmitBtn.textContent = 'Entrar';
            authSwitchText.textContent = '¿No tienes cuenta?';
            authSwitchBtn.textContent = 'Regístrate';
        }, 3000);
    }
}

async function handleLogout() {
    await _supabase.auth.signOut();
    currentUser = null;
    updateAuthUI(null);
}

// --- UI Event Listeners ---

function openAuthModal() {
    clearAuthMessage();
    authModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeAuthModal() {
    authModal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function toggleAuthMode() {
    clearAuthMessage();
    isSignUpMode = !isSignUpMode;
    if (isSignUpMode) {
        authTitle.textContent = 'Crear Cuenta';
        authSubmitBtn.textContent = 'Registrarse';
        authSwitchText.textContent = '¿Ya tienes cuenta?';
        authSwitchBtn.textContent = 'Inicia Sesión';
    } else {
        authTitle.textContent = 'Iniciar Sesión';
        authSubmitBtn.textContent = 'Entrar';
        authSwitchText.textContent = '¿No tienes cuenta?';
        authSwitchBtn.textContent = 'Regístrate';
    }
}

if (authForm) {
    authForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        clearAuthMessage();
        const email = document.getElementById('auth-email').value;
        const password = document.getElementById('auth-password').value;
        
        authSubmitBtn.disabled = true;
        authSubmitBtn.textContent = 'Procesando...';
        
        if (isSignUpMode) {
            await handleSignUp(email, password);
        } else {
            await handleLogin(email, password);
        }
        
        authSubmitBtn.disabled = false;
        authSubmitBtn.textContent = isSignUpMode ? 'Registrarse' : 'Entrar';
    });
}

if (authSwitchBtn) authSwitchBtn.addEventListener('click', (e) => { e.preventDefault(); toggleAuthMode(); });
if (loginBtn) loginBtn.addEventListener('click', openAuthModal);
if (closeAuthBtn) closeAuthBtn.addEventListener('click', closeAuthModal);

// Initial session check
checkUserSession();

// Listen for auth changes
_supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN') {
        currentUser = session.user;
        updateAuthUI(session.user);
    } else if (event === 'SIGNED_OUT') {
        currentUser = null;
        updateAuthUI(null);
    }
});

// --- Redirect & Email Confirmation Handling ---
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.hash) {
        // Parse hash params like #access_token=...&type=signup or #error=...
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        
        if (hashParams.has('error_description')) {
            // Supabase returned an error (e.g. link expired)
            const errorDesc = decodeURIComponent(hashParams.get('error_description').replace(/\+/g, ' '));
            openAuthModal();
            showAuthMessage('Error: ' + errorDesc, 'error');
            // Clean URL
            window.history.replaceState(null, '', window.location.pathname);
        } else if (hashParams.get('type') === 'signup' || hashParams.has('access_token')) {
            // Successful email verification
            openAuthModal();
            showAuthMessage('✅ ¡Correo confirmado exitosamente! Hemos iniciado tu sesión.', 'success');
            
            // Clean URL so it doesn't trigger again on refresh
            window.history.replaceState(null, '', window.location.pathname);
            
            // Auto close modal after 4 seconds
            setTimeout(() => {
                closeAuthModal();
            }, 4000);
        }
    }
});
