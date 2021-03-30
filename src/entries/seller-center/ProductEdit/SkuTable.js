import React, {useState, useCallback} from 'react'
import {Input, Button, Select } from 'antd';
import {PictureUpload} from "./PicturesWall";
import {ImageCard} from "../ImageCard";

const re_price = /^\d+(\.\d{0,2})?$/;
const re_stock = /^\d+$/;


function init(checkedSaleAttributes) {
    return new Array(checkedSaleAttributes ? checkedSaleAttributes.length : 0).fill(null);
}

const SkuTableBatch = React.memo(({checkedSaleAttributes, dispatch})=> {
    const [prevCheckedSaleAttributes, setPrevCheckedSaleAttributes] = useState(checkedSaleAttributes);
    const [state, setState] = useState(()=>({valueIds: init(checkedSaleAttributes)}));
    let {valueIds, stock = null, image = null, price = null} = state;
    if (checkedSaleAttributes != prevCheckedSaleAttributes) {
        setPrevCheckedSaleAttributes(checkedSaleAttributes);
        valueIds = init(checkedSaleAttributes);
        setState({
            ...state,
            valueIds
        });
    }
    const onSaleAttributeChange = useCallback((valueId, option) => {
        setState(prevState => {
            prevState.valueIds[option.index] = valueId;
            return {...prevState};
        });
    },[]);

    const onPriceChange = e=> {
        const price = e.target.value;
        if (!price || re_price.test(price))
            setState(prevState => ({...prevState, price}));
    };

    const onStockChange = e =>{
        const stock = e.target.value;
        if (!stock || re_stock.test(stock))
            setState(prevState => ({...prevState, stock}));
    };


    const onImageChange = useCallback(image => {
        setState(prevState => ({...prevState, image}));
    },[]);


    const onSubmit =() => {
        const values = {};
        if (state.image)
            values.image = state.image;
        if (state.price)
            values.price = state.price;
        if (state.stock)
            values.stock = state.stock;
        if (Object.keys(values).length)
            dispatch({type: "BATCH_CHANGE_SKU", payload: {valueIds: state.valueIds, values}});
    };

    return (
        <div className="sku-table-batch">
            {checkedSaleAttributes && checkedSaleAttributes.map((attribute, index) =>
                <div key={attribute.attributeId} className="sku-table-batch-item">
                    <label>{attribute.name}</label>
                    <Select
                        value={valueIds[index]}
                        onChange={onSaleAttributeChange}
                    >
                        <Select.Option index={index} value={null}>全部</Select.Option>
                        {attribute.values.map(value=>
                            <Select.Option index={index} value={value.valueId} key={value.valueId}>{value.val}</Select.Option>
                        )}
                    </Select>
                </div>
            )}
            <div className="sku-table-batch-item">
                <label>图片</label>
                <ImageCard image={image} onChange={onImageChange} className="sku-image-upload"/>
            </div>
            <div className="sku-table-batch-item">
                <label>价格</label>
                <Input value={price} onChange={onPriceChange}/>
            </div>
            <div className="sku-table-batch-item">
                <label>库存</label>
                <Input value={stock} onChange={onStockChange}/>
            </div>
            <div className="sku-table-batch-item">
                <label>某项不想批量设置，请留空</label>
                <Button onClick={onSubmit}>批量设置</Button>
            </div>
        </div>
    );
})

const SkuRow = React.memo(({sku, spans, vals, dispatch}) => {
    const onImageChange = useCallback(image => {
        dispatch({type: "CHANGE_SKU", payload: {key: sku.key, values:{image}}});
    }, [sku, dispatch]);

    const onPriceChange = e => {
        const price = e.target.value;
        if (!price || re_price.test(price)) {
            dispatch({type: "CHANGE_SKU", payload: {key: sku.key, values:{price}}});
        }
    };

    const onStockChange = e => {
        const stock = e.target.value;
        if (!stock || re_stock.test(stock)) {
            dispatch({type: "CHANGE_SKU", payload: {key: sku.key,  values:{stock}}});
        }
    };

    const onCodeChange = e => {
        dispatch({type: "CHANGE_SKU", payload: {key: sku.key, values:{code: e.target.value}}});
    };

    return (
        <tr>
            {sku.attributes && sku.attributes.map((attribute, i) =>
                spans[i] > 0  &&
                <td rowSpan={spans[i]} key={vals[i]}>{vals[i]}</td>
            )}
            <td>
                {/*<PictureUpload value={sku.image} onChange={onImageChange} className="sku-image-upload"/>*/}
                <ImageCard image={sku.image} onChange={onImageChange} className="sku-image-upload"/>
            </td>
            <td>
                <Input value={sku.price} onChange={onPriceChange}/>
            </td>
            <td>
                <Input value={sku.stock} onChange={onStockChange}/>
            </td>
            <td>
                <Input value={sku.code} onChange={onCodeChange}/>
            </td>
        </tr>
    );

}, (prevProps, nextProps) =>
    prevProps.sku === nextProps.sku &&
    prevProps.dispatch === nextProps.dispatch &&
    simpleArrayEquals(prevProps.spans, nextProps.spans) &&
    simpleArrayEquals(prevProps.vals, nextProps.vals)
);

function simpleArrayEquals(array1, array2) {
    return  array1 === array2 || (array1.length ===  array2.length && array1.every((e, i) => e === array2[i]));
}


const SkuTable = React.memo(({skus, checkedSaleAttributes, error, dispatch}) => {
    return (
        <div className="form-item">
            <label className="form-item-hd form-required">
                主图
            </label>
            <div className="form-item-bd">
                <SkuTableBatch checkedSaleAttributes={checkedSaleAttributes} dispatch={dispatch}/>
                <table className="sku-table">
                    <thead>
                    <tr>
                        {checkedSaleAttributes && checkedSaleAttributes.map(productSaleAttribute =>
                            <th key={productSaleAttribute.attributeId}>
                                {productSaleAttribute.name}
                            </th>
                        )}
                        <th>图片</th>
                        <th>价格</th>
                        <th>库存</th>
                        <th>编码</th>
                    </tr>
                    </thead>
                    <tbody>
                    {skus && skus.map((sku, index) =>
                        <SkuRow
                            key={sku.key}
                            sku={sku}
                            spans={checkedSaleAttributes && checkedSaleAttributes.map(item => index % item.subtotal ? 0 : item.subtotal)}
                            vals={sku.attributes && sku.attributes.map(attr => attr.val)}
                            dispatch={dispatch}
                        />
                    )}
                    </tbody>
                </table>
                {error && <div className="form-error">{error}</div>}
            </div>
        </div>
    );
});

export default SkuTable;