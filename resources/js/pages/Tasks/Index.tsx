import { TaskCard } from '@/components/task-card';
import AppLayout from '@/layouts/app-layout';
import { Task, type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import axios from '@/lib/axios-config';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tareas',
        href: '/tasks',
    },
];

export default function TasksIndex() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios
            .get('/api/tasks')
            .then((res) => {
                setTasks(res.data.data);
            })
            .catch((err) => {
                console.error(err);
            })
            .finally(() => setLoading(false));
    }, []);

    const handleTaskDeleted = (deletedId: number) => {
        setTasks(prev => prev.filter(task => task.id !== deletedId));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tareas" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <h1 className="text-2xl font-bold">Mis Tareas</h1>
                <Button asChild>
                <Link href={route('tasks.create')} className="gap-1">
                    <PlusCircle className="w-4 h-4" />
                    Nueva Tarea
                </Link>
                </Button>
                {loading ? (
                    <p>Cargando tareas...</p>
                ) : (
                    <div className="space-y-3">
                        {tasks.map((task) => (
                            <TaskCard key={task.id} task={task} onDelete={handleTaskDeleted}/>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
