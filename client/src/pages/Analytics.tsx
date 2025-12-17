import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Lock, Loader2 } from "lucide-react";
import { Link } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";

export default function Analytics() {
  const { user, isAuthenticated } = useAuth();
  const [selectedType, setSelectedType] = useState<string | undefined>(undefined);

  const { data: reports, isLoading } = trpc.reports.list.useQuery({
    type: selectedType,
    limit: 50,
  });

  const getAccessBadge = (accessLevel: string) => {
    switch (accessLevel) {
      case "public":
        return <Badge variant="secondary">Открытый доступ</Badge>;
      case "registered":
        return <Badge variant="default">Для зарегистрированных</Badge>;
      case "expert":
        return <Badge variant="destructive">Экспертный доступ</Badge>;
      default:
        return null;
    }
  };

  const canAccess = (accessLevel: string) => {
    if (accessLevel === "public") return true;
    if (!user) return false;
    if (accessLevel === "registered") return true;
    if (accessLevel === "expert") return user.role === "expert" || user.role === "admin";
    return false;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Аналитика</h1>
              <p className="text-muted-foreground">
                Отчеты, бюллетени и кейс-стади по американским элитам
              </p>
            </div>
            <Link href="/">
              <Button variant="outline">← На главную</Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="container py-8">
        {/* Filter Tabs */}
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList>
            <TabsTrigger value="all" onClick={() => setSelectedType(undefined)}>
              Все материалы
            </TabsTrigger>
            <TabsTrigger value="monthly" onClick={() => setSelectedType("Monthly Bulletin")}>
              Ежемесячные бюллетени
            </TabsTrigger>
            <TabsTrigger value="quarterly" onClick={() => setSelectedType("Quarterly Report")}>
              Квартальные отчеты
            </TabsTrigger>
            <TabsTrigger value="annual" onClick={() => setSelectedType("Annual Report")}>
              Годовые доклады
            </TabsTrigger>
            <TabsTrigger value="case" onClick={() => setSelectedType("Case Study")}>
              Кейс-стади
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : reports && reports.length > 0 ? (
              <div className="grid grid-cols-1 gap-6">
                {reports.map((report) => (
                  <Card key={report.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <FileText className="h-5 w-5 text-primary" />
                            <Badge variant="outline">{report.type}</Badge>
                            {getAccessBadge(report.accessLevel)}
                          </div>
                          <CardTitle className="text-xl">{report.title}</CardTitle>
                          {report.author && (
                            <CardDescription className="mt-2">
                              Автор: {report.author}
                            </CardDescription>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(report.publishDate).toLocaleDateString('ru-RU', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {report.summary && (
                        <p className="text-muted-foreground mb-4 line-clamp-3">
                          {report.summary}
                        </p>
                      )}
                      <div className="flex gap-3">
                        {canAccess(report.accessLevel) ? (
                          <>
                            <Link href={`/report/${report.id}`}>
                              <Button variant="default">
                                Читать полностью
                              </Button>
                            </Link>
                            {report.pdfUrl && (
                              <Button variant="outline" asChild>
                                <a href={report.pdfUrl} download>
                                  <Download className="h-4 w-4 mr-2" />
                                  Скачать PDF
                                </a>
                              </Button>
                            )}
                          </>
                        ) : (
                          <Button variant="outline" disabled>
                            <Lock className="h-4 w-4 mr-2" />
                            {!isAuthenticated
                              ? "Требуется авторизация"
                              : "Требуется экспертный доступ"}
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">
                    Аналитические материалы пока не добавлены
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Следите за обновлениями в разделе новостей
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="monthly">
            {/* Same content as "all" but filtered */}
          </TabsContent>
          <TabsContent value="quarterly">
            {/* Same content as "all" but filtered */}
          </TabsContent>
          <TabsContent value="annual">
            {/* Same content as "all" but filtered */}
          </TabsContent>
          <TabsContent value="case">
            {/* Same content as "all" but filtered */}
          </TabsContent>
        </Tabs>

        {/* Featured Case Studies Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold mb-6">Избранные кейс-стади</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
              <CardHeader>
                <CardTitle>Трамп 2024: смена политической парадигмы</CardTitle>
                <CardDescription>
                  Анализ внешнеполитических последствий возвращения Трампа
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Детальное исследование изменений в элитных конфигурациях и их влияния на внешнюю политику США
                </p>
                <Button variant="default">Читать кейс</Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-secondary/5 to-secondary/10 border-secondary/20">
              <CardHeader>
                <CardTitle>Big Tech и цифровое регулирование</CardTitle>
                <CardDescription>
                  Влияние технологических гигантов на политику
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Механизмы влияния крупных технологических компаний на формирование цифровой политики
                </p>
                <Button variant="default">Читать кейс</Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
              <CardHeader>
                <CardTitle>Оборонный бюджет и элитные интересы</CardTitle>
                <CardDescription>
                  От решения к реализации
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Анализ связи между элитными группами и формированием оборонного бюджета США
                </p>
                <Button variant="default">Читать кейс</Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-secondary/5 to-secondary/10 border-secondary/20">
              <CardHeader>
                <CardTitle>Think tanks и внешняя политика</CardTitle>
                <CardDescription>
                  Формирование стратегии США
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Роль аналитических центров в разработке внешнеполитической стратегии
                </p>
                <Button variant="default">Читать кейс</Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Access Level Info */}
        {!isAuthenticated && (
          <Card className="mt-12 bg-primary/5 border-primary/20">
            <CardContent className="py-8 text-center">
              <Lock className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Получите полный доступ</h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Зарегистрируйтесь для доступа к квартальным отчетам и расширенным аналитическим материалам
              </p>
              <div className="flex gap-4 justify-center">
                <Button size="lg" asChild>
                  <a href={getLoginUrl()}>Зарегистрироваться</a>
                </Button>
                <Link href="/expert-access">
                  <Button size="lg" variant="outline">
                    Запросить экспертный доступ
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
