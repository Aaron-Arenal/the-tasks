import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Badge } from "./ui/badge";
import { AlertCircle, CheckCircle, Clock, Edit, Eye, MoreVertical, Trash2 } from "lucide-react";
import { router } from "@inertiajs/react";
import { Task } from "@/types";
import { ReactNode } from "react";
import axios from '@/lib/axios-config';

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

export function TaskCard({ task, onDelete }: {task: Task; onDelete?: (id: number) => void;}) {
    const categoryStyle = categoryColors[task.category] ?? "bg-gray-100 text-gray-800";
    
    const handleView = () => router.get(`/tasks/${task.id}`);
    const handleEdit = () => router.get(`/tasks/${task.id}/edit`);
    const handleDelete = async () => {
        if (confirm("¿Estás seguro de que quieres eliminar esta tarea?")) {
            const response = await axios.delete(`/api/tasks/${task.id}`);
            onDelete?.(task.id);
            console.log(response.data.message);
        }
    };

    return (
        <div className={`relative rounded-2xl border border-border bg-background p-4 shadow-sm transition hover:shadow-md flex items-start gap-4 ${task.is_urgent ? "border-l-4 border-l-destructive animate-pulse-short" : ""}`}>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="mt-1">
                        <MoreVertical className="w-5 h-5" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="bottom" align="start">
                    <DropdownMenuItem onClick={handleView} className="cursor-pointer">
                        <Eye className="w4- h-4 mr-2" />
                        Ver
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleEdit} className="cursor-pointer">
                        <Edit className="w4- h-4 mr-2" />
                        Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleDelete} className="cursor-pointer text-destructive focus:text-destructive">
                        <Trash2 className="w4- h-4 mr-2" />
                        Eliminar
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2 mb-2">
                    <h2 className="text-lg font-semibold leading-tight">
                        {task.title}
                        {task.is_urgent && (
                            <span className="ml-2 text-destructive text-sm font-normal">
                                (Urgente)
                            </span>
                        )}
                    </h2>
                    <Badge className={`text-xs ${statusStyles[task.status]}`}>
                        <span className="flex items-center">
                        {statusIcons[task.status]}
                        {task.status}
                        </span>
                    </Badge>
                </div>
                {task.due_date && (
                    <p className="text-sm text-muted-foreground">
                        Fecha límite: {new Date(task.due_date).toLocaleDateString()}
                    </p>
                )}
                <p className="text-sm text-muted-foreground line-clamp-2">
                    {task.description || "Sin descripción"}
                </p>
            </div>

            {task.category && (
                <div className="flex">
                    <Badge className={`text-xs ${categoryStyle}`}>{task.category}</Badge>
                </div>
            )}
        </div>
    );
}