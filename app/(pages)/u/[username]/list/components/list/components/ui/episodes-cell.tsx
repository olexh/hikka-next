import { TableCell } from '@/components/ui/table';

interface Props {
    episodes: number;
    total: number;
}

const Component = ({ episodes, total }: Props) => (
    <TableCell className="w-20" align="center">
        {episodes} / {total || '?'}
    </TableCell>
);

export default Component;