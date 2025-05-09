import { SummaryContent } from '@/components/summary-content';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Inicio',
        href: '/dashboard',
    },
];

export default function Dashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Inicio" />
            <div className="flex items-center w-full h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <SummaryContent />
            </div>
        </AppLayout>
    );
}
