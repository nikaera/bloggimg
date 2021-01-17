import { useEffect, useState } from 'react';

import { useDropzone } from 'react-dropzone';
import { Icon } from 'semantic-ui-react'

interface ImageUploadAreaProps {
    onSelectedFiles: (files: Array<File>) => void;
}

function ImageUploadArea(props: ImageUploadAreaProps) {
    const [isDragActive, setIsDragActive] = useState(false);

    const onDragEnter = () => {
        setIsDragActive(true);
    };

    const onDragLeave = () => {
        setIsDragActive(false);
    };

    const {
        acceptedFiles,
        getRootProps,
        getInputProps
    } = useDropzone({
        accept: 'image/*',
        onDragEnter,
        onDragLeave,
        onDrop: onDragLeave
    });

    const { onSelectedFiles } = props;
    useEffect(() => {
        onSelectedFiles(acceptedFiles);
    }, [acceptedFiles]);

    return <div id="dropzone" {...getRootProps({ className: `dropzone${isDragActive ? " drag_active" : ''}` })}>
        <input {...getInputProps()} />
        <Icon style={{ paddingRight: "0.5em" }} size="big" name="file image" />ここに画像ファイルをドロップするか、画像ファイルを選択してください
    </div>;
}

export default ImageUploadArea;