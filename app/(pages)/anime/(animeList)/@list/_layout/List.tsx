'use client';

import clsx from 'clsx';
import { useCallback, useEffect, useState } from 'react';
import AntDesignArrowLeftOutlined from '~icons/ant-design/arrow-left-outlined';
import AntDesignArrowRightOutlined from '~icons/ant-design/arrow-right-outlined';
import AntDesignClearOutlined from '~icons/ant-design/clear-outlined';

import { usePathname, useSearchParams } from 'next/navigation';

import { useQuery } from '@tanstack/react-query';

import AnimeCard from '@/app/_components/AnimeCard';
import NotFound from '@/app/_components/NotFound';
import SkeletonCard from '@/app/_components/skeletons/EntryCard';
import getAnimeCatalog from '@/utils/api/anime/getAnimeCatalog';
import useDebounce from '@/utils/hooks/useDebounce';
import { useAuthContext } from '@/utils/providers/AuthProvider';
import useRouter from '@/utils/useRouter';

const Component = () => {
    const { secret } = useAuthContext();
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const search = useDebounce({
        value:
            searchParams.has('search') && searchParams.get('search')!.length > 3
                ? searchParams.get('search')!
                : undefined,
        delay: 300,
    });

    const page = searchParams.get('page');

    const [selectedPage, setSelectedPage] = useState(page ? Number(page) : 1);
    const types = searchParams.getAll('types');
    const statuses = searchParams.getAll('statuses');
    const seasons = searchParams.getAll('seasons');
    const ageRatings = searchParams.getAll('ratings');
    const years = searchParams.getAll('years');
    const genres = searchParams.getAll('genres');
    const lang = searchParams.get('only_translated');

    const { data, isLoading, error } = useQuery<
        {
            list: Hikka.Anime[];
            pagination: Hikka.Pagination;
        },
        Error
    >({
        queryKey: [
            'list',
            search,
            types,
            statuses,
            seasons,
            ageRatings,
            years,
            lang,
            genres,
            selectedPage,
            secret,
        ],
        queryFn: () =>
            getAnimeCatalog({
                query: search,
                years: years.length == 2 ? years : undefined,
                rating: ageRatings,
                season: seasons,
                status: statuses,
                media_type: types,
                genres,
                only_translated: Boolean(lang),
                page: selectedPage,
                secret: String(secret),
                size: 20,
            }),
    });

    const createQueryString = useCallback(
        (name: string, value: string | null) => {
            const params = new URLSearchParams(searchParams);

            if (value) {
                params.set(name, value);
            } else {
                params.delete(name);
            }

            return params.toString();
        },
        [searchParams],
    );

    const range = (min: number, max: number) => {
        const newArr = [];

        for (let i = min; i <= max; i++) {
            newArr.push(i);
        }

        return newArr;
    };

    const generatePaginationArr = (
        pagination: Hikka.Pagination,
        page: number,
    ) => {
        const pagArr: (number | undefined)[] = [1];

        if (pagination.pages >= 7) {
            if (pagination.pages - page <= 3) {
                pagArr.push(undefined);
                pagArr.push(...range(pagination.pages - 4, pagination.pages));

                return pagArr;
            }

            if (page < 5) {
                pagArr.push(...range(2, 5));
                pagArr.push(undefined);
                pagArr.push(pagination.pages);

                return pagArr;
            }

            pagArr.push(undefined);
            pagArr.push(...range(page - 1, page + 1));
            pagArr.push(undefined);
            pagArr.push(pagination.pages);

            return pagArr;
        }

        pagArr.push(...range(2, pagination.pages));
        return pagArr;
    };

    useEffect(() => {
        const query = createQueryString('page', String(selectedPage));
        router.push(`${pathname}?${query}`, { scroll: true });
    }, [selectedPage]);

    useEffect(() => {
        if (page) {
            setSelectedPage(Number(page));
        }
    }, [page]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [searchParams]);

    if (isLoading) {
        return (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-5 lg:gap-8">
                {range(1, 20).map((v) => (
                    <SkeletonCard key={v} />
                ))}
            </div>
        );
    }

    if (data === undefined || !data?.list || data.list.length === 0) {
        return (
            <NotFound
                title="Не знайдено результатів за Вашим запитом"
                description="Очистіть або змініть фільтри, щоб отримати інший результат"
            >
                <button
                    onClick={() => router.push(pathname)}
                    className="btn btn-error w-full lg:w-auto"
                >
                    <AntDesignClearOutlined />
                    Очистити
                </button>
            </NotFound>
        );
    }

    return (
        <div className="flex flex-col gap-8">
            <section
                className={clsx(
                    'grid grid-cols-2 gap-4 md:grid-cols-5 lg:gap-8',
                )}
            >
                {data &&
                    data.list &&
                    data!.list.map((x: Hikka.Anime) => {
                        return (
                            <AnimeCard
                                href={`/anime/${x.slug}`}
                                poster={x.poster}
                                title={x.title_ua || x.title_en || x.title_ja}
                                key={x.slug}
                                slug={x.slug}
                                watch={
                                    x.watch.length > 0 ? x.watch[0] : undefined
                                }
                            />
                        );
                    })}
                {error && <div>error</div>}
            </section>
            {data && data.pagination && data.pagination.pages > 1 && (
                <div className="flex w-full justify-center gap-2 lg:gap-4">
                    <button
                        onClick={() => setSelectedPage((prev) => prev - 1)}
                        disabled={selectedPage === 1}
                        className={clsx(
                            'btn-badge btn btn-square btn-secondary btn-outline text-xs lg:btn-md lg:text-base',
                        )}
                    >
                        <AntDesignArrowLeftOutlined />
                    </button>
                    {generatePaginationArr(data.pagination, selectedPage).map(
                        (v, index) => {
                            return (
                                <button
                                    disabled={!v}
                                    onClick={() => v && setSelectedPage(v)}
                                    key={index}
                                    className={clsx(
                                        'btn-badge btn btn-square text-xs lg:btn-md lg:text-base',
                                        selectedPage === v
                                            ? 'btn-accent'
                                            : 'btn-secondary btn-outline',
                                        !v && '!btn-ghost',
                                    )}
                                >
                                    {v ? v : '...'}
                                </button>
                            );
                        },
                    )}
                    <button
                        onClick={() => setSelectedPage((prev) => prev + 1)}
                        disabled={selectedPage === data.pagination.pages}
                        className={clsx(
                            'btn-badge btn btn-square btn-secondary btn-outline text-xs lg:btn-md lg:text-base',
                        )}
                    >
                        <AntDesignArrowRightOutlined />
                    </button>
                </div>
            )}
        </div>
    );
};

export default Component;
