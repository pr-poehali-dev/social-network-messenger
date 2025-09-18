import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';

interface Post {
  id: number;
  author: string;
  avatar: string;
  content: string;
  likes: number;
  comments: number;
  timestamp: string;
  image?: string;
}

interface User {
  id: number;
  name: string;
  avatar: string;
  status: string;
  isOnline: boolean;
}

interface Community {
  id: number;
  name: string;
  members: number;
  description: string;
}

const Index = () => {
  const [activeSection, setActiveSection] = useState('feed');
  const [posts, setPosts] = useState<Post[]>([
    {
      id: 1,
      author: 'Алексей Петров',
      avatar: 'АП',
      content: 'Отличная погода сегодня! Решил прогуляться по парку. Как дела у вас?',
      likes: 12,
      comments: 3,
      timestamp: '2 часа назад'
    },
    {
      id: 2,
      author: 'Мария Иванова',
      avatar: 'МИ',
      content: 'Закончила новый проект! Очень довольна результатом 🚀',
      likes: 8,
      comments: 5,
      timestamp: '4 часа назад'
    },
    {
      id: 3,
      author: 'Дмитрий Козлов',
      avatar: 'ДК',
      content: 'Кто-нибудь знает хорошие места для фотосессии в городе?',
      likes: 15,
      comments: 7,
      timestamp: '6 часов назад'
    }
  ]);

  const [friends] = useState<User[]>([
    { id: 1, name: 'Алексей Петров', avatar: 'АП', status: 'В сети', isOnline: true },
    { id: 2, name: 'Мария Иванова', avatar: 'МИ', status: 'Была 5 мин назад', isOnline: false },
    { id: 3, name: 'Дмитрий Козлов', avatar: 'ДК', status: 'В сети', isOnline: true },
    { id: 4, name: 'Анна Сидорова', avatar: 'АС', status: 'Была час назад', isOnline: false }
  ]);

  const [communities] = useState<Community[]>([
    { id: 1, name: 'Программисты', members: 1250, description: 'Обсуждение технологий и кода' },
    { id: 2, name: 'Фотография', members: 856, description: 'Делимся снимками и техниками' },
    { id: 3, name: 'Путешествия', members: 2100, description: 'Советы и впечатления о поездках' }
  ]);

  const [messages] = useState([
    { id: 1, author: 'Алексей Петров', content: 'Привет! Как дела?', timestamp: '14:30', isOwn: false },
    { id: 2, author: 'Вы', content: 'Привет! Всё отлично, спасибо!', timestamp: '14:32', isOwn: true },
    { id: 3, author: 'Алексей Петров', content: 'Увидимся завтра?', timestamp: '14:35', isOwn: false }
  ]);

  const handleLike = (postId: number) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, likes: post.likes + 1 }
        : post
    ));
  };

  const NavButton = ({ section, icon, label }: { section: string; icon: string; label: string }) => (
    <Button
      variant={activeSection === section ? "default" : "ghost"}
      className="w-full justify-start gap-3"
      onClick={() => setActiveSection(section)}
    >
      <Icon name={icon as any} size={20} />
      {label}
    </Button>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'feed':
        return (
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex gap-3">
                  <Avatar>
                    <AvatarFallback className="bg-primary text-primary-foreground">Вы</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <Textarea 
                      placeholder="Что нового?" 
                      className="min-h-[80px] resize-none border-0 p-0 focus-visible:ring-0"
                    />
                    <div className="flex justify-between items-center mt-4">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Icon name="Image" size={16} className="mr-2" />
                          Фото
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Icon name="MapPin" size={16} className="mr-2" />
                          Место
                        </Button>
                      </div>
                      <Button className="bg-vk-blue hover:bg-vk-dark">Опубликовать</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {posts.map((post) => (
              <Card key={post.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex gap-3">
                    <Avatar>
                      <AvatarFallback className="bg-primary text-primary-foreground">{post.avatar}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold">{post.author}</h4>
                        <span className="text-muted-foreground text-sm">{post.timestamp}</span>
                      </div>
                      <p className="mb-4 leading-relaxed">{post.content}</p>
                      <div className="flex items-center gap-6">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleLike(post.id)}
                          className="gap-2 hover:bg-red-50 hover:text-red-600"
                        >
                          <Icon name="Heart" size={16} />
                          {post.likes}
                        </Button>
                        <Button variant="ghost" size="sm" className="gap-2">
                          <Icon name="MessageCircle" size={16} />
                          {post.comments}
                        </Button>
                        <Button variant="ghost" size="sm" className="gap-2">
                          <Icon name="Share2" size={16} />
                          Поделиться
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        );

      case 'profile':
        return (
          <Card>
            <CardContent className="p-6">
              <div className="flex gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarFallback className="bg-primary text-primary-foreground text-2xl">Вы</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-2">Ваш Профиль</h2>
                  <p className="text-muted-foreground mb-4">В сети</p>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold">156</div>
                      <div className="text-sm text-muted-foreground">Записи</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">89</div>
                      <div className="text-sm text-muted-foreground">Друзья</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">12</div>
                      <div className="text-sm text-muted-foreground">Группы</div>
                    </div>
                  </div>
                  <Button className="mt-4">Редактировать профиль</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 'friends':
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Друзья</h2>
              <Input placeholder="Поиск друзей..." className="w-64" />
            </div>
            <div className="grid gap-4">
              {friends.map((friend) => (
                <Card key={friend.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar>
                          <AvatarFallback className="bg-primary text-primary-foreground">{friend.avatar}</AvatarFallback>
                        </Avatar>
                        {friend.isOnline && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background"></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold">{friend.name}</h4>
                        <p className="text-sm text-muted-foreground">{friend.status}</p>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Icon name="MessageCircle" size={16} />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case 'communities':
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Сообщества</h2>
              <Button className="bg-vk-blue hover:bg-vk-dark">
                <Icon name="Plus" size={16} className="mr-2" />
                Создать
              </Button>
            </div>
            <div className="grid gap-4">
              {communities.map((community) => (
                <Card key={community.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {community.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h4 className="font-semibold">{community.name}</h4>
                        <p className="text-sm text-muted-foreground mb-1">{community.description}</p>
                        <Badge variant="secondary">{community.members.toLocaleString()} участников</Badge>
                      </div>
                      <Button variant="outline">Подписаться</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case 'search':
        return (
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="relative">
                  <Icon name="Search" size={20} className="absolute left-3 top-3 text-muted-foreground" />
                  <Input 
                    placeholder="Поиск людей, сообществ, записей..." 
                    className="pl-10 h-12"
                  />
                </div>
              </CardContent>
            </Card>
            
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <h3 className="font-semibold">Популярные пользователи</h3>
                </CardHeader>
                <CardContent className="space-y-3">
                  {friends.slice(0, 3).map((user) => (
                    <div key={user.id} className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">{user.avatar}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{user.name}</p>
                      </div>
                      <Button size="sm" variant="outline">Добавить</Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <h3 className="font-semibold">Рекомендуемые группы</h3>
                </CardHeader>
                <CardContent className="space-y-3">
                  {communities.slice(0, 3).map((community) => (
                    <div key={community.id} className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">{community.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{community.name}</p>
                      </div>
                      <Button size="sm" variant="outline">Вступить</Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 'messages':
        return (
          <div className="grid md:grid-cols-3 gap-6 h-[600px]">
            <Card className="md:col-span-1">
              <CardHeader>
                <h3 className="font-semibold">Диалоги</h3>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-1">
                  {friends.slice(0, 4).map((friend) => (
                    <div key={friend.id} className="flex items-center gap-3 p-3 hover:bg-muted cursor-pointer">
                      <div className="relative">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>{friend.avatar}</AvatarFallback>
                        </Avatar>
                        {friend.isOnline && (
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{friend.name}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {friend.id === 1 ? 'Увидимся завтра?' : 'Привет! Как дела?'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2">
              <CardHeader className="border-b">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>АП</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold">Алексей Петров</h4>
                    <p className="text-sm text-muted-foreground">в сети</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 p-4">
                <div className="space-y-4 mb-4">
                  {messages.map((message) => (
                    <div key={message.id} className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-xs px-4 py-2 rounded-2xl ${
                        message.isOwn 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted'
                      }`}>
                        <p className="text-sm">{message.content}</p>
                        <p className={`text-xs mt-1 ${
                          message.isOwn ? 'text-primary-foreground/70' : 'text-muted-foreground'
                        }`}>
                          {message.timestamp}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <Separator className="my-4" />
                <div className="flex gap-2">
                  <Input placeholder="Напишите сообщение..." className="flex-1" />
                  <Button size="icon" className="bg-vk-blue hover:bg-vk-dark">
                    <Icon name="Send" size={16} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-vk-light">
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-vk-blue">СоцСеть</h1>
              <div className="relative">
                <Icon name="Search" size={20} className="absolute left-3 top-2.5 text-muted-foreground" />
                <Input placeholder="Поиск..." className="pl-10 w-80" />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon">
                <Icon name="Bell" size={20} />
              </Button>
              <Avatar>
                <AvatarFallback className="bg-primary text-primary-foreground">Вы</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-4 gap-6">
          <aside className="lg:col-span-1">
            <Card>
              <CardContent className="p-4">
                <nav className="space-y-2">
                  <NavButton section="feed" icon="Home" label="Лента" />
                  <NavButton section="profile" icon="User" label="Профиль" />
                  <NavButton section="friends" icon="Users" label="Друзья" />
                  <NavButton section="communities" icon="Users2" label="Группы" />
                  <NavButton section="messages" icon="MessageCircle" label="Сообщения" />
                  <NavButton section="search" icon="Search" label="Поиск" />
                </nav>
              </CardContent>
            </Card>
          </aside>

          <main className="lg:col-span-3">
            {renderContent()}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Index;