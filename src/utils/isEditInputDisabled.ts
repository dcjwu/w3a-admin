const disabledData = ["id", "createdAt", "updatedAt", "settingName"]

export const isEditInputDisabled = (value: string): boolean => disabledData.includes(value)