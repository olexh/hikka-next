import Filters from '@/app/anime/(animeList)/_layout/Filters';
import NavBar from '@/app/anime/(animeList)/_layout/NavBar';
import { ReactNode } from 'react';

interface Props {
    list: ReactNode;
}

const Component = ({ list }: Props) => {
    return (
        <div>
            <div className="drawer drawer-end">
                <input
                    id="filterDrawer"
                    type="checkbox"
                    className="drawer-toggle"
                />
                <div className="drawer-content grid grid-cols-1 md:grid-cols-[1fr_25%] justify-center md:items-start md:justify-between md:gap-16">
                    <div className="flex flex-col gap-8">
                        <div className="sticky md:relative top-[calc(5rem-1px)] md:top-0 z-[1] -mx-4">
                            <NavBar />
                        </div>
                        {list}
                    </div>
                    <div className="order-1 md:order-2 md:block w-full hidden">
                        <Filters />
                    </div>
                </div>
                <div className="drawer-side overflow-y-visible z-10 md:hidden">
                    <label
                        htmlFor="filterDrawer"
                        className="drawer-overlay"
                    ></label>
                    <div className="p-8 md:p-4 w-full overflow-y-scroll overscroll-contain h-full bg-black text-base-content">
                        <Filters />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Component;
