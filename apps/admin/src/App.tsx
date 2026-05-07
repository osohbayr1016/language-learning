import React, { useState, useEffect } from 'react';

// A simple client for the API
const API_URL = 'http://localhost:8787';

// Types
interface Course {
  id: number;
  title: string;
  description: string;
  hsk_level: number;
  thumbnail_url: string;
  created_at: string;
}

export default function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('admin_token'));
  const [currentView, setCurrentView] = useState<'dashboard' | 'courses' | 'upload'>('dashboard');

  const handleLogin = (newToken: string) => {
    localStorage.setItem('admin_token', newToken);
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setToken(null);
  };

  if (!token) {
    return <LoginView onLogin={handleLogin} />;
  }

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo">Админ Панел</div>
        <nav className="nav-menu">
          <a 
            href="#" 
            className={`nav-link ${currentView === 'dashboard' ? 'active' : ''}`}
            onClick={() => setCurrentView('dashboard')}
          >
            Хянах самбар
          </a>
          <a 
            href="#" 
            className={`nav-link ${currentView === 'courses' ? 'active' : ''}`}
            onClick={() => setCurrentView('courses')}
          >
            Хичээлүүд (Courses)
          </a>
          <a 
            href="#" 
            className={`nav-link ${currentView === 'upload' ? 'active' : ''}`}
            onClick={() => setCurrentView('upload')}
          >
            Видео оруулах
          </a>
          <a 
            href="#" 
            className="nav-link"
            onClick={handleLogout}
            style={{ color: 'var(--error)', marginTop: 'auto' }}
          >
            Гарах
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {currentView === 'dashboard' && <DashboardView token={token} />}
        {currentView === 'courses' && <CoursesView token={token} setView={setCurrentView} />}
        {currentView === 'upload' && <UploadView token={token} />}
      </main>
    </div>
  );
}

function LoginView({ onLogin }: { onLogin: (token: string) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();

      if (!res.ok || !data.data) {
        throw new Error(data.error || 'Нэвтрэхэд алдаа гарлаа');
      }

      onLogin(data.data.access_token);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div className="card" style={{ width: '400px' }}>
        <h2 style={{ marginBottom: '24px', textAlign: 'center' }}>Админ Нэвтрэх</h2>
        {error && <div style={{ color: 'var(--error)', marginBottom: '16px', padding: '12px', backgroundColor: 'rgba(239,68,68,0.1)', borderRadius: '8px' }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Имэйл</label>
            <input 
              type="email" 
              className="form-control" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Нууц үг</label>
            <input 
              type="password" 
              className="form-control" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required
            />
          </div>
          <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Уншиж байна...' : 'Нэвтрэх'}
          </button>
        </form>
      </div>
    </div>
  );
}

function DashboardView({ token }: { token: string }) {
  // Can fetch real stats using token here later
  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Хянах самбар</h1>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px' }}>
        <div className="card">
          <h3 style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>Нийт хичээл</h3>
          <div style={{ fontSize: '32px', fontWeight: '700' }}>12</div>
        </div>
        <div className="card">
          <h3 style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>Нийт үгс</h3>
          <div style={{ fontSize: '32px', fontWeight: '700' }}>654</div>
        </div>
        <div className="card">
          <h3 style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>Хэрэглэгчид</h3>
          <div style={{ fontSize: '32px', fontWeight: '700' }}>1,240</div>
        </div>
      </div>
    </div>
  );
}

function CoursesView({ token, setView }: { token: string, setView: (v: any) => void }) {
  const [courses, setCourses] = React.useState<Course[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch(`${API_URL}/api/courses`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setCourses(data.data || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [token]);

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Хичээлүүд</h1>
        <button className="btn-primary" onClick={() => setView('upload')}>+ Шинэ хичээл</button>
      </div>
      
      <div className="card">
        {loading ? (
          <p>Уншиж байна...</p>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Гарчиг</th>
                  <th>Түвшин</th>
                  <th>Огноо</th>
                  <th>Үйлдэл</th>
                </tr>
              </thead>
              <tbody>
                {courses.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', padding: '32px' }}>
                      Хичээл олдсонгүй
                    </td>
                  </tr>
                ) : (
                  courses.map(course => (
                    <tr key={course.id}>
                      <td>#{course.id}</td>
                      <td>{course.title}</td>
                      <td>
                        <span className="badge badge-success">HSK {course.hsk_level}</span>
                      </td>
                      <td>{new Date(course.created_at).toLocaleDateString()}</td>
                      <td>
                        <button style={{ color: 'var(--accent)', marginRight: '16px' }}>Засах</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function UploadView({ token }: { token: string }) {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [hsk, setHsk] = useState('1');
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState('');

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !file) {
      alert("Гарчиг болон видео файл оруулна уу.");
      return;
    }

    setStatus('1. Хичээл үүсгэж байна...');
    try {
      const createRes = await fetch(`${API_URL}/api/courses`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          description: desc,
          hsk_level: parseInt(hsk),
          order_num: 1
        })
      });
      const createData = await createRes.json();
      
      if (!createData.data) throw new Error(createData.error || "Failed to create course");
      const courseId = createData.data.id;

      setStatus('2. R2 Upload холбоос үүсгэж байна...');
      const urlRes = await fetch(`${API_URL}/api/courses/${courseId}/upload-video`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type || 'video/mp4'
        })
      });
      const urlData = await urlRes.json();
      
      if (!urlData.data || !urlData.data.uploadUrl) {
         throw new Error("Failed to get upload URL");
      }

      setStatus('3. Видеог R2-т хуулж байна... Түр хүлээнэ үү');
      const uploadRes = await fetch(urlData.data.uploadUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type || 'video/mp4'
        }
      });

      if (uploadRes.ok) {
        setStatus('Амжилттай хуулагдлаа! ✅');
        setTitle('');
        setDesc('');
        setFile(null);
      } else {
        throw new Error("R2 Upload failed");
      }

    } catch (e: any) {
      console.error(e);
      setStatus(`Алдаа гарлаа: ${e.message}`);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Шинэ хичээл & Видео оруулах</h1>
      </div>
      
      <div className="card" style={{ maxWidth: '600px' }}>
        <form onSubmit={handleUpload}>
          <div className="form-group">
            <label className="form-label">Гарчиг</label>
            <input 
              type="text" 
              className="form-control" 
              value={title} 
              onChange={e => setTitle(e.target.value)} 
              placeholder="Хичээлийн нэр"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Тайлбар</label>
            <textarea 
              className="form-control" 
              rows={3} 
              value={desc} 
              onChange={e => setDesc(e.target.value)}
              placeholder="Хичээлийн тайлбар"
            ></textarea>
          </div>
          
          <div className="form-group">
            <label className="form-label">HSK Түвшин</label>
            <select className="form-control" value={hsk} onChange={e => setHsk(e.target.value)}>
              <option value="1">HSK 1</option>
              <option value="2">HSK 2</option>
              <option value="3">HSK 3</option>
            </select>
          </div>
          
          <div className="form-group">
            <label className="form-label">Видео файл (MP4)</label>
            <input 
              type="file" 
              className="form-control" 
              accept="video/*"
              onChange={e => setFile(e.target.files ? e.target.files[0] : null)}
            />
          </div>

          <div style={{ marginTop: '32px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button type="submit" className="btn-primary">Хадгалах & Хуулах</button>
            {status && <span style={{ color: status.includes('Алдаа') ? 'var(--error)' : 'var(--text-secondary)' }}>{status}</span>}
          </div>
        </form>
      </div>
    </div>
  );
}
