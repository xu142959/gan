"use client"

import { useState } from "react"
import { Header } from "./components/header"
import { Sidebar } from "./components/sidebar"
import { MainVideo } from "./components/main-video"
import { ChatPanel } from "./components/chat-panel"
import { HomePage } from "./components/home-page"
import { UserCenter } from "./components/user-center/user-center"
import { StreamerDashboard } from "./components/streamer-dashboard/streamer-dashboard"
import { GiftEffectsManager } from "./components/gift-effects/gift-effects-manager"
import { LanguageProvider } from "./lib/language-manager"
import { RealNameVerification } from "./components/verification/real-name-verification"
import { Button } from "./components/ui/button"

export default function LivePlatform() {
  const [currentPage, setCurrentPage] = useState<"home" | "live" | "streamer-dashboard">("home")
  const [user, setUser] = useState<any>(null)
  const [showUserCenter, setShowUserCenter] = useState(false)
  const [showVerification, setShowVerification] = useState(false)

  const handleNavigate = (page: "home" | "live") => {
    setCurrentPage(page)
  }

  const handleRoomClick = (roomId: number) => {
    // 使用路由跳转到独立的直播间页面
    window.location.href = `/live-room/${roomId}`
  }

  const handleLogin = (userData: any) => {
    const userWithStreamerStatus = {
      ...userData,
      isStreamer: true,
    }
    setUser(userWithStreamerStatus)
    console.log("用户登录:", userWithStreamerStatus)
  }

  const handleLogout = () => {
    setUser(null)
    setCurrentPage("home")
    setShowUserCenter(false)
    console.log("用户退出登录")
  }

  const handleShowUserCenter = () => {
    setShowUserCenter(true)
  }

  const handleBackFromUserCenter = () => {
    setShowUserCenter(false)
  }

  const handleShowStreamerDashboard = () => {
    setCurrentPage("streamer-dashboard")
    setShowUserCenter(false)
  }

  const handleBackFromStreamerDashboard = () => {
    setCurrentPage("home")
  }

  const handleShowVerification = () => {
    setShowVerification(true)
    setShowUserCenter(false)
  }

  const handleBackFromVerification = () => {
    setShowVerification(false)
  }

  const handleVerificationComplete = (verificationData: any) => {
    setUser((prev) => ({
      ...prev,
      verificationStatus: "pending",
      verificationData,
    }))
    console.log("实名认证提交:", verificationData)
  }

  return (
    <LanguageProvider>
      <div className="hidden lg:block text-black">
        {/* 礼物特效管理器 */}
        <GiftEffectsManager />

        {showVerification && user ? (
          <RealNameVerification
            user={user}
            onBack={handleBackFromVerification}
            onVerificationComplete={handleVerificationComplete}
          />
        ) : showUserCenter && user ? (
          <UserCenter user={user} onBack={handleBackFromUserCenter} />
        ) : currentPage === "streamer-dashboard" ? (
          user?.verificationStatus === "approved" ? (
            <StreamerDashboard onBack={handleBackFromStreamerDashboard} />
          ) : (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-4">需要完成实名认证</h2>
                <p className="text-gray-600 mb-6">开启直播功能需要先完成实名认证</p>
                <Button onClick={handleShowVerification} className="bg-pink-600 hover:bg-pink-700">
                  立即认证
                </Button>
              </div>
            </div>
          )
        ) : (
          <>
            <Header
              currentPage={currentPage}
              onNavigate={handleNavigate}
              user={user}
              onLogin={handleLogin}
              onLogout={handleLogout}
              onUserCenter={handleShowUserCenter}
              onVerification={handleShowVerification}
            />

            {currentPage === "home" ? (
              <HomePage onRoomClick={handleRoomClick} />
            ) : (
              <div className="flex-1 flex overflow-hidden">
                <div className="hidden lg:block">
                  <Sidebar />
                </div>
                <MainVideo />
                <div className="hidden md:block">
                  <ChatPanel />
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </LanguageProvider>
  )
}
