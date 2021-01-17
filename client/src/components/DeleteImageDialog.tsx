import { Header, Icon, Image, Button, Modal } from 'semantic-ui-react'

import { imageUrl } from '../Common';
import { ImageData } from '../dto/ImageData';

interface DeleteImageDialogProps {
    isOpen: boolean;
    imageData?: ImageData;
    onClickCancel: () => void;
    onClickDelete: () => void;
}

function DeleteImageDialog(props: DeleteImageDialogProps) {
    const { isOpen, imageData, onClickCancel, onClickDelete } = props;
    return <Modal
        basic
        open={isOpen}
        size='small'
    >
        <Header>
            {`${imageData?.metadata.title} を削除しますか？`}
        </Header>
        <Modal.Content>
            <Image size='big' centered src={imageData ? imageUrl(imageData!) : null} />
        </Modal.Content>
        <Modal.Actions>
            <Button basic inverted onClick={onClickCancel}>
                キャンセル
            </Button>
            <Button color='red' inverted onClick={onClickDelete}>
                <Icon name='trash alternate outline' /> 画像を削除します
        </Button>
        </Modal.Actions>
    </Modal>;
}

export default DeleteImageDialog;