import React, {useCallback, useEffect} from "react";
import {usePlainSearchParams, useSafeReducer} from "../../../hooks";
import {fileListToUrls, PicturesWall, urlsToFileList} from "./PicturesWall";
import * as api from "../../../api";
import CategoryPicker from "../CategoryPicker";
import SpecPicker from "./SpecPicker";
import SkuTable from "./SkuTable";
import BasicAttributesEdit from "./BasicAttributesEdit";
import {ProductDetailEditTrigger} from "../ProductDetailEdit";
import {ImageCardList} from "../ImageCard";
import {Button, Input} from "antd";
import {Status} from "../../../components";
import "./style.less";

export default function ProductEdit() {
    const [{id}] = usePlainSearchParams();
    //id变了就重新挂载
    return <ProductEditInternal key={id} id={id}/>
}

function ProductEditInternal({id}) {
    const [state, dispatch] = useSafeReducer(reducer, async, null, () => {
        const cachedSkus = [];
        return {
            product: null, //产品信息，不可修改
            categoryAttributes: null, //类目属性，不可修改
            categoryAttributeValues: null, //类目属性值， 不可修改
            saleAttributes: undefined,
            checkedSaleAttributes: undefined,
            cachedSkus,
            skus: calculateSkus(cachedSkus),
            errors:{},
        };
    });
    useEffect(()=>{
        if (id)
            dispatch({type: "GET_PRODUCT", payload:{id}});
    }, []);

    const onCategoryChange = useCallback(category => {
        dispatch({type: "CHANGE_CATEGORY", payload: {category, categoryError: validateCategory(category)}});
    },[]);
    const onTitleChange = useCallback(e => {
        const title = e.target.value;
        dispatch({type: "CHANGE_SIMPLE_FIELD", payload: {title, titleError: validateTitle(title)}});
    },[]);
    const onModelChange = useCallback(e => {
        const model = e.target.value;
        dispatch({type: "CHANGE_SIMPLE_FIELD", payload: {model, modelError: validateModel(model)}});
    },[]);
    const onImageChange = useCallback(images => {
        dispatch({type: "CHANGE_SIMPLE_FIELD", payload: {images, imagesError: validateImages(images)}});
    },[]);

    const onFinish = () => {
        const errors = {
            categoryError: validateCategory(state.category),
            titleError: validateTitle(state.title),
            imagesError: validateImages(state.images),
            modelError: validateModel(state.model),
            skusError: validateSkus(state.skus),
            attributesError: validateAttributes(state.basicAttributes),
        }

       if (Object.values(errors).every(item => !item)) {
           //转化为api所需要的参数
           const saleAttributeValues = state.checkedSaleAttributes ? state.checkedSaleAttributes
               .flatMap(attribute => attribute.values) : [];
           const basicAttributeValues = state.basicAttributes ? state.basicAttributes
               .filter(attribute => attribute.selected !== undefined)
               .map(attribute => attribute.values.find(value => value.valueId === attribute.selected)) : [];
           const attributes = [...saleAttributeValues, ...basicAttributeValues]
               .map(value => ({
                   attributeId: value.attributeId,
                   valueId: value.valueId,
                   val: value.val,
               }));
           dispatch({type: "SAVE", payload: {
                   id,
                   title: state.title,
                   categoryId: state.category[2].id,
                   model: state.model,
                   images: state.images.map(item=>item.url),
                   attributes,
                   skus: state.skus,
                   detail: state.detail,
               }
           });
       } else  {
           dispatch({type: "SET_ERRORS", payload: errors});
           console.info(state);
       }
    }

    if (state.saveStatus === "success")
        return (
            <div>
                保存成功！
            </div>
        );
    return (
        <Status status={state.loadStatus} errMsg={state.loadError}>
            <div className="form-item">
                <label className="form-item-hd form-required">
                    类目
                </label>
                <div className="form-item-bd">
                    <CategoryPicker value={state.category} visible={!id} onChange={onCategoryChange}/>
                    {state.categoryError && <div className="form-error">{state.categoryError}</div>}
                </div>
            </div>

            <div className="form-item">
                <label className="form-item-hd form-required">
                    商品标题
                </label>
                <div className="form-item-bd">
                    <Input value={state.title} onChange={onTitleChange} />
                    {state.titleError && <div className="form-error">{state.titleError}</div>}
                </div>
            </div>

            <div className="form-item">
                <label className="form-item-hd">
                    商品编码
                </label>
                <div className="form-item-bd">
                    <Input value={state.model} onChange={onModelChange}/>
                    {state.modelError && <div className="form-error">{state.modelError}</div>}
                </div>
            </div>

            <div className="form-item">
                <label className="form-item-hd">
                    主图
                </label>
                <div className="form-item-bd">
                    {/*<PicturesWall fileList={state.images} className="product-image-upload"  onChange={onImageChange}/>*/}
                    <ImageCardList images={state.images} className="product-image-upload" onChange={onImageChange}/>

                    {state.imagesError && <div className="form-error">{state.imagesError}</div>}
                </div>
            </div>
            <BasicAttributesEdit basicAttributes={state.basicAttributes} error={state.attributesError} dispatch={dispatch}/>
            <SpecPicker saleAttributes={state.saleAttributes} dispatch={dispatch}/>
            <SkuTable checkedSaleAttributes={state.checkedSaleAttributes} skus={state.skus} error={state.skusError} dispatch={dispatch}/>
            <ProductDetailEditTrigger detail={state.detail} dispatch={dispatch}/>
            <div className="form-item">
                <label className="form-item-hd">
                </label>
                <div className="form-item-bd">
                    <Button type="primary" htmlType="submit" loading={state.saveStatus === "loading"} onClick={onFinish}>
                        提交
                    </Button>
                </div>
            </div>
        </Status>
    );
}




