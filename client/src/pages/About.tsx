import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, Users, BookOpen, TrendingUp } from "lucide-react";
import { Link } from "wouter";

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">О проекте</h1>
              <p className="text-muted-foreground">
                Исследование американских элит в эпоху цифровой трансформации
              </p>
            </div>
            <Link href="/">
              <Button variant="outline">← На главную</Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="container py-12">
        {/* Introduction */}
        <section className="max-w-4xl mx-auto mb-16">
          <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <CardContent className="pt-8">
              <p className="text-lg leading-relaxed text-foreground">
                Проект <strong>«Американские элиты в эпоху цифровой трансформации»</strong> представляет собой комплексное научное исследование структуры, динамики и механизмов влияния американских элит на формирование внутренней и внешней политики США. Реализуется на базе Российского государственного гуманитарного университета (РГГУ) с целью создания уникальной аналитической платформы для академического и экспертного сообщества.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Goals and Objectives */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Цели и задачи проекта</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <Target className="h-10 w-10 text-primary mb-4" />
                <CardTitle>Анализ внешней политики США</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Прогнозирование элитных трансформаций и их влияния на внешнеполитический курс</li>
                  <li>• Идентификация механизмов принятия внешнеполитических решений</li>
                  <li>• Анализ сценариев санкционного давления</li>
                  <li>• Отслеживание влияния think tanks на стратегию США</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <TrendingUp className="h-10 w-10 text-primary mb-4" />
                <CardTitle>Анализ внутренней политики</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Мониторинг бюджетных приоритетов США</li>
                  <li>• Анализ лоббистской деятельности корпораций</li>
                  <li>• Изучение механизмов формирования политической повестки</li>
                  <li>• Отслеживание партийной динамики и внутриэлитных конфликтов</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <BookOpen className="h-10 w-10 text-primary mb-4" />
                <CardTitle>Академическая и образовательная сфера</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Подготовка специалистов по элитным исследованиям</li>
                  <li>• Формирование базы знаний для научных работ</li>
                  <li>• Развитие российской школы американистики</li>
                  <li>• Публикация рецензируемых исследований</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Users className="h-10 w-10 text-primary mb-4" />
                <CardTitle>Экономический и стратегический анализ</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Отслеживание финансовых потоков и корпоративных связей</li>
                  <li>• Выявление экономических рисков и возможностей</li>
                  <li>• Анализ влияния Big Tech на цифровую политику</li>
                  <li>• Понимание энергетической и военной стратегии США</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Methodology */}
        <section className="mb-16 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Методология исследования</h2>
          <Card>
            <CardContent className="pt-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-3">Сетевой анализ элит</h3>
                  <p className="text-muted-foreground">
                    Применение методов сетевого анализа для выявления структуры связей между персоналиями, организациями и политическими институтами. Построение интерактивных графов влияния и идентификация ключевых узлов власти.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">Анализ политических решений</h3>
                  <p className="text-muted-foreground">
                    Систематическое отслеживание законодательных актов, исполнительных указов и бюджетных резолюций с идентификацией элитных групп, оказавших влияние на их принятие. Анализ лоббистской активности и финансовых потоков.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">Мониторинг медиа и публичных заявлений</h3>
                  <p className="text-muted-foreground">
                    Автоматизированный мониторинг СМИ, социальных сетей и официальных заявлений ключевых персон с применением технологий обработки естественного языка (NLP) для выявления позиций по внутренней и внешней политике.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">Прогнозное моделирование</h3>
                  <p className="text-muted-foreground">
                    Разработка предиктивных моделей на основе исторических данных о элитных конфигурациях и политических решениях для прогнозирования вероятных сценариев развития внутренней и внешней политики США.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Target Audience */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Целевая аудитория</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="text-center">
              <CardHeader>
                <CardTitle>Основная аудитория</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground text-left">
                  <li>• Исследователи и преподаватели</li>
                  <li>• Эксперты-аналитики</li>
                  <li>• Сотрудники МИД России</li>
                  <li>• Специалисты по внешней политике</li>
                  <li>• Студенты и аспиранты</li>
                  <li>• Журналисты-международники</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <CardTitle>Вторичная аудитория</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground text-left">
                  <li>• Представители бизнес-сообщества</li>
                  <li>• Специалисты по международным отношениям</li>
                  <li>• Заинтересованная общественность</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <CardTitle>Прикладное значение</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground text-left">
                  <li>• Поддержка принятия решений</li>
                  <li>• Стратегическое планирование</li>
                  <li>• Академические исследования</li>
                  <li>• Образовательные программы</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Team Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Команда проекта</h2>
          <Card>
            <CardContent className="pt-8">
              <p className="text-center text-muted-foreground mb-6">
                Проект реализуется междисциплинарной командой исследователей РГГУ, специализирующихся в области американистики, политологии, социологии и международных отношений.
              </p>
              <div className="text-center">
                <Link href="/team">
                  <Button variant="default">Познакомиться с командой</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Partners */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Партнеры и спонсоры</h2>
          <Card>
            <CardContent className="pt-8">
              <div className="text-center">
                <div className="mb-6">
                  <img src="/logo.png" alt="РГГУ" className="h-20 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold">
                    Российский государственный гуманитарный университет
                  </h3>
                  <p className="text-muted-foreground mt-2">Основной партнер и организатор проекта</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* CTA */}
        <section className="text-center">
          <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
            <CardContent className="py-12">
              <h2 className="text-3xl font-bold mb-4">Присоединяйтесь к исследованию</h2>
              <p className="text-xl mb-8 text-primary-foreground/90 max-w-2xl mx-auto">
                Получите доступ к уникальной базе данных и аналитическим материалам
              </p>
              <div className="flex gap-4 justify-center">
                <Link href="/database">
                  <Button size="lg" variant="secondary">
                    Исследовать базу данных
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                    Связаться с нами
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
