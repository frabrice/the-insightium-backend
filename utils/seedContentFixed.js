const mongoose = require('mongoose');
const Article = require('../models/Article');
const Video = require('../models/Video');
const TVShow = require('../models/TVShow');
const Podcast = require('../models/Podcast');
require('dotenv').config();

const seedContent = async () => {
  try {
    // Connect to MongoDB
    const mongoURI = process.env.MONGODB_URI
    await mongoose.connect(mongoURI);
    
    console.log('Connected to MongoDB');

    // Clear existing content
    await Article.deleteMany({});
    await Video.deleteMany({});
    await TVShow.deleteMany({});
    await Podcast.deleteMany({});
    
    console.log('Cleared existing content');

    // Sample Articles - Fixed to match schema
    const articles = [
      {
        title: "The Future of Artificial Intelligence in Libraries",
        content: `<p>Libraries are experiencing a revolutionary transformation through artificial intelligence integration. From automated cataloging systems to personalized reading recommendations, AI is reshaping how libraries serve their communities.</p>
        
        <p>Modern libraries are implementing AI-powered chatbots to provide 24/7 reference assistance, while machine learning algorithms help optimize collection development based on patron behavior patterns. These technological advances are not replacing librarians but rather empowering them to focus on higher-level services.</p>
        
        <p>The integration of natural language processing allows libraries to offer more sophisticated search capabilities, making information discovery more intuitive for users of all technical backgrounds.</p>`,
        excerpt: "Explore how artificial intelligence is transforming modern libraries, from automated cataloging to personalized recommendations and enhanced search capabilities.",
        author: "Dr. Sarah Johnson",
        featuredImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        categoryName: "Tech Trends",
        tags: "AI, Libraries, Technology, Innovation",
        featured: true,
        trending: true,
        status: "published",
        publishDate: new Date('2024-08-10'),
        views: 1250,
        metaDescription: "Discover how artificial intelligence is revolutionizing libraries with automated systems and personalized services."
      },
      {
        title: "Digital Preservation: Protecting Our Cultural Heritage",
        content: `<p>As our world becomes increasingly digital, the challenge of preserving cultural heritage for future generations has evolved significantly. Digital preservation involves not just storing digital files, but ensuring they remain accessible and usable over time.</p>
        
        <p>Libraries and archives worldwide are developing comprehensive strategies to combat digital decay, format obsolescence, and technological changes that threaten our collective memory.</p>
        
        <p>The implementation of standardized metadata schemas and migration policies ensures that valuable digital resources continue to serve researchers, educators, and the general public for decades to come.</p>`,
        excerpt: "Learn about the critical importance of digital preservation and how institutions are protecting our cultural heritage in the digital age.",
        author: "Prof. Michael Chen",
        featuredImage: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        categoryName: "Research World",
        tags: "Digital Preservation, Cultural Heritage, Archives, Technology",
        featured: true,
        trending: false,
        status: "published",
        publishDate: new Date('2024-08-12'),
        views: 892,
        metaDescription: "Essential methods for preserving digital cultural assets and ensuring long-term accessibility."
      },
      {
        title: "Community Engagement in Public Libraries",
        content: `<p>Public libraries have evolved far beyond their traditional role as repositories of books. Today's libraries serve as vibrant community hubs that foster social connection, lifelong learning, and civic engagement.</p>
        
        <p>Through innovative programming, maker spaces, and collaborative partnerships, libraries are addressing local needs while building stronger, more connected communities.</p>
        
        <p>From coding workshops for teens to senior citizen technology training, libraries are bridging digital divides and creating inclusive spaces where all community members can thrive.</p>`,
        excerpt: "Discover how public libraries are transforming into dynamic community centers that bring people together and address local needs.",
        author: "Maria Rodriguez",
        featuredImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        categoryName: "Spirit of Africa",
        tags: "Public Libraries, Community, Programming, Engagement",
        featured: false,
        trending: true,
        status: "published",
        publishDate: new Date('2024-08-14'),
        views: 673,
        metaDescription: "How modern public libraries serve as community hubs fostering connection and learning."
      },
      {
        title: "Open Access Publishing: Democratizing Knowledge",
        content: `<p>The open access movement is revolutionizing scholarly communication by making research freely available to all. This paradigm shift is breaking down traditional barriers to knowledge and accelerating scientific discovery.</p>
        
        <p>Universities and research institutions are implementing institutional repositories and supporting researchers in navigating the complex landscape of open access publishing models.</p>
        
        <p>The benefits extend beyond academia, as open access enables practitioners, policymakers, and the general public to access cutting-edge research that can inform decision-making and drive innovation.</p>`,
        excerpt: "Learn how open access publishing is democratizing knowledge and transforming the landscape of scholarly communication.",
        author: "Dr. James Wilson",
        featuredImage: "https://images.unsplash.com/photo-1456324504439-367cee3b3c32?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        categoryName: "Research World",
        tags: "Open Access, Publishing, Research, Scholarly Communication",
        featured: false,
        trending: true,
        status: "published",
        publishDate: new Date('2024-08-15'),
        views: 534,
        metaDescription: "Understanding how open access is transforming research dissemination and knowledge sharing."
      },
      {
        title: "Information Literacy in the Digital Age",
        content: `<p>In an era of information overload and misinformation, information literacy has become a critical skill for navigating our complex digital landscape. Libraries play a crucial role in developing these essential competencies.</p>
        
        <p>Modern information literacy instruction goes beyond traditional library skills to encompass digital citizenship, critical thinking, and media evaluation techniques.</p>
        
        <p>Through hands-on workshops and embedded instruction, librarians are empowering users to become discerning consumers and effective creators of information in all its forms.</p>`,
        excerpt: "Explore the importance of information literacy skills in today's digital world and how libraries are leading the charge in education.",
        author: "Dr. Lisa Thompson",
        featuredImage: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        categoryName: "Career Campus",
        tags: "Information Literacy, Digital Citizenship, Education, Critical Thinking",
        featured: false,
        trending: false,
        status: "published",
        publishDate: new Date('2024-08-16'),
        views: 789,
        metaDescription: "Essential information literacy competencies for navigating today's digital information landscape."
      }
    ];

    // Sample Videos - Fixed to match schema
    const videos = [
      {
        title: "Library Innovation Showcase 2024",
        description: "A comprehensive look at the most innovative library programs and services from around the world, featuring interviews with leading librarians and technology experts.",
        thumbnail: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        youtube_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        duration: "24:15",
        category: "Tech Trends",
        views: 2340,
        rating: 4.8,
        status: "published",
        upload_date: new Date('2024-08-08'),
        tags: "Innovation, Technology, Libraries, Future",
        meta_description: "Discover cutting-edge library innovations and technologies shaping the future of information services.",
        is_new: true
      },
      {
        title: "Digital Collections Management Best Practices",
        description: "Learn essential strategies for managing digital collections, including metadata standards, preservation workflows, and access optimization techniques.",
        thumbnail: "https://images.unsplash.com/photo-1554774853-719586f82d77?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        youtube_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        duration: "18:42",
        category: "Research World",
        views: 1875,
        rating: 4.5,
        status: "published",
        upload_date: new Date('2024-08-11'),
        tags: "Digital Collections, Metadata, Preservation, Best Practices",
        meta_description: "Comprehensive guide to best practices in digital collections management and preservation.",
        is_new: false
      },
      {
        title: "Community Library Programming Success Stories",
        description: "Inspiring examples of how libraries across different communities have created impactful programs that serve diverse populations and address local needs.",
        thumbnail: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        youtube_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        duration: "31:28",
        category: "Spirit of Africa",
        views: 1456,
        rating: 4.6,
        status: "published",
        upload_date: new Date('2024-08-13'),
        tags: "Programming, Community, Outreach, Success Stories",
        meta_description: "Real-world examples of effective library programming that engages and serves communities.",
        is_new: false
      }
    ];

    // Sample TV Shows - Fixed to match schema
    const tvShows = [
      {
        title: "Library Leaders Today - Episode 12: Future of Academic Libraries",
        description: "Join us for an in-depth discussion with leading academic librarians about the evolving role of university libraries in supporting research and learning in the digital age.",
        thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        youtube_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        duration: "42:15",
        category: "Full Episodes",
        section: "FullEpisodes",
        views: "3420",
        rating: 4.7,
        upload_date: new Date('2024-08-05'),
        is_new: true,
        status: "published",
        tags: "Academic Libraries, Leadership, Future, Research",
        meta_description: "Academic library leaders discuss the future of university libraries and research support.",
        episode_number: 12,
        likes: 89
      },
      {
        title: "Digital Transformation Chronicles - Episode 8: AI in Libraries",
        description: "Explore how artificial intelligence is being implemented in libraries worldwide, from chatbots to predictive analytics, and what the future holds for AI-library collaboration.",
        thumbnail: "https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        youtube_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        duration: "38:52",
        category: "Mind Battles",
        section: "MindBattles",
        views: "2890",
        rating: 4.5,
        upload_date: new Date('2024-08-09'),
        is_new: false,
        status: "published",
        tags: "AI, Technology, Digital Transformation, Innovation",
        meta_description: "Comprehensive overview of artificial intelligence applications in library services and operations.",
        episode_number: 8,
        likes: 67
      },
      {
        title: "Community Connections - Episode 15: Rural Library Impact",
        description: "Discover how rural libraries are serving as vital community anchors, providing essential services and bridging digital divides in underserved areas.",
        thumbnail: "https://images.unsplash.com/photo-1456324504439-367cee3b3c32?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        youtube_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        duration: "35:18",
        category: "Insight Stories",
        section: "InsightStories",
        views: "1967",
        rating: 4.8,
        upload_date: new Date('2024-08-12'),
        is_new: false,
        status: "published",
        tags: "Rural Libraries, Community Impact, Digital Divide, Access",
        meta_description: "How rural libraries serve as essential community resources and bridge digital divides.",
        episode_number: 15,
        likes: 78
      }
    ];

    // Sample Podcasts - Fixed to match schema
    const podcasts = [
      {
        title: "The Information Age: Navigating Digital Transformation",
        description: "A deep dive into how libraries are adapting to the digital age, featuring conversations with technology leaders and innovative librarians who are shaping the future of information access.",
        image: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        youtube_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        duration: "45:32",
        guest_name: "Dr. Elena Rodriguez",
        status: "published",
        publish_date: new Date('2024-08-07'),
        plays: "1892",
        likes: 134,
        tags: "Digital Transformation, Technology, Innovation, Future of Libraries",
        meta_description: "Expert insights on how libraries are navigating digital transformation and emerging technologies.",
        episode_number: 1
      },
      {
        title: "Preserving the Past, Building the Future",
        description: "Join us for an enlightening conversation about digital preservation strategies, cultural heritage protection, and the delicate balance between accessibility and conservation in the digital realm.",
        image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        youtube_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        duration: "52:18",
        guest_name: "Prof. David Kim",
        status: "published",
        publish_date: new Date('2024-08-10'),
        plays: "1456",
        likes: 98,
        tags: "Digital Preservation, Cultural Heritage, Archives, Conservation",
        meta_description: "Expert discussion on digital preservation strategies and cultural heritage protection.",
        episode_number: 2
      },
      {
        title: "Community Libraries: Hearts of Our Neighborhoods",
        description: "Explore how public libraries are evolving to meet changing community needs, from maker spaces to social services, and discover the innovative programs that are making real differences in people's lives.",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        youtube_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        duration: "41:45",
        guest_name: "Sarah Martinez",
        status: "published",
        publish_date: new Date('2024-08-14'),
        plays: "2103",
        likes: 167,
        tags: "Public Libraries, Community Engagement, Programming, Social Impact",
        meta_description: "How public libraries serve as community hubs and drive positive social change.",
        episode_number: 3
      },
      {
        title: "Open Access and the Future of Research",
        description: "A comprehensive discussion about the open access movement, its impact on scholarly communication, and how libraries are supporting researchers in navigating the changing landscape of academic publishing.",
        image: "https://images.unsplash.com/photo-1456324504439-367cee3b3c32?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        youtube_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        duration: "48:27",
        guest_name: "Dr. Michael Thompson",
        status: "published",
        publish_date: new Date('2024-08-16'),
        plays: "1634",
        likes: 112,
        tags: "Open Access, Research, Scholarly Communication, Academic Publishing",
        meta_description: "Understanding the open access movement and its impact on research and scholarly communication.",
        episode_number: 4
      }
    ];

    // Insert all content
    const insertedArticles = await Article.insertMany(articles);
    console.log(`Created ${insertedArticles.length} articles`);

    const insertedVideos = await Video.insertMany(videos);
    console.log(`Created ${insertedVideos.length} videos`);

    const insertedTVShows = await TVShow.insertMany(tvShows);
    console.log(`Created ${insertedTVShows.length} TV shows`);

    const insertedPodcasts = await Podcast.insertMany(podcasts);
    console.log(`Created ${insertedPodcasts.length} podcast episodes`);

    console.log('\n=== CONTENT SEEDING COMPLETED ===');
    console.log('Sample data has been successfully added to the database!');
    console.log('\nContent Summary:');
    console.log(`- ${insertedArticles.length} Articles (2 featured, 3 trending)`);
    console.log(`- ${insertedVideos.length} Videos`);
    console.log(`- ${insertedTVShows.length} TV Show Episodes`);
    console.log(`- ${insertedPodcasts.length} Podcast Episodes`);

  } catch (error) {
    console.error('Error seeding content:', error);
  } finally {
    mongoose.disconnect();
  }
};

// Run if called directly
if (require.main === module) {
  seedContent();
}

module.exports = seedContent;