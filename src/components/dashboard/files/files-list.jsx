import { FileRecord } from "./file-record";
import folderImage from 'src/assets/images/folder.png';
import webpFolderImage from 'src/assets/images/folder.webp';
import { Picture } from "src/components/picture";
export function FilesList({ files,removeFile }) {
    console.log(files.length); 
    return (
        <div className="files-list">
            {files.length !== 0 ? files.map((file, index) => (
                <FileRecord file={file} key={index} index={index} removeFile={removeFile}/>
            )) : files.length === 0 && <div className="empty-files-list">
                <Picture images={[folderImage, webpFolderImage]} imgHeight="64px" imgWidth="64px" alt="folder" />
                <p>Please attach atleast one file</p>
            </div>}
        </div>
    )
}