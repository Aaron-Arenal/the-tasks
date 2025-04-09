import AppLayout from '@/layouts/app-layout';
import { TaskForm } from '@/components/task-form';
import { Head } from '@inertiajs/react';
import { Task } from '@/types';
import { useEffect, useState } from 'react';
import axios from '@/lib/axios-config';
import { Loader2 } from 'lucide-react';

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
            } catch (err) {
                setError('Error al cargar la tarea');
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
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin" />
                </div>
            </AppLayout>
        );
    }

    if (error || !task) {
        return (
            <AppLayout>
                <div className="flex justify-center items-center h-64 text-destructive">
                    {error || 'La tarea no existe'}
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout>
            <Head title={`Editar ${task.title}`} />
            <div className="container max-w-2xl py-8">
                <h1 className="text-2xl font-bold mb-6">Editar Tarea</h1>
                <TaskForm task={task} onSuccess={handleSuccess} />
            </div>
        </AppLayout>
    );
}