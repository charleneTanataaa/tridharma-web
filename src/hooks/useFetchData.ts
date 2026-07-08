import { Dispatch, SetStateAction, useEffect, useState } from "react";

interface UseFetchDataReturn<T>{
    data: T | null;
    loading: boolean;
    error: string | null;
    setData: Dispatch<SetStateAction<T | null>>;
}

type UseFetchDataProps<T> = {
    fetchFn: () => Promise<T>;
    dependencies: any[];
};

export function useFetchData<T>({fetchFn, dependencies}: UseFetchDataProps<T>): UseFetchDataReturn<T>{
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetch = async () => {
            try{
                setLoading(true);
                setError(null);
                const result = await fetchFn();
                setData(result);
            } catch (err: any){
                setError(err.message || "Gagal memuat data");
            } finally{
                setLoading(false);
            }
        };
        fetch();
    }, dependencies);
    return { data, loading, error, setData};
}