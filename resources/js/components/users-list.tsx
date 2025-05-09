import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Edit, Loader2, MoreHorizontal, Trash2 } from 'lucide-react';
import axios from '@/lib/axios-config';
import { useEffect, useState } from 'react';
import { User } from '@/types';
import { Badge } from '@/components/ui/badge';
import EditUserDialog from '@/components/edit-user-dialog';
import { toast } from 'sonner';

export default function UsersList() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('/api/admin/users');
            setUsers(response.data.data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDelete = async (userId: number) => {
        if (confirm('¿Eliminar este usuario?')) {
            try {
                await axios.delete(`/api/admin/users/${userId}`);
                setUsers(prev => prev.filter(user => user.id !== userId));
                toast.success('Usuario eliminado exitosamente');
            } catch (error) {
                toast.error('Error al eliminar');
                console.log(error);
            }
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center gap-2 h-64">
                Cargando...
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    return (
        <div className="rounded-md border w-full max-w-[1000px]">
            <Table className="w-full">
                <TableHeader>
                    <TableRow className="hover:bg-transparent">
                        <TableHead>Nombre</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Rol</TableHead>
                        <TableHead className="w-24">Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.map((user) => (
                        <TableRow key={user.id} className="odd:bg-muted/40 even:bg-muted/20 hover:bg-muted/50 transition-colors">
                            <TableCell className="font-medium">{user.name}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                                <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                                    {user.role}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="cursor-pointer">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem className="cursor-pointer" onClick={() => setSelectedUser(user)}>
                                            <Edit className="w-4 h-4" />
                                            Editar
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="text-destructive cursor-pointer" onClick={() => handleDelete(user.id)}>
                                            <Trash2 className="w-4 h-4" />
                                            Eliminar
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <EditUserDialog
                user={selectedUser}
                onClose={() => setSelectedUser(null)}
                onSuccess={fetchUsers}
            />
        </div>
    );
}