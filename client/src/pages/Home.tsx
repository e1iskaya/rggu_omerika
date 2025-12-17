import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getLoginUrl } from "@/const";
import { Database, Users, FileText, Calendar, BookOpen, TrendingUp, Network, Download } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="AEF Logo" className="h-12 w-12" />
              <div>
                <h1 className="text-xl font-bold text-foreground">Американская элита будущего</h1>
                <p className="text-xs text-muted-foreground">American Elite of the Future</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/database" className="text-sm font-medium hover:text-primary transition-colors">
                База данных
              </Link>
              <Link href="/analytics" className="text-sm font-medium hover:text-primary transition-colors">
                Аналитика
              </Link>
              <Link href="/publications" className="text-sm font-medium hover:text-primary transition-colors">
                Публикации
              </Link>
              <Link href="/events" className="text-sm font-medium hover:text-primary transition-colors">
                Мероприятия
              </Link>
              <Link href="/about" className="text-sm font-medium hover:text-primary transition-colors">
                О проекте
              </Link>
              {isAuthenticated ? (
                <Link href="/dashboard">
                  <Button variant="default" size="sm">Личный кабинет</Button>
                </Link>
              ) : (
                <Button variant="default" size="sm" asChild>
                  <a href={getLoginUrl()}>Войти</a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Исследование американских элит в эпоху цифровой трансформации
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-foreground/90">
              Комплексная интерактивная аналитическая платформа для изучения структуры, динамики и влияния американских элит на формирование политики США
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/database">
                <Button size="lg" variant="secondary" className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Перейти к базе данных
                </Button>
              </Link>
              <Link href="/about">
                <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                  Узнать больше о проекте
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Key Statistics */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="text-center">
              <CardHeader>
                <CardTitle className="text-4xl font-bold text-primary">500+</CardTitle>
                <CardDescription>Персоналий в базе</CardDescription>
              </CardHeader>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <CardTitle className="text-4xl font-bold text-primary">200+</CardTitle>
                <CardDescription>Организаций</CardDescription>
              </CardHeader>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <CardTitle className="text-4xl font-bold text-primary">150+</CardTitle>
                <CardDescription>Политических решений</CardDescription>
              </CardHeader>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <CardTitle className="text-4xl font-bold text-primary">50+</CardTitle>
                <CardDescription>Аналитических отчетов</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-foreground">Возможности платформы</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Инструменты для глубокого анализа американских элит и их влияния на политические процессы
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Database className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Интерактивная база данных</CardTitle>
                <CardDescription>
                  Расширенный поиск и фильтрация по персоналиям, организациям и политическим решениям с детальными профилями
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Network className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Визуализация сетей</CardTitle>
                <CardDescription>
                  Интерактивные графы связей между элитами, корпорациями и политическими структурами
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <TrendingUp className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Аналитические отчеты</CardTitle>
                <CardDescription>
                  Ежемесячные бюллетени, квартальные отчеты и кейс-стади по ключевым политическим процессам
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <FileText className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Научные публикации</CardTitle>
                <CardDescription>
                  База рецензируемых статей, исследований и презентаций команды проекта
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Calendar className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Календарь мероприятий</CardTitle>
                <CardDescription>
                  Семинары, конференции и круглые столы с возможностью регистрации и доступом к записям
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <BookOpen className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Образовательные ресурсы</CardTitle>
                <CardDescription>
                  Учебные материалы, методические пособия и курсы по элитным исследованиям
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Access Levels */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-foreground">Уровни доступа</h2>
            <p className="text-xl text-muted-foreground">
              Выберите подходящий уровень доступа к аналитическим материалам
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Гостевой доступ</CardTitle>
                <CardDescription className="text-lg">Базовый просмотр</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>Просмотр открытой части базы данных</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>Доступ к публичным материалам</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>Чтение новостей и анонсов</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-primary border-2">
              <CardHeader>
                <CardTitle className="text-2xl">Зарегистрированный</CardTitle>
                <CardDescription className="text-lg">Расширенный доступ</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>Полный доступ к базе данных</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>Квартальные аналитические отчеты</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>Экспорт данных (CSV, Excel)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>Подписка на рассылки</span>
                  </li>
                </ul>
                <Button className="w-full mt-6" asChild>
                  <a href={getLoginUrl()}>Зарегистрироваться</a>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Экспертный</CardTitle>
                <CardDescription className="text-lg">Полный доступ</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>Все материалы без ограничений</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>Доступ к API</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>Прогнозные модели</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>Полная выгрузка данных</span>
                  </li>
                </ul>
                <Button className="w-full mt-6" variant="outline" asChild>
                  <Link href="/expert-access">
                    <a>Подать заявку</a>
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Начните исследование сегодня</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-primary-foreground/90">
            Получите доступ к уникальной базе данных и аналитическим материалам о структуре американских элит
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/database">
                <a>Исследовать базу данных</a>
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary" asChild>
              <a href={getLoginUrl()}>Создать аккаунт</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img src="/logo.png" alt="AEF Logo" className="h-10 w-10" />
                <span className="font-bold text-lg">AEF</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Российский государственный гуманитарный университет (РГГУ)
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Разделы</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/database"><a className="hover:text-primary transition-colors">База данных</a></Link></li>
                <li><Link href="/analytics"><a className="hover:text-primary transition-colors">Аналитика</a></Link></li>
                <li><Link href="/publications"><a className="hover:text-primary transition-colors">Публикации</a></Link></li>
                <li><Link href="/events"><a className="hover:text-primary transition-colors">Мероприятия</a></Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Информация</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/about"><a className="hover:text-primary transition-colors">О проекте</a></Link></li>
                <li><Link href="/team"><a className="hover:text-primary transition-colors">Команда</a></Link></li>
                <li><Link href="/methodology"><a className="hover:text-primary transition-colors">Методология</a></Link></li>
                <li><Link href="/contact"><a className="hover:text-primary transition-colors">Контакты</a></Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Подписка</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Получайте последние новости и аналитические материалы
              </p>
              <Button variant="default" size="sm" asChild>
                <Link href="/newsletter">
                  <a>Подписаться</a>
                </Link>
              </Button>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 Американская элита будущего. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
