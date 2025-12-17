import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, Video, Clock, Loader2 } from "lucide-react";
import { Link } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";

export default function Events() {
  const { isAuthenticated } = useAuth();
  const [selectedStatus, setSelectedStatus] = useState<"upcoming" | "ongoing" | "completed">("upcoming");

  const { data: events, isLoading } = trpc.events.list.useQuery({
    status: selectedStatus,
    limit: 50,
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "upcoming":
        return <Badge variant="default">Предстоящее</Badge>;
      case "ongoing":
        return <Badge variant="secondary">Идёт сейчас</Badge>;
      case "completed":
        return <Badge variant="outline">Завершено</Badge>;
      default:
        return null;
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Мероприятия</h1>
              <p className="text-muted-foreground">
                Семинары, конференции и круглые столы по элитным исследованиям
              </p>
            </div>
            <Link href="/">
              <Button variant="outline">← На главную</Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="container py-8">
        {/* Tabs */}
        <Tabs defaultValue="upcoming" className="space-y-6">
          <TabsList>
            <TabsTrigger value="upcoming" onClick={() => setSelectedStatus("upcoming")}>
              Предстоящие
            </TabsTrigger>
            <TabsTrigger value="ongoing" onClick={() => setSelectedStatus("ongoing")}>
              Идут сейчас
            </TabsTrigger>
            <TabsTrigger value="completed" onClick={() => setSelectedStatus("completed")}>
              Архив
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-6">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : events && events.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {events.map((event) => (
                  <Card key={event.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Calendar className="h-4 w-4 text-primary" />
                            {getStatusBadge(event.status)}
                          </div>
                          <CardTitle className="text-xl">{event.title}</CardTitle>
                          <CardDescription className="mt-2">
                            {event.eventType}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {event.description && (
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {event.description}
                        </p>
                      )}

                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>{formatDate(event.startDate)}</span>
                        </div>
                        
                        {event.location && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            <span>{event.location}</span>
                          </div>
                        )}
                        
                        {event.eventType && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Video className="h-4 w-4" />
                            <span>Формат: {event.eventType}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-3 pt-2">
                        {isAuthenticated ? (
                          <>
                            <Button variant="default">
                              Зарегистрироваться
                            </Button>
                            <Link href={`/event/${event.id}`}>
                              <Button variant="outline">
                                Подробнее
                              </Button>
                            </Link>
                          </>
                        ) : (
                          <>
                            <Button variant="default" asChild>
                              <a href={getLoginUrl()}>Войти для регистрации</a>
                            </Button>
                            <Link href={`/event/${event.id}`}>
                              <Button variant="outline">
                                Подробнее
                              </Button>
                            </Link>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">
                    Предстоящие мероприятия пока не запланированы
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Следите за обновлениями в разделе новостей
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="ongoing">
            {/* Same structure as upcoming */}
          </TabsContent>

          <TabsContent value="completed">
            {/* Same structure but with archive-specific features */}
          </TabsContent>
        </Tabs>

        {/* Featured Events */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold mb-6">Ближайшие мероприятия</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
              <CardHeader>
                <Badge className="w-fit mb-2">Семинар</Badge>
                <CardTitle>Трамп 2024: новая элитная конфигурация</CardTitle>
                <CardDescription>15 января 2025, 18:00 МСК</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Анализ изменений в элитных структурах после выборов 2024
                </p>
                <Button variant="default" size="sm">Зарегистрироваться</Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-secondary/5 to-secondary/10 border-secondary/20">
              <CardHeader>
                <Badge className="w-fit mb-2">Круглый стол</Badge>
                <CardTitle>Big Tech и цифровое регулирование</CardTitle>
                <CardDescription>22 января 2025, 19:00 МСК</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Обсуждение влияния технологических гигантов на политику
                </p>
                <Button variant="default" size="sm">Зарегистрироваться</Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
              <CardHeader>
                <Badge className="w-fit mb-2">Конференция</Badge>
                <CardTitle>Американские элиты: годовой обзор</CardTitle>
                <CardDescription>5-6 февраля 2025</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Двухдневная конференция с ведущими экспертами
                </p>
                <Button variant="default" size="sm">Зарегистрироваться</Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Newsletter Subscription */}
        <Card className="mt-12 bg-primary/5 border-primary/20">
          <CardContent className="py-8 text-center">
            <Calendar className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Не пропустите мероприятия</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Подпишитесь на рассылку, чтобы получать уведомления о новых семинарах и конференциях
            </p>
            <Link href="/newsletter">
              <Button size="lg">Подписаться на рассылку</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
