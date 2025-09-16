import { auth } from '../lib/firebase';
import { API_ENDPOINTS } from '../config/api';

export type RelationsOverview = {
  sent: string[];
  received: string[];
  pending: string[];
  connected: string[];
  blocked?: string[];
};

export type RelationStatus =
  | 'NONE'
  | 'SENT'
  | 'RECEIVED'
  | 'PENDING'
  | 'CONNECTED'
  | 'BLOCKED'
  | string;

class RelationService {
  private async getAuthToken(): Promise<string> {
    const user = auth.currentUser;
    if (!user) throw new Error('No authenticated user');
    return user.getIdToken();
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const token = await this.getAuthToken();
    const url = endpoint.startsWith('http') ? endpoint : `${API_ENDPOINTS.BASE_URL}${endpoint}`;
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data?.message || 'Request failed');
    }
    return data;
  }

  // POST /relations/send { toUserId }
  async send(toUserId: string) {
    return this.request(API_ENDPOINTS.RELATIONS_SEND, {
      method: 'POST',
      body: JSON.stringify({ toUserId }),
    });
  }

  // Back-compat helper: same as send(toUserId)
  async sendRelationRequest(_senderId: string, receiverId: string) {
    return this.send(receiverId);
  }


  // POST /relations/accept { fromUserId }
  async accept(fromUserId: string) {
    return this.request(API_ENDPOINTS.RELATIONS_ACCEPT, {
      method: 'POST',
      body: JSON.stringify({ fromUserId }),
    });
  }

  // POST /relations/decline { fromUserId }
  async decline(fromUserId: string) {
    return this.request(API_ENDPOINTS.RELATIONS_DECLINE, {
      method: 'POST',
      body: JSON.stringify({ fromUserId }),
    });
  }

  // POST /relations/cancel { toUserId }
  async cancel(toUserId: string) {
    return this.request(API_ENDPOINTS.RELATIONS_CANCEL, {
      method: 'POST',
      body: JSON.stringify({ toUserId }),
    });
  }

  // POST /relations/remove-connection { otherUserId }
  async removeConnection(otherUserId: string) {
    return this.request(API_ENDPOINTS.RELATIONS_REMOVE_CONNECTION, {
      method: 'POST',
      body: JSON.stringify({ otherUserId }),
    });
  }

  // POST /relations/block { blockedUserId }
  async block(blockedUserId: string) {
    return this.request(API_ENDPOINTS.RELATIONS_BLOCK, {
      method: 'POST',
      body: JSON.stringify({ blockedUserId }),
    });
  }

  // POST /relations/unblock { blockedUserId }
  async unblock(blockedUserId: string) {
    return this.request(API_ENDPOINTS.RELATIONS_UNBLOCK, {
      method: 'POST',
      body: JSON.stringify({ blockedUserId }),
    });
  }

  // GET /relations/me
  async getMyRelations(): Promise<{ success: boolean; data: RelationsOverview } | any> {
    return this.request(API_ENDPOINTS.RELATIONS_ME, { method: 'GET' });
  }

  // GET /relations/status?otherUserId=...
  async getStatus(otherUserId: string): Promise<{ success: boolean; data: RelationStatus } | any> {
    const url = `${API_ENDPOINTS.RELATIONS_STATUS}?otherUserId=${encodeURIComponent(otherUserId)}`;
    return this.request(url, { method: 'GET' });
  }

    // GET /relations/notifications
  async getNotifications(): Promise<{ notifications: any[]; unreadCount: number }> {
    const data = await this.request('/relations/notifications', { method: 'GET' });
    return {
      notifications: data.notifications || [],
      unreadCount: data.unreadCount || 0
    };
  }

  // POST /relations/notifications/:notificationId/read
  async markNotificationAsRead(notificationId: string): Promise<void> {
    await this.request(`/relations/notifications/${notificationId}/read`, { method: 'POST' });
  }

  // POST /relations/notifications/clear
async clearNotifications(): Promise<void> {
  await this.request('/relations/notifications/clear', { method: 'POST' });
}
}

export default new RelationService();


