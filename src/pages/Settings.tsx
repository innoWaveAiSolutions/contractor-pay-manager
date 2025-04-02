
import { useState } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '@/components/layout/Sidebar';
import { useAuth } from '@/contexts/AuthContext';
import { CustomButton } from '@/components/ui/custom-button';
import { User, Lock, Building, Bell, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const Settings = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  
  // Toggle state for notification preferences
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [payAppNotifications, setPayAppNotifications] = useState(true);
  const [projectNotifications, setProjectNotifications] = useState(true);
  
  // Mock backup director options
  const backupDirectorOptions = [
    { id: 1, name: "Select a backup director" },
    { id: 2, name: user?.role === 'director' ? "Jane Doe (Pending)" : "John Smith" },
    { id: 3, name: "Mark Johnson" },
  ];

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'password', label: 'Password', icon: Lock },
    { id: 'organization', label: 'Organization', icon: Building },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ];

  const handleSaveChanges = (section: string) => {
    toast.success(`${section} settings saved successfully`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar userRole={user?.role || 'pm'} />
      
      <main className="pt-16 pb-12 pl-0 md:pl-20 lg:pl-64">
        <div className="px-6 md:px-8 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-8">
              <h1 className="text-2xl md:text-3xl font-bold">Settings</h1>
              <p className="text-muted-foreground mt-1">Manage your account settings</p>
            </div>
          </motion.div>

          <div className="flex flex-col md:flex-row gap-6">
            {/* Tabs */}
            <div className="w-full md:w-64 space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  className={cn(
                    "w-full flex items-center gap-3 py-3 px-4 rounded-lg text-sm font-medium transition-colors text-left",
                    activeTab === tab.id
                      ? "bg-primary/10 text-primary"
                      : "text-foreground/70 hover:bg-accent hover:text-foreground"
                  )}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <tab.icon size={18} />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="flex-1 bg-white dark:bg-gray-900 rounded-xl shadow-card p-6">
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold">Profile Information</h2>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="h-20 w-20 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-500">
                      <User size={32} />
                    </div>
                    <div>
                      <CustomButton variant="outline" size="sm">
                        <Upload size={14} className="mr-2" /> Upload Photo
                      </CustomButton>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Full Name</label>
                      <input
                        type="text"
                        defaultValue={user?.name}
                        className="w-full px-4 py-2 border border-input rounded-lg bg-background"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Email Address</label>
                      <input
                        type="email"
                        defaultValue={user?.email}
                        className="w-full px-4 py-2 border border-input rounded-lg bg-background"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Role</label>
                      <input
                        type="text"
                        value={
                          user?.role === 'pm' ? 'Project Manager' :
                          user?.role === 'director' ? 'Director' :
                          user?.role === 'reviewer' ? 'Reviewer' :
                          'Contractor'
                        }
                        disabled
                        className="w-full px-4 py-2 border border-input rounded-lg bg-muted cursor-not-allowed"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Organization</label>
                      <input
                        type="text"
                        value={user?.organizationName || 'Not Assigned'}
                        disabled
                        className="w-full px-4 py-2 border border-input rounded-lg bg-muted cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div className="pt-4">
                    <CustomButton onClick={() => handleSaveChanges("Profile")}>Save Changes</CustomButton>
                  </div>
                </div>
              )}

              {activeTab === 'password' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold">Change Password</h2>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Current Password</label>
                      <input
                        type="password"
                        className="w-full px-4 py-2 border border-input rounded-lg bg-background"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">New Password</label>
                      <input
                        type="password"
                        className="w-full px-4 py-2 border border-input rounded-lg bg-background"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Confirm New Password</label>
                      <input
                        type="password"
                        className="w-full px-4 py-2 border border-input rounded-lg bg-background"
                      />
                    </div>
                  </div>

                  <div className="pt-4">
                    <CustomButton onClick={() => handleSaveChanges("Password")}>Update Password</CustomButton>
                  </div>
                </div>
              )}

              {activeTab === 'organization' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold">Organization Settings</h2>
                  {user?.role === 'director' ? (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Organization Name</label>
                        <input
                          type="text"
                          defaultValue={user?.organizationName || ''}
                          className="w-full px-4 py-2 border border-input rounded-lg bg-background"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Backup Director</label>
                        <select className="w-full px-4 py-2 border border-input rounded-lg bg-background">
                          {backupDirectorOptions.map((option) => (
                            <option key={option.id} value={option.id}>{option.name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="pt-4">
                        <CustomButton onClick={() => handleSaveChanges("Organization")}>Save Organization Settings</CustomButton>
                      </div>
                    </div>
                  ) : user?.role === 'pm' ? (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Current Organization</label>
                        <input
                          type="text"
                          value={user?.organizationName || 'Not Assigned'}
                          disabled
                          className="w-full px-4 py-2 border border-input rounded-lg bg-muted cursor-not-allowed"
                        />
                      </div>
                      {!user?.organizationName && (
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Join Organization</label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder="Organization ID"
                              className="flex-1 px-4 py-2 border border-input rounded-lg bg-background"
                            />
                            <CustomButton>Join</CustomButton>
                          </div>
                        </div>
                      )}
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Backup Project Manager</label>
                        <select className="w-full px-4 py-2 border border-input rounded-lg bg-background">
                          {backupDirectorOptions.map((option) => (
                            <option key={option.id} value={option.id}>{option.name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="pt-4">
                        <CustomButton onClick={() => handleSaveChanges("Settings")}>Save Settings</CustomButton>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p className="text-muted-foreground">Organization settings are only available to Project Managers and Directors.</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold">Notification Preferences</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Email Notifications</h3>
                        <p className="text-sm text-muted-foreground">Receive updates via email</p>
                      </div>
                      <button 
                        onClick={() => setEmailNotifications(!emailNotifications)} 
                        className={`h-6 w-11 ${emailNotifications ? 'bg-primary' : 'bg-muted'} relative rounded-full cursor-pointer transition-colors`}
                      >
                        <div 
                          className={`absolute ${emailNotifications ? 'right-1' : 'left-1'} top-1 h-4 w-4 rounded-full bg-white transition-transform`}
                        ></div>
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Pay Application Updates</h3>
                        <p className="text-sm text-muted-foreground">Notifications about pay application status changes</p>
                      </div>
                      <button 
                        onClick={() => setPayAppNotifications(!payAppNotifications)} 
                        className={`h-6 w-11 ${payAppNotifications ? 'bg-primary' : 'bg-muted'} relative rounded-full cursor-pointer transition-colors`}
                      >
                        <div 
                          className={`absolute ${payAppNotifications ? 'right-1' : 'left-1'} top-1 h-4 w-4 rounded-full bg-white transition-transform`}
                        ></div>
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Project Notifications</h3>
                        <p className="text-sm text-muted-foreground">Updates about project status changes</p>
                      </div>
                      <button 
                        onClick={() => setProjectNotifications(!projectNotifications)} 
                        className={`h-6 w-11 ${projectNotifications ? 'bg-primary' : 'bg-muted'} relative rounded-full cursor-pointer transition-colors`}
                      >
                        <div 
                          className={`absolute ${projectNotifications ? 'right-1' : 'left-1'} top-1 h-4 w-4 rounded-full bg-white transition-transform`}
                        ></div>
                      </button>
                    </div>
                  </div>

                  <div className="pt-4">
                    <CustomButton onClick={() => handleSaveChanges("Notification")}>Save Preferences</CustomButton>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;
