
import React, { useState } from 'react';
import { Send, Mail, MessageSquare, Users, Building2, FileText, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

const NotificationCenter = () => {
  const { toast } = useToast();
  
  const [notificationData, setNotificationData] = useState({
    type: 'email',
    category: 'all',
    subject: '',
    message: '',
    targetCompanies: [],
    specificContact: ''
  });

  const [companies] = useState([
    { id: 1, name: "Ethiopian Airlines", email: "hr@ethiopianairlines.com", phone: "+251-11-665-7777", category: "Aviation" },
    { id: 2, name: "Commercial Bank of Ethiopia", email: "recruitment@cbe.com.et", phone: "+251-11-551-5151", category: "Banking" },
    { id: 3, name: "Ethio Telecom", email: "careers@ethiotelecom.et", phone: "+251-11-515-5000", category: "Telecommunications" },
    { id: 4, name: "Ethiopian Electric Utility", email: "contact@eeu.gov.et", phone: "+251-11-661-6161", category: "Energy" },
    { id: 5, name: "Ministry of Agriculture", email: "info@moa.gov.et", phone: "+251-11-646-3200", category: "Government" }
  ]);

  const [notificationHistory] = useState([
    {
      id: 1,
      type: "email",
      subject: "New Tender Opportunities Available",
      recipients: 15,
      sent: "2024-06-18 10:30 AM",
      category: "Construction",
      status: "delivered"
    },
    {
      id: 2,
      type: "sms",
      subject: "Job Application Deadline Reminder",
      recipients: 8,
      sent: "2024-06-17 02:15 PM",
      category: "IT",
      status: "delivered"
    }
  ]);

  const handleCompanySelection = (companyId, checked) => {
    if (checked) {
      setNotificationData(prev => ({
        ...prev,
        targetCompanies: [...prev.targetCompanies, companyId]
      }));
    } else {
      setNotificationData(prev => ({
        ...prev,
        targetCompanies: prev.targetCompanies.filter(id => id !== companyId)
      }));
    }
  };

  const handleCategoryFilter = (category) => {
    const filteredCompanies = companies.filter(company => 
      category === 'all' || company.category.toLowerCase() === category.toLowerCase()
    );
    
    setNotificationData(prev => ({
      ...prev,
      category,
      targetCompanies: filteredCompanies.map(c => c.id)
    }));
  };

  const handleSendNotification = () => {
    if (!notificationData.subject || !notificationData.message) {
      toast({
        title: "Missing Information",
        description: "Please fill in both subject and message fields.",
        variant: "destructive"
      });
      return;
    }

    if (notificationData.targetCompanies.length === 0 && !notificationData.specificContact) {
      toast({
        title: "No Recipients",
        description: "Please select companies or enter a specific contact.",
        variant: "destructive"
      });
      return;
    }

    const recipientCount = notificationData.specificContact ? 1 : notificationData.targetCompanies.length;
    
    toast({
      title: "Notification Sent!",
      description: `${notificationData.type.toUpperCase()} notification sent to ${recipientCount} recipient(s).`,
    });

    // Reset form
    setNotificationData({
      type: 'email',
      category: 'all',
      subject: '',
      message: '',
      targetCompanies: [],
      specificContact: ''
    });
  };

  const getFilteredCompanies = () => {
    if (notificationData.category === 'all') return companies;
    return companies.filter(company => 
      company.category.toLowerCase() === notificationData.category.toLowerCase()
    );
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="send" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="send">Send Notification</TabsTrigger>
          <TabsTrigger value="history">Notification History</TabsTrigger>
        </TabsList>

        <TabsContent value="send">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="w-5 h-5" />
                Send Notification
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Notification Type */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notification Type
                  </label>
                  <Select
                    value={notificationData.type}
                    onValueChange={(value) => setNotificationData(prev => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          Email
                        </div>
                      </SelectItem>
                      <SelectItem value="sms">
                        <div className="flex items-center gap-2">
                          <MessageSquare className="w-4 h-4" />
                          SMS
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category Filter
                  </label>
                  <Select
                    value={notificationData.category}
                    onValueChange={handleCategoryFilter}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="aviation">Aviation</SelectItem>
                      <SelectItem value="banking">Banking</SelectItem>
                      <SelectItem value="telecommunications">Telecommunications</SelectItem>
                      <SelectItem value="energy">Energy</SelectItem>
                      <SelectItem value="government">Government</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Message Content */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <Input
                    placeholder="Enter notification subject..."
                    value={notificationData.subject}
                    onChange={(e) => setNotificationData(prev => ({ ...prev, subject: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <Textarea
                    placeholder="Enter your notification message..."
                    value={notificationData.message}
                    onChange={(e) => setNotificationData(prev => ({ ...prev, message: e.target.value }))}
                    className="min-h-[120px]"
                  />
                </div>
              </div>

              {/* Recipient Selection */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Specific Contact (Optional)
                  </label>
                  <Input
                    placeholder={notificationData.type === 'email' ? "Enter email address..." : "Enter phone number..."}
                    value={notificationData.specificContact}
                    onChange={(e) => setNotificationData(prev => ({ ...prev, specificContact: e.target.value }))}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Leave empty to send to selected companies below
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Companies ({notificationData.targetCompanies.length} selected)
                  </label>
                  <div className="border rounded-lg p-4 max-h-64 overflow-y-auto">
                    <div className="space-y-3">
                      {getFilteredCompanies().map((company) => (
                        <div key={company.id} className="flex items-center space-x-3">
                          <Checkbox
                            checked={notificationData.targetCompanies.includes(company.id)}
                            onCheckedChange={(checked) => handleCompanySelection(company.id, checked)}
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <Building2 className="w-4 h-4 text-gray-500" />
                              <span className="font-medium">{company.name}</span>
                              <Badge variant="secondary">{company.category}</Badge>
                            </div>
                            <div className="text-sm text-gray-500">
                              {notificationData.type === 'email' ? company.email : company.phone}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <Button onClick={handleSendNotification} className="w-full" size="lg">
                <Send className="w-4 h-4 mr-2" />
                Send Notification
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Notification History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {notificationHistory.map((notification) => (
                  <div key={notification.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {notification.type === 'email' ? (
                          <Mail className="w-4 h-4 text-blue-600" />
                        ) : (
                          <MessageSquare className="w-4 h-4 text-green-600" />
                        )}
                        <h3 className="font-semibold">{notification.subject}</h3>
                      </div>
                      <Badge className="bg-green-100 text-green-800">
                        {notification.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p>Recipients: {notification.recipients}</p>
                      <p>Category: {notification.category}</p>
                      <p>Sent: {notification.sent}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NotificationCenter;
