import * as Parse from "parse"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import { useSelector } from "react-redux"
import AgoraRTC, { RemoteStreamType } from "agora-rtc-sdk-ng"
import { MicrophoneIcon, VideoCameraIcon, DesktopComputerIcon } from "@heroicons/react/solid"

import { ele } from "../../../utils/helpers"

import Avatar from "../../../components/DataDisplay/Avatar"
import Button from "../../../components/Inputs/Button"
import Icon from "../../../components/DataDisplay/Icon"
import IconButton from "../../../components/Inputs/IconButton"

const rtc = {
  client: null as any,
  localAudioTrack: null as any,
  localVideoTrack: null as any,
  remoteAudioTrack: null as any,
  remoteVideoTrack: null as any,
}

const encoderConfig = {
  width: 960,
  height: 720,
  frameRate: 30,
  bitrateMax: 2760,
  optimizationMode: "motion",
}

const signalStrenghtMapping = {
  0: "DISCONNECTED",
  1: "EXCELLENT",
  2: "GREAT",
  3: "OKAY",
  4: "WEAK",
  5: "UNUSABLE",
  6: "DISCONNECTED",
}

// fix any
const VirtualPlayer = ({ patientQueue, agoraToken }: any): JSX.Element => {
  let navigate = useNavigate()

  const authData = useSelector((state: any) => state?.Auth.user)
  const [isJoin, setIsJoin] = useState(false)
  const [isJoinRemote, setIsJoinRemote] = useState(false)

  const [isAudioMuted, setIsAudioMuted] = useState(false)
  const [isVideoMuted, setIsVideoMuted] = useState(false)
  const [isScreenSharing, setIsScreenSharing] = useState(false)

  const [isRemoteAudioMuted, setIsRemoteAudioMuted] = useState(false)
  const [isRemoteVideoMuted, setIsRemoteVideoMuted] = useState(false)

  const [notify, setNotify] = useState(false)
  const [localNetworkStats, setLocalNetworkStats] = useState(null)
  const [remoteNetworkStats, setRemoteNetworkStats] = useState(null)

  const handleJoin = async (): Promise<void> => {
    let channel = ""

    if (patientQueue?.attributes) {
      channel = patientQueue?.attributes.channelName ?? ""
    } else {
      channel = patientQueue?.channelName ?? ""
    }

    const options: any = {
      appId: process.env.REACT_APP_AGORA_APP_ID || "",
      channel,
      token: agoraToken,
      uid: authData?.objectId,
      role: "host",
    }

    // Create a local client
    const rtcClient = AgoraRTC.createClient({ mode: "rtc", codec: "h264" })
    rtc.client = rtcClient

    // Subscribe to a remote user
    rtcClient.on("user-published", async (user, mediaType) => {
      // console.log('user-published: ', user, mediaType);

      // Subscribe to a remote user
      await rtcClient.subscribe(user, mediaType)
      // console.log("subscribe success", user, mediaType)

      if (mediaType === "video") {
        await rtcClient.setRemoteVideoStreamType(user.uid, RemoteStreamType.HIGH_STREAM)

        // Get `RemoteVideoTrack` in the `user` object.
        rtc.remoteVideoTrack = user.videoTrack

        // Dynamically create a container in the form of a DIV element for playing the remote video track.
        const playerContainer = document.createElement("div")
        playerContainer.id = user.uid.toString()
        playerContainer.style.width = "100%"
        playerContainer.style.height = "100%"

        const videoBox = ele("#remote-stream")
        videoBox?.appendChild(playerContainer)

        // Play the remote audio and video tracks
        // Pass the ID of the DIV container and the SDK dynamically creates a player in the container for playing the remote video track
        rtc.remoteVideoTrack.play(playerContainer.id)
        setIsJoinRemote(true)
        setIsRemoteVideoMuted(false)
      }

      if (mediaType === "audio") {
        // Get `RemoteAudioTrack` in the `user` object.
        rtc.remoteAudioTrack = user.audioTrack
        // Play the audio track. Do not need to pass any DOM element
        rtc.remoteAudioTrack.play()
        setIsRemoteAudioMuted(false)
      }
    })

    rtcClient.on("user-unpublished", async (user, mediaType) => {
      // console.log("user-unpublished: ", user, mediaType);

      mediaType === "video" && setIsRemoteVideoMuted(true)
      mediaType === "audio" && setIsRemoteAudioMuted(true)

      if (!user.hasVideo) {
        // console.log(user); // check this for video issue
        // Get the dynamically created DIV container
        const playerContainer = document.getElementById(user.uid.toString())
        // Destroy the container
        playerContainer && playerContainer.remove()
      }
    })

    rtcClient.on("user-left", (user, action) => {
      // console.log('user-left: ', user, action, rtc);
      if (action === "Quit") {
        setIsJoinRemote(false)
        setIsRemoteAudioMuted(false)
        setIsRemoteVideoMuted(false)
        setRemoteNetworkStats(null)
        handleLeave()
        setNotify(true)
      }
    })

    rtcClient.on("network-quality", (stats) => {
      // setLocalNetworkStats(stats);
      // let remoteStats = rtcClient.getRemoteNetworkQuality();
      // console.log("remoteStats: ", remoteStats, remoteStats[Object.keys(remoteStats)[0]])
      // setRemoteNetworkStats(remoteStats[Object.keys(remoteStats)[0]]);
    })

    // Join a channel
    try {
      const uid = await rtcClient.join(options.appId, options.channel, options.token, options.uid)

      // Enable dual-stream mode
      // await rtcClient.enableDualStream()

      // Create and publish the local tracks
      // Create an audio track from the audio captured by a microphone
      rtc.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack()

      // Create a video track from the video captured by a camera
      rtc.localVideoTrack = await AgoraRTC.createCameraVideoTrack({
        encoderConfig,
      })

      const localPlayer = document.createElement("div")
      localPlayer.id = `${uid}`
      localPlayer.style.width = "100%"
      localPlayer.style.height = "100%"

      const videoBox = ele("#local-stream")
      videoBox?.appendChild(localPlayer)
      rtc.localVideoTrack.play(`${uid}`)

      // Publish the local audio and video tracks to the channel
      await rtcClient.publish([rtc.localAudioTrack, rtc.localVideoTrack])
      setIsJoin(true)
    } catch (error) {
      console.log("Error joining virtual:", error)
    }
  }

  const handleLeave = async (): Promise<void> => {
    // Destroy the local audio and video tracks
    rtc.localAudioTrack && rtc.localAudioTrack.close()
    rtc.localVideoTrack && rtc.localVideoTrack.close()

    const localPlayer = document.getElementById(rtc.client.uid)
    localPlayer && localPlayer.remove()

    // Traverse all remote users
    rtc.client.remoteUsers.forEach(async (user: { uid: number }) => {
      // Destroy the dynamically created DIV container
      const playerContainer = document.getElementById(user.uid.toString())
      playerContainer && playerContainer.remove()
    })

    // Leave the channel
    await Parse.Cloud.run("crmVirtualCallLeave", { virtualCallId: patientQueue.id })
    await rtc.client.leave()

    setIsJoin(false)
    setIsJoinRemote(false)

    setIsAudioMuted(false)
    setIsVideoMuted(false)
    setIsScreenSharing(false)
    setIsRemoteAudioMuted(false)
    setIsRemoteVideoMuted(false)
    setLocalNetworkStats(null)
    setRemoteNetworkStats(null)
    navigate("/virtuals")
  }

  const toggleAudio = async (): Promise<void> => {
    if (!rtc.localAudioTrack) return

    rtc.localAudioTrack.setMuted(!rtc.localAudioTrack.muted)
    setIsAudioMuted((prev) => !prev)
  }

  const toggleVideo = (): void => {
    if (!rtc.localVideoTrack) return

    rtc.localVideoTrack.setMuted(!rtc.localVideoTrack.muted)
    setIsVideoMuted((prev) => !prev)
  }

  const toggleScreen = async (): Promise<void> => {
    if (!rtc.client) return

    // improve this logic

    const tempClient = { ...rtc }

    if (isScreenSharing) {
      try {
        tempClient.localVideoTrack = await AgoraRTC.createCameraVideoTrack({
          encoderConfig,
        })
        // await rtc.client.enableDualStream()
      } catch (error) {
        console.log("Error switching to video", error)
      }
    } else {
      try {
        tempClient.localVideoTrack = await AgoraRTC.createScreenVideoTrack({})
        await rtc.client.disableDualStream()
      } catch (error) {
        console.log("Error switchingg to screen", error)
        return
        // tempClient.localVideoTrack = await AgoraRTC.createCameraVideoTrack({ encoderConfig })
        // await rtc.client.enableDualStream()
      }
    }

    if (tempClient.localVideoTrack) {
      rtc.client.unpublish()
      rtc.localVideoTrack.close()

      rtc.localVideoTrack = tempClient.localVideoTrack
      rtc.localVideoTrack.play(`${rtc.client.uid}`)
      await rtc.client.publish([rtc.localAudioTrack, rtc.localVideoTrack])
      setIsScreenSharing((prev) => !prev)

      // switch to video if screen sharing stopped from chrome popup
      rtc.localVideoTrack.on("track-ended", async () => {
        console.log("trackEnded")
        tempClient.localVideoTrack = await AgoraRTC.createCameraVideoTrack({
          encoderConfig,
        })
        await rtc.client.enableDualStream()

        rtc.client.unpublish()
        rtc.localVideoTrack.close()
        rtc.localVideoTrack = tempClient.localVideoTrack
        rtc.localVideoTrack.play(`${rtc.client.uid}`)
        await rtc.client.publish([rtc.localAudioTrack, rtc.localVideoTrack])
        setIsScreenSharing((prev) => !prev)
      })
    }
  }

  useEffect(() => {
    if (patientQueue && agoraToken && !isJoin) handleJoin()
  }, [patientQueue, agoraToken])

  return (
    <div className="relative w-full h-full dark:bg-black-700 bg-indigo-50">
      {/* {notify && (
        <Notification
          message='Patient has ended the virtual call.'
          open
          onClose={() => setNotify(false)}
          variant='error'
          title='Patient left'
        />
      )} */}

      <div className="w-full h-full flex justify-center items-center xl:min-h-screen" style={{ minHeight: "600px" }}>
        <div className="px-2 py-14 sm:py-18 sm:p-8 2xl:p-10">
          <div id="remote-stream" className="absolute top-0 left-0 h-full w-full"></div>

          {isRemoteVideoMuted && (
            <div className="absolute top-0 left-0 h-full w-full flex flex-col justify-center items-center text-red-400 bg-black-700">
              <Icon icon={VideoCameraIcon} fontSize="text-9xl" />
              <span className="text-white">Video is disabled</span>
            </div>
          )}

          {isRemoteAudioMuted && (
            <div className="absolute bottom-2 right-12 text-red-400">
              <Icon icon={MicrophoneIcon} fontSize="text-3xl" />
            </div>
          )}

          {/* <div className='absolute right-3 bottom-3'>
            {remoteNetworkStats && (
              <WifiIndicator
                style={{ height: '30px', marginBottom: '2px' }}
                strength={
                  signalStrenghtMapping[
                    remoteNetworkStats.downlinkNetworkQuality
                  ]
                }
              />
            )}
          </div> */}

          {!isJoinRemote && (
            <div className="flex justify-center items-center">
              <Avatar image={null} firstName={"P"} size="xlarge" bg="bg-gray-500 dark:bg-black-800" text="text-5xl text-white dark:text-white" />
            </div>
          )}

          {isJoin && (
            <div className="flex justify-center items-center space-x-6 2xl:space-x-12 absolute left-0 right-0 bottom-6 2xl:bottom-8">
              <IconButton onClick={toggleAudio} size="2xl" className={`border border-transparent rounded-full shadow-sm dark:text-black-600 dark:bg-black-900 bg-gray-300 ${isAudioMuted ? "text-red-700 dark:text-red-500" : "text-gray-700 dark:hover:text-white"} focus:outline-none `}>
                <Icon icon={MicrophoneIcon} fontSize="text-2xl" />
              </IconButton>
              <IconButton onClick={toggleVideo} size="2xl" className={`border border-transparent rounded-full shadow-sm dark:text-black-600 dark:bg-black-900 bg-gray-300 ${isVideoMuted ? "text-red-700 dark:text-red-500" : "text-gray-700 dark:hover:text-white"} focus:outline-none`}>
                <Icon icon={VideoCameraIcon} fontSize="text-2xl" />
              </IconButton>
              <IconButton onClick={toggleScreen} size="2xl" className={`border border-transparent rounded-full shadow-sm dark:text-black-600 dark:bg-black-900 bg-gray-300 ${isScreenSharing ? "text-red-700 dark:text-red-500" : "text-gray-700 dark:hover:text-white"} focus:outline-none`}>
                <Icon icon={DesktopComputerIcon} fontSize="text-2xl" />
              </IconButton>
            </div>
          )}
        </div>

        <div className="absolute right-6 top-6 w-36 h-24 md:w-40 lg:w-48 2xl:w-56 md:h-28 lg:h-32 2xl:h-36 inline-flex justify-center items-center py-3 dark:bg-black-900 bg-gray-500 rounded-lg 2xl:right-8 2xl:top-8 2xl:py-5 2xl:rounded-xl">
          <div id="local-stream" className="absolute top-0 right-0 w-full h-full"></div>
          {isVideoMuted && (
            <div className="absolute top-0 left-0 h-full w-full flex flex-col justify-center items-center text-red-400 bg-black-900 rounded-lg">
              <Icon icon={VideoCameraIcon} fontSize="text-3xl" />
            </div>
          )}

          {!isJoin && (
            <div className="flex justify-center items-center w-full h-full">
              <Avatar image={null} firstName={authData?.username ?? authData?.attributes?.username} size="small" bg="bg-gray-100 dark:bg-black-700" text="text-5xl text-black dark:text-white" />
            </div>
          )}

          {/* <div className='absolute right-2 bottom-1'>
            {localNetworkStats && (
              <WifiIndicator
                style={{ height: '15px', marginBottom: '2px' }}
                strength={
                  signalStrenghtMapping[
                    localNetworkStats.downlinkNetworkQuality
                  ]
                }
              />
            )}
          </div> */}
        </div>

        {isJoin && (
          <div className="absolute top-8 left-8 md:left-auto">
            <Button variant="outlined" color="indigo" className="rounded-full bg-gray-300 text-gray-700 dark:text-white" onClick={handleLeave}>
              End Virtual
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default VirtualPlayer
