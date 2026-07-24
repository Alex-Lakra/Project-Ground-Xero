import React, { useState, useEffect } from 'react';
import { 
  PlusCircle, 
  Trash2, 
  Calendar, 
  Users, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  Megaphone,
  BarChart3,
  Globe,
  Tag
} from 'lucide-react';
import { getFallbackEventBanner } from './EventsView';

export interface PublishedEvent {
  id: string;
  title: string;
  date: string;
  location: string;
  category: 'Hackathon' | 'Workshop' | 'Meetup' | 'Webinar';
  imageUrl: string;
  description: string;
  capacity: string;
}

export interface PublishedCommunity {
  id: string;
  name: string;
  category: string;
  membersCount: number;
  description: string;
  iconName: string;
}

interface AdminConsoleViewProps {
  onEventCreated?: () => void;
  onCommunityCreated?: () => void;
}

export default function AdminConsoleView({ onEventCreated, onCommunityCreated }: AdminConsoleViewProps) {
  const [activeAdminTab, setActiveAdminTab] = useState<'events' | 'communities' | 'system'>('events');

  // Event Form State
  const [eventTitle, setEventTitle] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [eventCategory, setEventCategory] = useState<'Hackathon' | 'Workshop' | 'Meetup' | 'Webinar'>('Hackathon');
  const [eventImageUrl, setEventImageUrl] = useState('');
  const [eventCapacity, setEventCapacity] = useState('200');
  const [eventDescription, setEventDescription] = useState('');

  // Community Form State
  const [communityName, setCommunityName] = useState('');
  const [communityCategory, setCommunityCategory] = useState('Development');
  const [communityDesc, setCommunityDesc] = useState('');
  const [communityIcon, setCommunityIcon] = useState('code');

  // Stored items
  const [eventsList, setEventsList] = useState<PublishedEvent[]>([]);
  const [communitiesList, setCommunitiesList] = useState<PublishedCommunity[]>([]);
  const [notification, setNotification] = useState<string | null>(null);

  // Load from localStorage
  useEffect(() => {
    try {
      const storedEvents = localStorage.getItem('xero_events');
      if (storedEvents) {
        setEventsList(JSON.parse(storedEvents));
      }
      const storedComm = localStorage.getItem('xero_communities');
      if (storedComm) {
        setCommunitiesList(JSON.parse(storedComm));
      }
    } catch (e) {
      console.warn('Failed reading admin storage:', e);
    }
  }, []);

  const showFeedback = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  // Create Event Handler
  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTitle.trim() || !eventDate.trim() || !eventDescription.trim()) {
      showFeedback('Please fill in event title, date, and description.');
      return;
    }

    const titleStr = eventTitle.trim();
    const fallbackImage = getFallbackEventBanner(eventCategory, titleStr);

    const newEvent: PublishedEvent = {
      id: 'event-' + Date.now(),
      title: titleStr,
      date: eventDate.trim(),
      location: eventLocation.trim() || 'Virtual / Online',
      category: eventCategory,
      imageUrl: eventImageUrl.trim() || fallbackImage,
      description: eventDescription.trim(),
      capacity: eventCapacity || '100'
    };

    const updated = [newEvent, ...eventsList];
    setEventsList(updated);
    localStorage.setItem('xero_events', JSON.stringify(updated));

    // Reset Form
    setEventTitle('');
    setEventDate('');
    setEventLocation('');
    setEventDescription('');
    setEventImageUrl('');
    showFeedback(`Event "${newEvent.title}" published successfully!`);
    if (onEventCreated) onEventCreated();
  };

  // Delete Event Handler
  const handleDeleteEvent = (id: string) => {
    const updated = eventsList.filter(ev => ev.id !== id);
    setEventsList(updated);
    localStorage.setItem('xero_events', JSON.stringify(updated));
    showFeedback('Event removed successfully.');
  };

  // Create Community Handler
  const handleCreateCommunity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!communityName.trim() || !communityDesc.trim()) {
      showFeedback('Please enter community name and description.');
      return;
    }

    const newComm: PublishedCommunity = {
      id: 'comm-' + Date.now(),
      name: communityName.trim(),
      category: communityCategory,
      membersCount: 1,
      description: communityDesc.trim(),
      iconName: communityIcon || 'groups'
    };

    const updated = [newComm, ...communitiesList];
    setCommunitiesList(updated);
    localStorage.setItem('xero_communities', JSON.stringify(updated));

    setCommunityName('');
    setCommunityDesc('');
    showFeedback(`Community "${newComm.name}" created successfully!`);
    if (onCommunityCreated) onCommunityCreated();
  };

  // Delete Community Handler
  const handleDeleteCommunity = (id: string) => {
    const updated = communitiesList.filter(c => c.id !== id);
    setCommunitiesList(updated);
    localStorage.setItem('xero_communities', JSON.stringify(updated));
    showFeedback('Community deleted.');
  };

  return (
    <div className="py-8 px-6 md:px-8 max-w-[1200px] mx-auto text-[#dfe2ed] font-sans">
      
      {/* Header Banner */}
      <div className="bg-[#141a26] border border-[#2d384e] rounded-2xl p-6 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-full bg-gradient-to-l from-blue-600/10 to-transparent pointer-events-none" />
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded text-[11px] font-mono font-bold uppercase tracking-wider flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              ADMINISTRATOR CONSOLE
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">System Control Center</h1>
          <p className="text-xs text-[#8d909d] mt-1">
            Publish events, manage community hubs, monitor user activities, and broadcast platform updates.
          </p>
        </div>

        {/* Quick Admin Stats */}
        <div className="flex gap-4 font-mono text-xs text-[#c3c6d4]">
          <div className="bg-[#0b0e14] px-3.5 py-2 rounded-xl border border-[#212a3b] text-center">
            <span className="block text-white font-bold text-base">{eventsList.length}</span>
            <span className="text-[10px] text-[#787e91]">Active Events</span>
          </div>
          <div className="bg-[#0b0e14] px-3.5 py-2 rounded-xl border border-[#212a3b] text-center">
            <span className="block text-white font-bold text-base">{communitiesList.length}</span>
            <span className="text-[10px] text-[#787e91]">Managed Hubs</span>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {notification && (
        <div className="mb-6 p-4 bg-emerald-950/80 border border-emerald-700/80 text-emerald-200 rounded-xl text-xs flex items-center gap-2 shadow-lg animate-pulse">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-semibold">{notification}</span>
        </div>
      )}

      {/* Sub-Navigation Tabs */}
      <div className="flex gap-3 mb-6 border-b border-[#2b3548] pb-3">
        <button
          onClick={() => setActiveAdminTab('events')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeAdminTab === 'events'
              ? 'bg-[#3b82f6] text-white shadow-lg'
              : 'bg-[#181c24] border border-[#434752] text-[#c3c6d4] hover:text-white'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Post & Manage Events</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('communities')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeAdminTab === 'communities'
              ? 'bg-[#3b82f6] text-white shadow-lg'
              : 'bg-[#181c24] border border-[#434752] text-[#c3c6d4] hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Create & Manage Communities</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('system')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeAdminTab === 'system'
              ? 'bg-[#3b82f6] text-white shadow-lg'
              : 'bg-[#181c24] border border-[#434752] text-[#c3c6d4] hover:text-white'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>System & Analytics</span>
        </button>
      </div>

      {/* TAB 1: EVENTS MANAGER */}
      {activeAdminTab === 'events' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Create Event Form */}
          <div className="lg:col-span-6 bg-[#181c24] border border-[#434752] rounded-2xl p-6 space-y-4 shadow-md">
            <div className="flex items-center gap-2 border-b border-[#2d374a] pb-3">
              <PlusCircle className="w-5 h-5 text-[#60a5fa]" />
              <h2 className="text-lg font-bold text-white">Post New Event</h2>
            </div>

            <form onSubmit={handleCreateEvent} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#c3c6d4] font-semibold mb-1 uppercase tracking-wider">Event Title</label>
                <input
                  type="text"
                  placeholder="e.g. Global AI & Machine Learning Hackathon"
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  className="w-full bg-[#0d111a] border border-[#2b354a] rounded-xl px-3.5 py-2.5 text-white placeholder-[#586075] focus:outline-none focus:border-[#3b82f6]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#c3c6d4] font-semibold mb-1 uppercase tracking-wider">Category</label>
                  <select
                    value={eventCategory}
                    onChange={(e: any) => setEventCategory(e.target.value)}
                    className="w-full bg-[#0d111a] border border-[#2b354a] rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-[#3b82f6]"
                  >
                    <option value="Hackathon">Hackathon</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Meetup">Meetup</option>
                    <option value="Webinar">Webinar</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#c3c6d4] font-semibold mb-1 uppercase tracking-wider">Date & Time</label>
                  <input
                    type="text"
                    placeholder="Nov 15, 2026 • 10:00 AM"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full bg-[#0d111a] border border-[#2b354a] rounded-xl px-3.5 py-2.5 text-white placeholder-[#586075] focus:outline-none focus:border-[#3b82f6]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#c3c6d4] font-semibold mb-1 uppercase tracking-wider">Location / Venue</label>
                  <input
                    type="text"
                    placeholder="Virtual / Online or SF Hub 4"
                    value={eventLocation}
                    onChange={(e) => setEventLocation(e.target.value)}
                    className="w-full bg-[#0d111a] border border-[#2b354a] rounded-xl px-3.5 py-2.5 text-white placeholder-[#586075] focus:outline-none focus:border-[#3b82f6]"
                  />
                </div>

                <div>
                  <label className="block text-[#c3c6d4] font-semibold mb-1 uppercase tracking-wider">Capacity / Seats</label>
                  <input
                    type="text"
                    placeholder="500 Attendees"
                    value={eventCapacity}
                    onChange={(e) => setEventCapacity(e.target.value)}
                    className="w-full bg-[#0d111a] border border-[#2b354a] rounded-xl px-3.5 py-2.5 text-white placeholder-[#586075] focus:outline-none focus:border-[#3b82f6]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#c3c6d4] font-semibold mb-1 uppercase tracking-wider">Image Banner URL (Optional)</label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/..."
                  value={eventImageUrl}
                  onChange={(e) => setEventImageUrl(e.target.value)}
                  className="w-full bg-[#0d111a] border border-[#2b354a] rounded-xl px-3.5 py-2.5 text-white placeholder-[#586075] focus:outline-none focus:border-[#3b82f6]"
                />
              </div>

              <div>
                <label className="block text-[#c3c6d4] font-semibold mb-1 uppercase tracking-wider">Description</label>
                <textarea
                  rows={3}
                  placeholder="Describe the event, agenda, prizes, and key learning outcomes..."
                  value={eventDescription}
                  onChange={(e) => setEventDescription(e.target.value)}
                  className="w-full bg-[#0d111a] border border-[#2b354a] rounded-xl px-3.5 py-2.5 text-white placeholder-[#586075] focus:outline-none focus:border-[#3b82f6]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#2563eb] hover:bg-[#3b82f6] text-white font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer text-xs"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Publish Event to Platform</span>
              </button>
            </form>
          </div>

          {/* Published Events List */}
          <div className="lg:col-span-6 space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center justify-between">
              <span>Published Events ({eventsList.length})</span>
              <span className="text-xs text-[#8d909d] font-normal">Shows in Events tab</span>
            </h2>

            {eventsList.length === 0 ? (
              <div className="bg-[#181c24] border border-[#434752] rounded-2xl p-8 text-center space-y-2">
                <Calendar className="w-8 h-8 text-[#56617a] mx-auto" />
                <p className="text-xs text-[#8d909d]">No events published yet. Use the form to add your first event!</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                {eventsList.map((ev) => (
                  <div key={ev.id} className="bg-[#181c24] border border-[#3b4760] rounded-xl p-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src={ev.imageUrl || getFallbackEventBanner(ev.category, ev.title)} 
                        alt={ev.title} 
                        onError={(e) => {
                          e.currentTarget.src = getFallbackEventBanner(ev.category, ev.title);
                        }}
                        className="w-12 h-12 rounded-lg object-cover border border-[#2b3548]" 
                      />
                      <div>
                        <span className="text-[10px] font-mono text-[#a8dadc] bg-[#1d3557] px-2 py-0.5 rounded font-bold uppercase">
                          {ev.category}
                        </span>
                        <h4 className="text-sm font-bold text-white mt-1">{ev.title}</h4>
                        <p className="text-[11px] text-[#8d909d] font-mono">{ev.date} • {ev.location}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteEvent(ev.id)}
                      className="p-2 text-[#9da5b8] hover:text-rose-400 transition-colors cursor-pointer"
                      title="Delete Event"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: COMMUNITIES MANAGER */}
      {activeAdminTab === 'communities' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Create Community Form */}
          <div className="lg:col-span-6 bg-[#181c24] border border-[#434752] rounded-2xl p-6 space-y-4 shadow-md">
            <div className="flex items-center gap-2 border-b border-[#2d374a] pb-3">
              <Users className="w-5 h-5 text-[#60a5fa]" />
              <h2 className="text-lg font-bold text-white">Create New Community</h2>
            </div>

            <form onSubmit={handleCreateCommunity} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#c3c6d4] font-semibold mb-1 uppercase tracking-wider">Community Name</label>
                <input
                  type="text"
                  placeholder="e.g. Quantum Computing Guild"
                  value={communityName}
                  onChange={(e) => setCommunityName(e.target.value)}
                  className="w-full bg-[#0d111a] border border-[#2b354a] rounded-xl px-3.5 py-2.5 text-white placeholder-[#586075] focus:outline-none focus:border-[#3b82f6]"
                />
              </div>

              <div>
                <label className="block text-[#c3c6d4] font-semibold mb-1 uppercase tracking-wider">Category</label>
                <select
                  value={communityCategory}
                  onChange={(e) => setCommunityCategory(e.target.value)}
                  className="w-full bg-[#0d111a] border border-[#2b354a] rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#3b82f6]"
                >
                  <option value="Development">Development</option>
                  <option value="AI & Data Science">AI & Data Science</option>
                  <option value="Cybersecurity">Cybersecurity</option>
                  <option value="Cloud & DevOps">Cloud & DevOps</option>
                </select>
              </div>

              <div>
                <label className="block text-[#c3c6d4] font-semibold mb-1 uppercase tracking-wider">Description</label>
                <textarea
                  rows={3}
                  placeholder="What is this community about? Who should join?"
                  value={communityDesc}
                  onChange={(e) => setCommunityDesc(e.target.value)}
                  className="w-full bg-[#0d111a] border border-[#2b354a] rounded-xl px-3.5 py-2.5 text-white placeholder-[#586075] focus:outline-none focus:border-[#3b82f6]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#2563eb] hover:bg-[#3b82f6] text-white font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer text-xs"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Create Community Hub</span>
              </button>
            </form>
          </div>

          {/* Communities List */}
          <div className="lg:col-span-6 space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center justify-between">
              <span>Managed Communities ({communitiesList.length})</span>
            </h2>

            {communitiesList.length === 0 ? (
              <div className="bg-[#181c24] border border-[#434752] rounded-2xl p-8 text-center space-y-2">
                <Users className="w-8 h-8 text-[#56617a] mx-auto" />
                <p className="text-xs text-[#8d909d]">No custom communities created yet.</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                {communitiesList.map((c) => (
                  <div key={c.id} className="bg-[#181c24] border border-[#3b4760] rounded-xl p-4 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-[#a8dadc] bg-[#1d3557] px-2 py-0.5 rounded font-bold uppercase">
                        {c.category}
                      </span>
                      <h4 className="text-sm font-bold text-white mt-1">{c.name}</h4>
                      <p className="text-xs text-[#8d909d] line-clamp-1">{c.description}</p>
                    </div>

                    <button
                      onClick={() => handleDeleteCommunity(c.id)}
                      className="p-2 text-[#9da5b8] hover:text-rose-400 transition-colors cursor-pointer"
                      title="Delete Community"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}

      {/* TAB 3: SYSTEM & ANALYTICS */}
      {activeAdminTab === 'system' && (
        <div className="bg-[#181c24] border border-[#434752] rounded-2xl p-8 space-y-6">
          <div className="flex items-center gap-3 border-b border-[#2d374a] pb-4">
            <Megaphone className="w-6 h-6 text-[#60a5fa]" />
            <div>
              <h2 className="text-lg font-bold text-white">Global Platform Status</h2>
              <p className="text-xs text-[#8d909d]">System telemetry, network nodes, and global broadcasts</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#0f131b] p-4 rounded-xl border border-[#2b3548]">
              <span className="text-xs text-[#8d909d] font-mono uppercase">API Gateway</span>
              <p className="text-lg font-bold text-emerald-400 mt-1">99.98% Uptime</p>
            </div>
            <div className="bg-[#0f131b] p-4 rounded-xl border border-[#2b3548]">
              <span className="text-xs text-[#8d909d] font-mono uppercase">Total Submissions</span>
              <p className="text-lg font-bold text-[#60a5fa] mt-1">142,850 Solved</p>
            </div>
            <div className="bg-[#0f131b] p-4 rounded-xl border border-[#2b3548]">
              <span className="text-xs text-[#8d909d] font-mono uppercase">Active Sessions</span>
              <p className="text-lg font-bold text-amber-300 mt-1">1,240 Users Online</p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
