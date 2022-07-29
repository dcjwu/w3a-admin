const https = "https://"

export const isStringUrl = (str: string): boolean => {
   if (str) return str.includes(https)
   return false
}