import tooltipImage from 'src/assets/images/tooltip.png';
import webpTooltipImage from 'src/assets/images/tooltip.webp';
import { Picture } from '../picture';

export function Tooltip({description}) {
    return (
        <div className="tooltip">
            <Picture images={[tooltipImage,webpTooltipImage]} imgWidth="44px" imgHeight="46px" alt="tooltip"/>
            <div className='tooltip-description'>
                <p>{description}</p>
            </div>
        </div>
    )
}