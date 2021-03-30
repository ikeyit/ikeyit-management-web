import {useDrag, useDrop} from "react-dnd";

export function useReorder({ref, index, type, onMove}) {
    const [{isDragging}, drag] = useDrag({
        item: {type, index},
        collect: monitor => ({
            isDragging: monitor.isDragging(),
        }),
        type,
    });
    const [{isOver, dragIndex}, drop] = useDrop({
        accept: type,
        collect: monitor => {
            const { index: dragIndex } = monitor.getItem() || {};
            return dragIndex === index ? {} : {
                isOver: monitor.isOver(),
                dragIndex,
            };
        },
        drop: item => {
            if (item.index !== index)
                onMove(item.index, index);
        },
    });
    drop(drag(ref));
    const dndClassName = isDragging ? "dragging" : (isOver ? (dragIndex > index ? "dropping-up" : "dropping-down") : "");
    return {isDragging, isOver, dragIndex, dndClassName};
};