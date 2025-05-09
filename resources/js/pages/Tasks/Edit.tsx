import AppLayout from '@/layouts/app-layout';
import { TaskForm } from '@/components/task-form';
import { Head } from '@inertiajs/react';
import { Task } from '@/types';
import { useEffect, useState } from 'react';
import axios from '@/lib/axios-config';
import { Loader2, Undo2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface Props {
    id: number;
}

export default function TaskEdit({ id }: Props) {
    const [task, setTask] = useState<Task | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const handleSuccess = () => {
        window.history.back();
    };

    useEffect(() => {
        const fetchTask = async () => {
            try {
                const response = await axios.get(`/api/tasks/${id}`);
                setTask(response.data.data);
                toast.success(response.data.message);
            } catch (err) {
                setError('La tarea no existe');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchTask();
    }, [id]);

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
                        <Undo2 className="w-4 h-4 mr-2" />
                        Volver atrás
                    </Button>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout>
            <Head title={`Editar ${task.title}`} />
            <div className="flex items-center h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <h1 className="text-2xl font-bold mb-6">Editar Tarea</h1>
                <TaskForm task={task} onSuccess={handleSuccess} />
            </div>
        </AppLayout>
    );
}