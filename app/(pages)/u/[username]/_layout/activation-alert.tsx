'use client';

import { useSnackbar } from 'notistack';
import MaterialSymbolsInfoRounded from '~icons/material-symbols/info-rounded';



import { useParams } from 'next/navigation';



import { useQueryClient } from '@tanstack/react-query';



import { Button } from '@/app/_components/ui/button';
import resendActivation from '@/utils/api/auth/resendActivation';
import { useAuthContext } from '@/utils/providers/auth-provider';


const Component = () => {
    const params = useParams();
    const { enqueueSnackbar } = useSnackbar();
    const { secret } = useAuthContext();
    const queryClient = useQueryClient();

    const user: Hikka.User | undefined = queryClient.getQueryData([
        'user',
        params.username,
    ]);

    const loggedUser: Hikka.User | undefined = queryClient.getQueryData([
        'loggedUser',
    ]);

    if (
        !loggedUser ||
        loggedUser.role !== 'not_activated' ||
        user?.username !== loggedUser.username
    ) {
        return null;
    }

    const resend = async () => {
        try {
            await resendActivation({ secret: String(secret) });
            enqueueSnackbar(
                <span>
                    <span className="font-bold">{loggedUser.username}</span>, ми
                    успішно надіслали Вам лист для підтвердження поштової
                    адреси.
                </span>,
                { variant: 'success' },
            );
        } catch (e) {
            if ('code' in (e as Hikka.Error)) {
                if ((e as Hikka.Error).code === 'auth:activation_valid') {
                    enqueueSnackbar(
                        <span>
                            <span className="font-bold">
                                {loggedUser.username}
                            </span>
                            , Ваше посилання досі активне. Перегляньте, будь
                            ласка, вашу поштову скриньку для активації акаунту.
                        </span>,
                        { variant: 'error' },
                    );
                }
            }
        }
    };

    return (
        <div>
            <div className="alert border-secondary bg-secondary/30">
                <MaterialSymbolsInfoRounded className="text-xl text-neutral" />
                <span className="text-sm text-neutral">
                    На вашу пошту відправлено лист з активацією пошти. Будь
                    ласка, перейдіть за посилання у листі. Якщо Ваш лист не
                    прийшов, будь ласка,{' '}
                    <Button
                        onClick={resend}
                        variant="link"
                        className="text-primary hover:underline"
                    >
                        відправте його повторно
                    </Button>
                    .
                </span>
            </div>
        </div>
    );
};

export default Component;