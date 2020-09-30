import React from "react"
import NavBar from "../components/NavBar"
import QueueList from "../components/QueueList"

interface IndexProps {}

const Index: React.FC<IndexProps> = () => {
  return (
    <>
      <NavBar />
      Hi
      <QueueList />
    </>
  )
}

export default Index
