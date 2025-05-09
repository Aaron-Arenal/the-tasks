import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Ban, Loader2, Save } from 'lucide-react';
import { User } from '@/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import axios from '@/lib/axios-config';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface EditUserDialogProps {
    user: User | null;
    onClose: () => void;
    onSuccess: () => void;
}

export default function EditUserDialog({ user, onClose, onSuccess }: EditUserDialogProps) {
    const [formData, setFormData] = useState({
        name: '',
        role: 'user'
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name,
                role: user.role
            });
        }
    }, [user]);

    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            await axios.put(`/api/admin/users/${user?.id}`, formData);
            onSuccess();
            onClose();
            toast.success('Usuario actualizado');
        } catch (error) {
            toast.error('Error al actualizar: ' + error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={!!user} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Editar usuario</DialogTitle>
                </DialogHeader>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label>Nombre</Label>
                        <Input
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                        />
                    </div>
                    
                    <div>
                        <Label>Rol</Label>
                        <Select
                            value={formData.role}
                            onValueChange={(value) => setFormData({...formData, role: value})}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Selecciona rol" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="user">Usuario</SelectItem>
                                <SelectItem value="admin">Administrador</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={onClose}>
                            <Ban className="w-4 h-4 mr-2" />
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {!loading && <Save className="w-4 h-4 mr-2" />}
                            Guardar
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}