import { TaskCard } from '@/components/task-card';
import AppLayout from '@/layouts/app-layout';
import { Task, type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import axios from '@/lib/axios-config';
import { ReactNode, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, BookOpen, Briefcase, CheckCircle, ChevronDown, ChevronUp, Clock, DollarSign, Heart, Home, Loader2, Plane, PlusCircle, Smartphone, User, Users } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tareas',
        href: '/tasks',
    },
];

const statusOptions: { label: string; value: string; icon: ReactNode }[] = [
    { label: 'Pendientes', value: 'pendiente', icon: <AlertCircle className="w-4 h-4 mr-0.5" /> },
    { label: 'En Progreso', value: 'en progreso', icon: <Clock className="w-4 h-4 mr-0.5" /> },
    { label: 'Completadas', value: 'completada', icon: <CheckCircle className="w-4 h-4 mr-0.5" /> }
];

const categoryOptions: { label: string; value: string; icon: ReactNode }[] = [
    { label: 'Trabajo', value: 'trabajo', icon: <Briefcase className="w-4 h-4 mr-0.5" /> },
    { label: 'Estudio', value: 'estudio', icon: <BookOpen className="w-4 h-4 mr-0.5" /> },
    { label: 'Casa', value: 'casa', icon: <Home className="w-4 h-4 mr-0.5" /> },
    { label: 'Personal', value: 'personal', icon: <User className="w-4 h-4 mr-0.5" /> },
    { label: 'Finanzas', value: 'finanzas', icon: <DollarSign className="w-4 h-4 mr-0.5" /> },
    { label: 'Salud', value: 'salud', icon: <Heart className="w-4 h-4 mr-0.5" /> },
    { label: 'Viaje', value: 'viaje', icon: <Plane className="w-4 h-4 mr-0.5" /> },
    { label: 'Social', value: 'social', icon: <Users className="w-4 h-4 mr-0.5" /> },
    { label: 'Tecnología', value: 'tecnología', icon: <Smartphone className="w-4 h-4 mr-0.5" /> }
];

export default function TasksIndex() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCollapsed, setIsCollapsed] = useState(true);
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState(search);
    const [status, setStatus] = useState('0');
    const [category, setCategory] = useState('0');
    const [urgent, setUrgent] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(min-width: 768px)');

        const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
            setIsCollapsed(!e.matches);
        };

        handleChange(mediaQuery);

        mediaQuery.addEventListener('change', handleChange);

        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(search);
        }, 500);

        return () => clearTimeout(handler);
    }, [search]);

    useEffect(() => {
        setLoading(true);
        axios
            .get('/api/tasks', {
                params: {
                    search: debouncedSearch,
                    status: status === '0' ? undefined : status,
                    category: category === '0' ? undefined : category,
                    is_urgent: urgent ? true: undefined
                }
            })
            .then((res) => {
                setTasks(res.data.data);
            })
            .catch((err) => {
                console.error(err);
            })
            .finally(() => setLoading(false));
    }, [debouncedSearch, status, category, urgent]);

    const handleTaskDeleted = (deletedId: number) => {
        setTasks(prev => prev.filter(task => task.id !== deletedId));
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {;
        setSearch(e.target.value.toLowerCase());
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tareas" />
            <div className="flex items-center w-full h-full flex-1 flex-col gap-4 rounded-xl p-8">
                <h1 className="text-2xl font-bold">Mis Tareas</h1>
                <Collapsible 
                    open={!isCollapsed}
                    onOpenChange={(open) => setIsCollapsed(!open)}
                    className="w-full max-w[1000px]"
                >
                    <div className="flex items-center justify-between md:hidden mb-2">
                        <span className="font-semibold">Filtros</span>
                        <CollapsibleTrigger asChild>
                            <Button variant="ghost" size="sm">
                                {isCollapsed ? (
                                    <>
                                        <ChevronDown className="mr-1 h-4 w-4" />
                                        Mostrar
                                    </>
                                ) : (
                                    <>
                                        <ChevronUp className="mr-1 h-4 w-4" />
                                        Ocultar
                                    </>
                                )}
                            </Button>
                        </CollapsibleTrigger>
                    </div>

                    <CollapsibleContent>
                        <div className="flex flex-col items-center w-full gap-4 md:flex-row">
                            <div className="flex flex-col items-center gap-2 md:w-[30%]">
                                <Label htmlFor="search">Búsqueda</Label>
                                <Input 
                                    id="search"
                                    type="search"
                                    value={search}
                                    placeholder="Buscar tarea..."
                                    onChange={(e) => handleSearch(e)}
                                />
                            </div>
                            <div className="flex items-center gap-4 md:w-[70%]">
                                <div className="flex flex-col items-center gap-2 md:w-2/5">
                                    <Label>Filtrar por estado</Label>
                                    <Select
                                        value={status}
                                        onValueChange={(value) => setStatus(value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecciona un estado" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="0">Todos</SelectItem>
                                            {statusOptions.map((option) => (
                                                <SelectItem key={option.value} value={option.value}>
                                                    {option.icon}
                                                    {option.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex flex-col items-center gap-2 md:w-2/5">
                                    <Label>Filtrar por categoría</Label>
                                    <Select
                                        value={category}
                                        onValueChange={(value) => setCategory(value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecciona una categoría" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="0">Todas</SelectItem>
                                            {categoryOptions.map((option) => (
                                                <SelectItem key={option.value} value={option.value}>
                                                    {option.icon}
                                                    {option.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex items-center gap-2 md:w-1/5">
                                    <Switch 
                                        id="justUrgent"
                                        checked={urgent}
                                        onCheckedChange={(checked) => setUrgent(checked)}
                                    />
                                    <Label htmlFor="justUrgent">Solo urgentes</Label>
                                </div>
                            </div>
                        </div>
                    </CollapsibleContent>
                </Collapsible>
                
                <Button asChild className="w-full max-w-[1000px] mb-4">
                    <Link href={route('tasks.create')} className="gap-1">
                        <PlusCircle className="w-4 h-4" />
                        Nueva Tarea
                    </Link>
                </Button>
                {loading ? (
                    <div className="flex flex-col justify-center items-center gap-2 h-64">
                        Cargando...
                        <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                ) : (
                    <div className="flex w-full items-center flex-col space-y-3">
                        {tasks.length === 0 && (
                            <div className="flex flex-col justify-center items-center gap-2 h-64">
                                No hay tareas que mostrar.
                                <BookOpen className="h-8 w-8" />
                            </div>
                        )}
                        {tasks.map((task) => (
                            <TaskCard key={task.id} task={task} onDelete={handleTaskDeleted}/>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
