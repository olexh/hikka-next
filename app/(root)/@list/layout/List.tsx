'use client';

import Card from '../components/Card';
import SkeletonCard from '../components/skeletons/Card';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import getAnimeCatalog from '@/utils/api/anime/getAnimeCatalog';
import useDebounce from '@/utils/hooks/useDebounce';
import clsx from 'clsx';
import { useCallback, useEffect, useState } from 'react';
import AiArrowLeftOutlined from '@/app/components/icons/AiArrowLeftOutlined';
import AiArrowRightOutlined from '@/app/components/icons/AiArrowRightOutlined';
import NotFound from '../components/NotFound';

const Component = () => {
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
    const lang = searchParams.get('lang');

    const { data, isLoading, error } = useQuery<
        { list: Hikka.Anime[]; pagination: Hikka.Pagination },
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
                page: selectedPage,
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
        router.replace(`${pathname}?${query}`, { scroll: true });
    }, [selectedPage]);

    useEffect(() => {
        if (page) {
            setSelectedPage(Number(page));
        }
    }, [page]);

    if (isLoading) {
        return (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-8">
                {range(1, 12).map((v) => (
                    <SkeletonCard key={v} />
                ))}
            </div>
        );
    }

    if (data === undefined || !data?.list || data.list.length === 0) {
        return <NotFound />;
    }

    return (
        <div className="flex flex-col gap-8">
            <section
                className={clsx(
                    'grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-8',
                )}
            >
                {data &&
                    data.list &&
                    data!.list.map((x: Hikka.Anime) => {
                        return (
                            <Card
                                href="#"
                                poster={x.poster}
                                title_en={x.title_en}
                                key={x.slug}
                            />
                        );
                    })}
                {error && <div>error</div>}
            </section>
            {data && data.pagination && data.pagination.pages > 1 && (
                <div className="flex md:gap-4 gap-2 w-full justify-center">
                    <button
                        onClick={() => setSelectedPage((prev) => prev - 1)}
                        disabled={selectedPage === 1}
                        className={clsx(
                            'btn btn-outline btn-square md:btn-md btn-sm md:text-base text-xs',
                        )}
                    >
                        <AiArrowLeftOutlined />
                    </button>
                    {generatePaginationArr(data.pagination, selectedPage).map(
                        (v, index) => {
                            return (
                                <button
                                    disabled={!v}
                                    onClick={() => v && setSelectedPage(v)}
                                    key={index}
                                    className={clsx(
                                        'btn btn-outline btn-square md:btn-md btn-sm md:text-base text-xs',
                                        selectedPage === v && 'btn-active',
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
                            'btn btn-outline btn-square md:btn-md btn-sm md:text-base text-xs',
                        )}
                    >
                        <AiArrowRightOutlined />
                    </button>
                </div>
            )}
        </div>
    );
};

export default Component;
