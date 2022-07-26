const disabledData = ["id", "createdAt", "updatedAt"]

export const isEditInputDisabled = (value: string): boolean => disabledData.includes(value)