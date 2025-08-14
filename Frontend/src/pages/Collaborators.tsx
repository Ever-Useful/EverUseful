import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'react-hot-toast';
import { auth } from '@/lib/firebase';
import { API_ENDPOINTS } from '../config/api';

interface User {
  id: string;
  name: string;
  title: string;
  avatar: string;
  skills: string[];
}

const Collaborators = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_ENDPOINTS.USERS + "/all");
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async (userId: string) => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      toast.error('Please sign in to connect with others');
      return;
    }

    try {
      const response = await fetch(API_ENDPOINTS.USER_FOLLOW, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await currentUser.getIdToken()}`
        },
        body: JSON.stringify({ targetUserId: userId })
      });

      if (!response.ok) {
        throw new Error('Failed to follow user');
      }

      // Refresh users list
      fetchUsers();
      toast.success('User followed successfully!');
    } catch (error) {
      console.error('Error following user:', error);
      toast.error('Failed to follow user');
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSkills = selectedSkills.length === 0 ||
                         selectedSkills.some(skill => user.skills.includes(skill));
    return matchesSearch && matchesSkills;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold text-slate-800 mb-6">Find Collaborators</h1>
        
        <div className="space-y-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Search</Label>
              <Input
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name or title"
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="skills">Skills</Label>
              <Input
                id="skills"
                value={selectedSkills.join(', ')}
                onChange={(e) => setSelectedSkills(e.target.value.split(',').map(s => s.trim()))}
                placeholder="Filter by skills (comma-separated)"
              />
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredUsers.map(user => (
                <Card key={user.id} className="p-4 flex items-center gap-4">
                  <img
                    src={user.avatar || '/default-avatar.png'}
                    alt={user.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold">{user.name}</h3>
                    <p className="text-sm text-gray-600">{user.title}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {user.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <Button
                    onClick={() => handleFollow(user.id)}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    Connect
                  </Button>
                </Card>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Collaborators; 