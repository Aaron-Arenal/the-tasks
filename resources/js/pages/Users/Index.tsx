import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import UsersList from '@/components/users-list';
import { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Usuarios',
        href: '/users',
    },
];

export default function UsersIndex() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Gestión de usuarios" />
            <div className="flex items-center w-full h-full flex-1 flex-col gap-4 rounded-xl p-8">
                <h1 className="text-2xl font-bold">Usuarios</h1>
                <UsersList />
            </div>
        </AppLayout>
    );
}