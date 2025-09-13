"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Crown, CreditCard, Calendar, Star, Shield, Gift, Zap, Check,
  Clock, Users, Sparkles, TrendingUp, Award, Lock, Unlock,
  AlertCircle, RefreshCw, Download, Settings, ChevronRight
} from "lucide-react"

interface SubscriptionPlan {
  id: string
  name: string
  price: number
  period: 'monthly' | 'yearly'
  originalPrice?: number
  features: string[]
  limitations?: string[]
  popular?: boolean
  trialDays?: number
  color: string
}

interface UserSubscription {
  plan: string
  status: 'active' | 'trial' | 'expired' | 'cancelled'
  startDate: Date
  endDate: Date
  trialEndDate?: Date
  autoRenew: boolean
  paymentMethod: string
  nextBilling: Date
}

interface BillingHistory {
  id: string
  date: Date
  amount: number
  plan: string
  status: 'paid' | 'pending' | 'failed'
  invoice: string
}

export default function SubscriptionManagement() {
  const [activeTab, setActiveTab] = useState("plans")
  const [showAnnual, setShowAnnual] = useState(false)
  
  const [userSubscription] = useState<UserSubscription>({
    plan: "premium",
    status: "trial",
    startDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
    trialEndDate: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000),
    autoRenew: true,
    paymentMethod: "Visa ending in 4242",
    nextBilling: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000)
  })

  const subscriptionPlans: SubscriptionPlan[] = [
    {
      id: "free",
      name: "Free",
      price: 0,
      period: "monthly",
      features: [
        "Basic workout tracking",
        "3 workout templates",
        "Community access",
        "Progress charts",
        "Mobile app access"
      ],
      limitations: [
        "Limited to 3 workouts per week",
        "Basic analytics only",
        "No AI recommendations",
        "No premium features"
      ],
      color: "text-gray-400"
    },
    {
      id: "premium",
      name: "Premium",
      price: showAnnual ? 99 : 12,
      period: showAnnual ? "yearly" : "monthly",
      originalPrice: showAnnual ? 144 : undefined,
      trialDays: 14,
      popular: true,
      features: [
        "Unlimited workouts",
        "AI-powered recommendations", 
        "Advanced analytics",
        "Motion tracking",
        "Voice coaching",
        "Nutrition analysis",
        "Priority support",
        "Offline mode"
      ],
      color: "text-neon-cyan"
    },
    {
      id: "pro",
      name: "Pro",
      price: showAnnual ? 199 : 25,
      period: showAnnual ? "yearly" : "monthly", 
      originalPrice: showAnnual ? 300 : undefined,
      trialDays: 7,
      features: [
        "Everything in Premium",
        "Personal AI trainer",
        "Live coaching sessions",
        "Custom meal plans",
        "Advanced wearable integration",
        "Group challenges",
        "VIP community access",
        "1-on-1 consultations",
        "Early feature access"
      ],
      color: "text-neon-purple"
    }
  ]

  const [billingHistory] = useState<BillingHistory[]>([
    {
      id: "1",
      date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      amount: 12,
      plan: "Premium Monthly",
      status: "paid",
      invoice: "INV-2024-001"
    },
    {
      id: "2", 
      date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
      amount: 12,
      plan: "Premium Monthly",
      status: "paid",
      invoice: "INV-2024-002"
    }
  ])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500/20 text-green-400">Active</Badge>
      case 'trial':
        return <Badge className="bg-blue-500/20 text-blue-400">Trial</Badge>
      case 'expired':
        return <Badge className="bg-red-500/20 text-red-400">Expired</Badge>
      case 'cancelled':
        return <Badge className="bg-gray-500/20 text-gray-400">Cancelled</Badge>
      default:
        return <Badge>Unknown</Badge>
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'text-green-400'
      case 'pending': return 'text-yellow-400'
      case 'failed': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  const calculateSavings = (monthlyPrice: number) => {
    const annualSavings = (monthlyPrice * 12) - (monthlyPrice * 10) // 2 months free
    return Math.round((annualSavings / (monthlyPrice * 12)) * 100)
  }

  const handlePlanUpgrade = (planId: string) => {
    console.log(`Upgrading to plan: ${planId}`)
    // Integrate with payment processor
  }

  const handleCancelSubscription = () => {
    console.log("Cancelling subscription")
    // Handle subscription cancellation
  }

  const handleTrialExtension = () => {
    console.log("Extending trial")
    // Handle trial extension
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-blue-950 to-purple-950 py-8 px-4 particles-bg">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-neon-gradient mb-4">Subscription</h1>
          <p className="text-gray-300 text-lg">Manage your FitSync plan and billing</p>
        </div>

        {/* Current Subscription Status */}
        {userSubscription.status === 'trial' && (
          <Alert className="border-blue-500/50 bg-blue-500/10">
            <Gift className="h-4 w-4" />
            <AlertDescription className="text-blue-400">
              <div className="flex justify-between items-center">
                <span>
                  You're on a free trial! {Math.ceil((userSubscription.trialEndDate!.getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days remaining.
                </span>
                <Button size="sm" className="btn-neon-primary">
                  Upgrade Now
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 glass-card">
            <TabsTrigger value="plans">Plans</TabsTrigger>
            <TabsTrigger value="current">Current Plan</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
            <TabsTrigger value="usage">Usage</TabsTrigger>
          </TabsList>

          {/* Plans Tab */}
          <TabsContent value="plans" className="space-y-6">
            {/* Annual/Monthly Toggle */}
            <div className="flex items-center justify-center space-x-4 mb-8">
              <Label className={!showAnnual ? 'text-neon-cyan' : 'text-gray-400'}>Monthly</Label>
              <Switch checked={showAnnual} onCheckedChange={setShowAnnual} />
              <Label className={showAnnual ? 'text-neon-cyan' : 'text-gray-400'}>
                Annual
                <Badge className="ml-2 bg-green-500/20 text-green-400">Save up to 30%</Badge>
              </Label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {subscriptionPlans.map((plan) => (
                <Card key={plan.id} className={`glass-card-hover relative ${
                  plan.popular ? 'ring-2 ring-neon-cyan/50 scale-105' : ''
                }`}>
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/50 px-4 py-1">
                        <Star className="h-4 w-4 mr-1" />
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  
                  <CardHeader className="text-center">
                    <CardTitle className={`text-2xl ${plan.color}`}>{plan.name}</CardTitle>
                    <div className="space-y-2">
                      <div className="flex items-baseline justify-center space-x-2">
                        <span className={`text-4xl font-bold ${plan.color}`}>
                          ${plan.price}
                        </span>
                        <span className="text-gray-400">
                          /{plan.period === 'yearly' ? 'year' : 'month'}
                        </span>
                      </div>
                      {plan.originalPrice && (
                        <div className="flex items-center justify-center space-x-2">
                          <span className="text-gray-400 line-through">${plan.originalPrice}</span>
                          <Badge className="bg-green-500/20 text-green-400">
                            Save {calculateSavings(plan.price)}%
                          </Badge>
                        </div>
                      )}
                      {plan.trialDays && (
                        <div className="text-sm text-neon-purple">
                          {plan.trialDays}-day free trial
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    <div className="space-y-3">
                      {plan.features.map((feature, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <Check className="h-4 w-4 text-green-400 flex-shrink-0" />
                          <span className="text-gray-300 text-sm">{feature}</span>
                        </div>
                      ))}
                      
                      {plan.limitations && (
                        <div className="pt-3 border-t border-gray-700">
                          {plan.limitations.map((limitation, index) => (
                            <div key={index} className="flex items-center space-x-3 opacity-60">
                              <Lock className="h-4 w-4 text-gray-500 flex-shrink-0" />
                              <span className="text-gray-500 text-sm">{limitation}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <Button 
                      onClick={() => handlePlanUpgrade(plan.id)}
                      className={`w-full ${
                        plan.id === userSubscription.plan 
                          ? 'glass-card opacity-50 cursor-not-allowed' 
                          : plan.popular 
                            ? 'btn-neon-primary' 
                            : 'btn-neon-secondary'
                      }`}
                      disabled={plan.id === userSubscription.plan}
                    >
                      {plan.id === userSubscription.plan ? (
                        <>
                          <Crown className="h-4 w-4 mr-2" />
                          Current Plan
                        </>
                      ) : plan.trialDays ? (
                        <>
                          <Gift className="h-4 w-4 mr-2" />
                          Start Free Trial
                        </>
                      ) : (
                        <>
                          <CreditCard className="h-4 w-4 mr-2" />
                          Choose Plan
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Current Plan Tab */}
          <TabsContent value="current" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Current Subscription */}
              <Card className="glass-card-hover">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-neon-cyan">
                    <Crown className="h-6 w-6" />
                    <span>Current Subscription</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Plan</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-neon-cyan capitalize">{userSubscription.plan}</span>
                      {getStatusBadge(userSubscription.status)}
                    </div>
                  </div>

                  {userSubscription.status === 'trial' && userSubscription.trialEndDate && (
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-400">Trial Progress</span>
                        <span className="text-sm text-blue-400">
                          {Math.ceil((userSubscription.trialEndDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days left
                        </span>
                      </div>
                      <Progress 
                        value={((Date.now() - userSubscription.startDate.getTime()) / (userSubscription.trialEndDate.getTime() - userSubscription.startDate.getTime())) * 100} 
                        className="h-2"
                      />
                    </div>
                  )}

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Started</span>
                      <span>{userSubscription.startDate.toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Next Billing</span>
                      <span>{userSubscription.nextBilling.toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Auto-renew</span>
                      <Switch checked={userSubscription.autoRenew} />
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Payment Method</span>
                      <span className="flex items-center space-x-2">
                        <CreditCard className="h-4 w-4" />
                        <span>{userSubscription.paymentMethod}</span>
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-gray-700">
                    {userSubscription.status === 'trial' ? (
                      <div className="space-y-2">
                        <Button className="w-full btn-neon-primary">
                          <Crown className="h-4 w-4 mr-2" />
                          Upgrade to Premium
                        </Button>
                        <Button variant="outline" className="w-full glass-card" onClick={handleTrialExtension}>
                          <Clock className="h-4 w-4 mr-2" />
                          Extend Trial
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Button className="w-full btn-neon-primary">
                          <TrendingUp className="h-4 w-4 mr-2" />
                          Upgrade Plan
                        </Button>
                        <Button variant="outline" className="w-full glass-card" onClick={handleCancelSubscription}>
                          <AlertCircle className="h-4 w-4 mr-2" />
                          Cancel Subscription
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Subscription Benefits */}
              <Card className="glass-card-hover">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-neon-green">
                    <Sparkles className="h-6 w-6" />
                    <span>Your Benefits</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { icon: Zap, title: "AI Personal Trainer", description: "Custom workouts powered by AI" },
                      { icon: Users, title: "Premium Community", description: "Access to exclusive groups" },
                      { icon: Shield, title: "Priority Support", description: "24/7 expert assistance" },
                      { icon: Award, title: "Advanced Analytics", description: "Detailed progress insights" },
                      { icon: Calendar, title: "Smart Scheduling", description: "Adaptive workout planning" }
                    ].map((benefit, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 glass-card rounded-lg">
                        <benefit.icon className="h-5 w-5 text-neon-cyan mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium text-neon-cyan">{benefit.title}</h4>
                          <p className="text-sm text-gray-400">{benefit.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Billing Tab */}
          <TabsContent value="billing" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Payment Method */}
              <Card className="glass-card-hover">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-neon-purple">
                    <CreditCard className="h-6 w-6" />
                    <span>Payment Method</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 glass-card rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded flex items-center justify-center">
                        <span className="text-white text-xs font-bold">VISA</span>
                      </div>
                      <div>
                        <div className="font-medium">•••• •••• •••• 4242</div>
                        <div className="text-sm text-gray-400">Expires 12/25</div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="glass-card">
                      <Settings className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  </div>
                  
                  <Button variant="outline" className="w-full glass-card">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Add Payment Method
                  </Button>
                </CardContent>
              </Card>

              {/* Billing Summary */}
              <Card className="glass-card-hover">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-neon-orange">
                    <Calendar className="h-6 w-6" />
                    <span>Billing Summary</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Current Period</span>
                      <span>
                        {userSubscription.startDate.toLocaleDateString()} - {userSubscription.endDate.toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Next Charge</span>
                      <span className="font-semibold">$12.00 on {userSubscription.nextBilling.toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Billing Cycle</span>
                      <span>Monthly</span>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-700">
                    <Button variant="outline" className="w-full glass-card">
                      <Download className="h-4 w-4 mr-2" />
                      Download Invoice
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Billing History */}
            <Card className="glass-card-hover">
              <CardHeader>
                <CardTitle className="text-neon-cyan">Billing History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {billingHistory.map((bill) => (
                    <div key={bill.id} className="flex items-center justify-between p-4 glass-card rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div>
                          <div className="font-medium">{bill.plan}</div>
                          <div className="text-sm text-gray-400">{bill.date.toLocaleDateString()}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className={`font-semibold ${getPaymentStatusColor(bill.status)}`}>
                          ${bill.amount}
                        </span>
                        <Badge className={
                          bill.status === 'paid' ? 'bg-green-500/20 text-green-400' :
                          bill.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-red-500/20 text-red-400'
                        }>
                          {bill.status}
                        </Badge>
                        <Button variant="outline" size="sm" className="glass-card">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Usage Tab */}
          <TabsContent value="usage" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: "Workouts This Month", value: "23", limit: "Unlimited", icon: Activity, color: "text-neon-cyan" },
                { title: "AI Recommendations", value: "156", limit: "Unlimited", icon: Sparkles, color: "text-neon-purple" },
                { title: "Analytics Reports", value: "8", limit: "Unlimited", icon: TrendingUp, color: "text-neon-green" },
                { title: "Voice Commands", value: "342", limit: "Unlimited", icon: Zap, color: "text-neon-orange" }
              ].map((usage, index) => (
                <Card key={index} className="glass-card-hover">
                  <CardContent className="p-6 text-center">
                    <usage.icon className={`h-8 w-8 mx-auto mb-3 ${usage.color}`} />
                    <div className="text-2xl font-bold text-neon-cyan">{usage.value}</div>
                    <div className="text-sm text-gray-400">{usage.title}</div>
                    <div className="text-xs text-green-400 mt-1">{usage.limit}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="glass-card-hover">
              <CardHeader>
                <CardTitle className="text-neon-pink">Feature Usage Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {[
                    { feature: "Workout Tracking", usage: 85, color: "bg-neon-cyan" },
                    { feature: "Nutrition Analysis", usage: 67, color: "bg-neon-purple" },
                    { feature: "Motion Tracking", usage: 42, color: "bg-neon-green" },
                    { feature: "Voice Coaching", usage: 38, color: "bg-neon-orange" },
                    { feature: "Community Features", usage: 73, color: "bg-neon-pink" }
                  ].map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-300">{item.feature}</span>
                        <span className="text-gray-400">{item.usage}%</span>
                      </div>
                      <Progress value={item.usage} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}