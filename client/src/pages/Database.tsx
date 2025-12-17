import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Users, Building2, FileText, Loader2 } from "lucide-react";
import { Link } from "wouter";

export default function Database() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sphereFilter, setSphereFilter] = useState<string>("");
  const [orgTypeFilter, setOrgTypeFilter] = useState<string>("");
  const [decisionTypeFilter, setDecisionTypeFilter] = useState<string>("");

  const { data: elites, isLoading: elitesLoading } = trpc.elites.search.useQuery({
    query: searchQuery,
    sphereOfInfluence: sphereFilter || undefined,
    limit: 50,
  });

  const { data: organizations, isLoading: orgsLoading } = trpc.organizations.search.useQuery({
    query: searchQuery,
    type: orgTypeFilter || undefined,
    limit: 50,
  });

  const { data: decisions, isLoading: decisionsLoading } = trpc.decisions.search.useQuery({
    query: searchQuery,
    type: decisionTypeFilter || undefined,
    limit: 50,
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">База данных</h1>
              <p className="text-muted-foreground">
                Поиск и анализ персоналий, организаций и политических решений
              </p>
            </div>
            <Link href="/">
              <Button variant="outline">← На главную</Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="container py-8">
        {/* Search Bar */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Поиск по имени, организации или решению..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="default">
                <Search className="h-4 w-4 mr-2" />
                Поиск
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="elites" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-2xl">
            <TabsTrigger value="elites" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Персоналии
            </TabsTrigger>
            <TabsTrigger value="organizations" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Организации
            </TabsTrigger>
            <TabsTrigger value="decisions" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Решения
            </TabsTrigger>
          </TabsList>

          {/* Elites Tab */}
          <TabsContent value="elites" className="space-y-4">
            <div className="flex gap-4 mb-6">
              <Select value={sphereFilter} onValueChange={setSphereFilter}>
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="Сфера влияния" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все сферы</SelectItem>
                  <SelectItem value="Big Tech">Big Tech</SelectItem>
                  <SelectItem value="Defense">Оборона</SelectItem>
                  <SelectItem value="Finance">Финансы</SelectItem>
                  <SelectItem value="Energy">Энергетика</SelectItem>
                  <SelectItem value="Media">Медиа</SelectItem>
                  <SelectItem value="Politics">Политика</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {elitesLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : elites && elites.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {elites.map((elite) => (
                  <Card key={elite.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start gap-4">
                        {elite.imageUrl ? (
                          <img
                            src={elite.imageUrl}
                            alt={elite.name}
                            className="w-16 h-16 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                            <Users className="h-8 w-8 text-primary" />
                          </div>
                        )}
                        <div className="flex-1">
                          <CardTitle className="text-lg">{elite.name}</CardTitle>
                          {elite.sphereOfInfluence && (
                            <CardDescription className="mt-1">
                              {elite.sphereOfInfluence}
                            </CardDescription>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {elite.politicalOrientation && (
                        <p className="text-sm text-muted-foreground mb-2">
                          <strong>Ориентация:</strong> {elite.politicalOrientation}
                        </p>
                      )}
                      {elite.biography && (
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {elite.biography}
                        </p>
                      )}
                      <Link href={`/elite/${elite.id}`}>
                        <Button variant="link" className="mt-4 p-0">
                          Подробнее →
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">
                    Персоналии не найдены. Попробуйте изменить параметры поиска.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Organizations Tab */}
          <TabsContent value="organizations" className="space-y-4">
            <div className="flex gap-4 mb-6">
              <Select value={orgTypeFilter} onValueChange={setOrgTypeFilter}>
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="Тип организации" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все типы</SelectItem>
                  <SelectItem value="Corporation">Корпорация</SelectItem>
                  <SelectItem value="Think Tank">Think Tank</SelectItem>
                  <SelectItem value="Political Structure">Политическая структура</SelectItem>
                  <SelectItem value="Lobbying Group">Лоббистская группа</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {orgsLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : organizations && organizations.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {organizations.map((org) => (
                  <Card key={org.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start gap-4">
                        {org.logoUrl ? (
                          <img
                            src={org.logoUrl}
                            alt={org.name}
                            className="w-16 h-16 object-contain"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded bg-primary/10 flex items-center justify-center">
                            <Building2 className="h-8 w-8 text-primary" />
                          </div>
                        )}
                        <div className="flex-1">
                          <CardTitle className="text-lg">{org.name}</CardTitle>
                          <CardDescription className="mt-1">{org.type}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {org.description && (
                        <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                          {org.description}
                        </p>
                      )}
                      <div className="space-y-1 text-sm">
                        {org.founded && (
                          <p className="text-muted-foreground">
                            <strong>Основана:</strong> {org.founded}
                          </p>
                        )}
                        {org.headquarters && (
                          <p className="text-muted-foreground">
                            <strong>Штаб-квартира:</strong> {org.headquarters}
                          </p>
                        )}
                      </div>
                      <Link href={`/organization/${org.id}`}>
                        <Button variant="link" className="mt-4 p-0">
                          Подробнее →
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">
                    Организации не найдены. Попробуйте изменить параметры поиска.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Political Decisions Tab */}
          <TabsContent value="decisions" className="space-y-4">
            <div className="flex gap-4 mb-6">
              <Select value={decisionTypeFilter} onValueChange={setDecisionTypeFilter}>
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="Тип решения" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все типы</SelectItem>
                  <SelectItem value="Legislative Act">Законодательный акт</SelectItem>
                  <SelectItem value="Executive Order">Исполнительный указ</SelectItem>
                  <SelectItem value="Budget Resolution">Бюджетная резолюция</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {decisionsLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : decisions && decisions.length > 0 ? (
              <div className="space-y-4">
                {decisions.map((decision) => (
                  <Card key={decision.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <CardTitle className="text-lg">{decision.title}</CardTitle>
                          <CardDescription className="mt-2">
                            {decision.type} • {decision.category}
                          </CardDescription>
                        </div>
                        {decision.dateEnacted && (
                          <div className="text-sm text-muted-foreground">
                            {new Date(decision.dateEnacted).toLocaleDateString('ru-RU')}
                          </div>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      {decision.description && (
                        <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                          {decision.description}
                        </p>
                      )}
                      {decision.administration && (
                        <p className="text-sm text-muted-foreground mb-2">
                          <strong>Администрация:</strong> {decision.administration}
                        </p>
                      )}
                      <Link href={`/decision/${decision.id}`}>
                        <Button variant="link" className="p-0">
                          Подробнее →
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">
                    Политические решения не найдены. Попробуйте изменить параметры поиска.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
