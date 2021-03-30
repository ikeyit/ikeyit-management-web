import React from "react";
import {useModalTrigger} from "../hooks";
import {Button} from "antd";

const ModalButton = React.memo(({label, modal, onOK, buttonType="primary", ...restProps}) => {
    const {onOpen, renderModal} = useModalTrigger(onOK);
    return (
        <>
            <Button type={buttonType} onClick={()=>onOpen}>{label}</Button>
            {renderModal(modal, restProps)}
        </>
    )
});

export default ModalButton;