import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, BookOpen, Briefcase, CalendarIcon, CheckCircle, Clock, DollarSign, Edit, Heart, Home, Plane, Smartphone, Trash2, Undo2, User, Users } from 'lucide-react';
import axios from '@/lib/axios-config';
import { ReactNode, useEffect, useState } from 'react';
import { Task } from '@/types';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
    id: number;
}

const categoryColors: Record<string, string> = {
    Trabajo: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    Estudio: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300",
    Casa: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
    Personal: "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300",
    Finanzas: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
    Salud: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    Viaje: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300",
    Social: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
    Tecnología: "bg-zinc-100 text-zinc-800 dark:bg-zinc-800/30 dark:text-zinc-300",
};
const categoryIcons: Record<string, ReactNode> = {
    Trabajo: <Briefcase className="w-4 h-4 mr-1" />,
    Estudio: <BookOpen className="w-4 h-4 mr-1" />,
    Casa: <Home className="w-4 h-4 mr-1" />,
    Personal: <User className="w-4 h-4 mr-1" />,
    Finanzas: <DollarSign className="w-4 h-4 mr-1" />,
    Salud: <Heart className="w-4 h-4 mr-1" />,
    Viaje: <Plane className="w-4 h-4 mr-1" />,
    Social: <Users className="w-4 h-4 mr-1" />,
    Tecnología: <Smartphone className="w-4 h-4 mr-1" />,
}

const statusStyles: Record<string, string> = {
    Pendiente: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
    "En progreso": "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    Completada: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
};
const statusIcons: Record<string, ReactNode> = {
    Pendiente: <AlertCircle className="w-4 h-4 mr-1" />,
    "En progreso": <Clock className="w-4 h-4 mr-1" />,
    Completada: <CheckCircle className="w-4 h-4 mr-1" />,
};

export default function TaskShow({ id }: Props) {
    const [task, setTask] = useState<Task | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTask = async () => {
            try {
                const response = await axios.get(`/api/tasks/${id}`);
                setTask(response.data.data);
            } catch (err) {
                setError('Error al cargar la tarea');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchTask();
    }, [id]);

    const handleDelete = async () => {
        if (confirm('¿Estás seguro de eliminar esta tarea?')) {
            try {
                await axios.delete(`/api/tasks/${id}`);
                toast.success('Tarea eliminada correctamente');
                window.location.href = '/tasks';
            } catch (error) {
                toast.error('Error al eliminar la tarea');
                console.log(error);
            }
        }
    };

    if (loading) {
        return (
            <AppLayout>
                <div className="flex flex-col justify-center items-center gap-2 h-64">
                    Cargando...
                    <Loader2 className="h-8 w-8 animate-spin" />
                </div>
            </AppLayout>
        );
    }

    if (error || !task) {
        return (
            <AppLayout>
                <div className="flex flex-col justify-center items-center h-64">
                    <h1 className="text-2xl font-bold text-destructive" >{error || 'La tarea no existe'}</h1>
                    <Button variant="outline" onClick={() => window.history.back()} className="mt-4">
                        Volver atrás
                    </Button>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout>
            <Head title={task.title} />
            <div className="flex items-center flex-col flex-1 gap-4 rounded-xl p-4">
                <div className="w-full max-w-[1000px] space-y-6">
                    <div className="flex flex-wrap w-full justify-between items-start gap-2">
                        <h1 className="text-3xl font-bold">{task.title}</h1>
                        <div className="flex gap-2">
                            <Button asChild variant="outline">
                                <Link href={route('tasks.edit', task.id)}>
                                    <Edit className="w-4 h-4 mr-2" />
                                    Editar
                                </Link>
                            </Button>
                            <Button variant="destructive" onClick={handleDelete}>
                                <Trash2 className="w-4 h-4 mr-2" />
                                Eliminar
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <Badge className={statusStyles[task.status]}>
                                {statusIcons[task.status]}
                                {task.status}
                            </Badge>
                            {task.is_urgent && (
                                <Badge variant="destructive">Urgente</Badge>
                            )}
                        </div>

                        {task.due_date && (
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <CalendarIcon className="w-4 h-4" />
                                <span>Fecha de creación: {new Date(task.created_at).toLocaleDateString()}</span>
                                <span> - </span>
                                <CalendarIcon className="w-4 h-4" />
                                <span>Fecha límite: {new Date(task.due_date).toLocaleDateString()}</span>
                            </div>
                        )}

                        {task.category && (
                            <Badge className={categoryColors[task.category]}>
                                 {categoryIcons[task?.category || "Personal"]}
                                 {task?.category}
                            </Badge>
                        )}

                        <div className="prose dark:prose-invert">
                            <p className="text-foreground">
                                {task.description || 'Sin descripción adicional'}
                            </p>
                        </div>
                    </div>

                    <Button variant="outline" onClick={() => window.history.back()} className="mt-4">
                        <Undo2 className="w-4 h-4 mr-2" />
                        Volver atrás
                    </Button>
                </div>
            </div>
        </AppLayout>
    );
}