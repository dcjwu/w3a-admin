export const filterRequiredFields = (keys: string[], form: {[k: string]: string}): {[k: string]: string} => {
   const values: string[] = []

   keys.forEach(key => {
      if (form[key]) {
         values.push(form[key])
      }
   })
   
   return keys.reduce((acc, elem, index) => {
      return { ...acc, [elem]: values[index] }
   }, {})
}