function reducer(state, action) {
    const {type, payload} = action;
    switch (type) {
        case 'GET_PRODUCT_START':
            return {...state, loadStatus: "loading"};
        case 'GET_PRODUCT_SUCCESS': {
            const {product, categoryAttributes, categoryAttributeValues} = payload;
            return {
                ...state,
                ...payload,
                loadStatus: "success",
                title: product.title,
                model: product.model,
                detail: product.detail,
                images: ImageCardList.fromUrls(product.images),
                cachedSkus: cacheSkus(product.skus, state.cachedSkus),
                ...refreshAttributes(categoryAttributes, categoryAttributeValues, product.attributes, state.cachedSkus),
            };
        }
        case 'CHANGE_CATEGORY_START':
            return {...state, ...payload, loadStatus: "loading"};
        case 'CHANGE_CATEGORY_SUCCESS': {
            const {categoryAttributes, categoryAttributeValues} = payload;
            return {
                ...state,
                categoryAttributes,
                categoryAttributeValues,
                loadStatus: "success",
                ...refreshAttributes(categoryAttributes, categoryAttributeValues, state.product && state.product.attributes, state.cachedSkus),
            };
        }
        case 'GET_PRODUCT_ERROR':
        case 'CHANGE_CATEGORY_ERROR':
            return {
                ...state,
                loadStatus: "error",
                loadError: payload.errMsg
            };
        case "CHANGE_BASIC_ATTRIBUTE": {
            const {valueId, attributeId} = payload;
            let changedAttribute = undefined;
            const basicAttributes = state.basicAttributes.map(attribute => {
                if (attributeId !== attribute.attributeId)
                    return attribute;
                changedAttribute = {
                    ...attribute,
                    selected: valueId,
                };
                return changedAttribute;
            });

            return {
                ...state,
                basicAttributes,
                attributesError: {
                    ...state.attributesError,
                    [attributeId]: validateAttribute(changedAttribute),
                }
            }
        }
        case "CHANGE_SPEC": {
            const {valueId, params} = payload;
            const saleAttributes = state.saleAttributes.map(attribute => {
                if (attribute.values.some(value => value.valueId === valueId)) {
                    return {
                        ...attribute,
                        values: attribute.values.map(value => {
                            if (value.valueId !== valueId)
                                return value;
                            return {
                                ...value,
                                ...params,
                            }
                        }),
                    }
                }
                return attribute;
            });

            const checkedSaleAttributes = getCheckedAttributes(saleAttributes);
            const skus = calculateSkus(state.cachedSkus, checkedSaleAttributes);
            return {
                ...state,
                saleAttributes,
                checkedSaleAttributes,
                skus,
            };
        }

        case "ADD_SPEC": {
            const {attributeId, params} = payload;
            const saleAttributes = state.saleAttributes.map(attribute => {
                if (attribute.attributeId !== attributeId)
                    return attribute;
                return {
                    ...attribute,
                    values: [...attribute.values, {
                        attributeId: attributeId,
                        valueId: --newValueIdGenerator,
                        checked: true,
                        customized: true,
                        ...params,
                    }]
                }
            });

            const checkedSaleAttributes = getCheckedAttributes(saleAttributes);
            const skus = calculateSkus(state.cachedSkus, checkedSaleAttributes);
            return {
                ...state,
                saleAttributes,
                checkedSaleAttributes,
                skus,
            };
        }
        case "ORDER_SPEC": {
            const attributeId = payload[0].attributeId;
            const saleAttributes = state.saleAttributes.map(attribute => {
                if (attribute.attributeId !== attributeId)
                    return attribute;
                const valuesMap = {};
                attribute.values.forEach(value => valuesMap[value.valueId] = value);
                return {
                    ...attribute,
                    values: payload.map(value => valuesMap[value.valueId]),
                }
            });

            const checkedSaleAttributes = getCheckedAttributes(saleAttributes);
            const skus = calculateSkus(state.cachedSkus, checkedSaleAttributes);
            return {
                ...state,
                saleAttributes,
                checkedSaleAttributes,
                skus,
            };
        }
        case "CHANGE_SKU": {
            const {key, values} = payload;
            const skus = state.skus.map(sku => {
                if (sku.key !== key)
                    return sku;

                const newSku = {...sku, ...values};
                state.cachedSkus[newSku.key] = newSku;
                return newSku;
            });
            return {
                ...state,
                skus,
                skusError: validateSkus(skus)
            };
        }
        case "BATCH_CHANGE_SKU": {
            const {valueIds, values} = payload;
            const skus = state.skus.map(sku => {
                if (valueIds.some((valueId, i) => valueId && valueId !== sku.attributes[i].valueId))
                    return sku;
                const newSku = {...sku, ...values};
                //更新缓存
                state.cachedSkus[newSku.key] = newSku;
                return newSku;
            });

            return {
                ...state,
                skus,
                skusError: validateSkus(skus)
            };
        }
        case "CHANGE_DETAIL": {
            return {
                ...state,
                detail: payload,
            }
        }
        case "SAVE_START":
            return {
                ...state,
                saveStatus: "loading",
            }
        case "SAVE_SUCCESS":
            return {
                ...state,
                saveStatus: "success",
            }
        case "SAVE_ERROR":
            return {
                ...state,
                saveStatus: "error",
                saveError: payload.errMsg,
            }
        case "CHANGE_SIMPLE_FIELD":
            return  {
                ...state,
                ...payload,
            }
        case "SET_ERRORS":
            return {
                ...state,
                ...payload,
            }
        default:
            return state;
    }
}

