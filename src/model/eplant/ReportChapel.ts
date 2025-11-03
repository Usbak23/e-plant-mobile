export interface IReportChapelDay {
    ha: number
    percent: number
}

export interface IReportChapelResponse {
    rotation: string
    a: IReportChapelDay
    b: IReportChapelDay
    c: IReportChapelDay
    d: IReportChapelDay
    e: IReportChapelDay
    f: IReportChapelDay
}