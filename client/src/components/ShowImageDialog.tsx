import { Header, Icon, Image, Button, Modal } from 'semantic-ui-react'

import { imageUrl } from '../Common';
import { ImageData } from '../dto/ImageData';

interface ShowImageDialogProps {
    isOpen: boolean;
    imageData?: ImageData;
    onClose: () => void;
}

function ShowImageDialog(props: ShowImageDialogProps) {
    const { isOpen, imageData, onClose } = props;
    return <Modal
        basic
        open={isOpen}
        onClose={onClose}
        size='small'
    >
        <Header>
            {`${imageData?.metadata.title} のプレビュー`}
        </Header>
        <Modal.Content>
            <Image size='huge' centered src={imageData ? imageUrl(imageData!) : null} />
        </Modal.Content>
        <Modal.Actions>
            <Button basic inverted onClick={onClose}>
                <Icon name='close' /> 閉じる
    </Button>
        </Modal.Actions>
    </Modal >;
}

export default ShowImageDialog;