import { useState } from "react"

import Chat from "./Chat/Chat"
import WaitingQueue from "./WaitingQueue/WaitingQueue"

export default function VirtualsList(): JSX.Element {
  const [showChat, setShowChat] = useState(true)
  return (
    <div className="min-w-0 flex-1 h-full flex flex-col dark:bg-black-700 overflow-hidden lg:order-last relative">
      <WaitingQueue />

      {/* <Chat open={showChat} setOpen={(): void => setShowChat((prev) => !prev)} /> */}
    </div>
  )
}
