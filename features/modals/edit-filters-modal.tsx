import { ReactNode } from 'react';
import AntDesignFilterFilled from '~icons/ant-design/filter-filled';

import { Button } from '@/components/ui/button';
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from '@/components/ui/drawer';
import { Separator } from '@/components/ui/separator';

import Filters from '@/features/filters/edit-filters.component';

interface Props {
    children?: ReactNode;
}

const Component = ({ children }: Props) => {
    return (
        <Drawer>
            <DrawerTrigger asChild>
                {children || (
                    <Button variant="outline" size="icon">
                        <AntDesignFilterFilled />
                    </Button>
                )}
            </DrawerTrigger>
            <DrawerContent className="h-[90dvh] p-4 pt-0">
                <DrawerHeader className="px-0 text-left">
                    <DrawerTitle>Фільтри</DrawerTitle>
                </DrawerHeader>
                <Separator className="-mx-6 w-auto" />
                <Filters className="-mx-6 px-6" />
            </DrawerContent>
        </Drawer>
    );
};

export default Component;
