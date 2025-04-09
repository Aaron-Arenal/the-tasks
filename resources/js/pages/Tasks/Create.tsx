import AppLayout from '@/layouts/app-layout';
import { TaskForm } from '@/components/task-form';
import { Head } from '@inertiajs/react';

export default function TaskCreate() {
    const handleSuccess = () => {
        window.history.back();
    };

    return (
        <AppLayout>
            <Head title="Crear nueva tarea" />
            <div className="container max-w-2xl py-8">
                <h1 className="text-2xl font-bold mb-6">Crear Nueva Tarea</h1>
                <TaskForm onSuccess={handleSuccess}/>
            </div>
        </AppLayout>
    );
}