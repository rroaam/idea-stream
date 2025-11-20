'use client';

import React, { useState, useEffect } from 'react';
import { Camera, Plus, X, Filter, Search, Image as ImageIcon, Calendar, ArrowLeft } from 'lucide-react';

export default function Home() {
  const [ideas, setIdeas] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedIdea, setSelectedIdea] = useState(null);
  const [currentFilter, setCurrentFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    emoji: '💡',
    description: '',
    category: '',
    tags: '',
    images: [],
    notes: []
  });
  
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // Sample ideas for initial load
  const sampleIdeas = [
    {
      id: '1',
      name: "T.I.M.E.",
      emoji: "🎬",
      description: "A film/story exploring the nature of time, consciousness, and reality. Multiple timelines converging.",
      category: "story",
      tags: ["film", "sci-fi", "narrative"],
      images: [],
      notes: [],
      createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '2',
      name: "Klip Kid",
      emoji: "🧢",
      description: "Custom hat company with unique, personally designed pieces. Each hat tells a story.",
      category: "product",
      tags: ["fashion", "custom", "apparel"],
      images: [],
      notes: [],
      createdAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '3',
      name: "EMF Pad Art",
      emoji: "🎨",
      description: "Stylized non-radiation pads with unique artistic designs. Function meets beauty.",
      category: "product",
      tags: ["health", "design", "wellness"],
      images: [],
      notes: [],
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '4',
      name: "Kulti",
      emoji: "📱",
      description: "Creative livestreaming app for artists and makers. Real-time creative collaboration.",
      category: "app",
      tags: ["streaming", "creative", "community"],
      images: [],
      notes: [],
      createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];

  const emojiOptions = ['💡', '🎨', '🚀', '🎬', '📱', '✨', '🌊', '🔥', '⚡', '🎯', '🎪', '🎭', '🧢', '📝', '🎵', '🏗️', '🌱', '🦋', '🎪', '🔮', '🎲', '🎨', '📚', '🎸'];

  // Load ideas from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('ideastream-ideas');
    if (stored) {
      setIdeas(JSON.parse(stored));
    } else {
      setIdeas(sampleIdeas);
      localStorage.setItem('ideastream-ideas', JSON.stringify(sampleIdeas));
    }
  }, []);

  // Save to localStorage whenever ideas change
  useEffect(() => {
    if (ideas.length > 0) {
      localStorage.setItem('ideastream-ideas', JSON.stringify(ideas));
    }
  }, [ideas]);

  const categories = ['all', 'app', 'product', 'art', 'story', 'other'];

  const handleAddIdea = (e) => {
    e.preventDefault();
    
    const newIdea = {
      id: Date.now().toString(),
      ...formData,
      tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
      createdAt: new Date().toISOString()
    };

    setIdeas([newIdea, ...ideas]);
    setShowAddModal(false);
    setFormData({
      name: '',
      emoji: '💡',
      description: '',
      category: '',
      tags: '',
      images: [],
      notes: []
    });
    setShowEmojiPicker(false);
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const readers = files.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readers).then(images => {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...images]
      }));
    });
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const filteredIdeas = ideas
    .filter(idea => currentFilter === 'all' || idea.category === currentFilter)
    .filter(idea => 
      searchQuery === '' || 
      idea.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      idea.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      idea.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );

  const getDaysSince = (dateString) => {
    const days = Math.floor((Date.now() - new Date(dateString)) / (1000 * 60 * 60 * 24));
    if (days === 0) return 'today';
    if (days === 1) return 'yesterday';
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    if (days < 365) return `${Math.floor(days / 30)} months ago`;
    return `${Math.floor(days / 365)} years ago`;
  };

  return (
    <>
      <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        html, body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
          background: #0a0a0a;
          color: #ffffff;
          overflow-x: hidden;
        }

        .app-container {
          min-height: 100vh;
          padding-bottom: 100px;
        }

        .header {
          position: sticky;
          top: 0;
          background: rgba(10, 10, 10, 0.95);
          backdrop-filter: blur(20px);
          padding: 24px 20px 16px;
          z-index: 100;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .header-title {
          font-size: 32px;
          font-weight: 700;
          letter-spacing: -1px;
          background: linear-gradient(135deg, #fff 0%, #888 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 6px;
        }

        .header-subtitle {
          font-size: 14px;
          color: #666;
          font-weight: 400;
          letter-spacing: 0.5px;
        }

        .search-container {
          padding: 16px 20px;
          position: sticky;
          top: 90px;
          background: rgba(10, 10, 10, 0.95);
          backdrop-filter: blur(20px);
          z-index: 99;
        }

        .search-box {
          width: 100%;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 12px 16px 12px 44px;
          color: #fff;
          font-size: 15px;
          outline: none;
          transition: all 0.2s;
          position: relative;
        }

        .search-icon {
          position: absolute;
          left: 34px;
          top: 28px;
          color: #666;
          width: 18px;
          height: 18px;
        }

        .search-box:focus {
          border-color: rgba(255, 255, 255, 0.3);
          background: rgba(255, 255, 255, 0.08);
        }

        .filter-chips {
          display: flex;
          gap: 8px;
          padding: 8px 20px 16px;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
        }

        .filter-chips::-webkit-scrollbar {
          display: none;
        }

        .chip {
          padding: 8px 18px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          font-size: 13px;
          white-space: nowrap;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          text-transform: capitalize;
        }

        .chip:hover {
          background: rgba(255, 255, 255, 0.08);
        }

        .chip.active {
          background: rgba(255, 255, 255, 0.15);
          border-color: rgba(255, 255, 255, 0.3);
          transform: scale(1.05);
        }

        .ideas-grid {
          padding: 0 20px;
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
        }

        .idea-card {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 20px;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
        }

        .idea-card:hover {
          transform: translateY(-4px);
          border-color: rgba(255, 255, 255, 0.15);
          background: rgba(255, 255, 255, 0.05);
        }

        .idea-card:active {
          transform: scale(0.98);
        }

        .idea-visual {
          width: 100%;
          height: 220px;
          background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }

        .idea-emoji {
          font-size: 72px;
          position: relative;
          z-index: 2;
        }

        .idea-images {
          display: flex;
          gap: 4px;
          overflow-x: auto;
          scrollbar-width: none;
        }

        .idea-images::-webkit-scrollbar {
          display: none;
        }

        .idea-image {
          width: 100%;
          height: 220px;
          object-fit: cover;
          flex-shrink: 0;
        }

        .idea-content {
          padding: 20px;
        }

        .idea-header {
          display: flex;
          justify-content: space-between;
          align-items: start;
          margin-bottom: 10px;
        }

        .idea-title {
          font-size: 20px;
          font-weight: 600;
          letter-spacing: -0.5px;
          flex: 1;
        }

        .idea-age {
          font-size: 11px;
          color: #666;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          white-space: nowrap;
          margin-left: 12px;
        }

        .idea-description {
          font-size: 14px;
          color: #999;
          line-height: 1.6;
          margin-bottom: 16px;
        }

        .idea-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .tag {
          padding: 5px 12px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 14px;
          font-size: 11px;
          color: #aaa;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .fab {
          position: fixed;
          bottom: 28px;
          right: 28px;
          width: 64px;
          height: 64px;
          background: linear-gradient(135deg, #fff 0%, #e0e0e0 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #000;
          cursor: pointer;
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.5), 0 2px 8px rgba(0, 0, 0, 0.3);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 50;
        }

        .fab:hover {
          transform: scale(1.1);
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.6);
        }

        .fab:active {
          transform: scale(0.95);
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.95);
          z-index: 200;
          padding: 20px;
          overflow-y: auto;
          animation: fadeIn 0.2s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .modal-content {
          max-width: 600px;
          margin: 0 auto;
          animation: slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
        }

        .modal-title {
          font-size: 28px;
          font-weight: 700;
          letter-spacing: -0.5px;
        }

        .close-btn {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #888;
          transition: all 0.2s;
          border-radius: 50%;
        }

        .close-btn:hover {
          background: rgba(255, 255, 255, 0.05);
          color: #fff;
        }

        .form-group {
          margin-bottom: 24px;
        }

        .form-label {
          display: block;
          font-size: 12px;
          color: #888;
          margin-bottom: 10px;
          text-transform: uppercase;
          letter-spacing: 1px;
          font-weight: 500;
        }

        .form-input,
        .form-textarea {
          width: 100%;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 14px;
          padding: 16px;
          color: #fff;
          font-size: 16px;
          font-family: inherit;
          transition: all 0.2s;
        }

        .form-input:focus,
        .form-textarea:focus {
          outline: none;
          border-color: rgba(255, 255, 255, 0.3);
          background: rgba(255, 255, 255, 0.08);
        }

        .form-textarea {
          resize: vertical;
          min-height: 120px;
          line-height: 1.5;
        }

        .emoji-selector {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .emoji-display {
          width: 64px;
          height: 64px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 36px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .emoji-display:hover {
          background: rgba(255, 255, 255, 0.08);
          transform: scale(1.05);
        }

        .emoji-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 8px;
          flex: 1;
        }

        .emoji-option {
          font-size: 28px;
          padding: 12px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s;
          border: 1px solid transparent;
        }

        .emoji-option:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: scale(1.1);
        }

        .emoji-option.selected {
          border-color: rgba(255, 255, 255, 0.3);
          background: rgba(255, 255, 255, 0.15);
        }

        .image-upload-zone {
          border: 2px dashed rgba(255, 255, 255, 0.2);
          border-radius: 14px;
          padding: 32px;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s;
          background: rgba(255, 255, 255, 0.02);
        }

        .image-upload-zone:hover {
          border-color: rgba(255, 255, 255, 0.4);
          background: rgba(255, 255, 255, 0.05);
        }

        .upload-icon {
          width: 48px;
          height: 48px;
          margin: 0 auto 12px;
          color: #666;
        }

        .upload-text {
          color: #888;
          font-size: 14px;
        }

        .image-preview-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin-top: 16px;
        }

        .image-preview {
          position: relative;
          aspect-ratio: 1;
          border-radius: 12px;
          overflow: hidden;
        }

        .image-preview img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .remove-image {
          position: absolute;
          top: 8px;
          right: 8px;
          width: 28px;
          height: 28px;
          background: rgba(0, 0, 0, 0.8);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #fff;
          transition: all 0.2s;
        }

        .remove-image:hover {
          background: rgba(255, 0, 0, 0.8);
          transform: scale(1.1);
        }

        .submit-btn {
          width: 100%;
          padding: 18px;
          background: linear-gradient(135deg, #fff 0%, #e0e0e0 100%);
          border: none;
          border-radius: 14px;
          color: #000;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          margin-top: 32px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(255, 255, 255, 0.2);
        }

        .submit-btn:active {
          transform: scale(0.98);
        }

        .empty-state {
          text-align: center;
          padding: 80px 20px;
          color: #666;
        }

        .empty-icon {
          font-size: 72px;
          margin-bottom: 20px;
          opacity: 0.5;
        }

        .empty-title {
          font-size: 20px;
          margin-bottom: 8px;
          color: #888;
        }

        .empty-subtitle {
          font-size: 14px;
          color: #666;
        }
      `}</style>

      <div className="app-container">
        {/* Header */}
        <div className="header">
          <div className="header-title">idea:stream</div>
          <div className="header-subtitle">seeds growing into forests</div>
        </div>

        {/* Search */}
        <div className="search-container">
          <input
            type="text"
            className="search-box"
            placeholder="Search your seeds..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="search-icon" />
        </div>

        {/* Filter Chips */}
        <div className="filter-chips">
          {categories.map(cat => (
            <div
              key={cat}
              className={`chip ${currentFilter === cat ? 'active' : ''}`}
              onClick={() => setCurrentFilter(cat)}
            >
              {cat}
            </div>
          ))}
        </div>

        {/* Ideas Grid */}
        <div className="ideas-grid">
          {filteredIdeas.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">✨</div>
              <div className="empty-title">No seeds here yet</div>
              <div className="empty-subtitle">Tap the + to plant your first idea</div>
            </div>
          ) : (
            filteredIdeas.map(idea => (
              <div key={idea.id} className="idea-card" onClick={() => setSelectedIdea(idea)}>
                <div className="idea-visual">
                  {idea.images.length > 0 ? (
                    <div className="idea-images">
                      {idea.images.map((img, idx) => (
                        <img key={idx} src={img} alt="" className="idea-image" />
                      ))}
                    </div>
                  ) : (
                    <div className="idea-emoji">{idea.emoji}</div>
                  )}
                </div>
                <div className="idea-content">
                  <div className="idea-header">
                    <div className="idea-title">{idea.name}</div>
                    <div className="idea-age">{getDaysSince(idea.createdAt)}</div>
                  </div>
                  <div className="idea-description">{idea.description}</div>
                  <div className="idea-tags">
                    {idea.tags.map((tag, idx) => (
                      <span key={idx} className="tag">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* FAB */}
        <div className="fab" onClick={() => setShowAddModal(true)}>
          <Plus size={28} strokeWidth={2.5} />
        </div>

        {/* Add Modal */}
        {showAddModal && (
          <div className="modal-overlay" onClick={(e) => {
            if (e.target.className === 'modal-overlay') setShowAddModal(false);
          }}>
            <div className="modal-content">
              <div className="modal-header">
                <div className="modal-title">Plant a Seed</div>
                <div className="close-btn" onClick={() => setShowAddModal(false)}>
                  <X size={24} />
                </div>
              </div>

              <form onSubmit={handleAddIdea}>
                {/* Name */}
                <div className="form-group">
                  <label className="form-label">Idea Name</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="What's the big idea?"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                {/* Emoji */}
                <div className="form-group">
                  <label className="form-label">Choose Your Icon</label>
                  <div className="emoji-selector">
                    <div 
                      className="emoji-display"
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    >
                      {formData.emoji}
                    </div>
                    {showEmojiPicker && (
                      <div className="emoji-grid">
                        {emojiOptions.map(emoji => (
                          <div
                            key={emoji}
                            className={`emoji-option ${formData.emoji === emoji ? 'selected' : ''}`}
                            onClick={() => {
                              setFormData({ ...formData, emoji });
                              setShowEmojiPicker(false);
                            }}
                          >
                            {emoji}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div className="form-group">
                  <label className="form-label">The Vision</label>
                  <textarea
                    className="form-textarea"
                    placeholder="What's the essence of this idea?"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                  />
                </div>

                {/* Category */}
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="app, product, art, story..."
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value.toLowerCase() })}
                    required
                  />
                </div>

                {/* Tags */}
                <div className="form-group">
                  <label className="form-label">Tags (comma separated)</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="tech, creative, mobile..."
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  />
                </div>

                {/* Images */}
                <div className="form-group">
                  <label className="form-label">Mood Board (optional)</label>
                  <input
                    type="file"
                    id="imageUpload"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                  />
                  <label htmlFor="imageUpload">
                    <div className="image-upload-zone">
                      <ImageIcon className="upload-icon" />
                      <div className="upload-text">
                        Tap to add inspiration images
                      </div>
                    </div>
                  </label>

                  {formData.images.length > 0 && (
                    <div className="image-preview-grid">
                      {formData.images.map((img, idx) => (
                        <div key={idx} className="image-preview">
                          <img src={img} alt="" />
                          <div className="remove-image" onClick={() => removeImage(idx)}>
                            <X size={16} />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <button type="submit" className="submit-btn">
                  Plant This Seed
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
