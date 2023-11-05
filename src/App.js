import React from "react";
import { useDrag, useDrop } from "react-dnd";
import galleryList from "./data.js";
import ImageUpload from "./ImageUpload";

const Card = ({ src, title, id, index, moveImage, selected, onSelect, onDeselect }) => {
  const ref = React.useRef(null);

  const [, drop] = useDrop({
    accept: "image",
    hover: (item, monitor) => {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      moveImage(dragIndex, hoverIndex);

      item.index = hoverIndex;
    }
  });

  const [{ isDragging }, drag] = useDrag({
    type: "image",
    item: () => ({
      id,
      index,
      selected,
    }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  const handleSelect = () => {
    if (selected) {
      onDeselect(id);
    } else {
      onSelect(id);
    }
  };

  return (
    <div
      ref={ref}
      className={`card ${isDragging ? 'dragging' : ''} ${selected ? 'selected' : ''}`}
      onClick={handleSelect}
    >
      <img src={src} alt={title} />
    </div>
  );
};


const App = () => {
  const [images, setImages] = React.useState(galleryList);
  const [selectedImages, setSelectedImages] = React.useState([]);

  const moveImage = React.useCallback((dragIndex, hoverIndex) => {
    setImages((prevCards) => {
      const clonedCards = [...prevCards];
      const removedItem = clonedCards.splice(dragIndex, 1)[0];

      clonedCards.splice(hoverIndex, 0, removedItem);
      return clonedCards;
    });
  }, []);

  const handleImageUpload = (newImage) => {
    setImages((prevImages) => [...prevImages, newImage]);
  };

  const handleSelect = (imageId) => {
    setSelectedImages((prevSelected) => [...prevSelected, imageId]);
  };

  const handleDeselect = (imageId) => {
    setSelectedImages((prevSelected) => prevSelected.filter((id) => id !== imageId));
  };

  const handleDeleteSelected = () => {
    setImages((prevImages) => prevImages.filter((image) => !selectedImages.includes(image.id)));
    setSelectedImages([]);
  };

  return (
    <>
    <div className="banner">
      <div>
        <h2>Gallery</h2>
      </div>
      <div>
      <button className="delete-button" onClick={handleDeleteSelected} disabled={selectedImages.length === 0}>
        Delete Selected
      </button>
      </div>
    </div>
    
    <main>
      
      <ImageUpload onImageUpload={handleImageUpload} />
    {/* <div className="button-container">
      
      </div> */}
      {images.map((image, index) => (
        <Card
          key={image.id}
          src={image.src}
          title={image.title}
          id={image.id}
          index={index}
          moveImage={moveImage}
          selected={selectedImages.includes(image.id)}
          onSelect={handleSelect}
          onDeselect={handleDeselect}
        />
      ))}
    </main>
    </>
    
  );
};

export default App;
