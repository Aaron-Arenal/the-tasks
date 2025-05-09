import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Badge } from "./ui/badge";
import { AlertCircle, BookOpen, Briefcase, CheckCircle, Clock, DollarSign, Edit, Eye, Heart, Home, MoreVertical, Plane, Smartphone, Trash2, User, Users } from "lucide-react";
import { router } from "@inertiajs/react";
import { Task } from "@/types";
import { ReactNode } from "react";
import axios from '@/lib/axios-config';
import { toast } from "sonner";

interface TaskCardProps {
    task?: Task;
    onDelete?: (id: number) => void;
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

export function TaskCard({ task, onDelete }: TaskCardProps) {
    const categoryStyle = categoryColors[task?.category || "Personal"] ?? "bg-gray-100 text-gray-800";
    
    const handleView = () => router.get(`/tasks/${task?.id}`);
    const handleEdit = () => router.get(`/tasks/${task?.id}/edit`);
    const handleDelete = async () => {
        if (confirm("¿Estás seguro de que quieres eliminar esta tarea?")) {
            const response = await axios.delete(`/api/tasks/${task?.id}`);
            onDelete?.(task?.id || 0);
            toast.success(response.data.message);
        }
    };

    return (
        <div className={`w-full max-w-[1000px] relative rounded-2xl border border-border bg-background p-4 shadow-sm transition hover:shadow-md flex items-start gap-4 ${task?.is_urgent ? "border-l-4 border-l-destructive animate-pulse-short" : ""}`}>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="mt-1 cursor-pointer">
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

            <div className="flex flex-col self-center items-center justify-center w-full space-y-4">
                <div className="flex items-center justify-between w-full gap-2 mb-2">
                    <h2 className="text-lg font-semibold leading-tight">
                        {task?.title}
                        {task?.is_urgent && (
                            <span className="ml-2 text-destructive text-sm font-normal">
                                (Urgente)
                            </span>
                        )}
                    </h2>
                    <div className="hidden items-center gap-2 md:flex">
                        <Badge className={`text-xs ${categoryStyle}`}>
                            {categoryIcons[task?.category || "Personal"]}
                            {task?.category}
                        </Badge>
                        <Badge className={`text-xs ${statusStyles[task?.status || "Pendiente"]}`}>
                            <span className="flex items-center">
                                {statusIcons[task?.status || "Pendiente"]}
                                {task?.status}
                            </span>
                        </Badge>
                    </div>
                </div>
                <div className="flex items-center w-full gap-2 md:hidden">
                    <Badge className={`text-xs ${categoryStyle}`}>
                        {categoryIcons[task?.category || "Personal"]}
                        {task?.category}
                    </Badge>
                    <Badge className={`text-xs ${statusStyles[task?.status || "Pendiente"]}`}>
                        <span className="flex items-center">
                            {statusIcons[task?.status || "Pendiente"]}
                            {task?.status}
                        </span>
                    </Badge>
                </div>
                {task?.due_date && (
                    <p className="flex items-center w-full text-sm text-muted-foreground">
                        <Clock className="w-4 h-4 mr-1" />
                        Fecha límite: 
                        <span className="ml-1">{new Date(task?.due_date).toLocaleDateString()}</span>
                    </p>
                )}
                {task?.description && (
                    <p className="w-full text-sm text-muted-foreground line-clamp-2">
                        {task?.description}
                    </p>
                )}
            </div>
        </div>
    );
}