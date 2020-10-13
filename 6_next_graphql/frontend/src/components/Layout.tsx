import React from "react"
import NavBar from "./NavBar"
import PageWrapper, { PageWrapperVariant } from "./PageWrapper"

interface LayoutProps {
  variant?: PageWrapperVariant
}

const Layout: React.FC<LayoutProps> = ({ children, variant = "regular" }) => {
  return (
    <>
      <NavBar />

      <PageWrapper variant={variant}>{children}</PageWrapper>
    </>
  )
}

export default Layout
