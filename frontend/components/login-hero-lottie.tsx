"use client"

import Lottie from "lottie-react"

import handshakeAnimation from "@/public/lottie/b2c3f600-40f2-11ef-a21d-ab0890cced63.json"

export function LoginHeroLottie() {
  return (
    <Lottie
      animationData={handshakeAnimation}
      loop
      autoplay
      className="h-full w-full"
      rendererSettings={{
        preserveAspectRatio: "xMidYMid meet",
      }}
    />
  )
}
