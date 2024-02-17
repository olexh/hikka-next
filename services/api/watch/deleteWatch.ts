import { fetchRequest } from '@/services/api/fetchRequest';

export interface Response {
    success: boolean;
}

export default async function req({
    secret,
    slug,
}: {
    secret: string;
    slug: string;
}): Promise<Response> {
    return fetchRequest<Response>({
        path: `/watch/${slug}`,
        method: 'delete',
        secret,
    });
}