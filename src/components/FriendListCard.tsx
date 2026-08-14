import React from 'react';
import { SSHUser, DEFAULT_GHOST_AVATAR, formatImageUrl } from '../services/firebaseDb';
import { X, UserPlus, Check, Trash2, Ban, Search as SearchIcon } from 'lucide-react';

export type FriendListMode = 'friends' | 'requests' | 'sent' | 'blocked' | 'search';

interface FriendListCardProps {
  mode: FriendListMode;
  users: SSHUser[];
  onClose: () => void;
  onViewProfile: (user: SSHUser) => void;
  onAction: (action: 'add' | 'accept' | 'deny' | 'remove' | 'block' | 'unblock' | 'cancel', targetUser: SSHUser) => void;
  searchQuery?: string;
}

export default function FriendListCard({
  mode,
  users,
  onClose,
  onViewProfile,
  onAction,
  searchQuery
}: FriendListCardProps) {
  
  const getHeaderTitle = () => {
    switch (mode) {
      case 'friends': return 'NETWORK_CONNECTIONS';
      case 'requests': return 'INBOUND_REQUESTS';
      case 'sent': return 'OUTBOUND_REQUESTS';
      case 'blocked': return 'BLOCKED_ENTITIES';
      case 'search': return 'GLOBAL_DIRECTORY';
      default: return 'USER_LIST';
    }
  };

  return (
    <main className="friend-list-card animate-cyber-card-enter relative pb-4 w-full max-w-md border border-[#ff0000] bg-black text-[#ff0000] font-mono shadow-[0_0_20px_rgba(255,0,0,0.25)] rounded-none overflow-hidden select-text transition-all hover:shadow-[0_0_30px_rgba(255,0,0,0.45)]">
      {/* Scanline Overlay */}
      <div className="scanlines pointer-events-none absolute inset-0 z-20"></div>

      {/* Top Bar with Close Button */}
      <div className="flex justify-between items-center bg-[#110000] border-b border-[#ff0000] px-3 py-1.5 z-30 relative">
        <span className="text-[11px] font-bold tracking-widest uppercase terminal-text flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 bg-[#ff0000] rounded-full animate-ping inline-block"></span>
          [{getHeaderTitle()}]
        </span>
        <button
          onClick={onClose}
          aria-label="Close Friend List"
          className="text-[#ff0000] hover:bg-[#ff0000] hover:text-black p-0.5 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <section className="p-4 relative z-10 max-h-[400px] overflow-y-auto custom-scrollbar">
        {mode === 'search' && (
          <div className="mb-4 pb-2 border-b border-dashed border-[#ff0000]">
            <span className="text-xs terminal-text-dim flex items-center gap-2">
              <SearchIcon className="w-3 h-3" /> 
              Searching for: "{searchQuery}"
            </span>
          </div>
        )}

        {users.length === 0 ? (
          <div className="text-center py-8 border border-dashed border-[#660000] bg-[#110000]">
            <span className="text-xs terminal-text-dim italic">NO_RECORDS_FOUND</span>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {users.map((user) => (
              <div key={user.username} className="group relative border border-[#440000] bg-black p-2 flex items-center justify-between hover:border-[#ff0000] transition-colors">
                
                {/* User Info (Clickable) */}
                <div 
                  className="flex items-center gap-3 cursor-pointer flex-1 min-w-0"
                  onClick={() => onViewProfile(user)}
                >
                  <div className="relative flex-shrink-0">
                    <img 
                      src={formatImageUrl(user.avatarUrl)} 
                      alt={user.username}
                      className="w-10 h-10 object-cover border border-[#440000] group-hover:border-[#ff0000] transition-colors bg-black"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        if (target.src !== DEFAULT_GHOST_AVATAR) {
                          target.src = DEFAULT_GHOST_AVATAR;
                        }
                      }}
                    />
                    {/* Status Beacon Fake Mock (Red = Online/Busy since it's the theme) */}
                    <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-[#ff0000] border border-black rounded-full shadow-[0_0_5px_#ff0000]"></div>
                  </div>
                  
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="text-sm font-bold terminal-text truncate group-hover:text-white transition-colors">
                      {user.displayName || user.username}
                    </span>
                    <span className="text-[10px] terminal-text-dim truncate">
                      @{user.username}
                    </span>
                    {user.statusBubble && (
                      <span className="text-[9px] text-[#ffaaaa] italic truncate mt-0.5">
                        &gt; {user.statusBubble}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 ml-2">
                  {mode === 'friends' && (
                    <>
                      <button 
                        onClick={() => onAction('remove', user)}
                        className="p-1.5 border border-[#ff0000] bg-black hover:bg-[#ff0000] hover:text-black transition-colors"
                        title="Remove Friend"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}
                  {mode === 'requests' && (
                    <>
                      <button 
                        onClick={() => onAction('accept', user)}
                        className="p-1.5 border border-[#ff0000] bg-black hover:bg-[#ff0000] hover:text-black transition-colors"
                        title="Accept Request"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => onAction('deny', user)}
                        className="p-1.5 border border-[#ff0000] bg-black hover:bg-[#ff0000] hover:text-black transition-colors"
                        title="Deny Request"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}
                  {mode === 'sent' && (
                    <>
                      <button 
                        onClick={() => onAction('cancel', user)}
                        className="p-1.5 border border-[#ff0000] bg-black hover:bg-[#ff0000] hover:text-black transition-colors"
                        title="Cancel Request"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}
                  {mode === 'search' && (
                    <>
                      <button 
                        onClick={() => onAction('add', user)}
                        className="p-1.5 border border-[#ff0000] bg-black hover:bg-[#ff0000] hover:text-black transition-colors"
                        title="Add Friend"
                      >
                        <UserPlus className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}
                  {mode === 'blocked' && (
                    <>
                      <button 
                        onClick={() => onAction('unblock', user)}
                        className="px-2 py-1 border border-[#ff0000] bg-black hover:bg-[#ff0000] hover:text-black transition-colors text-[10px] font-bold"
                        title="Unblock User"
                      >
                        UNBLOCK
                      </button>
                    </>
                  )}
                  
                  {/* Block action available everywhere except blocked mode */}
                  {mode !== 'blocked' && (
                    <button 
                      onClick={() => onAction('block', user)}
                      className="p-1.5 border border-[#660000] bg-black text-[#660000] hover:bg-[#ff0000] hover:border-[#ff0000] hover:text-black transition-colors"
                      title="Block User"
                    >
                      <Ban className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
