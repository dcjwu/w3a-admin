import moment from "moment"

export const isStringDate = (str: string): boolean => moment(str, moment.ISO_8601, true).isValid()