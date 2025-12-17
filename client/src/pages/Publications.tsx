import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, ExternalLink, Loader2 } from "lucide-react";
import { Link } from "wouter";

export default function Publications() {
  const [selectedType, setSelectedType] = useState<string | undefined>(undefined);

  const { data: publications, isLoading } = trpc.publications.list.useQuery({
    publicationType: selectedType,
    limit: 50,
  });

  const getTypeBadge = (type: string) => {
    const badges: Record<string, { variant: "default" | "secondary" | "outline"; label: string }> = {
      "Journal Article": { variant: "default", label: "Статья" },
      "Book Chapter": { variant: "secondary", label: "Глава книги" },
      "Conference Paper": { variant: "outline", label: "Доклад" },
      "Working Paper": { variant: "outline", label: "Рабочий документ" },
    };
    const config = badges[type] || { variant: "outline" as const, label: type };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Публикации</h1>
              <p className="text-muted-foreground">
                Научные статьи, монографии и доклады команды проекта
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
              Все публикации
            </TabsTrigger>
            <TabsTrigger value="journal" onClick={() => setSelectedType("Journal Article")}>
              Статьи
            </TabsTrigger>
            <TabsTrigger value="book" onClick={() => setSelectedType("Book Chapter")}>
              Главы книг
            </TabsTrigger>
            <TabsTrigger value="conference" onClick={() => setSelectedType("Conference Paper")}>
              Доклады
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : publications && publications.length > 0 ? (
              <div className="space-y-4">
                {publications.map((pub) => (
                  <Card key={pub.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <FileText className="h-4 w-4 text-primary" />
                            {pub.publicationType && getTypeBadge(pub.publicationType)}
                          </div>
                          <CardTitle className="text-xl">{pub.title}</CardTitle>
                          {pub.authors && (
                            <CardDescription className="mt-2">
                              {pub.authors}
                            </CardDescription>
                          )}
                        </div>
                        {pub.publicationDate && (
                          <div className="text-sm text-muted-foreground">
                            {new Date(pub.publicationDate).getFullYear()}
                          </div>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {pub.abstract && (
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {pub.abstract}
                        </p>
                      )}

                      <div className="space-y-1 text-sm text-muted-foreground">
                        {pub.journal && (
                          <p><strong>Журнал:</strong> {pub.journal}</p>
                        )}

                      </div>

                      <div className="flex gap-3">
                        {pub.pdfUrl && (
                          <Button variant="default" size="sm" asChild>
                            <a href={pub.pdfUrl} download>
                              <Download className="h-4 w-4 mr-2" />
                              Скачать PDF
                            </a>
                          </Button>
                        )}
                        {pub.url && (
                          <Button variant="outline" size="sm" asChild>
                            <a href={pub.url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4 mr-2" />
                              Открыть на сайте издателя
                            </a>
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
                    Публикации пока не добавлены
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Следите за обновлениями в разделе новостей
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Featured Publications */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold mb-6">Избранные публикации</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
              <CardHeader>
                <Badge className="w-fit mb-2">Статья</Badge>
                <CardTitle>Трамп 2024: смена элитной парадигмы</CardTitle>
                <CardDescription>Журнал "Международные процессы", 2024</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Анализ трансформации американских элит после президентских выборов 2024 года и их влияния на внешнюю политику США
                </p>
                <div className="flex gap-2">
                  <Button variant="default" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    PDF
                  </Button>
                  <Button variant="outline" size="sm">
                    Подробнее
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-secondary/5 to-secondary/10 border-secondary/20">
              <CardHeader>
                <Badge className="w-fit mb-2">Монография</Badge>
                <CardTitle>Big Tech и цифровая политика США</CardTitle>
                <CardDescription>Издательство РГГУ, 2024</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Комплексное исследование влияния технологических гигантов на формирование цифровой политики и регулирование в США
                </p>
                <div className="flex gap-2">
                  <Button variant="default" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    PDF
                  </Button>
                  <Button variant="outline" size="sm">
                    Подробнее
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
              <CardHeader>
                <Badge className="w-fit mb-2">Доклад</Badge>
                <CardTitle>Оборонный бюджет и элитные интересы</CardTitle>
                <CardDescription>Конференция РАПН, 2024</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Анализ связи между элитными группами и формированием оборонного бюджета США в контексте украинского кризиса
                </p>
                <div className="flex gap-2">
                  <Button variant="default" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    PDF
                  </Button>
                  <Button variant="outline" size="sm">
                    Подробнее
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-secondary/5 to-secondary/10 border-secondary/20">
              <CardHeader>
                <Badge className="w-fit mb-2">Статья</Badge>
                <CardTitle>Think tanks и внешняя политика США</CardTitle>
                <CardDescription>Вестник МГИМО, 2023</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Роль аналитических центров в разработке внешнеполитической стратегии США и механизмы их влияния на принятие решений
                </p>
                <div className="flex gap-2">
                  <Button variant="default" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    PDF
                  </Button>
                  <Button variant="outline" size="sm">
                    Подробнее
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Research Areas */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold mb-6 text-center">Направления исследований</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Внешняя политика</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Элитные трансформации и внешнеполитический курс</li>
                  <li>• Санкционная политика США</li>
                  <li>• Влияние think tanks на стратегию</li>
                  <li>• Российско-американские отношения</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Внутренняя политика</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Бюджетные приоритеты США</li>
                  <li>• Лоббистская деятельность корпораций</li>
                  <li>• Партийная динамика</li>
                  <li>• Внутриэлитные конфликты</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Экономика и технологии</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Big Tech и цифровая политика</li>
                  <li>• Финансовые потоки и корпоративные связи</li>
                  <li>• Энергетическая стратегия</li>
                  <li>• Военно-промышленный комплекс</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
