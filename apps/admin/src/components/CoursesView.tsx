import { useEffect, useState } from 'react';
import { adminApi, type Course } from '../api';

export function CoursesView({ token }: { token: string }) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    adminApi.courses
      .list(token)
      .then((r) => setCourses(r.data ?? []))
      .catch((e) => setError((e as Error).message))
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Хичээлүүд</h1>
      </div>
      <div className="card">
        {loading ? (
          <p>Уншиж байна...</p>
        ) : error ? (
          <p style={{ color: 'var(--error)' }}>{error}</p>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Гарчиг (MN)</th>
                  <th>Гарчиг (ZH)</th>
                  <th>Түвшин</th>
                  <th>Огноо</th>
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
                  courses.map((course) => (
                    <tr key={course.id}>
                      <td>#{course.id}</td>
                      <td>{course.title_mn}</td>
                      <td>{course.title_zh}</td>
                      <td>
                        <span className="badge badge-success">HSK {course.hsk_level}</span>
                      </td>
                      <td>{new Date(course.created_at).toLocaleDateString()}</td>
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
