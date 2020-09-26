import { Box } from "@chakra-ui/core"
import React from "react"

interface PageWrapperProps {
  variant?: "small" | "regular"
}

const PageWrapper: React.FC<PageWrapperProps> = ({
  children,
  variant = "regular",
}) => {
  return (
    <Box
      m={8}
      mx="auto"
      maxW={variant === "regular" ? "800px" : "400px"}
      w="100%"
    >
      {children}
    </Box>
  )
}

export default PageWrapper