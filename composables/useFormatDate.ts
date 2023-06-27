import moment from 'moment'

export const useFormatDate = (date: string) => {
    return moment(date).format('DD MMMM YYYY hh:mm:ss')
}