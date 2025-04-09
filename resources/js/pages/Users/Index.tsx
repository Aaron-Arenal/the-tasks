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
            <div className="container max-w-6xl py-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Usuarios</h1>
                </div>
                <UsersList />
            </div>
        </AppLayout>
    );
}