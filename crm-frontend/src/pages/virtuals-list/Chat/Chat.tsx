import React, { useRef, useState } from "react"
import { ChevronLeftIcon } from "@heroicons/react/outline"
import { PaperAirplaneIcon } from "@heroicons/react/solid"

import Avatar from "../../../components/DataDisplay/Avatar"
import Icon from "../../../components/DataDisplay/Icon"
import Textarea from "../../../components/Inputs/Textarea"

interface IChatProps {
  open: boolean
  setOpen: () => void
}

interface IChatItemProps {
  name: string
  text: string
  image: string | null
}

const Chat = ({ open, setOpen }: IChatProps): JSX.Element => {
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // auth user
  const user = { id: 1, name: "Abdul" }

  const [chats, setChats] = useState([
    {
      name: "Devin",
      text: "Devin Peach just joined the queue. He is in a hurry, please get to him quick. I updated his cc and sx.",
      image: null,
      userId: 2,
    },
    {
      name: "Abdul",
      text: "Abdul Rehman just joined the queue. He is in a hurry, please get to him quick. I updated his cc and sx.",
      image: null,
      userId: 1,
    },
  ])

  // fix e: any
  const handleSubmit = (e: any) => {
    e.preventDefault()

    // send to server and local state
    if (inputRef.current) {
      setChats([
        ...chats,
        {
          text: inputRef.current.value,
          name: user.name,
          userId: user.id,
          image: null,
        },
      ])

      inputRef.current.value = ""
    }
  }

  return (
    <div className={`-my-5 col-span-2 border-l dark:border-black-900 flex flex-col max-w-md absolute top-0 bottom-0 -right-5 h-full bg-white dark:bg-black-700 z-20 lg:relative lg:max-w-full transition duration-500 transform ${!open ? "translate-x-full" : "translate-x-0"}`}>
      <button
        className={`lg:hidden border w-8 h-8 shadow absolute -left-4 top-5 rounded-full bg-white dark:bg-black-800 dark:border-black-600 dark:text-white z-30 text-lg flex justify-center items-center transform transition duration-500 ${open ? "rotate-180" : "rotate-0 -translate-x-5"}`}
        onClick={setOpen}
      >
        <Icon icon={ChevronLeftIcon}></Icon>
      </button>

      {!open && <div className="w-5 border-l absolute -left-5 h-full z-20 bg-white dark:bg-black-700 dark:border-black-900"></div>}

      <div className={`flex-1 h-full flex flex-col w-full transition duration-500 ${open ? "opacity-100" : "opacity-0"}`}>
        <header className="text-center text-xl font-semibold py-2.5 border-b dark:border-black-900 dark:bg-black-900 p-2">
          <h3 className="dark:text-white">Chat</h3>
        </header>

        <div className="p-3 overflow-y-auto h-full flex flex-col space-y-3">
          {chats.map((chat, index) => (
            <React.Fragment key={index}>{chat.userId === user.id ? <LocalChatItem name={chat.name} text={chat.text} image={chat.image} /> : <RemoteChatItem name={chat.name} text={chat.text} image={chat.image} />}</React.Fragment>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="relative">
          <Textarea placeholder="Type your message here" rows={5} innerRef={inputRef}></Textarea>

          <button type="submit" className="p-1 text-gray-600 text-2xl flex items-center justify-center absolute right-3 bottom-3 dark:text-gray-400 dark:hover:text-gray-300 transition">
            <Icon icon={PaperAirplaneIcon}></Icon>
          </button>
        </form>
      </div>
    </div>
  )
}

export default Chat

const RemoteChatItem = ({ name, text, image }: IChatItemProps) => {
  return (
    <div className="flex items-start justify-start">
      <div>
        <Avatar image={image} firstName={name} className={"border dark:text-white w-8 h-8 text-gray-600 dark:bg-black-900 dark:border-black-900 text-sm"}></Avatar>
      </div>
      <div className="bg-gray-100 dark:bg-black-800 dark:text-white text-sm lg:text-xs 2xl:text-sm ml-2 px-3 py-2 rounded-xl mr-5">{text}</div>
    </div>
  )
}

const LocalChatItem = ({ name, text, image }: IChatItemProps) => {
  return (
    <div className="flex items-start justify-end">
      <div className="bg-violet-100 dark:bg-black-900 dark:text-white text-sm lg:text-xs 2xl:text-sm mr-2 px-3 py-2 rounded-xl ml-5">{text}</div>
      <div>
        <Avatar image={image} firstName={name} className={"border dark:text-white w-8 h-8 text-gray-600 dark:bg-black-900 dark:border-black-900 text-sm"}></Avatar>
      </div>
    </div>
  )
}
