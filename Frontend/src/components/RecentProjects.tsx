import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Github, ExternalLink, Calendar, Tag, Trash2 } from 'lucide-react';
import { auth, db } from "@/lib/firebase";
import { useState, useEffect } from "react";
import { collection, query, where, orderBy, limit, getDocs, onSnapshot, doc, deleteDoc } from "firebase/firestore";
import { toast } from "react-hot-toast";
import { format } from 'date-fns';


interface Project {
  id: string;
  title: string;
  category: string;
  status: string;
  progress: number;
  collaborators: number;
  createdAt: string;
  imageUrl?: string;
  description: string;
  githubLink?: string;
  projectLink?: string;
  tags: string[];
}

const RecentProjects = () => {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Recent Projects
        </h2>
      </div>
      <div className="text-center py-8 text-gray-500">
        Project fetching disabled.
      </div>
    </Card>
  );
};

export default RecentProjects;