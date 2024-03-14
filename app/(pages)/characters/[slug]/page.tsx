import React from 'react';

import Anime from './_components/anime';
import Description from './_components/description';
import Voices from './_components/voices';

const Component = () => {
    return (
        <div className="relative flex flex-col gap-12 ">
            <Description />
            <Voices />
            <Anime />
        </div>
    );
};

export default Component;
