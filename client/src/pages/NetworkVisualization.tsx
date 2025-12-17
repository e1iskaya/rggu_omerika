import { useEffect, useRef, useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Network, Loader2, ZoomIn, ZoomOut, Maximize } from "lucide-react";
import { Link } from "wouter";

export default function NetworkVisualization() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedElite, setSelectedElite] = useState<number | null>(null);
  const [zoom, setZoom] = useState(1);

  const { data: elites } = trpc.elites.getAll.useQuery();
  const { data: connections, isLoading } = trpc.elites.getConnections.useQuery(
    { eliteId: selectedElite! },
    { enabled: !!selectedElite }
  );

  useEffect(() => {
    if (!canvasRef.current || !connections || !elites) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Simple network visualization
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(canvas.width, canvas.height) * 0.35 * zoom;

    // Draw central node
    ctx.fillStyle = "#1e3a8a"; // Navy blue
    ctx.beginPath();
    ctx.arc(centerX, centerY, 40, 0, 2 * Math.PI);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.font = "12px Inter";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const centralElite = elites.find(e => e.id === selectedElite);
    if (centralElite) {
      const name = centralElite.name.split(" ");
      ctx.fillText(name[0] || "", centerX, centerY - 5);
      ctx.fillText(name.slice(1).join(" "), centerX, centerY + 10);
    }

    // Draw connected nodes
    connections.forEach((conn, index) => {
      const angle = (2 * Math.PI * index) / connections.length;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);

      // Draw connection line
      ctx.strokeStyle = "#d4af37"; // Gold
      ctx.lineWidth = Math.max(1, (conn.strength || 1) * 2);
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(x, y);
      ctx.stroke();

      // Draw node
      ctx.fillStyle = "#d4af37"; // Gold
      ctx.beginPath();
      ctx.arc(x, y, 25, 0, 2 * Math.PI);
      ctx.fill();

      // Draw connection type label
      ctx.fillStyle = "#1e3a8a";
      ctx.font = "10px Inter";
      ctx.textAlign = "center";
      ctx.fillText(conn.connectionType, x, y);
    });
  }, [connections, elites, selectedElite, zoom]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Визуализация сетей</h1>
              <p className="text-muted-foreground">
                Интерактивный граф связей между элитами и организациями
              </p>
            </div>
            <Link href="/">
              <Button variant="outline">← На главную</Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Controls */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Настройки</CardTitle>
                <CardDescription>Выберите персону для анализа</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Центральная персона</label>
                  <Select
                    value={selectedElite?.toString()}
                    onValueChange={(val) => setSelectedElite(parseInt(val))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите персону" />
                    </SelectTrigger>
                    <SelectContent>
                      {elites?.slice(0, 20).map((elite) => (
                        <SelectItem key={elite.id} value={elite.id.toString()}>
                          {elite.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Масштаб</label>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
                    >
                      <ZoomOut className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setZoom(Math.min(2, zoom + 0.1))}
                    >
                      <ZoomIn className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setZoom(1)}
                    >
                      <Maximize className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {selectedElite && connections && (
              <Card>
                <CardHeader>
                  <CardTitle>Статистика</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Всего связей:</span>
                      <span className="font-semibold">{connections.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Профессиональных:</span>
                      <span className="font-semibold">
                        {connections.filter(c => c.connectionType === "Professional").length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Политических:</span>
                      <span className="font-semibold">
                        {connections.filter(c => c.connectionType === "Political").length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Финансовых:</span>
                      <span className="font-semibold">
                        {connections.filter(c => c.connectionType === "Financial").length}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Visualization Canvas */}
          <div className="lg:col-span-3">
            <Card className="h-[600px]">
              <CardContent className="p-0 h-full">
                {!selectedElite ? (
                  <div className="flex flex-col items-center justify-center h-full text-center p-8">
                    <Network className="h-16 w-16 text-muted-foreground mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Выберите персону</h3>
                    <p className="text-muted-foreground max-w-md">
                      Выберите персону из списка слева для визуализации её связей с другими элитами и организациями
                    </p>
                  </div>
                ) : isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : connections && connections.length > 0 ? (
                  <canvas
                    ref={canvasRef}
                    className="w-full h-full"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center p-8">
                    <Network className="h-16 w-16 text-muted-foreground mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Нет данных о связях</h3>
                    <p className="text-muted-foreground">
                      Для выбранной персоны пока не добавлены связи в базу данных
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Легенда</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-primary"></div>
                    <span>Центральная персона</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-secondary"></div>
                    <span>Связанная персона</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-1 bg-secondary"></div>
                    <span>Связь</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-2 bg-secondary"></div>
                    <span>Сильная связь</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
