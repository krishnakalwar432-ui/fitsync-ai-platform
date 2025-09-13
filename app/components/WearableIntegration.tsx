"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Watch, Smartphone, Heart, Activity, Bluetooth, CheckCircle, 
  Battery, TrendingUp, Moon, Target, Flame, Timer, Footprints
} from "lucide-react"

interface WearableDevice {
  id: string
  name: string
  brand: string
  isConnected: boolean
  batteryLevel: number
  lastSync: Date
  icon: React.ReactNode
}

export default function WearableIntegration() {
  const [activeTab, setActiveTab] = useState("devices")
  const [isScanning, setIsScanning] = useState(false)
  const [autoSync, setAutoSync] = useState(true)

  const [devices, setDevices] = useState<WearableDevice[]>([
    {
      id: "1",
      name: "Apple Watch Series 9",
      brand: "Apple",
      isConnected: true,
      batteryLevel: 78,
      lastSync: new Date(Date.now() - 5 * 60 * 1000),
      icon: <Watch className="h-6 w-6" />
    },
    {
      id: "2", 
      name: "iPhone 15 Pro",
      brand: "Apple",
      isConnected: true,
      batteryLevel: 65,
      lastSync: new Date(Date.now() - 2 * 60 * 1000),
      icon: <Smartphone className="h-6 w-6" />
    }
  ])

  const todayData = {
    steps: 8547,
    distance: 6.2,
    calories: 387,
    activeMinutes: 45,
    heartRate: { current: 72, resting: 58 },
    sleep: { duration: 7.5, quality: 85 }
  }

  const connectDevice = (deviceId: string) => {
    setDevices(prev => prev.map(device => 
      device.id === deviceId 
        ? { ...device, isConnected: true, lastSync: new Date(), batteryLevel: 85 }
        : device
    ))
  }

  const scanForDevices = async () => {
    setIsScanning(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsScanning(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-blue-950 to-purple-950 py-8 px-4 particles-bg">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-neon-gradient mb-4">Wearable Hub</h1>
          <p className="text-gray-300 text-lg">Connect fitness devices for comprehensive health tracking</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 glass-card">
            <TabsTrigger value="devices" className="flex items-center space-x-2">
              <Watch className="h-4 w-4" />
              <span>Devices</span>
            </TabsTrigger>
            <TabsTrigger value="activity" className="flex items-center space-x-2">
              <Activity className="h-4 w-4" />
              <span>Activity</span>
            </TabsTrigger>
            <TabsTrigger value="health" className="flex items-center space-x-2">
              <Heart className="h-4 w-4" />
              <span>Health</span>
            </TabsTrigger>
          </TabsList>

          {/* Devices Tab */}
          <TabsContent value="devices" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Card className="glass-card-hover">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="flex items-center space-x-2 text-neon-cyan">
                        <Bluetooth className="h-6 w-6" />
                        <span>Connected Devices</span>
                      </CardTitle>
                      <Button onClick={scanForDevices} disabled={isScanning} className="btn-neon-primary">
                        {isScanning ? "Scanning..." : "Scan Devices"}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {devices.map((device) => (
                        <div key={device.id} className="glass-card p-6 rounded-xl">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="p-3 rounded-xl glass-card text-neon-cyan">
                                {device.icon}
                              </div>
                              <div>
                                <h3 className="font-semibold text-neon-cyan">{device.name}</h3>
                                <p className="text-sm text-gray-400">{device.brand}</p>
                                <div className="flex items-center space-x-4 mt-2">
                                  <div className="flex items-center space-x-1">
                                    <CheckCircle className="h-4 w-4 text-green-400" />
                                    <span className="text-xs">Connected</span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <Battery className="h-4 w-4 text-green-400" />
                                    <span className="text-xs">{device.batteryLevel}%</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <Button size="sm" variant="outline" className="glass-card">
                              Sync
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card className="glass-card-hover">
                  <CardHeader>
                    <CardTitle className="text-neon-green">Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Auto Sync</Label>
                      <Switch checked={autoSync} onCheckedChange={setAutoSync} />
                    </div>
                    <Button className="w-full btn-neon-primary">Sync All</Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="glass-card-hover">
                <CardContent className="p-6 text-center">
                  <Footprints className="h-8 w-8 text-neon-cyan mx-auto mb-2" />
                  <div className="text-3xl font-bold text-neon-cyan">{todayData.steps.toLocaleString()}</div>
                  <div className="text-sm text-gray-400">Steps</div>
                  <Progress value={(todayData.steps / 10000) * 100} className="h-2 mt-2" />
                </CardContent>
              </Card>

              <Card className="glass-card-hover">
                <CardContent className="p-6 text-center">
                  <Target className="h-8 w-8 text-neon-purple mx-auto mb-2" />
                  <div className="text-3xl font-bold text-neon-purple">{todayData.distance}</div>
                  <div className="text-sm text-gray-400">km Distance</div>
                  <Progress value={(todayData.distance / 8) * 100} className="h-2 mt-2" />
                </CardContent>
              </Card>

              <Card className="glass-card-hover">
                <CardContent className="p-6 text-center">
                  <Flame className="h-8 w-8 text-neon-orange mx-auto mb-2" />
                  <div className="text-3xl font-bold text-neon-orange">{todayData.calories}</div>
                  <div className="text-sm text-gray-400">Calories</div>
                  <Progress value={(todayData.calories / 500) * 100} className="h-2 mt-2" />
                </CardContent>
              </Card>

              <Card className="glass-card-hover">
                <CardContent className="p-6 text-center">
                  <Timer className="h-8 w-8 text-neon-green mx-auto mb-2" />
                  <div className="text-3xl font-bold text-neon-green">{todayData.activeMinutes}</div>
                  <div className="text-sm text-gray-400">Active Minutes</div>
                  <Progress value={(todayData.activeMinutes / 60) * 100} className="h-2 mt-2" />
                </CardContent>
              </Card>
            </div>

            <Card className="glass-card-hover">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-neon-red">
                  <Heart className="h-6 w-6" />
                  <span>Heart Rate</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-neon-red">{todayData.heartRate.current}</div>
                    <div className="text-sm text-gray-400">Current BPM</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-neon-cyan">{todayData.heartRate.resting}</div>
                    <div className="text-sm text-gray-400">Resting BPM</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Health Tab */}
          <TabsContent value="health" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="glass-card-hover">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-neon-blue">
                    <Moon className="h-6 w-6" />
                    <span>Sleep Analysis</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-4">
                    <div className="text-4xl font-bold text-neon-blue">{todayData.sleep.duration}h</div>
                    <div className="text-sm text-gray-400">Total Sleep</div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Sleep Quality</span>
                      <span className="font-bold text-neon-green">{todayData.sleep.quality}%</span>
                    </div>
                    <Progress value={todayData.sleep.quality} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card-hover">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-neon-green">
                    <TrendingUp className="h-6 w-6" />
                    <span>Recovery Score</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-4">
                    <div className="text-4xl font-bold text-neon-green">87%</div>
                    <div className="text-sm text-gray-400">Ready for Training</div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>HRV Score</span>
                        <span className="text-neon-cyan">Good</span>
                      </div>
                      <Progress value={75} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Stress Level</span>
                        <span className="text-neon-yellow">Low</span>
                      </div>
                      <Progress value={25} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}