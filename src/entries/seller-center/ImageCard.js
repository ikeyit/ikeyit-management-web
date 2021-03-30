import React, {useCallback, useState, useRef} from "react";
import {useModalTrigger} from "../../hooks";
import {PlusOutlined, CloseOutlined} from '@ant-design/icons';
import {MediaPicker} from "./MediaPicker";
import {Reorder} from "../../components";
import {reorderArray} from "../../utils/reorderArray";
import "./ImageCard.less";


let imageCardListUid = 1;
function fromUrls(urls) {
    return urls && urls.map(url => ({
        url,
        uid: imageCardListUid++,
    }));
}

function fromMediaPicker(medias) {
    return medias && medias.map(item => ({
        url : item.url,
        uid: imageCardListUid++,
    }));
}


export const ImageCardList = React.memo(({images=[], onChange, className, maxCount=10, sortable = true, type="image-card"})=> {
    const onFinish = useCallback(data => {
        onChange && onChange([...images,...fromMediaPicker(data)]);
    }, [images, onChange]);
    const onDelete = useCallback(image => {
        onChange && onChange(images.filter(item => item !== image));
    }, [images, onChange]);

    const onMove = useCallback((dragIndex, dropIndex) => {
        onChange && onChange(reorderArray(images, dragIndex, dropIndex));
    }, [images, onChange]);

    const {onOpen, renderModal} = useModalTrigger(onFinish);
    const leftCount = images ? maxCount - images.length : maxCount;

    const renderCards = ()=> {
        if (sortable) {
            return images.map((image, index) =>
                <Reorder className="image-card-draggable" key={image.uid} index={index} onMove={onMove} type={type}>
                    <Card image={image} onDelete={onDelete}/>
                </Reorder>
            );
        }

        return images && images.map(image =>
            <Card key={image.uid} image={image} onDelete={onDelete}/>
        );
    }

    return (
        <div className={"image-card-list " + className}>
            {renderCards()}
            {leftCount > 0 &&
                <Card onClick={()=>onOpen()}/>
            }
            {renderModal(MediaPicker, {maxCount: leftCount}, true)}
        </div>
    );
});
ImageCardList.fromUrls = fromUrls;

const Card = React.memo(({image, className, onDelete, onPreview, onClick}) => {
    const [actionsVisible, setActionsVisible] = useState(false);
    const onDeleteClick = e => {
        e.stopPropagation();
        setActionsVisible(false);
        onDelete && onDelete(image);
    };
    return (
        <>
            {image ?
                <div
                    className={"image-card " + (className ? className : "")}
                    onMouseEnter={()=>setActionsVisible(true)}
                    onMouseLeave={()=>setActionsVisible(false)}
                    onClick={()=>onClick && onClick(image)}
                >
                    <img src={image.url}/>
                    {actionsVisible && onDelete &&
                    <CloseOutlined
                        className="image-card-delete"
                        onClick={onDeleteClick}
                    />}
                </div>
                :
                <div
                    className={"image-card " + (className ? className : "")}
                    onClick={()=>onClick && onClick(image)}
                >
                    <div className="image-card-empty">
                        <PlusOutlined />
                    </div>
                </div>
            }
        </>
    )
});

/**
 * 当选图片
 * @type {React.NamedExoticComponent<{readonly image?: *, readonly onChange?: *, readonly className?: *}>}
 */
export const ImageCard = React.memo(({image, className, onChange, disableDelete = false}) => {
    const {onOpen, renderModal} = useModalTrigger(data => {
        onChange && onChange(data[0].url);
    });
    const onDelete = disableDelete ? undefined : () => onChange && onChange();
    return (
        <>
            <Card
                image={image && {url: image}} className={className} onDelete={onDelete} onClick={()=>onOpen()}
            />
            {renderModal(MediaPicker, {maxCount: 1})}
        </>
    )
});