//异步操作放这里
function async(action, dispatch) {
    const {type, payload} = action;
    switch (type) {
        case "GET_PRODUCT": //加载产品数据
            dispatch({...action, type: "GET_PRODUCT_START"});
            const data = {};
            api.getProduct(payload).then(res => {
                data.product = res;
                const params = {id: res.categoryId};
                return Promise.all([api.getCategoryPath(params), api.getCategoryAttributes(params), api.getCategoryAttributeValues(params)]);
            }).then(([category, categoryAttributes, categoryAttributeValues]) => {
                data.category = category;
                data.categoryAttributes = categoryAttributes;
                data.categoryAttributeValues = categoryAttributeValues;
                dispatch({type: "GET_PRODUCT_SUCCESS", payload: data});
            }).catch(error =>
                dispatch({type: "GET_PRODUCT_ERROR", payload: error})
            );
            break;
        case "CHANGE_CATEGORY": //用户切换了类目
            dispatch({...action, type: "CHANGE_CATEGORY_START"});
            const params = {id: payload.category[2].id};
            Promise.all([api.getCategoryAttributes(params), api.getCategoryAttributeValues(params)])
                .then(([categoryAttributes, categoryAttributeValues]) =>
                    dispatch({type: "CHANGE_CATEGORY_SUCCESS", payload: {categoryAttributes, categoryAttributeValues}})
                ).catch(error =>
                dispatch({type: "CHANGE_CATEGORY_ERROR", payload: error})
            );
            break;
        case "SAVE":
            dispatch({...action, type: "SAVE_START"});
            (payload.id ? api.updateProduct : api.createProduct)(payload).then(res =>
                dispatch({type: "SAVE_SUCCESS", payload: res})
            ).catch(error=>
                dispatch({type: "SAVE_ERROR", payload: error})
            );
        default:
            dispatch(action);
    }
}

const no_sale_attribute = "no_sale_attribute";

let newValueIdGenerator = -1;

//递归生成笛卡尔乘积
function crossJoin(checkedSaleAttributes,  i = 0) {
    const attribute = checkedSaleAttributes[i];
    i++;
    const ret = [];
    if (i < checkedSaleAttributes.length) {
        attribute.values.forEach(value => {
            crossJoin(checkedSaleAttributes, i).forEach(subValue => ret.push([value, ...subValue]));
        });
    } else {
        attribute.values.forEach(value=>ret.push([value]));
    }
    return ret;
}


function calculateSkus(cachedSkus, checkedSaleAttributes) {
    if (!checkedSaleAttributes || checkedSaleAttributes.length <= 0) {
        let sku = cachedSkus[no_sale_attribute];
        if (!sku) {
            sku = {
                key: no_sale_attribute,
                stock: null,
                price: null,
            };
            cachedSkus[no_sale_attribute] = sku;
        }
        return [sku];
    }

    return crossJoin(checkedSaleAttributes).map(attributes => {
        const key = attributes.map(item => item.valueId).join(",");
        let sku = cachedSkus[key];
        if (!sku) {
            sku = {
                key,
                stock: null,
                price: null,
            };
            cachedSkus[key] = sku;
        }
        sku.attributes = attributes;
        return sku;
    });
}

