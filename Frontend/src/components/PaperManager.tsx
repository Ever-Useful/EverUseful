import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useProfileStore, Paper } from '@/hooks/useProfileStore';
import { v4 as uuidv4 } from 'uuid';

const PaperManager = () => {
  const { profile, addPaper, updatePaper, deletePaper } = useProfileStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPaper, setEditingPaper] = useState<Paper | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    publisher: '',
    link: ''
  });

  const papers = profile?.userType === 'professor' ? profile.papers : [];

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingPaper) {
      updatePaper(editingPaper.id, formData);
    } else {
      const newPaper: Paper = {
        id: uuidv4(),
        ...formData
      };
      addPaper(newPaper);
    }
    
    resetForm();
  };

  const resetForm = () => {
    setFormData({ name: '', description: '', publisher: '', link: '' });
    setEditingPaper(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (paper: Paper) => {
    setFormData({
      name: paper.name,
      description: paper.description,
      publisher: paper.publisher,
      link: paper.link
    });
    setEditingPaper(paper);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this paper?')) {
      deletePaper(id);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">Manage Papers</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>Add New Paper</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingPaper ? 'Edit Paper' : 'Add New Paper'}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="paper-name">Name of Paper *</Label>
                <Input
                  id="paper-name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                  placeholder="Enter paper title"
                />
              </div>
              
              <div>
                <Label htmlFor="paper-description">Description *</Label>
                <Textarea
                  id="paper-description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  required
                  placeholder="Describe the paper and its findings..."
                  rows={4}
                />
              </div>
              
              <div>
                <Label htmlFor="paper-publisher">Publisher Name *</Label>
                <Input
                  id="paper-publisher"
                  value={formData.publisher}
                  onChange={(e) => handleInputChange('publisher', e.target.value)}
                  required
                  placeholder="Name of the journal or conference"
                />
              </div>
              
              <div>
                <Label htmlFor="paper-link">Link</Label>
                <Input
                  id="paper-link"
                  value={formData.link}
                  onChange={(e) => handleInputChange('link', e.target.value)}
                  placeholder="https://doi.org/paper-link"
                />
              </div>
              
              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingPaper ? 'Update Paper' : 'Add Paper'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {papers.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-gray-500 mb-4">No papers added yet</p>
            <Button onClick={() => setIsDialogOpen(true)}>Add Your First Paper</Button>
          </Card>
        ) : (
          papers.map((paper) => (
            <Card key={paper.id} className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold mb-2">{paper.name}</h3>
                  <p className="text-gray-600 mb-2"><strong>Publisher:</strong> {paper.publisher}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(paper)}>
                    Edit
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(paper.id)}>
                    Delete
                  </Button>
                </div>
              </div>
              <p className="text-gray-700 mb-4">{paper.description}</p>
              {paper.link && (
                <a 
                  href={paper.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  View Paper →
                </a>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default PaperManager;