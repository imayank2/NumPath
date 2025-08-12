import React, { useState } from 'react';
import { Calendar, User, Clock, ArrowRight, Search, Tag, Heart, MessageCircle, Share2, } from 'lucide-react';
import './Blog.css';

const Blog = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPost, setSelectedPost] = useState(null);
  const [showFullPost, setShowFullPost] = useState(false);

  const blogPosts = [
    {
      id: 1,
      title: "Understanding Your Life Path Number: The Blueprint of Your Soul",
      excerpt: "Discover how your Life Path Number reveals your life's purpose, challenges, and opportunities. Learn to calculate and interpret this fundamental numerological concept.",
      content: `Your Life Path Number is the most important number in numerology, representing the path you're meant to walk in this lifetime. It reveals your life's purpose, natural talents, and the lessons you're here to learn.

## How to Calculate Your Life Path Number

To calculate your Life Path Number, you need to reduce your full birth date to a single digit (or master numbers 11, 22, 33).

**Example:** If you were born on September 24, 2000
- Month: September = 9
- Day: 24 = 2 + 4 = 6  
- Year: 2000 = 2 + 0 + 0 + 0 = 2
- Total: 9 + 6 + 2 = 17 = 1 + 7 = 8

So your Life Path Number would be 8.

## Life Path Number Meanings

### Life Path 1 - The Leader
You are a natural-born leader with pioneering spirit. Your purpose is to innovate, lead, and inspire others to follow their own path. You thrive in positions of authority and independence.

**Strengths:** Independent, innovative, ambitious, determined
**Challenges:** Can be overly aggressive, impatient, or self-centered
**Career Paths:** Entrepreneur, executive, inventor, politician

### Life Path 2 - The Peacemaker
You are the diplomat and mediator. Your purpose is to bring harmony, cooperation, and balance to relationships and situations. You excel at working with others and creating peaceful environments.

**Strengths:** Cooperative, diplomatic, sensitive, patient
**Challenges:** May be overly dependent, indecisive, or oversensitive
**Career Paths:** Counselor, teacher, mediator, artist

### Life Path 3 - The Creative Communicator
You are the artist and entertainer. Your purpose is to inspire and uplift others through creative expression and communication. You have a natural gift for words, art, and performance.

**Strengths:** Creative, optimistic, charming, expressive
**Challenges:** Can be scattered, superficial, or overly dramatic
**Career Paths:** Artist, writer, performer, designer

### Life Path 4 - The Builder
You are the foundation of society. Your purpose is to build lasting structures, systems, and traditions. You value hard work, stability, and practical solutions.

**Strengths:** Reliable, organized, practical, hardworking
**Challenges:** May be rigid, stubborn, or overly serious
**Career Paths:** Engineer, architect, manager, accountant

### Life Path 5 - The Freedom Seeker
You are the adventurer and freedom lover. Your purpose is to experience variety, change, and personal freedom. You thrive on new experiences and breaking conventional boundaries.

**Strengths:** Adventurous, versatile, curious, progressive
**Challenges:** Can be restless, irresponsible, or commitment-phobic
**Career Paths:** Travel guide, journalist, sales, entrepreneur

### Life Path 6 - The Nurturer
You are the caregiver and healer. Your purpose is to serve, nurture, and heal others. You have a natural instinct to care for family, community, and those in need.

**Strengths:** Nurturing, responsible, compassionate, supportive
**Challenges:** May be overly protective, martyr-like, or interfering
**Career Paths:** Healthcare, teaching, counseling, social work

### Life Path 7 - The Seeker
You are the researcher and mystic. Your purpose is to seek truth, wisdom, and spiritual understanding. You are drawn to analysis, research, and uncovering hidden mysteries.

**Strengths:** Analytical, intuitive, spiritual, independent
**Challenges:** Can be aloof, skeptical, or overly secretive
**Career Paths:** Researcher, scientist, analyst, spiritual teacher

### Life Path 8 - The Achiever
You are the executive and material master. Your purpose is to achieve material success and use your power responsibly. You have natural business acumen and leadership abilities.

**Strengths:** Ambitious, organized, practical, authoritative
**Challenges:** May be materialistic, controlling, or workaholic
**Career Paths:** Business executive, banker, real estate, politics

### Life Path 9 - The Humanitarian
You are the global thinker and humanitarian. Your purpose is to serve humanity and make the world a better place. You have a broad perspective and deep compassion.

**Strengths:** Compassionate, generous, idealistic, artistic
**Challenges:** Can be overly emotional, impractical, or martyr-like
**Career Paths:** Humanitarian, artist, teacher, healer

## Master Numbers

### Life Path 11 - The Intuitive Illuminator
You are here to inspire and enlighten others through your heightened intuition and spiritual insights. You have the potential to be a spiritual teacher or inspirational leader.

### Life Path 22 - The Master Builder
You combine the intuition of 11 with the practical skills of 4. You're here to build something of lasting significance that benefits humanity on a large scale.

### Life Path 33 - The Master Teacher
You embody the highest form of compassionate service. Your purpose is to heal and uplift humanity through unconditional love and spiritual wisdom.

## Working with Your Life Path Number

Understanding your Life Path Number is just the beginning. Here's how to work with this knowledge:

1. **Embrace Your Purpose:** Align your career and life choices with your natural tendencies
2. **Address Your Challenges:** Be aware of your potential pitfalls and work to overcome them
3. **Develop Your Strengths:** Focus on cultivating your natural talents and abilities
4. **Find Your Tribe:** Connect with others who support and understand your path
5. **Trust the Journey:** Remember that challenges are opportunities for growth

Your Life Path Number is not a limitation but a guide to help you understand your natural inclinations and life purpose. Use this knowledge to make conscious choices that align with your highest potential.`,
      author: "Sarah Mitchell",
      date: "2025-08-05",
      readTime: "8 min read",
      category: "Life Path",
      image: "Most_Successful_Life_Path_Number@2x.png",
      likes: 142,
      comments: 23,
      tags: ["Life Path", "Numerology Basics", "Soul Purpose"]
    },
    {
      id: 2,
      title: "Master Numbers 11, 22, 33: The Spiritual Powerhouses",
      excerpt: "Explore the mystical significance of Master Numbers and their profound impact on personality, destiny, and spiritual evolution.",
      content: `Master Numbers are double-digit numbers that carry intensified energy and spiritual significance. These powerful numbers - 11, 22, and 33 - are considered the most spiritually charged numbers in numerology.

## What Are Master Numbers?

Master Numbers are special double-digit numbers in numerology that are not reduced to single digits because they carry their own unique vibrational frequency and spiritual significance. They represent a higher calling and greater potential, but also greater challenges.

The three Master Numbers are:
- **11** - The Intuitive Illuminator
- **22** - The Master Builder  
- **33** - The Master Teacher

## Master Number 11: The Intuitive Illuminator

People with Master Number 11 are natural psychics and spiritual teachers. They possess heightened intuition and sensitivity that allows them to tap into higher realms of consciousness.

### Characteristics of 11:
- **Highly Intuitive:** Can sense things others cannot
- **Spiritually Aware:** Natural connection to the divine
- **Inspirational:** Ability to uplift and motivate others
- **Sensitive:** Deeply empathetic and emotionally aware
- **Visionary:** Can see possibilities others miss

### Challenges for 11:
- Overwhelming sensitivity
- Tendency toward anxiety or nervousness
- Difficulty staying grounded in practical matters
- May struggle with self-doubt despite their gifts

### Life Purpose:
Master Number 11 individuals are here to be spiritual teachers, healers, and inspirational leaders. They're meant to illuminate the path for others and bridge the gap between the spiritual and material worlds.

## Master Number 22: The Master Builder

Master Number 22 combines the intuitive insights of 11 with the practical skills of 4 (2+2=4). These individuals have the potential to manifest their dreams into reality on a grand scale.

### Characteristics of 22:
- **Visionary Practicality:** Can turn dreams into concrete reality
- **Natural Leadership:** Ability to organize and lead large projects
- **Material Mastery:** Excellent with money and resources
- **Global Perspective:** Think in terms of benefiting humanity
- **Methodical:** Systematic approach to achieving goals

### Challenges for 22:
- May feel overwhelmed by their own potential
- Tendency to be workaholics
- Can become frustrated if progress is slow
- May struggle with perfectionism

### Life Purpose:
Master Number 22 individuals are here to build something of lasting significance that benefits humanity. They're the architects of the new world, capable of turning visionary ideas into tangible reality.

## Master Number 33: The Master Teacher

Master Number 33 represents the highest level of spiritual development in numerology. These rare individuals embody unconditional love and compassionate service to humanity.

### Characteristics of 33:
- **Unconditional Love:** Naturally compassionate and loving
- **Healing Presence:** Others feel better just being around them
- **Wise Teachers:** Natural ability to guide and educate
- **Self-Sacrificing:** Put others' needs before their own
- **Spiritually Advanced:** High level of consciousness

### Challenges for 33:
- May become martyrs or overly self-sacrificing
- Tendency to take on others' problems
- Can become overwhelmed by the world's suffering
- May struggle with boundaries

### Life Purpose:
Master Number 33 individuals are here to heal and uplift humanity through love, compassion, and spiritual wisdom. They're often found in healing professions, spiritual teaching, or humanitarian work.

## Working with Master Numbers

### If You Have a Master Number:

1. **Embrace Your Sensitivity:** Your sensitivity is a gift, not a weakness
2. **Develop Grounding Practices:** Meditation, yoga, nature walks
3. **Trust Your Intuition:** Learn to distinguish between intuition and anxiety
4. **Serve Others:** Your purpose involves helping others in some way
5. **Be Patient:** Master Number paths often take time to unfold
6. **Protect Your Energy:** Learn to set healthy boundaries

### Master Number Challenges:

Master Numbers come with greater responsibility and challenges:
- Higher expectations from yourself and others
- Increased sensitivity to energy and emotions
- Greater potential for both success and failure
- More intense life experiences
- Stronger spiritual calling

## Master Numbers in Different Positions

Master Numbers can appear in various positions in your numerology chart:

### Life Path Master Numbers:
When your Life Path calculation results in 11, 22, or 33, you're on a Master Number path with a special spiritual mission.

### Expression Master Numbers:
Master Numbers in your Expression Number indicate special talents and abilities you're meant to develop and share.

### Soul Urge Master Numbers:
Master Numbers in your Soul Urge position indicate deep spiritual desires and motivations.

## Living Your Master Number Potential

Master Numbers represent potential, not guarantee. To fulfill your Master Number destiny:

1. **Develop Your Gifts:** Work on enhancing your natural abilities
2. **Serve Others:** Find ways to contribute to humanity's wellbeing
3. **Stay Grounded:** Balance spiritual awareness with practical action
4. **Heal Yourself First:** Work on your own healing before helping others
5. **Trust the Process:** Your path may be challenging but ultimately rewarding

Remember, having a Master Number is both a blessing and a responsibility. You're here to make a significant positive impact on the world, but first, you must develop the wisdom, strength, and spiritual maturity to handle such power responsibly.`,
      author: "David Chen",
      date: "2025-08-03",
      readTime: "10 min read",
      category: "Master Numbers",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400",
      likes: 98,
      comments: 15,
      tags: ["Master Numbers", "Spiritual Growth", "Advanced Numerology"]
    },
    {
      id: 3,
      title: "Numerology and Relationships: Finding Your Perfect Match",
      excerpt: "Learn how numerology can guide you to understand compatibility, resolve conflicts, and deepen connections with your loved ones.",
      content: "Numerology offers profound insights into relationship compatibility by analyzing the vibrational frequencies of different numbers and how they interact with each other.",
      author: "Luna Rodriguez",
      date: "2025-08-01",
      readTime: "12 min read",
      category: "Relationships",
      image: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400",
      likes: 205,
      comments: 34,
      tags: ["Relationships", "Compatibility", "Love Numerology"]
    },
    {
      id: 4,
      title: "Your Personal Year Number: Navigating Life's Cycles",
      excerpt: "Understand the nine-year cycle of personal growth and how your Personal Year Number influences the themes and opportunities in your life.",
      content: "Your Personal Year Number reveals the dominant theme and energy that will influence your experiences throughout a specific year, helping you align with natural cycles of growth.",
      author: "Marcus Thompson",
      date: "2025-07-28",
      readTime: "6 min read",
      category: "Personal Cycles",
      image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400",
      likes: 87,
      comments: 12,
      tags: ["Personal Year", "Cycles", "Annual Forecast"]
    },
    {
      id: 5,
      title: "The Power of Your Name: Expression and Soul Urge Numbers",
      excerpt: "Discover how the letters in your name carry vibrational energy that reveals your deepest desires, talents, and life expression.",
      content: "Your name is not just a label - it's a vibrational blueprint that contains profound information about your soul's desires, natural talents, and the way you express yourself in the world.",
      author: "Isabella White",
      date: "2025-07-25",
      readTime: "9 min read",
      category: "Name Numbers",
      image: "https://images.unsplash.com/photo-1481833761820-0509d3217039?w=400",
      likes: 156,
      comments: 28,
      tags: ["Expression Number", "Soul Urge", "Name Analysis"]
    },
    {
      id: 6,
      title: "Numerology in Business: Choosing Lucky Numbers for Success",
      excerpt: "Learn how to apply numerological principles to business decisions, from naming your company to selecting launch dates and office addresses.",
      content: "Business numerology can provide valuable insights for entrepreneurs and business owners looking to align their ventures with favorable numerical vibrations.",
      author: "Robert Kim",
      date: "2025-07-22",
      readTime: "11 min read",
      category: "Business",
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400",
      likes: 73,
      comments: 9,
      tags: ["Business Numerology", "Success", "Entrepreneurship"]
    }
  ];

  const categories = [
    { id: 'all', name: 'All Posts', icon: '⭐' },
    { id: 'Life Path', name: 'Life Path', icon: '🛤️' },
    { id: 'Master Numbers', name: 'Master Numbers', icon: '✨' },
    { id: 'Relationships', name: 'Relationships', icon: '💫' },
    { id: 'Personal Cycles', name: 'Personal Cycles', icon: '🔄' },
    { id: 'Name Numbers', name: 'Name Numbers', icon: '📝' },
    { id: 'Business', name: 'Business', icon: '💼' }
  ];

  const handleReadMore = (post) => {
    setSelectedPost(post);
    setShowFullPost(true);
  };

  const handleBackToBlog = () => {
    setShowFullPost(false);
    setSelectedPost(null);
  };

  // If showing full post, render the detailed view
  if (showFullPost && selectedPost) {
    return (
      <div className="blog-container">
        <div className="blog-post-detail">
          <button className="back-btn" onClick={handleBackToBlog}>
            <ArrowRight className="back-icon" />
            Back to Blog
          </button>
          
          <div className="post-detail-header">
            <img src={selectedPost.image} alt={selectedPost.title} className="post-detail-image" />
            <div className="post-detail-overlay">
              <div className="post-detail-meta">
                <span className="category-tag">{selectedPost.category}</span>
                <div className="meta-info">
                  <Calendar size={16} />
                  <span>{new Date(selectedPost.date).toLocaleDateString()}</span>
                  <Clock size={16} />
                  <span>{selectedPost.readTime}</span>
                </div>
              </div>
              <h1 className="post-detail-title">{selectedPost.title}</h1>
              <div className="author-info">
                <User size={18} />
                {/* <span>By {selectedPost.author}</span> */}
              </div>
            </div>
          </div>
          
          <div className="post-detail-content">
            <div className="post-content-text">
              {selectedPost.content.split('\n\n').map((paragraph, index) => {
                if (paragraph.startsWith('## ')) {
                  return <h2 key={index} className="content-heading">{paragraph.replace('## ', '')}</h2>;
                } else if (paragraph.startsWith('### ')) {
                  return <h3 key={index} className="content-subheading">{paragraph.replace('### ', '')}</h3>;
                } else if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                  return <p key={index} className="content-bold">{paragraph.replace(/\*\*/g, '')}</p>;
                } else if (paragraph.includes('**')) {
                  const parts = paragraph.split('**');
                  return (
                    <p key={index} className="content-paragraph">
                      {parts.map((part, i) => 
                        i % 2 === 1 ? <strong key={i}>{part}</strong> : part
                      )}
                    </p>
                  );
                } else {
                  return <p key={index} className="content-paragraph">{paragraph}</p>;
                }
              })}
            </div>
            
            <div className="post-detail-sidebar">
              {/* <div className="post-stats-card">
                <h3>Article Stats</h3>
                <div className="stat-item">
                  <Heart size={16} />
                  <span>{selectedPost.likes} Likes</span>
                </div>
                <div className="stat-item">
                  <MessageCircle size={16} />
                  <span>{selectedPost.comments} Comments</span>
                </div>
                <div className="stat-item">
                  <Clock size={16} />
                  <span>{selectedPost.readTime}</span>
                </div>
              </div> */}
              
              <div className="post-tags-card">
                <h3>Tags</h3>
                <div className="detail-tags">
                  {selectedPost.tags.map(tag => (
                    <span key={tag} className="detail-tag">
                      <Tag size={12} />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="share-card">
                <h3>Share Article</h3>
                <div className="share-buttons">
                  <button className="share-btn-detail">
                    <Share2 size={16} />
                    Share
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredPost = blogPosts[1];

  return (
    <div className="blog-container">
      <div className="blog-header">
        <div className="header-content">
          <h1 className="blog-title">✨ NumPath Blog</h1>
          <p className="blog-subtitle">Unlock the mysteries of numbers and discover your cosmic blueprint</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="blog-controls">
        <div className="search-bar">
          <Search className="search-icon" />
          <input
            type="text"
            placeholder="Search articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="category-filters">
          {categories.map(category => (
            <button
              key={category.id}
              className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category.id)}
            >
              <span className="category-icon">{category.icon}</span>
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Featured Article */}
      {selectedCategory === 'all' && !searchTerm && (
        <div className="featured-section">
          <h2 className="section-title">Featured Article</h2>
          <div className="featured-card">
            <div className="featured-image">
              <img src={featuredPost.image} alt={featuredPost.title} />
              <div className="featured-badge">Featured</div>
            </div>
            <div className="featured-content">
              <div className="featured-meta">
                <span className="category-tag">{featuredPost.category}</span>
                <div className="meta-info">
                  <Calendar size={14} />
                  <span>{new Date(featuredPost.date).toLocaleDateString()}</span>
                  <Clock size={14} />
                  <span>{featuredPost.readTime}</span>
                </div>
              </div>
              <h3 className="featured-title">{featuredPost.title}</h3>
              <p className="featured-excerpt">{featuredPost.excerpt}</p>
              <div className="featured-footer">
                <div className="author-info">
                  <User size={16} />
                  <span>{featuredPost.author}</span>
                </div>
                <button className="read-more-btn" onClick={() => handleReadMore(featuredPost)}>
                  Read Full Article
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Blog Posts Grid */}
      <div className="blog-grid">
        <div className="section-header">
          <h2 className="section-title">
            {selectedCategory === 'all' ? 'Latest Articles' : `${selectedCategory} Articles`}
          </h2>
          <p className="section-subtitle">
            {filteredPosts.length} {filteredPosts.length === 1 ? 'article' : 'articles'} found
          </p>
        </div>

        <div className="posts-grid">
          {filteredPosts.map(post => (
            <div key={post.id} className="post-card">
              <div className="post-image">
                <img src={post.image} alt={post.title} />
                <div className="post-overlay">
                  <button className="like-btn">
                    <Heart size={16} />
                  </button>
                  <button className="share-btn">
                    <Share2 size={16} />
                  </button>
                </div>
              </div>
              
              <div className="post-content">
                <div className="post-meta">
                  <span className="category-tag">{post.category}</span>
                  <div className="meta-info">
                    <Calendar size={12} />
                    <span>{new Date(post.date).toLocaleDateString()}</span>
                  </div>
                </div>
                
                <h3 className="post-title">{post.title}</h3>
                <p className="post-excerpt">{post.excerpt}</p>
                
                <div className="post-tags">
                  {post.tags.slice(0, 2).map(tag => (
                    <span key={tag} className="tag">
                      <Tag size={10} />
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="post-footer">
                  <div className="author-info">
                    <User size={14} />
                    <span>{post.author}</span>
                    <span className="read-time">{post.readTime}</span>
                  </div>
                  
                  <div className="post-stats">
                    <span className="stat">
                      <Heart size={12} />
                      {post.likes}
                    </span>
                    <span className="stat">
                      <MessageCircle size={12} />
                      {post.comments}
                    </span>
                  </div>
                </div>
                
                <button className="read-more-btn" onClick={() => handleReadMore(post)}>
                  Continue Reading
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Newsletter Signup */}
      <div className="newsletter-section">
        <div className="newsletter-card">
          <div className="newsletter-icon">✨</div>
          <h3>Stay Connected to the Universe</h3>
          {/* <p>Get weekly numerology insights, cosmic updates, and exclusive content delivered to your inbox.</p> */}
          <div className="newsletter-form">
            {/* <input type="email" placeholder="Enter your email address" /> */}
            {/* <button className="subscribe-btn">Subscribe</button> */}
          </div>
          <div className="newsletter-features">
            <span>✓ Weekly Numerology Tips</span>
            <span>✓ Cosmic Event Alerts</span>
            <span>✓ Exclusive Content</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;