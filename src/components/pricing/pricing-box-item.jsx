import { Picture } from "src/components/picture"
import checkImage from 'src/assets/images/check.png';
import webpCheckImage from 'src/assets/images/check.webp';

export function PricingItem({item,index,service,description}) {
    return (
        <div className="pricing__box-included-item" key={index}>
            <Picture images={[checkImage, webpCheckImage]} alt="check mark" imgWidth="36.52px" imgHeight="28px" />
            <p><font>{service}</font>: Up to <font>{item}</font> {description}</p>
        </div>
    )
}