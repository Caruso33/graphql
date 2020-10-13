import { Box } from "@chakra-ui/core"
import React from "react"

export type PageWrapperVariant = "small" | "regular"

interface PageWrapperProps {
  variant?: PageWrapperVariant
}

const PageWrapper: React.FC<PageWrapperProps> = ({
  children,
  variant = "regular",
}) => {
  return (
    <Box
      m={8}
      mx="auto"
      maxW={variant === "regular" ? "1000px" : "400px"}
      w="100%"
    >
      {children}
    </Box>
  )
}

export default PageWrapper
