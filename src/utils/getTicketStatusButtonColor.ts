import { TicketStatusEnum } from "@customTypes/admin/pages"

import type { ButtonPropsColorOverrides } from "@mui/material/Button"
import type { OverridableStringUnion } from "@mui/types"

export const getTicketStatusButtonColor = (status: TicketStatusEnum):
   OverridableStringUnion<
      "inherit" | "primary" | "secondary" | "success" | "error" | "info" | "warning",
      ButtonPropsColorOverrides> => {
   if (status === TicketStatusEnum.NEW) return "success"
   if (status === TicketStatusEnum.REPLIED) return "warning"
   if (status === TicketStatusEnum.CLOSED) return "error"

   return "inherit"
}