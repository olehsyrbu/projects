import { arrayMove } from '@dnd-kit/sortable';
import PropTypes from 'prop-types';
import { ImageAdd24Filled as ImageAdd } from '@fluentui/react-icons';
import { SortableContainer } from './SortableContainer';
import { SortableImage } from './SortableImage';
import { useDropzone } from 'react-dropzone';

export function ImagePicker({ images, rearrangeMode, onChange }) {
  function addImages(newImages) {
    onChange(images.concat(newImages).slice(0, 6));
  }

  function removeImage(url) {
    onChange(images.filter((img) => img !== url));
  }

  function replaceImages(id, overId) {
    let index = images.indexOf(id);
    let overIndex = images.indexOf(overId);
    onChange(arrayMove(images, index, overIndex));
  }

  return (
    <SortableContainer items={images} onReplace={replaceImages}>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(0,auto-fit))] gap-4 md:grid-cols-[repeat(auto-fill,minmax(0,266px))] md:gap-6">
        {images.map((url) => (
          <SortableImage
            key={url}
            src={url}
            rearrangeMode={rearrangeMode}
            onDelete={() => removeImage(url)}
          />
        ))}
        {images.length < 6 && (
          <FilePicker
            icon={ImageAdd}
            className="space-y-3"
            text="Drag up to 6 photos here or"
            onChange={addImages}
            accept={['image/jpeg', 'image/png', 'image/gif']}
          />
        )}
      </div>
    </SortableContainer>
  );
}

ImagePicker.propTypes = {
  images: PropTypes.arrayOf(PropTypes.string).isRequired,
  rearrangeMode: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
};

ImagePicker.defaultProps = {
  rearrangeMode: false,
};

function FilePicker({ onChange, accept, className, text, icon }) {
  const Image = icon;
  let { getRootProps, getInputProps, open } = useDropzone({
    accept,
    maxSize: 8_000_000,
    multiple: true,
    noClick: true,
    onDropAccepted(files) {
      onChange(files.map((file) => URL.createObjectURL(file)));
    },
  });

  return (
    <div
      className={`min-h-40 flex max-w-md flex-col items-center justify-center rounded-2xl bg-graphics-10 p-7 ${className}`}
      {...getRootProps()}
    >
      <input {...getInputProps()} hidden data-testid="picker-input" />
      <Image className="text-graphics-50" />
      <p className="leading-relaxed text-hint">{text}</p>
      <button type="button" className="mir-button compact" onClick={open}>
        Browse Your Files
      </button>
    </div>
  );
}

FilePicker.propTypes = {
  icon: PropTypes.oneOfType([PropTypes.node, PropTypes.func]).isRequired,
  text: PropTypes.string,
  className: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  accept: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
};
