import { useForm } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { AlertCircle, Ban, BookOpen, Briefcase, CalendarIcon, CheckCircle, Clock, DollarSign, Heart, Home, Loader2, Plane, Save, Smartphone, User, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Task } from '@/types';
import axios from '@/lib/axios-config';
import { toast } from "sonner";
import { ReactNode } from "react";

interface TaskFormProps {
    task?: Task;
    onSuccess?: () => void;
}


enum TaskStatus {
    Pendiente = 'Pendiente',
    EnProgreso = 'En progreso',
    Completada = 'Completada'
}

enum TaskCategory {
    Trabajo = 'Trabajo',
    Estudio = 'Estudio',
    Casa = 'Casa',
    Personal = 'Personal',
    Finanzas = 'Finanzas',
    Salud = 'Salud',
    Viaje = 'Viaje',
    Social = 'Social',
    Tecnologia = 'Tecnología'
}

const statusIcons: Record<string, ReactNode> = {
    Pendiente: <AlertCircle className="w-4 h-4 mr-0.5" />,
    "En progreso": <Clock className="w-4 h-4 mr-0.5" />,
    Completada: <CheckCircle className="w-4 h-4 mr-0.5" />,
};

const categoryIcons: Record<string, ReactNode> = {
    Trabajo: <Briefcase className="w-4 h-4 mr-0.5" />,
    Estudio: <BookOpen className="w-4 h-4 mr-0.5" />,
    Casa: <Home className="w-4 h-4 mr-0.5" />,
    Personal: <User className="w-4 h-4 mr-0.5" />,
    Finanzas: <DollarSign className="w-4 h-4 mr-0.5" />,
    Salud: <Heart className="w-4 h-4 mr-0.5" />,
    Viaje: <Plane className="w-4 h-4 mr-0.5" />,
    Social: <Users className="w-4 h-4 mr-0.5" />,
    Tecnología: <Smartphone className="w-4 h-4 mr-0.5" />,
}

export function TaskForm({ task, onSuccess }: TaskFormProps) {
    const { data, setData, processing, errors } = useForm({
        title: task?.title || '',
        description: task?.description || '',
        status: task?.status || TaskStatus.Pendiente,
        due_date: task?.due_date ? new Date(task.due_date) : null,
        is_urgent: task?.is_urgent || false,
        category: task?.category || TaskCategory.Personal,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const normalizedData = {
            ...data,
            status: data.status.toLowerCase() as TaskStatus,
            category: data.category.toLowerCase() as TaskCategory
        };
        
        try {
            if (task) {
                await axios.put(`/api/tasks/${task.id}`, normalizedData);
            } else {
                await axios.post('/api/tasks', normalizedData);
            }
            onSuccess?.();
            
        } catch (error) {
            toast.error(`Error al ${task ? 'actualizar' : 'crear'} la tarea`);
            console.error(error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-[1000px]">
            <div className="space-y-4">
                <div>
                    <Label htmlFor="title">Título *</Label>
                    <Input
                        id="title"
                        value={data.title}
                        onChange={(e) => setData('title', e.target.value)}
                        placeholder="Nombre de la tarea"
                        className={errors.title ? 'border-destructive' : ''}
                    />
                    {errors.title && (
                        <p className="text-sm text-destructive mt-1">{errors.title}</p>
                    )}
                </div>

                <div>
                    <Label htmlFor="description">Descripción</Label>
                    <Textarea
                        id="description"
                        value={data.description}
                        onChange={(e) => setData('description', e.target.value)}
                        placeholder="Detalles de la tarea"
                        rows={4}
                    />
                </div>

                <div>
                    <Label>Estado *</Label>
                    <Select
                        value={data.status}
                        onValueChange={(value) => setData('status', value as TaskStatus)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Selecciona un estado" />
                        </SelectTrigger>
                        <SelectContent>
                            {Object.values(TaskStatus).map((status) => (
                                <SelectItem key={status} value={status}>
                                    {statusIcons[status || "Pendiente"]}
                                    {status}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <Label>Fecha límite</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className={cn(
                                    "w-full justify-start text-left font-normal",
                                    !data.due_date && "text-muted-foreground"
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {data.due_date ? (
                                    new Date(data.due_date).toLocaleDateString()
                                ) : (
                                    <span>Seleccionar fecha</span>
                                )}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar
                                mode="single"
                                selected={data.due_date || undefined}
                                onSelect={(date) => setData('due_date', date || null)}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                </div>

                <div>
                    <Label>Categoría</Label>
                    <Select
                        value={data.category}
                        onValueChange={(value) => setData('category', value as TaskCategory)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Selecciona una categoría" />
                        </SelectTrigger>
                        <SelectContent>
                            {Object.values(TaskCategory).map((category) => (
                                <SelectItem key={category} value={category}>
                                    {categoryIcons[category || "Personal"]}
                                    {category}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="flex justify-end gap-4">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => window.history.back()}
                    disabled={processing}
                >
                    <Ban className="w-4 h-4 mr-2" />
                    Cancelar
                </Button>
                <Button type="submit" disabled={processing}>
                    {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {!processing && <Save className="w-4 h-4 mr-2" />}
                    {task ? 'Actualizar tarea' : 'Crear tarea'}
                </Button>
            </div>
        </form>
    );
}