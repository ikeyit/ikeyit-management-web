import React, {useState, useCallback} from "react";

// function uuid() {
//     let temp_url = URL.createObjectURL(new Blob());
//     let uuid = temp_url.toString();
//     URL.revokeObjectURL(temp_url);
//     return uuid.split(/[:\/]/g).pop();
// }

export function useModalTrigger(onOK) {
    const [state, setState] = useState({
        visible: false,
        fullyVisible: false,
    });

    const onOpen = useCallback(props => {
        setState({
            visible: true,
            fullyVisible: true,
            props
        });
    },[]);

    const onOkInternal = useCallback((...args) => {
        setState({
            fullyVisible: true,
            visible: false,
        });
        onOK && onOK(...args);
    }, [onOK]);

    const onCancel = useCallback(()=> {
        setState({
            fullyVisible: true,
            visible: false,
        });
    },[]);

    const onAfterClose = useCallback(()=> {
        setState({
            fullyVisible: false,
            visible: false,
        });
    },[]);

    const renderModal = (WrappedModal, modalProps, reserveModal = false) => {
        if (reserveModal || state.fullyVisible)
            return <WrappedModal
                    visible={state.visible}
                    onOk={onOkInternal}
                    onCancel={onCancel}
                    afterClose={onAfterClose}
                    {...modalProps}
                    {...state.props}
            />
    };

    return {onOpen, renderModal};
}
