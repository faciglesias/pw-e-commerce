'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Register() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        return;
      }

      if (data.user) {
        const { error: perfilError } = await supabase.from('usuarios').insert({
          id: data.user.id,
          email,
          nombre,
        });

        if (perfilError) {
          console.error('Error al crear perfil:', perfilError);
        }
      }

      router.push('/auth/login');
    } catch (err) {
      console.error(err);
      setError('Error al registrarse');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container auth-container">
      <section className="auth-card">
        <div className="auth-header">
          <p className="small-label">Cuenta</p>
          <h1 className="auth-title">Crear cuenta</h1>
          <p className="auth-subtitle">
            Registrate para guardar tu carrito y continuar comprando productos Nómada.
          </p>
        </div>

        <form className="auth-form" onSubmit={handleRegister}>
          <div className="auth-field">
            <label className="auth-label">Nombre</label>
            <input
              className="auth-input"
              type="text"
              placeholder="Tu nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>

          <div className="auth-field">
            <label className="auth-label">Email</label>
            <input
              className="auth-input"
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="auth-field">
            <label className="auth-label">Contraseña</label>
            <input
              className="auth-input"
              type="password"
              placeholder="Tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="auth-error">{error}</p>}

          <button className="button-dark auth-button" type="submit" disabled={loading}>
            {loading ? 'Registrando...' : 'Registrarse'}
          </button>
        </form>

        <p className="auth-footer">
          ¿Ya tenés cuenta? <Link href="/auth/login">Iniciá sesión acá</Link>
        </p>
      </section>
    </main>
  );
}