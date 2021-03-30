import React, {useEffect, useMemo, useState} from 'react'
import * as api from '../../api';
import {Menu, Breadcrumb, Modal} from 'antd';
import './CategoryPicker.less';
import {useAsyncTask} from "../../hooks";
import {Status} from "../../components";

const CategoryPicker=React.memo(({value, onChange, visible=false}) => {
    // console.info("CategoryPicker", {value, onChange, visible});
    const {status, data : categories, error, execute} = useAsyncTask(api.getAllCategories);
    const [modalVisible, setModalVisible] = useState(visible);
    const [category1, setCategory1] = useState();
    const [category2, setCategory2] = useState();
    const [category3, setCategory3] = useState();


    useEffect(()=> {
        if (modalVisible && !categories)
            execute();
    }, [modalVisible]);

    function onCategory1Click(item) {
        if (item === category1)
            return;
        setCategory1(item);
        setCategory2(undefined);
        setCategory3(undefined);
    }

    function onCategory2Click(item) {
        if (item === category2)
            return;
        setCategory2(item);
        setCategory3(undefined);
    }

    function onCategory3Click(item) {
        if (item === category3)
            return;
        setCategory3(item);
    }

    function onOk() {
        setModalVisible(false);
        if (value && value[2].id === category3.id)
            return;

        const newValue = [category1, category2, category3];
        if (onChange) onChange(newValue);
    }

    return (
        <>
            {value &&
            <Breadcrumb style={{display: "inline-block", marginRight: 30}} >
                <Breadcrumb.Item>{value[0].name}</Breadcrumb.Item>
                <Breadcrumb.Item>{value[1].name}</Breadcrumb.Item>
                <Breadcrumb.Item>{value[2].name}</Breadcrumb.Item>
            </Breadcrumb>
            }
            <a onClick={()=>setModalVisible(true)}>
                修改类目
            </a>


            <Modal visible={modalVisible}
                   title="选择商品类目"
                   width={1000}
                   okButtonProps={{disabled: !category3}}
                   onCancel={()=>setModalVisible(false)}
                   onOk={onOk}>
                <div style={{display: "flex", border: 1, borderColor: "#f0f0f0"}}>
                    <Menu className="category-select">
                        {categories && categories.map(item =>
                            <Menu.Item onClick={() => onCategory1Click(item)} key={item.id}>{item.name}</Menu.Item>
                        )}
                    </Menu>
                    <Menu className="category-select">
                        {category1 && category1.children && category1.children.map(item =>
                            <Menu.Item onClick={() => onCategory2Click(item)} key={item.id}>{item.name}</Menu.Item>
                        )}
                    </Menu>
                    <Menu className="category-select">
                        {category2 && category2.children && category2.children.map(item =>
                            <Menu.Item onClick={() => onCategory3Click(item)}  key={item.id}>{item.name}</Menu.Item>
                        )}
                    </Menu>

                </div>
                <div style={{marginTop:30, marginBottom:30}}>
                    已选：
                    <Breadcrumb style={{display: "inline-block"}}>
                        <Breadcrumb.Item>{category1 && category1.name}</Breadcrumb.Item>
                        <Breadcrumb.Item>{category2 && category2.name}</Breadcrumb.Item>
                        <Breadcrumb.Item>{category3 && category3.name}</Breadcrumb.Item>
                    </Breadcrumb>
                </div>

                <Status status={status} errMsg={error && error.errMsg}/>
            </Modal>
        </>
    );
});

export default CategoryPicker;
