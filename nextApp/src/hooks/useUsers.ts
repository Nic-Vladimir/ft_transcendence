import { useEffect, useState } from 'react';

export function useUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/users', {
        credentials: 'include', 
      });
      if (!res.ok) throw new Error('Failed to fetch users');
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id: number) => {
    if (!window.confirm('Delete user?')) return;
    await fetch(`/api/auth/${id}`, { method: 'DELETE' });
    setUsers(u => u.filter(user => user.id !== id));
    setSuccessMessage('User deleted');
  };

  const updateUser = async (id: number, payload: any) => {
    const res = await fetch(`/api/auth/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const updated = await res.json();
    setUsers(u =>
      u.map(user =>
        user.id === id
          ? {
              ...user,          // keep existing fields like created_at
              ...updated,       // overwrite with backend response
              created_at: user.created_at // always preserve created_at
            }
          : user
      )
    );
    setSuccessMessage('User updated');
  };

  const createUser = async (payload: any) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const created = await res.json();
    setUsers(u => [...u, created]);
    setSuccessMessage('User created');
  };

  return {
    users,
    loading,
    successMessage,
    setSuccessMessage,
    deleteUser,
    updateUser,
    createUser,
  };
}