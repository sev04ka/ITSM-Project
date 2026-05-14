import type { FC } from 'react';
import { Link } from 'react-router-dom';


const NotFound: FC = () => {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            gap: '1rem',
            color: 'var(--text-muted)'
        }}>
            <h1 style={{ fontSize: '4rem', fontWeight: 700, color: 'var(--accent)' }}>404</h1>
            <p style={{ fontSize: '1.125rem' }}>Страница не найдена</p>
            <Link to="/" style={{
                color: 'var(--accent)',
                fontSize: '0.875rem',
                fontWeight: 500
            }}>Вернуться на главную</Link>
        </div>
    )
}

export default NotFound
