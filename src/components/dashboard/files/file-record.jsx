import trashImage from 'src/assets/images/trash.png';
import webpTrashImage  from 'src/assets/images/trash.webp';
import { Picture } from 'src/components/picture';

export function FileRecord({file,index,removeFile}) {
    return (
        <div className="file-record">
            <p className="file-name">{file.name}</p>
            <p className="file-size">{file.size}</p>
            <button onClick={() => {removeFile(index)}}className="remove-file"><Picture images={[trashImage,webpTrashImage]} alt="trash" imgWidth="32" imgHeight="32"/></button>
        </div>
    )
}