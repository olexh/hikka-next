import config from '@/utils/api/config';

export interface Response {
    reference: string;
    created: number;
    anime: Hikka.Anime;
}

export default async function req({
    slug,
    secret,
}: {
    slug: string;
    secret: string;
}): Promise<Response> {
    const res = await fetch(config.baseAPI + '/favourite/anime/' + slug, {
        method: 'get',
        ...config.config,
        headers: {
            ...config.config.headers,
            auth: secret || '',
        },
    });
    if (!res.ok) {
        throw new Error('Failed to fetch data');
    }

    return await res.json();
}
