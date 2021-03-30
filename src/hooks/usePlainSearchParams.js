import {useHistory, useLocation} from "react-router-dom";
import {useCallback, useMemo} from "react";


//URLSearchParams 转化为 普通Object
function searchParamsToPlainParams(urlSearchParams, arrayKeys) {
    const plainParams = {};
    for (const [key, value] of urlSearchParams)
        plainParams[key] = arrayKeys && arrayKeys.includes(key) ? urlSearchParams.getAll(key) : value;
    return plainParams;
}

//普通Object 转化为 URLSearchParams
function plainParamsToSearchParams(plainParams) {
    const urlSearchParams = new URLSearchParams();
    for (let key in plainParams) {
        const v = plainParams[key];
        if (Array.isArray(v)) {
            v.forEach((vi=> urlSearchParams.append(key, vi)));
        } else if (v !== undefined && v !== null) {
            urlSearchParams.set(key, v);
        }

    }

    return urlSearchParams;
}

//同步URL中query状态
//arrayKeys，将指定key解释为数组
export function usePlainSearchParams(arrayKeys) {
    const {search} = useLocation();
    const searchParams = useMemo(() => searchParamsToPlainParams(new URLSearchParams(search), arrayKeys),
        [search, arrayKeys]);
    const history = useHistory();
    const setSearchParams = useCallback((params, options = {append: true}) => {
        const newParams = options.append ? {...searchParams, ...params} : params;
        const newSearch = "?" + plainParamsToSearchParams(newParams);
        if (newSearch !== search)
            history.push(newSearch);
        else
            history.replace(newSearch);
        return newParams;

    },[searchParams, history, search]);
    return [searchParams, setSearchParams];
}
