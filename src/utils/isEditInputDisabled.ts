const disabledData = ["id", "createdAt"]

export const isEditInputDisabled = (value: string): boolean => disabledData.includes(value)