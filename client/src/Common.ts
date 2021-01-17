import { ImageData } from './dto/ImageData'

const isRightCollectionId = (id: string) => id.length === 0 || id.match(/^([a-zA-Z0-9]{32})$/);
const imageUrl = (image: ImageData) => `https://i.gyazo.com/${image.image_id}.${image.type}`;
const imageMarkdownText = (image: ImageData) => `![${image.metadata.title}](${imageUrl(image)})`;

export {
    isRightCollectionId,
    imageUrl,
    imageMarkdownText
}