import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { redirect } from 'next/navigation';
import { FC } from 'react';

import NovelList from '@/features/novel/novel-list/novel-list.component';

import { prefetchNovelCatalog } from '@/services/hooks/novel/use-novel-catalog';
import getQueryClient from '@/utils/get-query-client';

interface Props {
    searchParams: Record<string, string>;
}

const NovelListPage: FC<Props> = async ({ searchParams }) => {
    const page = searchParams.page;

    if (!page) {
        return redirect(
            `/novel?page=1&iPage=1&${new URLSearchParams(searchParams as Record<string, string>).toString()}`,
        );
    }

    const query = searchParams.search as string;
    const media_type = searchParams.types;
    const status = searchParams.statuses;
    const years = searchParams.years;
    const genres = searchParams.genres;

    const only_translated = searchParams.only_translated;

    const sort = searchParams.sort || 'score';
    const order = searchParams.order || 'desc';

    const iPage = searchParams.iPage;

    const dataKeys = {
        query,
        media_type: typeof media_type === 'string' ? [media_type] : media_type,
        status: typeof status === 'string' ? [status] : status,
        years: typeof years === 'string' ? [years] : years,
        genres: typeof genres === 'string' ? [genres] : genres,
        only_translated: Boolean(only_translated),
        sort: sort ? [`${sort}:${order}`] : undefined,
        page: Number(page),
        iPage: Number(iPage),
    };

    const queryClient = getQueryClient();

    await prefetchNovelCatalog(dataKeys);

    const dehydratedState = dehydrate(queryClient);

    return (
        <HydrationBoundary state={dehydratedState}>
            <NovelList searchParams={searchParams} />
        </HydrationBoundary>
    );
};

export default NovelListPage;
