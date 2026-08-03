import { useRef, useState } from 'react';
import { ClipIcon, TrashIcon } from './Icons';
import { RequiredMark } from './Layout';
import { ACCEPTED_EXTENSIONS, MAX_TOTAL_BYTES, MAX_TOTAL_MB } from '../data/mock';
import { extensionOf, formatSize } from '../lib/format';

type FileUploaderProps = {
  title: string;
  subtitle: string;
  files: File[];
  onChange: (files: File[]) => void;
  required?: boolean;
};

const FileUploader = ({
  title,
  subtitle,
  files,
  onChange,
  required
}: FileUploaderProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addFiles = (incoming: FileList | null) => {
    if (!incoming?.length) return;
    setError(null);

    const accepted: File[] = [];
    for (const file of Array.from(incoming)) {
      if (!ACCEPTED_EXTENSIONS.includes(extensionOf(file.name))) {
        setError(`ფაილის ფორმატი არ არის მხარდაჭერილი: ${file.name}`);
        continue;
      }
      if (files.some((existing) => existing.name === file.name && existing.size === file.size)) {
        continue;
      }
      accepted.push(file);
    }

    const next = [...files, ...accepted];
    const total = next.reduce((sum, file) => sum + file.size, 0);
    if (total > MAX_TOTAL_BYTES) {
      setError(`ფაილების ჯამური მოცულობა აღემატება ${MAX_TOTAL_MB} მბ-ს`);
      return;
    }

    onChange(next);
  };

  return (
    <div>
      <div
        className={`uploader${dragging ? ' uploader--drag' : ''}`}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          addFiles(event.dataTransfer.files);
        }}
      >
        <div>
          <p className="uploader__title">
            {title}
            {required && <RequiredMark />}
          </p>
          <p className="uploader__sub">{subtitle}</p>
        </div>

        <div className="uploader__right">
          <span className="uploader__count">
            ფაილები
            <span
              className={`uploader__badge${
                files.length ? ' uploader__badge--filled' : ''
              }`}
            >
              {files.length}
            </span>
          </span>

          <button
            type="button"
            className="uploader__pick"
            onClick={() => inputRef.current?.click()}
          >
            <ClipIcon />
            აირჩიე ფაილი
          </button>
        </div>

        <input
          ref={inputRef}
          type="file"
          multiple
          hidden
          accept={ACCEPTED_EXTENSIONS.join(',')}
          onChange={(event) => {
            addFiles(event.target.files);
            event.target.value = '';
          }}
        />
      </div>

      {files.length > 0 && (
        <ul className="files">
          {files.map((file) => (
            <li className="file" key={`${file.name}-${file.size}`}>
              <span className="file__icon">
                {(extensionOf(file.name).replace('.', '') || 'ფაილი').toUpperCase()}
              </span>
              <span className="file__name">{file.name}</span>
              <span className="file__size">{formatSize(file.size)}</span>
              <button
                type="button"
                className="file__remove"
                aria-label="წაშლა"
                onClick={() =>
                  onChange(files.filter((current) => current !== file))
                }
              >
                <TrashIcon />
              </button>
            </li>
          ))}
        </ul>
      )}

      {error && <p className="error-text">{error}</p>}
    </div>
  );
};

export default FileUploader;
