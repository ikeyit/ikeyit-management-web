export function reorderArray(items, fromIndex, toIndex) {
    const newItems = [];
    if (!items || items.length <= 0 || fromIndex > items.length || toIndex > items.length)
        return newItems;

    const dragItem = items[fromIndex];
    items.forEach((item, i)=> {
        if (i === fromIndex)
            return;
        if (i === toIndex) {
            if (fromIndex > toIndex) {
                newItems.push(dragItem);
                newItems.push(item);
            } else {
                newItems.push(item);
                newItems.push(dragItem);
            }
        } else {
            newItems.push(item);
        }
    });
    return newItems;
}

export default reorderArray;