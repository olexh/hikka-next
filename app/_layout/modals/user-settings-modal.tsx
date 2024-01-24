'use client';

import clsx from 'clsx';
import * as React from 'react';
import { Dispatch, ReactNode, SetStateAction, useState } from 'react';

import CustomizationForm from '@/app/_layout/modals/user-settings/customization-form';
import EmailForm from '@/app/_layout/modals/user-settings/email-form';
import GeneralForm from '@/app/_layout/modals/user-settings/general-form';
import PasswordForm from '@/app/_layout/modals/user-settings/password-form';
import UsernameForm from '@/app/_layout/modals/user-settings/username-form';
import WatchListForm from '@/app/_layout/modals/user-settings/watchlist-form';
import useIsMobile from '@/utils/hooks/useIsMobile';

type Tab =
    | 'general'
    | 'password'
    | 'username'
    | 'email'
    | 'watchList'
    | 'customization';

const DATA: {
    title: string;
    description: string;
    slug: Tab;
    form: ReactNode;
}[] = [
    {
        title: 'Загальне',
        description: 'Змінити загальні дані профілю',
        slug: 'general',
        form: <GeneralForm />,
    },
    {
        title: 'Імпорт',
        description: 'Імпорт Вашого списку аніме',
        slug: 'watchList',
        form: <WatchListForm />,
    },
    {
        title: 'Email',
        description: 'Змінити свій email',
        slug: 'email',
        form: <EmailForm />,
    },
    {
        title: 'Ім\'я користувача',
        description: 'Змінити своє ім\'я',
        slug: 'username',
        form: <UsernameForm />,
    },
    {
        title: 'Пароль',
        description: 'Змінити свій пароль',
        slug: 'password',
        form: <PasswordForm />,
    },
    {
        title: 'Кастомізація',
        description: 'Зміна налаштувань перегляду контенту на сайті',
        slug: 'customization',
        form: <CustomizationForm />,
    },
];

const Tabs = ({ setActiveTab, activeTab }: { activeTab?: Tab, setActiveTab: Dispatch<SetStateAction<Tab | undefined>> }) => {
    return (
        <div className='flex h-full w-full flex-col gap-4 border-r-secondary/60 py-6 lg:border-r'>
            <div className='flex items-center'>
                <h3 className='px-6'>Налаштування</h3>
            </div>
            <ul className='menu w-full p-0 [&_li>*]:rounded-none'>
                {DATA.map((tab) => (
                    <li key={tab.slug}>
                        <a
                            onClick={() => setActiveTab(tab.slug)}
                            className={clsx(
                                'flex flex-col items-start justify-center gap-0 px-8 py-4',
                                activeTab === tab.slug &&
                                'active !bg-secondary',
                            )}
                        >
                            <p>{tab.title}</p>
                            <p className='text-xs text-muted-foreground'>
                                {tab.description}
                            </p>
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
};

const Component = () => {
    const isMobile = useIsMobile();
    const [activeTab, setActiveTab] = useState<Tab | undefined>(
        isMobile ? undefined : 'general',
    );

    const activeForm = DATA.find((tab) => tab.slug === activeTab);

    return (
        <div className='grid grid-cols-1 md:grid-cols-[40%_1fr] h-full'>
            {isMobile && !activeTab && <Tabs setActiveTab={setActiveTab} />}
            {!isMobile && <Tabs setActiveTab={setActiveTab} />}
            {activeForm?.form}
        </div>
    );
};

export default Component;