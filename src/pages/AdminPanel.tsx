import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import Icon from '@/components/ui/icon';

interface User {
  id: string;
  username: string;
  email: string;
  full_name: string;
  is_online: boolean;
  is_banned: boolean;
  created_at: string;
}

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  is_read: boolean;
}

const AdminPanel = () => {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [banReason, setBanReason] = useState('');
  const [user1Id, setUser1Id] = useState('');
  const [user2Id, setUser2Id] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user || !user.is_admin) {
      navigate('/login');
      return;
    }
    fetchUsers();
  }, [user, navigate]);

  const fetchUsers = async () => {
    try {
      const response = await fetch('https://functions.poehali.dev/32ff698a-a00d-4888-a38f-9bac7e8eeb8d', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'get_users',
          admin_token: token,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setUsers(data.users);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const banUser = async () => {
    if (!selectedUser || !banReason) {
      toast.error('Выберите пользователя и укажите причину');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('https://functions.poehali.dev/32ff698a-a00d-4888-a38f-9bac7e8eeb8d', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'ban_user',
          admin_token: token,
          target_user_id: selectedUser,
          reason: banReason,
        }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Пользователь заблокирован');
        setBanReason('');
        setSelectedUser('');
        fetchUsers();
      } else {
        toast.error('Ошибка блокировки пользователя');
      }
    } catch (error) {
      toast.error('Ошибка при блокировке');
    }
    setIsLoading(false);
  };

  const unbanUser = async (userId: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('https://functions.poehali.dev/32ff698a-a00d-4888-a38f-9bac7e8eeb8d', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'unban_user',
          admin_token: token,
          target_user_id: userId,
        }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Пользователь разблокирован');
        fetchUsers();
      } else {
        toast.error('Ошибка разблокировки пользователя');
      }
    } catch (error) {
      toast.error('Ошибка при разблокировке');
    }
    setIsLoading(false);
  };

  const readMessages = async () => {
    if (!user1Id || !user2Id) {
      toast.error('Укажите ID обоих пользователей');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('https://functions.poehali.dev/32ff698a-a00d-4888-a38f-9bac7e8eeb8d', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'read_messages',
          admin_token: token,
          user1_id: user1Id,
          user2_id: user2Id,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setMessages(data.messages);
        toast.success('Переписка загружена');
      } else {
        toast.error('Ошибка загрузки переписки');
      }
    } catch (error) {
      toast.error('Ошибка при загрузке переписки');
    }
    setIsLoading(false);
  };

  if (!user || !user.is_admin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Админ-панель</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">
              Добро пожаловать, {user.full_name}
            </span>
            <Button variant="outline" onClick={logout}>
              <Icon name="LogOut" className="w-4 h-4 mr-2" />
              Выйти
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Управление пользователями</CardTitle>
              <CardDescription>
                Блокировка и разблокировка пользователей
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Выберите пользователя для блокировки</Label>
                <select
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                  className="w-full p-2 border rounded-md"
                  disabled={isLoading}
                >
                  <option value="">Выберите пользователя</option>
                  {users.filter(u => !u.is_banned).map(user => (
                    <option key={user.id} value={user.id}>
                      {user.username} ({user.full_name})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label>Причина блокировки</Label>
                <Textarea
                  value={banReason}
                  onChange={(e) => setBanReason(e.target.value)}
                  placeholder="Укажите причину блокировки"
                  disabled={isLoading}
                />
              </div>

              <Button onClick={banUser} disabled={isLoading} className="w-full">
                {isLoading ? (
                  <Icon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Icon name="Ban" className="w-4 h-4 mr-2" />
                )}
                Заблокировать пользователя
              </Button>

              <div className="mt-6">
                <h3 className="font-semibold mb-2">Заблокированные пользователи:</h3>
                {users.filter(u => u.is_banned).map(user => (
                  <div key={user.id} className="flex items-center justify-between p-2 bg-red-50 rounded-md mb-2">
                    <span>{user.username}</span>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => unbanUser(user.id)}
                      disabled={isLoading}
                    >
                      Разблокировать
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Чтение переписок</CardTitle>
              <CardDescription>
                Просмотр личных сообщений между пользователями
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label>ID пользователя 1</Label>
                  <Input
                    value={user1Id}
                    onChange={(e) => setUser1Id(e.target.value)}
                    placeholder="USER123"
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label>ID пользователя 2</Label>
                  <Input
                    value={user2Id}
                    onChange={(e) => setUser2Id(e.target.value)}
                    placeholder="USER456"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <Button onClick={readMessages} disabled={isLoading} className="w-full">
                {isLoading ? (
                  <Icon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Icon name="MessageSquare" className="w-4 h-4 mr-2" />
                )}
                Загрузить переписку
              </Button>

              {messages.length > 0 && (
                <div className="mt-4 space-y-2 max-h-64 overflow-y-auto">
                  <h3 className="font-semibold">Переписка:</h3>
                  {messages.map(message => (
                    <div key={message.id} className="p-2 bg-gray-100 rounded-md text-sm">
                      <div className="font-medium text-blue-600">
                        От: {message.sender_id} → Кому: {message.receiver_id}
                      </div>
                      <div className="mt-1">{message.content}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {new Date(message.created_at).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Список всех пользователей</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {users.map(user => (
                <div key={user.id} className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-2 h-2 rounded-full ${user.is_online ? 'bg-green-500' : 'bg-gray-400'}`} />
                    <span className="font-medium">{user.username}</span>
                    {user.is_banned && <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">Заблокирован</span>}
                  </div>
                  <div className="text-sm text-gray-600">
                    <div>ID: {user.id}</div>
                    <div>Имя: {user.full_name}</div>
                    <div>Email: {user.email}</div>
                    <div>Создан: {new Date(user.created_at).toLocaleDateString()}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminPanel;