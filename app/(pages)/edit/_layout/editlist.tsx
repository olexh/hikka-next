'use client';

import clsx from 'clsx';
import { format } from 'date-fns';
import * as React from 'react';
import { useEffect, useState } from 'react';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

import { useQuery } from '@tanstack/react-query';

import BaseCard from '@/app/_components/base-card';
import Pagination from '@/app/_components/ui/pagination';
import { Label } from '@/app/_components/ui/label';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/app/_components/ui/table';
import getEditList from '@/utils/api/edit/getEditList';
import createQueryString from '@/utils/createQueryString';
import { useSettingsContext } from '@/utils/providers/settings-provider';
import useRouter from '@/utils/useRouter';

import EditStatus from '../_components/edit-status';


const Component = () => {
    const { titleLanguage } = useSettingsContext();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const page = searchParams.get('page');
    const [selectedPage, setSelectedPage] = useState(page ? Number(page) : 1);

    const [go, setGo] = useState(false);
    const router = useRouter();

    const { data } = useQuery<
        {
            list: Hikka.Edit[];
            pagination: Hikka.Pagination;
        },
        Error
    >({
        queryKey: ['editList', selectedPage],
        queryFn: () =>
            getEditList({
                page: selectedPage,
            }),
    });

    useEffect(() => {
        const query = createQueryString(
            'page',
            String(selectedPage),
            new URLSearchParams(searchParams),
        );
        router.push(`${pathname}?${query}`, { scroll: true });
    }, [selectedPage]);

    useEffect(() => {
        if (page) {
            setSelectedPage(Number(page));
        }
    }, [page]);

    return (
        <div className="flex flex-col gap-8">
            <div className="overflow-x-auto">
                <Table className="table">
                    <TableHeader className="overflow-hidden rounded-lg bg-secondary/30">
                        <TableRow>
                            <TableHead className="w-8">#</TableHead>
                            <TableHead>Автор</TableHead>
                            <TableHead align="left">Контент</TableHead>
                            <TableHead
                                className=" hidden lg:table-cell"
                                align="left"
                            >
                                Опис
                            </TableHead>
                            <TableHead align="center" className="w-20">
                                Статус
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data &&
                            data.list.map((edit) => (
                                <TableRow
                                    key={edit.edit_id}
                                    className={clsx(
                                        'hover:cursor-pointer hover:bg-secondary/60',
                                    )}
                                    onClick={() =>
                                        !go &&
                                        router.push('/edit/' + edit.edit_id)
                                    }
                                >
                                    <TableHead className="w-8">
                                        <Label>{edit.edit_id}</Label>
                                    </TableHead>
                                    <TableCell>
                                        <div className="flex gap-4">
                                            <div className="w-10 h-10">
                                                <BaseCard
                                                    containerClassName="!pt-[100%]"
                                                    poster={edit.author!.avatar}
                                                />
                                            </div>
                                            <div className="flex flex-col">
                                                <Link
                                                    className="hover:underline"
                                                    href={`/u/${
                                                        edit.author!.username
                                                    }`}
                                                    onClick={() => setGo(true)}
                                                >
                                                    {edit.author!.username}
                                                </Link>
                                                <Label className="text-muted-foreground text-xs">
                                                    {format(
                                                        edit.created * 1000,
                                                        'd MMM yyyy H:mm',
                                                    )}
                                                </Label>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell align="left">
                                        <div className="flex gap-4">
                                            {edit.content_type === 'anime' &&
                                            'title_en' in edit.content ? (
                                                <Link
                                                    className="hover:underline"
                                                    href={`/anime/${edit.content.slug}`}
                                                    onClick={() => setGo(true)}
                                                >
                                                    {edit.content[
                                                        titleLanguage!
                                                    ] ||
                                                        edit.content.title_ua ||
                                                        edit.content.title_en ||
                                                        edit.content.title_ja}
                                                </Link>
                                            ) : (
                                                'name_ua' in edit.content &&
                                                (edit.content.name_ua ||
                                                    edit.content.name_en)
                                            )}
                                        </div>
                                        <Label className="text-xs text-muted-foreground">
                                            {edit.content_type === 'anime'
                                                ? 'Аніме'
                                                : 'Автор'}
                                        </Label>
                                    </TableCell>
                                    <TableCell
                                        className="hidden lg:table-cell"
                                        align="left"
                                    >
                                        <p
                                            className={clsx(
                                                'text-sm overflow-hidden overflow-ellipsis break-all',
                                                !edit.description &&
                                                    'text-muted-foreground',
                                            )}
                                        >
                                            {edit.description
                                                ? edit.description
                                                : 'Немає опису правки'}
                                        </p>
                                    </TableCell>
                                    <TableCell align="center" className="w-20">
                                        <div className="flex justify-end">
                                            <EditStatus status={edit.status} />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </div>
            {data && data.pagination.pages > 1 && (
                <Pagination
                    page={selectedPage}
                    pages={data.pagination.pages}
                    setPage={setSelectedPage}
                />
            )}
        </div>
    );
};

export default Component;