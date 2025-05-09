import { useEffect, useState } from "react";
import axios from '@/lib/axios-config';
import { Loader2 } from "lucide-react";

interface SummaryData {
    total_tasks: number;
    completed_tasks: number;
    in_progress_tasks: number;
    pending_tasks: number;
    urgent_tasks: number;
    category_counts: Record<string, number>;
}

const categoryColors: Record<string, string> = {
    trabajo: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    estudio: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300",
    casa: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
    personal: "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300",
    finanzas: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
    salud: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    viaje: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300",
    social: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
    tecnología: "bg-zinc-100 text-zinc-800 dark:bg-zinc-800/30 dark:text-zinc-300",
};

export function SummaryContent() {
    const [data, setData] = useState<SummaryData>();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios
            .get('/api/tasks/summary')
            .then((res) => {
                setData(res.data.data);
            })
            .catch((err) => {
                console.error(err)
            })
            .finally(() => setLoading(false));
    }, []);
    return (
        <div className="flex w-full max-w-[1000px] h-full flex-col gap-4 rounded-xl">
            <h1 className="text-2xl self-center font-bold">Resumen de Tareas</h1>
            {loading ? (
                <div className="flex flex-col justify-center items-center gap-2 h-64">
                    Cargando...
                    <Loader2 className="h-8 w-8 animate-spin" />
                </div>
            ) : (
                <div>    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="border border-gray-300 rounded-lg p-4 shadow-sm">
                            <h2 className="text-lg font-semibold">Total de Tareas</h2>
                            <p>{data?.total_tasks}</p>
                        </div>
                        <div className="border border-blue-800 text-blue-800 rounded-lg p-4 shadow-sm dark:border-blue-300 dark:text-blue-300">
                            <h2 className="text-lg font-semibold">Tareas en Progreso</h2>
                            <p>{data?.in_progress_tasks}</p>
                        </div>
                        <div className="border border-amber-800 text-amber-800 rounded-lg p-4 shadow-sm dark:border-amber-300 dark:text-amber-300">
                            <h2 className="text-lg font-semibold">Total Pendientes</h2>
                            <p>{data?.pending_tasks}</p>
                        </div>
                        <div className="border border-emerald-800 text-emerald-800 rounded-lg p-4 shadow-sm dark:border-emerald-300 dark:text-emerald-300">
                            <h2 className="text-lg font-semibold">Total Completadas</h2>
                            <p>{data?.completed_tasks}</p>
                        </div>
                    </div>

                    <h2 className="text-xl self-center font-bold my-6">Por Categoría</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Object.entries(data?.category_counts || {}).map(([category, count]) => (
                            <div key={category} className={`rounded-lg p-4 shadow-sm ${categoryColors[category]}`}>
                                <h2 className="text-lg font-semibold capitalize">{category}</h2>
                                <p>{count}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}