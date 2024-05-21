import { dehydrate } from '@tanstack/query-core';
import { HydrationBoundary } from '@tanstack/react-query';
import { Metadata, ResolvingMetadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { FC, PropsWithChildren } from 'react';

import Breadcrumbs from '@/components/navigation/nav-breadcrumbs';
import NavMenu from '@/components/navigation/nav-dropdown';
import InternalNavBar from '@/components/navigation/nav-tabs';
import SubBar from '@/components/navigation/sub-nav';

import Cover from '@/features/characters/character-view/cover';
import Title from '@/features/characters/character-view/title';

import getCharacterInfo from '@/services/api/characters/getCharacterInfo';
import { CHARACTER_NAV_ROUTES } from '@/utils/constants';
import getQueryClient from '@/utils/getQueryClient';

import _generateMetadata, { MetadataProps } from './layout.metadata';
import prefetchQueries from './layout.queries';

interface Props extends PropsWithChildren {
    params: {
        slug: string;
    };
}

export async function generateMetadata(
    props: MetadataProps,
    parent: ResolvingMetadata,
): Promise<Metadata> {
    return await _generateMetadata(props, parent);
}

const CharacterLayout: FC<Props> = async ({ params: { slug }, children }) => {
    const queryClient = await getQueryClient();

    const character = await queryClient.fetchQuery({
        queryKey: ['character', slug],
        queryFn: ({ meta }) =>
            getCharacterInfo({
                params: {
                    slug,
                },
            }),
    });

    if (!character) {
        return redirect('/');
    }

    await prefetchQueries({ queryClient, params: { slug } });

    const dehydratedState = dehydrate(queryClient);

    return (
        <HydrationBoundary state={dehydratedState}>
            <>
                <Breadcrumbs>
                    <div className="flex w-auto items-center gap-4 overflow-hidden whitespace-nowrap">
                        <Link
                            href={'/characters/' + character?.slug}
                            className="flex-1 overflow-hidden text-ellipsis text-sm font-bold hover:underline"
                        >
                            {character?.name_ua ||
                                character?.name_en ||
                                character?.name_ja}
                        </Link>
                    </div>
                    <NavMenu
                        routes={CHARACTER_NAV_ROUTES}
                        urlPrefix={`/characters/${slug}`}
                    />
                </Breadcrumbs>
                <SubBar>
                    <InternalNavBar
                        routes={CHARACTER_NAV_ROUTES}
                        urlPrefix={`/characters/${slug}`}
                    />
                </SubBar>
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-[20%_1fr] lg:gap-16">
                    <div className="flex flex-col gap-4">
                        <Cover />
                    </div>
                    <div className="flex flex-col gap-12">
                        <Title />
                        {children}
                    </div>
                </div>
            </>
        </HydrationBoundary>
    );
};

export default CharacterLayout;