//合并类目属性和产品属性
function mergeAttributes(categoryAttributes, categoryValues, productValues) {
    if (!categoryAttributes)
        return {};

    const saleAttributes = [];
    const basicAttributes = [];
    const attributesMap = {};
    categoryAttributes.forEach(item => {
        const attribute = {...item, values:[]};
        attributesMap[attribute.attributeId] = attribute;
        if (item.attributeType === 0) {
            basicAttributes.push(attribute);
        } else if (item.attributeType === 2) {
            saleAttributes.push(attribute);
        }
    });

    productValues && productValues.forEach(value => {
        const attribute = attributesMap[value.attributeId];
        if (attribute) {
            //目前基础属性仅支持单选，不可自定义。可以在这里扩展
            const mergedValue = {
                ...value,
                customized: true,
            };
            if (attribute.attributeType === 0) {
                attribute.selected = value.valueId;
            } else if (attribute.attributeType === 2) {
                mergedValue.checked = true;
            }
            attribute.values.push(mergedValue);
        }
    });

    categoryValues && categoryValues.forEach(value => {
        const attribute = attributesMap[value.attributeId];
        if (attribute) {
            let existingValue = attribute.values.find(item => item.valueId === value.valueId);
            if (!existingValue) {
                existingValue = {
                    ...value,
                    checked: false,
                }
                attribute.values.push(existingValue);
            }
            existingValue.customized = false;
        }
    });

    return {
        basicAttributes: basicAttributes.length ? basicAttributes : undefined,
        saleAttributes: saleAttributes.length ? saleAttributes : undefined,
    };
}

//获取选中的属性
function getCheckedAttributes(attributes) {
    if (!attributes)
        return;
    let checkedAttributes = [];
    attributes.forEach(attribute => {
        const values = [];
        attribute.values.forEach(value => {
            if (value.checked)
                values.push(value);
        });

        if (values.length) {
            checkedAttributes.push({
                attributeId: attribute.attributeId,
                name: attribute.name,
                values,
            });
        }
    });

    //用于计算跨行
    const last = checkedAttributes.length - 1;
    for (let i = last; i >= 0; i--) {
        checkedAttributes[i].subtotal = i === last ?
            1 : checkedAttributes[i + 1].subtotal * checkedAttributes[i + 1].values.length;
    }

    if (checkedAttributes.length)
        return checkedAttributes;
}

function refreshAttributes(categoryAttributes, categoryValues, productValues, cachedSkus) {
    const {basicAttributes, saleAttributes} = mergeAttributes(categoryAttributes, categoryValues, productValues);
    const checkedSaleAttributes = getCheckedAttributes(saleAttributes);
    const skus = calculateSkus(cachedSkus, checkedSaleAttributes);

    return {
        basicAttributes,
        saleAttributes,
        checkedSaleAttributes,
        skus,
    };
};


function cacheSkus(skus, cachedSkus) {
    skus && skus.forEach(sku => {
        const key = sku.attributes && sku.attributes.length ? sku.attributes.map(item=>item.valueId).join(",") : no_sale_attribute;
        sku.key = key;
        cachedSkus[key] = sku;
    });
    return cachedSkus;
}


function validateSkus(skus) {
    if (skus === undefined || skus === null || skus.length <=0 )
        return '规格不能为空哦~';
    for (let row = 1; row <= skus.length; row++) {
        let sku = skus[row-1];
        if (!sku.price)
            return `第${row}行：价格不能为空`;
        if (!sku.stock)
            return `第${row}行：库存不能为空`;
        if (parseFloat(sku.price) < 0)
            return `第${row}行：价格必须大于0`;
        if (parseInt(sku.stock) < 0)
            return `第${row}行：库存必须大于等于0`;
    }
};

function validateCategory(category) {
    if (!category)
        return "类目不能为空";
}


function validateTitle(title) {
    if (!title)
        return "标题不能为空";
    if (title.length > 60)
        return "标题不能超过60个字";
}

function validateModel(model) {
    if (model && model.length > 30)
        return "编码不能超过30个字";
}

function validateImages(images) {
    if (!images || !images.length)
        return "请至少上传一张图片";
}

function validateAttributes(attributes) {
    const errors = {};
    let hasError = false;
    attributes && attributes.forEach(attribute=> {
        const error = validateAttribute(attribute);
        errors[attribute.attributeId] = error;
        if (error)
            hasError = true;
    });
    return hasError ? errors : undefined;
}

function validateAttribute(attribute) {
    if (attribute.selected === undefined || attribute.selected === null)
        return "不能为空";
}