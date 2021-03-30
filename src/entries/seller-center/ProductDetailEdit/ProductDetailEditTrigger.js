import React from "react";
import {useModalTrigger} from "../../../hooks";
import {Button} from "antd";
import {ProductDetailEdit} from "./ProductDetailEdit";

export const ProductDetailEditTrigger = React.memo(({detail, dispatch}) => {
    const {onOpen, renderModal} = useModalTrigger(data => {
        dispatch({type:"CHANGE_DETAIL", payload: data});
    });
    return (
        <div className="form-item">
            <label className="form-item-hd">
                商品详情
            </label>
            <div className="form-item-bd">
                <Button onClick={()=>onOpen()}>点击编辑</Button>
                {renderModal(ProductDetailEdit, {detail})}
            </div>
        </div>
    );
});
