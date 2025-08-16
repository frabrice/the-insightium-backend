const Article = require('../models/Article');
const Video = require('../models/Video');
const Podcast = require('../models/Podcast');

const getDashboardStats = async (req, res) => {
  try {
    // Get total counts for each content type
    const totalArticles = await Article.countDocuments();
    const totalVideos = await Video.countDocuments();
    const totalPodcasts = await Podcast.countDocuments();
    
    // Get monthly stats (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    
    const monthlyArticles = await Article.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });
    
    const monthlyVideos = await Video.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });
    
    const monthlyPodcasts = await Podcast.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });
    
    // Calculate total views (sum of all article views)
    const viewsResult = await Article.aggregate([
      {
        $group: {
          _id: null,
          totalViews: { $sum: "$views" }
        }
      }
    ]);
    
    const totalViews = viewsResult.length > 0 ? viewsResult[0].totalViews : 0;
    
    // Get monthly views (articles created in last 30 days)
    const monthlyViewsResult = await Article.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: null,
          monthlyViews: { $sum: "$views" }
        }
      }
    ]);
    
    const monthlyViews = monthlyViewsResult.length > 0 ? monthlyViewsResult[0].monthlyViews : 0;
    
    // Format numbers for display
    const formatNumber = (num) => {
      if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
      } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
      }
      return num.toString();
    };
    
    const stats = [
      {
        title: 'Total Articles',
        value: totalArticles.toString(),
        change: `+${monthlyArticles}`,
        changeType: 'increase',
        icon: 'BookOpen',
        color: 'blue'
      },
      {
        title: 'Video Content',
        value: totalVideos.toString(),
        change: `+${monthlyVideos}`,
        changeType: 'increase',
        icon: 'Tv',
        color: 'red'
      },
      {
        title: 'Podcast Episodes',
        value: totalPodcasts.toString(),
        change: `+${monthlyPodcasts}`,
        changeType: 'increase',
        icon: 'Mic',
        color: 'green'
      },
      {
        title: 'Total Views',
        value: formatNumber(totalViews),
        change: `+${formatNumber(monthlyViews)}`,
        changeType: 'increase',
        icon: 'Eye',
        color: 'purple'
      }
    ];

    res.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard statistics',
      error: error.message
    });
  }
};

const getRecentArticles = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 3;
    
    // Get main articles (isMainArticle: true OR isSecondMainArticle: true)
    // Then get the next latest articles to fill up to the limit
    const mainArticles = await Article.find({
      $or: [
        { isMainArticle: true },
        { isSecondMainArticle: true }
      ]
    })
      .sort({ createdAt: -1 })
      .limit(limit)
      .select('title status views publishDate categoryName createdAt isMainArticle isSecondMainArticle mainArticlePosition');

    // If we have less than the limit, get additional latest articles that are not main articles
    let additionalArticles = [];
    if (mainArticles.length < limit) {
      const remainingSlots = limit - mainArticles.length;
      additionalArticles = await Article.find({
        isMainArticle: { $ne: true },
        isSecondMainArticle: { $ne: true }
      })
        .sort({ createdAt: -1 })
        .limit(remainingSlots)
        .select('title status views publishDate categoryName createdAt');
    }

    // Combine and sort all articles by creation date
    const allArticles = [...mainArticles, ...additionalArticles]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, limit);

    const formattedArticles = allArticles.map(article => ({
      _id: article._id,
      title: article.title,
      status: article.status === 'published' ? 'Published' : 
              article.status === 'draft' ? 'Draft' : 'Review',
      views: article.views || 0,
      date: article.publishDate || article.createdAt,
      category: article.categoryName,
      isMain: article.isMainArticle || article.isSecondMainArticle,
      mainPosition: article.mainArticlePosition
    }));

    res.json({
      success: true,
      data: formattedArticles
    });

  } catch (error) {
    console.error('Error fetching recent articles:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching recent articles',
      error: error.message
    });
  }
};

const getDashboardAnalytics = async (req, res) => {
  try {
    // Get most popular category
    const categoryStats = await Article.aggregate([
      {
        $match: { status: 'published' }
      },
      {
        $group: {
          _id: '$categoryName',
          count: { $sum: 1 },
          totalViews: { $sum: '$views' }
        }
      },
      {
        $sort: { totalViews: -1 }
      },
      {
        $limit: 1
      }
    ]);

    const mostPopularCategory = categoryStats.length > 0 ? categoryStats[0]._id : 'N/A';

    // Calculate average read time (assuming read time is stored as string like "5 min")
    const avgReadTimeResult = await Article.aggregate([
      {
        $match: { 
          status: 'published',
          readTime: { $exists: true, $ne: null, $ne: '' }
        }
      },
      {
        $addFields: {
          readTimeNumber: {
            $toDouble: {
              $trim: {
                input: {
                  $arrayElemAt: [
                    { $split: ['$readTime', ' '] },
                    0
                  ]
                }
              }
            }
          }
        }
      },
      {
        $group: {
          _id: null,
          avgReadTime: { $avg: '$readTimeNumber' }
        }
      }
    ]);

    const avgReadTime = avgReadTimeResult.length > 0 
      ? `${avgReadTimeResult[0].avgReadTime.toFixed(1)} minutes`
      : 'N/A';

    // Calculate engagement rate (simplified: articles with comments allowed)
    const totalPublished = await Article.countDocuments({ status: 'published' });
    const withComments = await Article.countDocuments({ 
      status: 'published', 
      allowComments: true 
    });
    
    const engagementRate = totalPublished > 0 
      ? `${((withComments / totalPublished) * 100).toFixed(1)}%`
      : '0%';

    // Get new articles this month as "subscribers" equivalent
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const newContent = await Article.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });

    const analytics = {
      mostPopularCategory,
      avgReadTime,
      engagementRate,
      newSubscribers: `+${newContent}`
    };

    res.json({
      success: true,
      data: analytics
    });

  } catch (error) {
    console.error('Error fetching dashboard analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard analytics',
      error: error.message
    });
  }
};

module.exports = {
  getDashboardStats,
  getRecentArticles,
  getDashboardAnalytics
};