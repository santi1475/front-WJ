
export interface IApiResponse<T> {
    code: number;
    status?: string;
    message?: string;
    data: T;
}

export interface IApiListResponse<T> {
    code: number;
    status: string;
    count: number;
    data: T[];
}