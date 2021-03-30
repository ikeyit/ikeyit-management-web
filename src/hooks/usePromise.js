import {useEffect, useRef, useState} from "react";

//异步任务，同步状态和数据！三个状态loading success error
export function usePromise(options) {
    const [state, setState] = useState(options.init || {});
    // 防止组件卸载以后异步回调设置状态报异常
    const unmounted = useRef(false);
    // 放置重复执行出现混乱，如果上次执行还没有完成，有重新执行，则上次执行返回的结果会被丢弃
    const lastCallId = useRef(0);
    const execute = promise => {
        if (unmounted.current)
            return Promise.reject({errCode: "UNMOUNT"});
        const callId = ++lastCallId.current;
        setState(prevState => ({ ...prevState, status: "loading" }));
        options.onLoading && options.onLoading();
        return promise.then(data => {
            if (unmounted.current || callId !== lastCallId.current)
                return;
            setState(prevState => ({ ...prevState, status: "success", data }));
            options.onSuccess && options.onSuccess(data);
            return data;
        }).catch(error => {
            if (unmounted.current || callId !== lastCallId.current)
                return;
            setState(prevState => ({...prevState, status: "error", error}));
            options.onError && options.onError(error);
            return Promise.reject(error);
        });
    };

    const setData = data => {
        setState(prevState => ({
            ...prevState,
            data: typeof data === "function" ? data(prevState.data) : data
        }));
    }

    useEffect(() => () => {
        unmounted.current = true;
    }, []);

    return {...state, execute, setData};
}