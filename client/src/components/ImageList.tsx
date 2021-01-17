import { Icon, Button, Item } from 'semantic-ui-react'

import { imageMarkdownText } from '../Common';
import { ImageData } from '../dto/ImageData';

interface ImageListProps {
    imageList: Array<ImageData>;
    onClickThumb: (imageId: string) => void;
    onClickDelete: (imageId: string) => void;
    onClickCopyMarkdown: (markdown: string) => void;
}

function ImageList(props: ImageListProps) {
    const { imageList, onClickThumb, onClickDelete, onClickCopyMarkdown } = props;
    const imageListItems = imageList.map(image =>
        <Item>
            <a href="#" style={{ marginRight: "1em" }} onClick={e => {
                e.preventDefault();
                onClickThumb(image.image_id);
            }}><Item.Image src={image.thumb_url} /></a>

            <Item.Content>
                <Item.Header as='a'>
                    <a href={image.permalink_url} target="_blank" rel="noopener noreferrer">{image.metadata.title}</a>
                </Item.Header>
                <Item.Meta>
                    <span>{image.created_at}</span>
                </Item.Meta>
                <Item.Description>
                    {
                        image.ocr ? `${image.ocr.description.slice(0, 89)}...` : null
                    }
                </Item.Description>
                <Item.Extra>
                    <Button primary floated='right' onClick={e => onClickCopyMarkdown(imageMarkdownText(image))}>
                        <Icon name='copy outline' />
                        &nbsp;マークダウンをコピー
                    </Button>
                    <Button color='red' floated='right' onClick={e => onClickDelete(image.image_id)}>
                        <Icon name='trash alternate outline' />
                        &nbsp;画像の削除
                    </Button>
                </Item.Extra>
            </Item.Content>
        </Item>
    )

    return <Item.Group divided>{imageListItems}</Item.Group>;
}

export default ImageList;