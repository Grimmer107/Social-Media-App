import React from 'react';
import Classes from './gallery.module.css';
import Pic1 from '../../Assets/img/cloud_on_mountain.jpg';
import Pic2 from '../../Assets/img/debian-galaxy.png';
import Pic3 from '../../Assets/img/market.jpg';
import Pic4 from '../../Assets/img/subtle_ferns.jpg';

const Gallery = () => {
    return (
        <div className={Classes.scrollbox}>
            <div className={Classes.body}>
                <img src={Pic1} alt={"pic1"} loading={'lazy'} />
                <img src={Pic2} alt={"pic2"} loading={'lazy'} />
                <img src={Pic3} alt={"pic3"} loading={'lazy'} />
                <img src={Pic4} alt={"pic4"} loading={'lazy'} />
                <img src={Pic1} alt={"pic1"} loading={'lazy'} />
                <img src={Pic2} alt={"pic2"} loading={'lazy'} />
                <img src={Pic3} alt={"pic3"} loading={'lazy'} />
                <img src={Pic4} alt={"pic4"} loading={'lazy'} />
                <img src={Pic1} alt={"pic1"} loading={'lazy'} />
                <img src={Pic2} alt={"pic2"} loading={'lazy'} />
                <img src={Pic3} alt={"pic3"} loading={'lazy'} />
                <img src={Pic4} alt={"pic4"} loading={'lazy'} />
            </div>
        </div>
    );
};

export default Gallery;