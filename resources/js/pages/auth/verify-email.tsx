// Components
import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import AuthLayout from '@/layouts/auth-layout';

export default function VerifyEmail({ status }: { status?: string }) {
    const { post, processing } = useForm({});

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('verification.send'));
    };

    return (
        <AuthLayout title="Verificar correo" description="Por favor verifica tu correo electrónico usando el enlace que te enviamos.">
            <Head title="Verificar correo electrónico" />

            {status === 'verification-link-sent' && (
                <div className="mb-4 text-center text-sm font-medium text-green-600">
                    Una nueva verificación ha sido enviada a la dirección de correo electrónico que proporcionaste durante el registro.
                </div>
            )}

            <form onSubmit={submit} className="space-y-6 text-center">
                <Button disabled={processing} variant="secondary">
                    {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                    {processing ? 'Enviando...' : 'Reenviar enlace de verificación'}
                </Button>

                <TextLink href={route('logout')} method="post" className="mx-auto block text-sm">
                    Cierra sesión
                </TextLink>
            </form>
        </AuthLayout>
    );
}
