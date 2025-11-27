'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { ThunderButton, ThunderCard } from '@/components/ui/design-system';
import { Plus, Trash2, Edit2, Save, XCircle, Hash } from 'lucide-react';
import { toast } from 'sonner';

interface Topic {
  id: string;
  title: string;
  slug: string;
  description?: string;
  color_hex?: string;
}

interface TopicsManagerProps {
  initialTopics: Topic[];
}

export function TopicsManager({ initialTopics }: TopicsManagerProps) {
  const [topics, setTopics] = useState<Topic[]>(initialTopics);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  // Form State
  const [formData, setFormData] = useState<Partial<Topic>>({});

  const handleEdit = (topic: Topic) => {
    setIsEditing(topic.id);
    setFormData(topic);
    setIsCreating(false);
  };

  const handleCreate = () => {
    setIsCreating(true);
    setFormData({ color_hex: '#FFC800' }); // Default color
    setIsEditing(null);
  };

  const handleCancel = () => {
    setIsEditing(null);
    setIsCreating(false);
    setFormData({});
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this topic?')) return;

    setLoading(true);
    const { error } = await supabase.from('topics').delete().eq('id', id);

    if (error) {
      toast.error('Failed to delete topic');
      console.error(error);
    } else {
      setTopics(topics.filter(t => t.id !== id));
      toast.success('Topic deleted');
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!formData.title || !formData.slug) {
      toast.error('Title and Slug are required');
      return;
    }

    setLoading(true);
    
    if (isCreating) {
      const { data, error } = await supabase
        .from('topics')
        .insert([formData])
        .select()
        .single();

      if (error) {
        toast.error('Failed to create topic');
        console.error(error);
      } else {
        setTopics([...topics, data]);
        toast.success('Topic created');
        handleCancel();
      }
    } else if (isEditing) {
      const { error } = await supabase
        .from('topics')
        .update(formData)
        .eq('id', isEditing);

      if (error) {
        toast.error('Failed to update topic');
        console.error(error);
      } else {
        setTopics(topics.map(t => (t.id === isEditing ? { ...t, ...formData } as Topic : t)));
        toast.success('Topic updated');
        handleCancel();
      }
    }
    setLoading(false);
  };

  return (
    <ThunderCard className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold font-headings flex items-center gap-2">
          <Hash className="w-5 h-5 text-thunder-yellow" />
          Manage Topics
        </h3>
        {!isCreating && !isEditing && (
          <ThunderButton size="sm" onClick={handleCreate}>
            <Plus className="w-4 h-4 mr-2" />
            Add Topic
          </ThunderButton>
        )}
      </div>

      {/* Form Area */}
      {(isCreating || isEditing) && (
        <div className="mb-8 p-4 bg-secondary/10 rounded-lg border border-border/50 space-y-4 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">Title</label>
              <input
                value={formData.title || ''}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-background border border-border rounded px-3 py-2 text-sm"
                placeholder="e.g. African History"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">Slug</label>
              <input
                value={formData.slug || ''}
                onChange={e => setFormData({ ...formData, slug: e.target.value })}
                className="w-full bg-background border border-border rounded px-3 py-2 text-sm"
                placeholder="e.g. african-history"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">Description</label>
              <textarea
                value={formData.description || ''}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-background border border-border rounded px-3 py-2 text-sm h-20"
                placeholder="Brief description of the topic..."
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">Color (Hex)</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={formData.color_hex || '#FFC800'}
                  onChange={e => setFormData({ ...formData, color_hex: e.target.value })}
                  className="h-9 w-9 p-0 border-none rounded cursor-pointer"
                />
                <input
                  value={formData.color_hex || ''}
                  onChange={e => setFormData({ ...formData, color_hex: e.target.value })}
                  className="flex-1 bg-background border border-border rounded px-3 py-2 text-sm"
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button onClick={handleCancel} className="px-4 py-2 text-sm text-muted-foreground hover:text-white transition-colors">
              Cancel
            </button>
            <ThunderButton size="sm" onClick={handleSave} disabled={loading}>
              {loading ? <span className="animate-spin mr-2">⏳</span> : <Save className="w-4 h-4 mr-2" />}
              Save Topic
            </ThunderButton>
          </div>
        </div>
      )}

      {/* Topics List */}
      <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        {topics.map(topic => (
          <div 
            key={topic.id} 
            className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
              isEditing === topic.id ? 'bg-primary/10 border-primary' : 'bg-surface border-white/5 hover:border-white/10'
            }`}
          >
            <div className="flex items-center gap-3">
              <div 
                className="w-3 h-3 rounded-full shadow-[0_0_8px_currentColor]" 
                style={{ color: topic.color_hex || '#fff', backgroundColor: topic.color_hex || '#fff' }} 
              />
              <div>
                <p className="font-bold text-sm">{topic.title}</p>
                <p className="text-xs text-muted-foreground font-mono">{topic.slug}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => handleEdit(topic)}
                className="p-2 text-muted-foreground hover:text-white hover:bg-white/10 rounded transition-colors"
                disabled={isEditing !== null || isCreating}
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button 
                onClick={() => handleDelete(topic.id)}
                className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded transition-colors"
                disabled={isEditing !== null || isCreating}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
        {topics.length === 0 && (
          <p className="text-center text-muted-foreground py-8">No topics found.</p>
        )}
      </div>
    </ThunderCard>
  );
}
