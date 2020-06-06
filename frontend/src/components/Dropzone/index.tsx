import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FiUpload } from 'react-icons/fi';

import './styles.css';

interface Props {
  onFileUploaded: (file: File) => void;
}

function Dropzone(props: Props) {
  const { onFileUploaded } = props;
  const [selectedFileUrl, setSelectedFileUrls] = useState('');

  const onDrop = useCallback(function (acceptedFiles) {
    const file = acceptedFiles[0];
    const fileUrl = URL.createObjectURL(file);

    setSelectedFileUrls(fileUrl);
    onFileUploaded(file);
  }, [onFileUploaded]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: 'image/*'
  });

  return (
    <div className='dropzone' {...getRootProps()}>
      <input {...getInputProps()} accept='image/*' />
      {
        selectedFileUrl
          ? <img src={selectedFileUrl} alt="Point thumbnail"/>
          : isDragActive
            ? <p>Solte a sua imagem aqui</p>
            : <p>
              <FiUpload />
              Imagem do estabelecimento
            </p>
      }
    </div>
  );
}

export default Dropzone;
